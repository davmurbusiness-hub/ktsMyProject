import './styles/styles.css';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from 'config/router/routes';
import { useQueryParamsStoreInit } from 'hooks/useQueryParamsStoreInit';

function App() {
  const AppContent = () => {
    useQueryParamsStoreInit();

    return <AppRouter />;
  };

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
