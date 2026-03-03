import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import s from './FilmPage.module.scss';
import cn from 'classnames';
import type { Gallery } from 'types/GalleryType';
import { ArrowRightIcon, Loader, Navbar, StarIcon, Text } from 'components/index';
import { useLocalStore } from 'hooks/useLocalStore';
import FetchDataStore from 'store/localStores/FilmDataStore';
import { Meta } from '../../../utils/meta';
import { observer } from 'mobx-react-lite';

const FilmPage = () => {
  const { documentId } = useParams<{ documentId?: string }>();
  const navigate = useNavigate();
  const filmStore = useLocalStore(() => new FetchDataStore());

  useEffect(() => {
    if (!documentId || documentId.trim().length === 0) {
      return;
    }
    filmStore.getFilm(documentId);

    return () => {
      filmStore.destroy();
    };
  }, [documentId, filmStore]);

  return (
    <div className={s.filmPage}>
      <Navbar actualPage={'films'} />

      <div
        className={s.back}
        onClick={() => {
          navigate(-1);
        }}
      >
        <ArrowRightIcon width={32} height={32} className={s.icon} />
        <Text view={'p-20'}>Назад</Text>
      </div>

      {filmStore.meta !== Meta.success ? (
        <Loader size={'l'} className={s.loader} />
      ) : (
        <div className={s.content}>
          <div className={s.film}>
            <iframe
              src={filmStore.currentFilm?.trailerUrl + '?autoplay=1&loop=1&muted=1'}
              allow="autoplay; fullscreen"
              allowFullScreen
            />

            <div className={s.info}>
              <div className={s.title}>
                <Text tag={'h2'}>{filmStore.currentFilm?.title}</Text>
                <span className={cn(s.cardImageInf, s.rating)}>
                  <Text view={'p-20'} weight={'medium'}>
                    {filmStore.currentFilm?.rating}
                  </Text>
                  <StarIcon iconType={'fill'} color={'yellow'} />
                </span>
              </div>
              <div className={s.captionSlot}>
                <p>{filmStore.currentFilm?.releaseYear}</p>
                <span>•</span>
                <p>{filmStore.currentFilm?.category.title}</p>
                <span>•</span>
                <p>{filmStore.currentFilm?.ageLimit}+</p>
                <span>•</span>
                <span>
                  {filmStore.currentFilm && Math.trunc(filmStore.currentFilm.duration / 60)}ч{' '}
                  {filmStore.currentFilm && filmStore.currentFilm.duration % 60}
                </span>
              </div>
              <Text className={s.description}>{filmStore.currentFilm?.description}</Text>
            </div>
          </div>
          <div className={s.gallery}>
            <Text view={'title'}>Изображения</Text>
            <div>
              {filmStore.currentFilm?.gallery.map((item: Gallery) => (
                <img src={item.formats.thumbnail.url} key={item.id} alt="" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default observer(FilmPage);
