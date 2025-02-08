import { createContext } from 'react';
import { ShopListData } from '../../types';

export const DataContext = createContext<
  | {
      data: ShopListData;
      onDataChange: (data: ShopListData) => void;
    }
  | undefined
>(undefined);
