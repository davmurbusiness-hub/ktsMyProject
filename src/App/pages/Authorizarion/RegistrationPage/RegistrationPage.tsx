import { Button, Input, Navbar, Text } from 'components/index';
import { useState } from 'react';
import s from './RegistrationPage.module.scss';
import { useNavigate } from 'react-router-dom';
import rootStore from 'store/globalStores/RootStore/instance';

const RegistrationPage = () => {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordSecond, setPasswordSecond] = useState<string>('');
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
    if (passwordSecond !== password) {
      setError('Пароли не совпадают');
      return;
    }
    rootStore.auth.registerReq(login, password);
  };

  return (
    <div className={s.root}>
      <Navbar actualPage={'login'} />
      <div className={s.container}>
        <Text className={s.nameText} tag={'h1'}>
          Регистрация
        </Text>
        {error && (
          <Text color={'accent'} view={'p-14'}>
            {error}
          </Text>
        )}
        <Input placeholder={'Логин'} value={login} onChange={setLogin} />
        <Input type={'password'} placeholder={'Пароль'} value={password} onChange={setPassword} />
        <Input
          type={'password'}
          placeholder={'Повторите пароль'}
          value={passwordSecond}
          onChange={setPasswordSecond}
        />
        <Button onClick={handleSendInfo}>Зарегистрироваться</Button>
        <span className={s.regText} onClick={() => navigate('/login')}>
          Логин
        </span>
      </div>
    </div>
  );
};

export default RegistrationPage;
