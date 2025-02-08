import { FC } from 'react';
import styles from './ListItem.module.css';
import { useDataContext } from '../../contexts/DataContext/hooks';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UniqueId } from '../../types';

interface Props {
  id: UniqueId;
  title: string;
}

const ListItem: FC<Props> = ({ id, title }) => {
  const { data, onDataChange } = useDataContext();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, data: { type: 'item' } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleChange = (e) => {
    onDataChange({
      ...data,
      items: {
        ...data.items,
        [id]: { ...data.items[id], title: e.currentTarget.value },
      },
    });
  };

  return (
    <div
      className={styles.item}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <input value={title} onChange={handleChange} />
    </div>
  );
};

export default ListItem;
