import { ChangeEvent, FC } from 'react';
import styles from './Category.module.css';
import { UniqueId } from '../../types';
import ListItem from '../ListItem';
import { useDataContext } from '../../contexts/DataContext/hooks';

import { useDraggable, useDroppable } from '../../utils/dnd';
import { arrayMove } from '../../utils/common/arrayMove';
import { useDragDropContext } from '../../utils/dnd/DragDropContext';

interface Props {
  id: UniqueId;
  title: string;
  items: UniqueId[];
}

const Category: FC<Props> = ({ id, title, items }) => {
  const { data, onDataChange } = useDataContext();
    const { activeId, hoverTarget, elementHeight, groupHoverOffsets, setGroupHoverOffsets } = useDragDropContext();
  

  const handleDrop = (draggedId: UniqueId, targetId: UniqueId) => {
    if (!draggedId || !targetId) return;

    if (
      data.categoryOrder.includes(draggedId) &&
      data.categoryOrder.includes(targetId)
    ) {
      const oldIndex = data.categoryOrder.indexOf(draggedId);
      const newIndex = data.categoryOrder.indexOf(targetId);
      onDataChange({
        ...data,
        categoryOrder: arrayMove(data.categoryOrder, oldIndex, newIndex),
      });
    }
  };

  const handleDragEnter = () => {
    console.log(activeId, id)
    if (activeId !== id) {
      return;
    }

    const newOffsets = {};
    const activeIndex = data.categoryOrder.indexOf(activeId);
    const hoverIndex = data.categoryOrder.indexOf(id);
    console.log('od', id)
    data.categoryOrder.forEach((categoryId, index) => {
      if (
        (activeIndex > hoverIndex && index >= hoverIndex && index < activeIndex && activeIndex !== hoverIndex) ||
        (activeIndex < hoverIndex && index > activeIndex && index <= hoverIndex && activeIndex !== hoverIndex)
      ) {
        newOffsets[categoryId] = 100;
      } else {
        newOffsets[categoryId] = 0;
      }
    });

    setGroupHoverOffsets(newOffsets);
  };

  const droppableRef = useDroppable({ id, onDrop: handleDrop }).ref;
  const {ref: draggableRef, isDragging } = useDraggable({ id, type: 'category', onDragEnter: handleDragEnter });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onDataChange({
      ...data,
      categories: {
        ...data.categories,
        [id]: { ...data.categories[id], title: e.currentTarget.value },
      },
    });
  };

  let hoverClass = "";
  if (hoverTarget === id && activeId) {
    const activeIndex = data.categoryOrder.indexOf(activeId);
    const hoverIndex = data.categoryOrder.indexOf(id);

    if (activeIndex > hoverIndex) {
      hoverClass = "hovering-up";
    } else if (activeIndex < hoverIndex) {
      hoverClass = "hovering-down";
    }
  }
  console.log('groupHoverOffsets', groupHoverOffsets);
  return (
    <div className={`${styles.category} ${isDragging ? styles.dragging : ""} ${hoverClass ? styles[hoverClass] : ''}`}      
     style={{ "--hover-offset": `${groupHoverOffsets[id]}px` } as React.CSSProperties}
>
      <div ref={droppableRef}>
        <div ref={draggableRef}>
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
        </div>
      </div>
    </div>
  );
};

export default Category;
