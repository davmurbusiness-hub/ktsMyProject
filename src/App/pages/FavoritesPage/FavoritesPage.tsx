import { Card, Navbar, Text } from 'components/index';
import rootStore from 'store/globalStores/RootStore/instance';
import type { Film } from 'types/FilmType';
import s from './FavoritesPage.module.scss';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

const FavoritesPage = () => {
  useEffect(() => {
    rootStore.auth.getFavorite();
  }, []);

  return (
    <div className={s.container}>
      <Navbar actualPage={'favorites'} />
      <div className={s.frameText}>
        <Text tag={'h1'}>Избранное</Text>
        <Text view={'p-20'} color={'secondary'}>
          Подборка для вечера уже здесь: фильмы, сериалы и новинки. <br />
          Ваши любимые фильмы собраны в одном месте!
        </Text>
      </div>
      <div className={s.listOfFilms}>
        {rootStore.auth.authorized ? (
          rootStore.auth.favorites.map((favorite: Film) => {
            return (
              <Card
                key={favorite.documentId}
                title={favorite.title}
                subtitle={favorite.shortDescription}
                image={favorite.gallery[0]?.url}
                rating={favorite.rating}
                releaseYear={favorite.releaseYear}
                ageLimit={favorite.ageLimit}
                category={favorite.category.title}
                duration={favorite.duration}
                actionSlot={favorite.documentId}
                buttonText={'Удалить'}
                actionFavorites={() => {
                  rootStore.auth.removeFavorite(favorite);
                }}
              />
            );
          })
        ) : (
          <Text view={'p-20'}>Похоже вы еще не авторизовались!</Text>
        )}
      </div>
    </div>
  );
};

export default observer(FavoritesPage);
