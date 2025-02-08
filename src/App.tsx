import InputForm from './components/InputForm';
import MainList from './components/MainList';

import styles from './App.module.css';

export default function ShopList() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ShopList AI</h1>

      <InputForm />

      <MainList />
    </div>
  );
}
