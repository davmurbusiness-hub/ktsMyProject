import { Button, Input, Navbar, Text } from 'components/index';
import { useState } from 'react';
import s from './AuthorizationPage.module.scss';
import { useNavigate } from 'react-router-dom';
import rootStore from 'store/globalStores/RootStore/instance';

const RegistrationPage = () => {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSendInfo = () => {
    if (login === '') {
      setError('Заполните логин');
      return;
    }
    if (password === '') {
      setError('Заполните пароль');
      return;
    }
    rootStore.auth.loginReq(login, password);
  };

  return (
    <div className={s.root}>
      <Navbar actualPage={'login'} />
      <div className={s.container}>
        <Text tag={'h1'} className={s.nameText}>
          Вход
        </Text>
        {error && (
          <Text color={'accent'} view={'p-14'}>
            {error}
          </Text>
        )}
        <Input placeholder={'Логин'} value={login} onChange={setLogin} />
        <Input type={'password'} placeholder={'Пароль'} value={password} onChange={setPassword} />
        <Button onClick={handleSendInfo}>Войти</Button>
        <span className={s.regText} onClick={() => navigate('/registration')}>
          Зарегистрироваться
        </span>
      </div>
    </div>
  );
};

export default RegistrationPage;
