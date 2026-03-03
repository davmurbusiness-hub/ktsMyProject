import { Navigate } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import FilmsList from 'pages/FilmsList';
import FilmPage from 'pages/FilmPage';
import AuthorizationPage from 'pages/Authorizarion/AuthorizationPage/AuthorizationPage';
import RegistrationPage from 'pages/Authorizarion/RegistrationPage';
import FavoritesPage from 'pages/FavoritesPage';

export const routesConfig = [
  {
    path: '/',
    element: <FilmsList />,
  },
  {
    path: '/films',
    element: <FilmsList />,
  },
  {
    path: '/films/:documentId',
    element: <FilmPage />,
  },
  {
    path: '/login',
    element: <AuthorizationPage />,
  },
  {
    path: '/registration',
    element: <RegistrationPage />,
  },
  {
    path: '/favorites',
    element: <FavoritesPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export const AppRouter = () => {
  return (
    <Routes>
      {routesConfig.map((item) => (
        <Route key={item.path} path={item.path} element={item.element} />
      ))}
    </Routes>
  );
};
