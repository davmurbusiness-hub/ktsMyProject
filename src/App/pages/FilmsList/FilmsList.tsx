import s from './FilmsList.module.scss';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useObserver } from 'hooks/useObserver';
import { useLocalStore } from 'hooks/useLocalStore';
import FetchDataStore from 'store/localStores/FilmDataStore';
import { Button, Card, Input, Loader, MultiDropdown, Navbar, Text } from 'components/index';
import { Meta } from '../../../utils/meta';
import { observer } from 'mobx-react-lite';
import { action, reaction } from 'mobx';
import type { Option } from 'components/MultiDropdown';
import rootStore from 'store/globalStores/RootStore/instance';

const FilmsList = () => {
  const filmsStore = useLocalStore(() => new FetchDataStore());
  const [totalFilms, setTotalFilms] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [categoriesIds, setCategoriesIds] = useState<number[]>([]);
  const lastElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return reaction(
      () => ({
        search: rootStore.query.search,
        categories: rootStore.query.categories.map((cat) => Number(cat)),
      }),
      ({ search, categories }) => {
        setSearchValue(search);
        setCurrentSearch(search);
        setCategoriesIds(categories);
      },
      { fireImmediately: true }
    );
  }, []);

  useEffect(() => {
    filmsStore.getCategories();
  }, [filmsStore]);

  useEffect(() => {
    filmsStore.getFilmsList(page, currentSearch, categoriesIds);
  }, [page, currentSearch, filmsStore, categoriesIds]);

  useEffect(() => {
    return reaction(
      () => filmsStore.responseMeta?.pagination,
      (pagination) => {
        if (pagination) {
          setTotalPages(pagination.pageCount);
          setTotalFilms(pagination.total);
        }
      }
    );
  }, [filmsStore]);

  const onSearchChange = (value: string) => {
    rootStore.query.setParams({ search: value, page: 1, categories: categoriesIds });
  };

  const handleSearch = () => {
    setPage(1);
    setCurrentSearch(searchValue);
    onSearchChange(searchValue);
  };

  const getDisplayTitle = (values: Option[]): string => {
    if (values.length === 0) {
      return 'Выберите жанр фильма';
    }
    return values.map((item) => item.value).join(', ');
  };

  const options = useMemo(() => {
    return filmsStore.categories.map((cat) => ({
      key: String(cat.id),
      value: cat.title,
    }));
  }, [filmsStore.categories]);

  useEffect(() => {
    return reaction(
      () => filmsStore.categories,
      (categories) => {
        const chosenOptions = categories
          .filter((cat) => categoriesIds.includes(cat.id))
          .map((cat) => ({
            key: String(cat.id),
            value: cat.title,
          }));
        setSelectedCategories(chosenOptions);
      }
    );
  }, [filmsStore.categories, categoriesIds]);

  useObserver(lastElement, page < totalPages, filmsStore.meta === Meta.loading, () => {
    setPage((prev) => prev + 1);
  });

  return (
    <div className={s.page}>
      <Navbar actualPage={'films'} />
      <div className={s.container}>
        <div className={s.frameText}>
          <Text tag={'h1'}>Cinema</Text>
          <Text view={'p-20'} color={'secondary'}>
            Подборка для вечера уже здесь: фильмы, сериалы и новинки. <br />
            Найди что посмотреть — за пару секунд.
          </Text>
        </div>

        <div className={s.searchSection}>
          <div className={s.paramsSection}>
            <div className={s.search}>
              <Input
                className={s.searchInput}
                placeholder={'Искать фильм'}
                value={searchValue}
                onChange={setSearchValue}
              />
              <Button onClick={handleSearch} className={s.findButton}>
                Найти
              </Button>
            </div>
            <MultiDropdown
              value={selectedCategories}
              onChange={action((newValues) => {
                rootStore.query.setParams({
                  search: rootStore.query.search,
                  page: 1,
                  categories: newValues.map((cat) => cat.key),
                });
                setSelectedCategories(newValues);
                setPage(1);
                setCategoriesIds(
                  newValues.length === 0
                    ? []
                    : newValues.map((value) => {
                        return Number(value.key);
                      })
                );
              })}
              options={options}
              getTitle={getDisplayTitle}
            />
          </div>
        </div>
        <div className={s.paginationSection}>
          <div className={s.allFilms}>
            <p style={{ fontWeight: 'bold', fontSize: 32 }}>Все фильмы</p>
            {totalPages > 0 && (
              <Text color={'accent'} view={'p-20'}>
                {totalFilms}
              </Text>
            )}
          </div>
        </div>
      </div>
      <div className={s.listOfFilms}>
        {filmsStore.films.map((film) => (
          <Card
            key={film.documentId}
            title={film.title}
            subtitle={film.shortDescription}
            image={film.gallery[0].url}
            rating={film.rating}
            releaseYear={film.releaseYear}
            ageLimit={film.ageLimit}
            category={film.category.title}
            duration={film.duration}
            actionSlot={film.documentId}
            buttonText={'В избранное'}
            actionFavorites={() => {
              rootStore.auth.addFavorite(film);
            }}
          />
        ))}
      </div>
      <div
        style={{ visibility: filmsStore.meta === Meta.loading ? 'visible' : 'hidden' }}
        className={s.loader}
      >
        <Loader />
      </div>
      <div ref={lastElement} style={{ height: '20px' }} />
    </div>
  );
};

export default observer(FilmsList);
