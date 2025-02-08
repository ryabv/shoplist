import { FC } from 'react';
import styles from './Category.module.css';
import { UniqueId } from '../../types';
import ListItem from '../ListItem';
import { useDataContext } from '../../contexts/DataContext/hooks';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';

interface Props {
  id: UniqueId;
  title: string;
  items: UniqueId[];
}

const Category: FC<Props> = ({ id, title, items }) => {
  const { data, onDataChange } = useDataContext();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, data: { type: 'category' } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { setNodeRef: setDroppableRef } = useDroppable({ id });

  const handleChange = (e) => {
    onDataChange({
      ...data,
      categories: {
        ...data.categories,
        [id]: { ...data.categories[id], title: e.currentTarget.value },
      },
    });
  };

  return (
    <div
      className={styles.category}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div ref={setDroppableRef} className={styles.itemsList}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className={styles.dragHandle} />
          <input
            className={styles.categoryTitle}
            value={title}
            onChange={handleChange}
          />
          <div className={styles.itemsList}>
            {items.map((itemId) => (
              <ListItem
                key={data.items[itemId].id}
                id={data.items[itemId].id}
                title={data.items[itemId].title}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default Category;
