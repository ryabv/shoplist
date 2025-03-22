import { ReactNode } from 'react';
import { UniqueId } from '../../types';
import { useDraggable } from './hooks/useDraggable';

import styles from './styles.module.css';

interface DraggableProps {
  id: UniqueId;
  type: string;
  isHoveredOnTop?: boolean;
  isHoveredOnBottom?: boolean;
  onDrag?: (id: UniqueId, event: DragEvent) => void;
  onDragStart?: (id: UniqueId, event: DragEvent) => void;
  onDragEnd?: (id: UniqueId, event: DragEvent) => void;
  onDragEnter?: (id: UniqueId) => void;
  onDragOver?: (id: UniqueId, event: DragEvent) => void;
  onDragLeave?: (id: UniqueId) => void;
  children: ReactNode;
  shouldUseDragElement?: boolean;
  shouldAnimateOnHover?: boolean;
}

export const Draggable = ({
  id,
  type,
  isHoveredOnTop,
  isHoveredOnBottom,
  onDrag,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onDragLeave,
  onDragOver,
  children,
  shouldUseDragElement,
  shouldAnimateOnHover,
}: DraggableProps) => {
  const {
    ref: draggableRef,
    dragHandlerRef,
    isDragging,
  } = useDraggable({
    id,
    type,
    onDrag,
    onDragEnter,
    onDragStart,
    onDragEnd,
    onDragLeave,
    onDragOver,
  });

  return (
    <div
      className={`${styles.container} 
      ${!shouldUseDragElement && styles.draggable} 
      ${shouldAnimateOnHover && isDragging && styles.dragging} 
      ${shouldAnimateOnHover && !isDragging && isHoveredOnTop && styles['hovered-top']} 
      ${shouldAnimateOnHover && !isDragging && isHoveredOnBottom && styles['hovered-bottom']}`}
      ref={draggableRef}
    >
      <div className={`${styles.block}`}>
        {shouldUseDragElement && (
          <div
            ref={dragHandlerRef}
            className={`${styles.handler} ${shouldUseDragElement && styles.draggable}`}
          >
            ⁞
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
