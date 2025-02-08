import { useContext } from 'react';
import { DataContext } from './context';

export const useDataContext = () => {
  const dataContext = useContext(DataContext);

  if (!dataContext) {
    throw new Error('useDataContext should be used inside DataProvider');
  }

  return dataContext;
};
