import logo from '../../../assets/img.png';
import s from './Navbar.module.scss';
import BookmarkIcon from 'components/icons/BookmarkIcon';
import UserIcon from 'components/icons/UserIcon';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import BurgerNavbar from 'components/BurgerMenu';

export type NavbarProps = {
  actualPage: string;
};

const pages = [
  { name: 'films', value: 'Фильмы' },
  { name: 'trends', value: 'Новинки' },
  { name: 'collections', value: 'Подборки' },
];

const iconSize = 30;

const Navbar: React.FC<NavbarProps> = ({ actualPage, ...props }) => {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 500);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isMobile) {
    return <BurgerNavbar pages={pages} actualPage={actualPage} />;
  }

  return (
    <div className={s.navbar} {...props}>
      <img
        className={s.image}
        onClick={() => {
          navigate('/');
        }}
        src={logo}
        alt={'logo'}
      />
      <div className={s.pages}>
        {pages.map((page) => (
          <p
            onClick={() => {
              navigate(`/${page.name}`);
            }}
            key={page.name}
            className={cn(s.page, actualPage === page.name ? s.selected : undefined)}
          >
            {page.value}
          </p>
        ))}
      </div>
      <div className={s.icons}>
        <BookmarkIcon
          onClick={() => {
            navigate('/favorites');
          }}
          color={actualPage === 'favorites' ? 'accent' : 'white'}
          iconType={'stroke'}
          className={s.icon}
          width={iconSize}
          height={iconSize}
        />
        <UserIcon
          onClick={() => {
            navigate('/login');
          }}
          className={s.icon}
          color={actualPage === 'login' || actualPage === 'registration' ? 'accent' : 'white'}
          width={iconSize}
          height={iconSize}
        />
      </div>
    </div>
  );
};

export default Navbar;
