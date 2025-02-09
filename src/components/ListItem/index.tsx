import { ChangeEvent, FC } from 'react';
import styles from './ListItem.module.css';
import { useDataContext } from '../../contexts/DataContext/hooks';
import { UniqueId } from '../../types';
import { useDraggable, useDroppable } from '../../utils/dnd';

interface Props {
  id: UniqueId;
  title: string;
}

const ListItem: FC<Props> = ({ id, title }) => {
  const { data, onDataChange } = useDataContext();
  const { ref, isDragging } = useDraggable({ id, type: 'item' });

  const handleDrop = (draggedId: UniqueId, targetId: UniqueId) => {
    if (!draggedId || !targetId) return;

    let fromCategoryId;
    let toCategoryId;

    Object.values(data.categories).forEach((category) => {
      if (category.items.includes(draggedId)) fromCategoryId = category.id;
      if (category.items.includes(targetId)) toCategoryId = category.id;
    });

    if (!fromCategoryId || !toCategoryId) return;

    const updatedCategories = { ...data.categories };
    updatedCategories[fromCategoryId].items = updatedCategories[
      fromCategoryId
    ].items.filter((id) => id !== draggedId);
    updatedCategories[toCategoryId].items.push(draggedId);

    onDataChange({ ...data, categories: updatedCategories });
  };

  const droppableRef = useDroppable({ id, onDrop: handleDrop }).ref;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      className={`${styles.item} ${isDragging ? styles.dragging : ""}`}
      ref={(el) => {
        ref.current = el;
        droppableRef.current = el;
      }}
    >
      <input value={title} onChange={handleChange} />
    </div>
  );
};

export default ListItem;
