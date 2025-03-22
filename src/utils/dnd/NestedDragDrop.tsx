import { useRef, useState } from 'react';
import { UniqueId } from '../../types';
import { arrayMove } from '../common/arrayMove';
import { Droppable } from './Droppable';
import { Draggable } from './Draggable';

import styles from './styles.module.css';

enum ElementType {
  Root = 'Root',
  Parent = 'Parent',
  Child = 'Child',
}

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
  const orders = Object.entries(state.orders).reduce<State['orders']>(
    (acc, [parentId, items]) => {
      if (parentId === targetId) {
        acc[parentId] = insertAtIndex(items, draggedId, newIndex + 1);
      } else {
        acc[parentId] = items.filter((item) => item !== draggedId);
      }
      return acc;
    },
    {}
  );

  return { ...state, orders };
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
    orders: {
      ...state.orders,
      [parentId]: arrayMove(items, oldIndex, newIndex === -1 ? 0 : newIndex),
    },
  };
};

interface NestedDragDropProps {
  shouldAnimateOnHover?: boolean;
  shouldUseDragElement?: boolean;
}

type State = {
  data: Record<
    UniqueId,
    { id: UniqueId; type: ElementType; parentType: ElementType | null }
  >;
  orders: Record<UniqueId, UniqueId[]>;
};

const defaultState: State = {
  data: {
    root: {
      id: 'root',
      type: ElementType.Root,
      parentType: null,
    },
    'parent-1': {
      id: 'parent-1',
      type: ElementType.Parent,
      parentType: ElementType.Root,
    },
    'parent-2': {
      id: 'parent-2',
      type: ElementType.Parent,
      parentType: ElementType.Root,
    },
    'child-1': {
      id: 'child-1',
      type: ElementType.Child,
      parentType: ElementType.Parent,
    },
    'child-2': {
      id: 'child-2',
      type: ElementType.Child,
      parentType: ElementType.Parent,
    },
    'child-3': {
      id: 'child-3',
      type: ElementType.Child,
      parentType: ElementType.Parent,
    },
    'child-4': {
      id: 'child-4',
      type: ElementType.Child,
      parentType: ElementType.Parent,
    },
  },
  orders: {
    root: ['parent-1', 'parent-2'],
    'parent-1': ['child-1', 'child-2', 'child-3'],
    'parent-2': ['child-4'],
  },
};

export type MouseYDirection = 'up' | 'down';

