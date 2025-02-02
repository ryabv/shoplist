import { useEffect, useState } from 'react';
import { TelegramWebAppUser } from './types';
import styles from "./App.module.css";

const MOCK_USER: TelegramWebAppUser = {
        id: 111222333,
        first_name: 'Dev',
        last_name: 'User',
        username: 'devuser',
        photo_url: 'https://cdn1.iconfinder.com/data/icons/arrows-elements-outline/128/ic_round_logo-1024.png',
};

export default function TelegramMiniApp() {
  const [user, setUser] = useState<TelegramWebAppUser>();

  useEffect(() => {
    if (!window.Telegram) {
      setUser(MOCK_USER);
      return;
    }

    const initData = window.Telegram?.WebApp?.initDataUnsafe;
    if (initData?.user) {
      setUser(initData.user);
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Telegram Mini App</h1>
      {user ? (
        <div className={styles.card}>
          <img
            src={user.photo_url}
            alt={user.first_name}
            className={styles.avatar}
          />
          <p className={styles.name}>{user.first_name}</p>
          <p className={styles.id}>ID: {user.id}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
