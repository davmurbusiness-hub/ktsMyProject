import { Navigate} from "react-router-dom";
import FilmsList from "../App/pages/FilmsList";
import FilmPage from "../App/pages/FilmPage";

export const routesConfig = [
    {
        path: '/',
        element: <FilmsList />
    },
    {
        path: '/films',
        element: <FilmsList />
    },
    {
        path: '/films/:documentId',
        element: <FilmPage />
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
];