import './styles/styles.css'
import { BrowserRouter} from "react-router-dom";
import {AppRouter} from "./components/AppRouter.tsx";


function App() {


    return (
        <BrowserRouter>
            {/*<Input value={''} onChange={() => {}} width={800} />*/}
            <AppRouter/>
        </BrowserRouter>
    )
}

export default App
