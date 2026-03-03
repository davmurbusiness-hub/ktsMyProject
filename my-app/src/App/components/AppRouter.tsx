import {Route, Routes} from "react-router-dom";
import {routesConfig} from "../../config/routes.tsx";


export const AppRouter = () => {
    return (
        <Routes>
            {routesConfig.map(item =>
                <Route
                    key={item.path}
                    path={item.path}
                    element={item.element}
                />)
            }
        </Routes>
    )
}