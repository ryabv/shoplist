import { ReactNode } from 'react';
import { UniqueId } from '../../types';
import { useDroppable } from './hooks/useDroppable';

import styles from './styles.module.css';

interface DroppableProps {
  id: UniqueId;
  onDrop: (targetId: UniqueId, event: DragEvent) => void;
  onDragEnter?: (dragOverId: UniqueId) => void;
  children: ReactNode;
}

export const Droppable = ({
  id,
  onDrop,
  onDragEnter,
  children,
}: DroppableProps) => {
  const { ref: droppableRef, isOver } = useDroppable({
    id,
    onDrop,
    onDragEnter,
  });

  return (
    <div>
      {id}
      <div
        className={`${styles.droppable} ${isOver && styles.isOver}`}
        ref={droppableRef}
      >
        {children}
      </div>
    </div>
  );
};
