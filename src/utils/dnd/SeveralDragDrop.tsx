import { useState } from 'react';
import { UniqueId } from '../../types';
import { arrayMove } from '../common/arrayMove';
import { Droppable } from './Droppable';
import { Draggable } from './Draggable';

import styles from './styles.module.css';

const insertAtIndex = (arr: UniqueId[], item: UniqueId, index: number) => [
  ...arr.slice(0, index),
  item,
  ...arr.slice(index),
];

const moveBetweenParents = (
  state: State,
  draggedId: UniqueId,
  targetId: UniqueId,
  newIndex: number
): State => {
  return Object.entries(state).reduce<State>((acc, [parentId, items]) => {
    if (parentId === targetId) {
      acc[parentId] = insertAtIndex(items, draggedId, newIndex + 1);
    } else {
      acc[parentId] = items.filter((item) => item !== draggedId);
    }
    return acc;
  }, {});
};

const moveWithinParent = (
  state: State,
  parentId: UniqueId,
  items: UniqueId[],
  oldIndex: number,
  newIndex: number
): State => {
  return {
    ...state,
    [parentId]: arrayMove(items, oldIndex, newIndex === -1 ? 0 : newIndex + 1),
  };
};

interface SeveralDragDropProps {
  shouldAnimateOnHover?: boolean;
  shouldUseDragElement?: boolean;
}

type State = Record<UniqueId, UniqueId[]>;

const defaultState: State = {
  'droppable-1': ['draggable-1', 'draggable-2', 'draggable-3'],
  'droppable-2': ['draggable-4'],
};

export const SeveralDragDrop = ({
  shouldUseDragElement,
  shouldAnimateOnHover,
}: SeveralDragDropProps) => {
  const [draggedId, setDraggedId] = useState<UniqueId | null>(null);
  const [hoveredId, setHoveredId] = useState<UniqueId | null>(null);
  const [hoveredParentId, setHoveredParentId] = useState<UniqueId | null>(null);
  const [state, setState] = useState<State>(defaultState);

  const handleDrop = (targetId: UniqueId, event: DragEvent) => {
    event.stopPropagation();

    if (!draggedId) {
      resetHoverState();
      return;
    }

    setState((state) => {
      const currentTargetItems = state[targetId] || [];
      const oldIndex = currentTargetItems.indexOf(draggedId);
      const newIndex = hoveredId ? currentTargetItems.indexOf(hoveredId) : -1;
      const isSameParent = oldIndex !== -1;

      if (isSameParent) {
        return moveWithinParent(
          state,
          targetId,
          currentTargetItems,
          oldIndex,
          newIndex
        );
      }

      return moveBetweenParents(state, draggedId, targetId, newIndex);
    });

    resetHoverState();
  };

  const resetHoverState = () => {
    setHoveredId(null);
    setHoveredParentId(null);
  };

  const handleDragOver = (id: UniqueId) => {
    setHoveredId(id);
  };

  const handleDragStart = (id: UniqueId, event: DragEvent) => {
    event.stopPropagation();
    setDraggedId(id);

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleLineDragEnter = (parentId: UniqueId) => () => {
    setHoveredId(null);
    setHoveredParentId(parentId);
  };

  return (
    <>
      {Object.entries(state).map(([parentId, items]) => (
        <Droppable key={parentId} id={parentId} onDrop={handleDrop}>
          <div
            className={`${styles.line} ${parentId === hoveredParentId && !hoveredId && styles.lineHighlight}`}
            onDragEnter={handleLineDragEnter(parentId)}
          />
          {items.map((item) => (
            <Draggable
              shouldUseDragElement={shouldUseDragElement}
              shouldAnimateOnHover={shouldAnimateOnHover}
              key={item}
              id={item}
              type="Child"
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
              isHoveredOnBottom={hoveredId === item}
            >
              {item}
            </Draggable>
          ))}
        </Droppable>
      ))}
    </>
  );
};
