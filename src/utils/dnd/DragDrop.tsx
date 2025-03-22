import { useState } from 'react';
import { UniqueId } from '../../types';
import { arrayMove } from '../common/arrayMove';
import { Droppable } from './Droppable';
import { Draggable } from './Draggable';

const isIndexSmaller = <T,>(arr: T[], item1: T, item2: T): boolean => {
  const index1 = arr.indexOf(item1);
  const index2 = arr.indexOf(item2);
  return index1 < index2;
};

interface DragDropProps {
  shouldAnimateOnHover?: boolean;
  shouldUseDragElement?: boolean;
}

export const DragDrop = ({
  shouldUseDragElement,
  shouldAnimateOnHover,
}: DragDropProps) => {
  const [hoveredId, setHoveredId] = useState<UniqueId | null>(null);
  const [draggedId, setDraggedId] = useState<UniqueId | null>(null);
  const [items, setItems] = useState<UniqueId[]>([
    'draggable-1',
    'draggable-2',
    'draggable-3',
    'draggable-4',
  ]);

  const handleDrop = () => {
    if (!draggedId || !hoveredId) return;

    const oldIndex = items.indexOf(draggedId);
    const newIndex = items.indexOf(hoveredId);

    setItems(arrayMove(items, oldIndex, newIndex));
    setHoveredId(null);
    setDraggedId(null);
  };

  const handleDragEnter = (id: UniqueId) => {
    setHoveredId(id);
  };

  const handleDragStart = (id: UniqueId) => {
    setDraggedId(id);
  };

  return (
    <Droppable id="droppable-1" onDrop={handleDrop}>
      {items.map((item) => (
        <Draggable
          shouldUseDragElement={shouldUseDragElement}
          shouldAnimateOnHover={shouldAnimateOnHover}
          key={item}
          id={item}
          type="child"
          onDragEnter={handleDragEnter}
          onDragStart={handleDragStart}
          isHoveredOnTop={
            hoveredId === item && !isIndexSmaller(items, draggedId, item)
          }
          isHoveredOnBottom={
            hoveredId === item && isIndexSmaller(items, draggedId, item)
          }
        >
          {item}
        </Draggable>
      ))}
    </Droppable>
  );
};
