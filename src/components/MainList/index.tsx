import { FC } from 'react';
import styles from './MainList.module.css';
import Category from '../Category';
import { useDataContext } from '../../contexts/DataContext/hooks';

import { DragDropProvider } from '../../utils/dnd';

const MainList: FC = () => {
  const { data } = useDataContext();

  return (
    <DragDropProvider>
      <div className={styles.mainList}>
        {data.categoryOrder.map((id) => (
          <Category
            key={id}
            id={id}
            title={data.categories[id].title}
            items={data.categories[id].items}
          />
        ))}
      </div>
    </DragDropProvider>
  );
};

export default MainList;
