import { computed, makeObservable, observable, runInAction } from 'mobx';
import ApiStore from 'api/ApiStore';
import type { Film } from 'types/FilmType';

type PrivateFields = '_login' | '_token' | '_authorized' | '_favorites';

export default class AuthStore {
  private readonly _apiStore = new ApiStore('https://front-school-strapi.ktsdev.ru');

  private _login = '';
  private _token = '';
  private _authorized = false;
  private _favorites: Film[] = [];

  constructor() {
    makeObservable<AuthStore, PrivateFields>(this, {
      _login: observable,
      _token: observable,
      _authorized: observable,
      _favorites: observable.shallow,

      login: computed,
      token: computed,
      authorized: computed,
      favorites: computed,
    });
  }

  get login(): string {
    return this._login;
  }

  get token(): string {
    return this._token;
  }

  get authorized(): boolean {
    return this._authorized;
  }

  get favorites(): Film[] {
    return this._favorites;
  }

  async addFavorite(film: Film): Promise<void> {
    if (!this._token) return;

    const response = await this._apiStore.fetchAddFavorites(this._token, film.id);

    runInAction(() => {
      const received = response?.film
        ? Array.isArray(response.film)
          ? response.film[0]
          : response.film
        : null;

      if (!received) return;

      const alreadyExists = this._favorites.some((f) => f.id === received.id);
      if (!alreadyExists) {
        this._favorites.push(received);
      }
    });
  }

  async getFavorite(): Promise<void> {
    if (!this._token) return;

    const response = await this._apiStore.fetchGetFavorites(this._token);

    runInAction(() => {
      if (!response) return;

      const uniqueMap = new Map<number, Film>();

      response.forEach((item) => {
        if (item.film.id) {
          uniqueMap.set(item.film.id, item.film);
        }
      });

      this._favorites = Array.from(uniqueMap.values());
    });
  }

  async removeFavorite(film: Film): Promise<void> {
    if (!this._token) return;

    const response = await this._apiStore.fetchRemoveFavorites(this._token, film.id);

    runInAction(() => {
      if (!response) return;

      this._favorites = this._favorites.filter((f) => f.id !== film.id);
    });
  }

  async registerReq(login = '', password = ''): Promise<void> {
    if (!login || !password) return;

    const response = await this._apiStore.register(login, login, password);

    runInAction(() => {
      if (!response) return;

      this._login = String(response.user);
      this._authorized = true;
      this._token = response.jwt;
    });
  }

  async loginReq(login = '', password = ''): Promise<void> {
    if (!login || !password) return;

    const response = await this._apiStore.login(login, password);

    runInAction(() => {
      if (!response) return;

      this._login = String(response.user);
      this._authorized = true;
      this._token = response.jwt;
    });
  }
}
