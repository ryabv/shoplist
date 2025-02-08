import { FC, useState } from 'react';
import styles from './InputForm.module.css';
import { useDataContext } from '../../contexts/DataContext/hooks';
import { categorizeShoppingList } from '../../api';

const InputForm: FC = () => {
  const { onDataChange } = useDataContext();
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isDisabled = !userInput || isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const categorizedList = await categorizeShoppingList(userInput);
    onDataChange(categorizedList);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <textarea
        className={styles.textarea}
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter your shopping list..."
      />
      <button className={styles.button} type="submit" disabled={isDisabled}>
        {isLoading ? 'Processing...' : 'Categorize'}
      </button>
    </form>
  );
};

export default InputForm;
