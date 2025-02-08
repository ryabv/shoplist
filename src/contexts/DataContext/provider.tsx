import { FC, ReactNode, useState } from 'react';
import { DataContext } from './context';
import { ShopListData } from '../../types';

interface Props {
  children: ReactNode;
}

export const DataProvider: FC<Props> = ({ children }) => {
  const [data, setData] = useState<ShopListData>({
    categories: {},
    items: {},
    categoryOrder: [],
  });

  return (
    <DataContext.Provider value={{ data, onDataChange: setData }}>
      {children}
    </DataContext.Provider>
  );
};
