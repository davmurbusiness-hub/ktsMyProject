import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import s from './BurgerNavbar.module.scss';
import logo from '../../../assets/img.png';
import BookmarkIcon from '../icons/BookmarkIcon';
import UserIcon from '../icons/UserIcon';

export type Page = {
  name: string;
  value: string;
};

export type BurgerNavbarProps = {
  pages: Page[];
  actualPage: string;
};

const iconSize = 30;

const BurgerNavbar: React.FC<BurgerNavbarProps> = ({ pages, actualPage }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handlePageClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className={s.navbar}>
        <button className={s.burgerButton} onClick={() => setIsOpen((prev) => !prev)}>
          <span />
          <span />
          <span />
        </button>

        <img className={s.logo} src={logo} alt="logo" onClick={() => navigate('/')} />

        <div className={s.icons}>
          <BookmarkIcon className={s.icon} iconType={'stroke'} width={iconSize} height={iconSize} />
          <UserIcon className={s.icon} width={iconSize} height={iconSize} />
        </div>
      </div>

      {isOpen && <div className={s.overlay} onClick={() => setIsOpen(false)} />}

      <div className={cn(s.sideMenu, isOpen && s.open)}>
        {pages.map((page) => (
          <p
            key={page.name}
            className={cn(s.menuItem, actualPage === page.name && s.selected)}
            onClick={() => handlePageClick()}
          >
            {page.value}
          </p>
        ))}
      </div>
    </>
  );
};

export default BurgerNavbar;
