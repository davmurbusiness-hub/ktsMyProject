import type { Film } from 'types/FilmType';
import type { ILocalStore } from 'hooks/useLocalStore';
import { computed, makeObservable, observable, runInAction } from 'mobx';
import { Meta } from '../../../../utils/meta';
import ApiStore from 'api/ApiStore';
import type { MetaFromResponse } from 'api/ApiTypes';
import type { Category } from 'types/CategoryType';

type PrivateFields = '_films' | '_meta' | '_responseMeta' | '_currentFilm' | '_categories';

export default class FilmDataStore implements ILocalStore {
  private readonly _apiStore = new ApiStore('https://front-school-strapi.ktsdev.ru');
  private _abortController: AbortController | null = null;

  private _films: Film[] = [];
  private _categories: Category[] = [];
  private _currentFilm: Film | null = null;
  private _responseMeta: MetaFromResponse | null = null;
  private _meta: Meta = Meta.initial;

  constructor() {
    makeObservable<FilmDataStore, PrivateFields>(this, {
      _films: observable.ref,
      _categories: observable.ref,
      _currentFilm: observable.ref,
      _responseMeta: observable.ref,
      _meta: observable,

      films: computed,
      categories: computed,
      currentFilm: computed,
      meta: computed,
      responseMeta: computed,
    });
  }

  get films(): Film[] {
    return this._films;
  }

  get categories(): Category[] {
    return this._categories;
  }

  get currentFilm(): Film | null {
    return this._currentFilm;
  }

  get meta(): Meta {
    return this._meta;
  }

  get responseMeta(): MetaFromResponse | null {
    return this._responseMeta;
  }

  private abortPrevious(): AbortController {
    this._abortController?.abort();
    const newController = new AbortController();
    this._abortController = newController;
    return newController;
  }

  async getCategories(): Promise<void> {
    try {
      const response = await this._apiStore.fetchCategories();

      runInAction(() => {
        if (response) {
          this._categories = response.data as Category[];
        }
      });
    } catch {
      /* empty */
    }
  }

  async getFilmsList(page = 1, searchValue = '', selectedCategories: number[] = []): Promise<void> {
    const controller = this.abortPrevious();

    runInAction(() => {
      this._meta = Meta.loading;
    });

    try {
      const response = await this._apiStore.fetchData(page, {
        signal: controller.signal,
        searchValue,
        selectedCategories,
      });

      runInAction(() => {
        if (!response) {
          this._meta = Meta.error;
          return;
        }

        const filmsData: Film[] = Array.isArray(response.data) ? response.data : [response.data];

        if (page === 1) {
          this._films = filmsData;
          this._responseMeta = response.meta;
        } else {
          const filmsMap = new Map<number, Film>(this._films.map((film) => [film.id, film]));

          filmsData.forEach((film) => {
            filmsMap.set(film.id, film);
          });

          this._films = Array.from(filmsMap.values());
        }

        this._meta = Meta.success;
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      runInAction(() => {
        this._meta = Meta.error;
      });
    } finally {
      this._abortController = null;
    }
  }

  async getFilm(documentId: string): Promise<void> {
    if (!documentId.trim()) return;

    const controller = this.abortPrevious();

    runInAction(() => {
      this._meta = Meta.loading;
      this._currentFilm = null;
    });

    try {
      const response = await this._apiStore.fetchFilm(documentId, controller.signal);

      runInAction(() => {
        if (!response) {
          this._meta = Meta.error;
          return;
        }

        this._currentFilm = response;
        this._meta = Meta.success;
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      runInAction(() => {
        this._meta = Meta.error;
      });
    } finally {
      this._abortController = null;
    }
  }

  destroy(): void {
    this._abortController?.abort();
    this._abortController = null;

    runInAction(() => {
      this._films = [];
      this._currentFilm = null;
      this._meta = Meta.initial;
    });
  }
}