export const NestedDragDrop = ({
  shouldUseDragElement,
  shouldAnimateOnHover,
}: NestedDragDropProps) => {
  const [directionY, setDirectionY] = useState<MouseYDirection | null>(null);
  const [draggedId, setDraggedId] = useState<UniqueId | null>(null);
  const [hoveredId, setHoveredId] = useState<UniqueId | null>(null);
  const [hoveredParentId, setHoveredParentId] = useState<UniqueId | null>(null);
  const [state, setState] = useState<State>(defaultState);
  const lastMouseYRef = useRef<number>();

  const handleDrop = (targetId: UniqueId, event: DragEvent) => {
    if (
      !draggedId ||
      state.data[draggedId].parentType !== state.data[targetId].type
    ) {
      return;
    }

    event.stopPropagation();

    setState((state) => {
      const currentTargetItems = state.orders[targetId] || [];
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
    setDraggedId(null);
  };

  const handleDragStart = (id: UniqueId, event: DragEvent) => {
    event.stopPropagation();
    setDraggedId(id);

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragEnd = () => {
    resetHoverState();
  };

  const handleDragOver = (id: UniqueId) => {
    if (!draggedId) {
      return;
    }

    if (state.data[id].type === state.data[draggedId].type) {
      setHoveredId(id);
    }
  };

  const handleDrag = (_: UniqueId, event: DragEvent) => {
    const lastMouseY = lastMouseYRef.current;

    const isMouseMovingDown = (event: DragEvent): boolean => {
      if (lastMouseY === undefined) {
        lastMouseYRef.current = event.clientY;
        return false;
      }
      const movingDown = event.clientY > lastMouseY;

      lastMouseYRef.current = event.clientY;
      return movingDown;
    };

    if (event.clientY !== lastMouseY) {
      setDirectionY(isMouseMovingDown(event) ? 'down' : 'up');
    }
  };

  const handleLineDragEnter = (parentId: UniqueId) => () => {
    setHoveredId(null);
    setHoveredParentId(parentId);
  };

  const isLineHighlighted = (parentId: UniqueId) => {
    return (
      !state.orders[parentId].length &&
      !hoveredId &&
      parentId === hoveredParentId &&
      draggedId &&
      state.data[draggedId].parentType === state.data[hoveredParentId].type
    );
  };

  const handleBeforeDragOver = (parentId: UniqueId, idx: number) => () => {
    setHoveredId(state.orders[parentId][idx - 1]);
  };

  const handleAfterDragOver = (parentId: UniqueId, idx: number) => () => {
    setHoveredId(state.orders[parentId][idx + 1]);
  };

  return (
    <Droppable id="root" onDrop={handleDrop}>
      <div
        className={`${styles.line} ${'root' === hoveredParentId && draggedId && state.data[draggedId].parentType === state.data[hoveredParentId].type && !hoveredId && styles.lineHighlight}`}
        onDragEnter={handleLineDragEnter('root')}
      />
      {state.orders['root'].map((parentId, idx) => (
        <div className={styles.itemBlock} key={parentId}>
          {draggedId &&
            idx !== 0 &&
            directionY === 'up' &&
            state.data[draggedId].type === state.data[parentId].type && (
              <div
                className={styles.helperBefore}
                onDragOver={handleBeforeDragOver('root', idx)}
              />
            )}
          <Draggable
            shouldUseDragElement={shouldUseDragElement}
            shouldAnimateOnHover={shouldAnimateOnHover}
            key={parentId}
            id={parentId}
            type={state.data[parentId].type}
            onDrag={handleDrag}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            isHoveredOnBottom={hoveredId === parentId}
          >
            <Droppable key={parentId} id={parentId} onDrop={handleDrop}>
              <div
                className={`${styles.line} ${isLineHighlighted(parentId) && styles.lineHighlight}`}
                onDragEnter={handleLineDragEnter(parentId)}
              />
              {state.orders[parentId].map((itemId, idx) => (
                <div className={styles.itemBlock} key={itemId}>
                  {draggedId &&
                    idx !== 0 &&
                    directionY === 'up' &&
                    state.data[draggedId].type === state.data[itemId].type && (
                      <div
                        className={styles.helperBefore}
                        onDragOver={handleBeforeDragOver(parentId, idx)}
                      />
                    )}
                  <Draggable
                    shouldUseDragElement={shouldUseDragElement}
                    shouldAnimateOnHover={shouldAnimateOnHover}
                    id={itemId}
                    type={state.data[itemId].type}
                    onDragOver={handleDragOver}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isHoveredOnBottom={hoveredId === itemId}
                  >
                    {itemId}
                  </Draggable>
                  {draggedId &&
                    state.orders[parentId].length - 1 !== idx &&
                    directionY === 'down' &&
                    state.data[draggedId].type === state.data[itemId].type && (
                      <div
                        className={styles.helperAfter}
                        onDragOver={handleAfterDragOver(parentId, idx)}
                      />
                    )}
                </div>
              ))}
            </Droppable>
          </Draggable>
          {draggedId &&
            state.orders['root'].length - 1 !== idx &&
            directionY === 'down' &&
            state.data[draggedId].type === state.data[parentId].type && (
              <div
                className={styles.helperAfter}
                onDragOver={handleAfterDragOver('root', idx)}
              />
            )}
        </div>
      ))}
    </Droppable>
  );
};
