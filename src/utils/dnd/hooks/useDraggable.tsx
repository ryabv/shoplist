import { useRef, useEffect, useState, useCallback } from 'react';
import { UniqueId } from '../../../types';
interface DraggableProps {
  id: UniqueId;
  type: string;
  onDrag?: (id: UniqueId, event: DragEvent) => void;
  onDragStart?: (id: UniqueId, event: DragEvent) => void;
  onDragEnd?: (id: UniqueId, event: DragEvent) => void;
  onDragEnter?: (id: UniqueId, event: DragEvent) => void;
  onDragLeave?: (id: UniqueId, event: DragEvent) => void;
  onDragOver?: (id: UniqueId, event: DragEvent) => void;
}

export function useDraggable({
  id,
  type,
  onDrag,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onDragLeave,
  onDragOver,
}: DraggableProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const dragHandlerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback(
    (event: DragEvent) => {
      setIsDragging(true);
      onDragStart?.(id, event);
    },
    [onDragStart, id]
  );

  const handleDragEnter = useCallback(
    (event: DragEvent) => {
      onDragEnter?.(id, event);
    },
    [onDragEnter, id]
  );

  const handleDragLeave = useCallback(
    (event: DragEvent) => {
      onDragLeave?.(id, event);
    },
    [onDragLeave, id]
  );

  const handleDragOver = useCallback(
    (event: DragEvent) => {
      onDragOver?.(id, event);
    },
    [onDragOver, id]
  );

  const handleDragEnd = useCallback(
    (event: DragEvent) => {
      setIsDragging(false);
      onDragEnd?.(id, event);

      const dragHandler = dragHandlerRef.current;
      const element = ref.current;

      if (dragHandler && element) {
        element.setAttribute('draggable', 'false');
      }
    },
    [onDragEnd, id]
  );

  const handleDrag = useCallback(
    (event: DragEvent) => {
      onDrag?.(id, event);
    },
    [onDrag, id]
  );

  useEffect(() => {
    const dragHandler = dragHandlerRef.current;
    const element = ref.current;
    if (!element) return;

    if (dragHandler) {
      dragHandler.addEventListener('mousedown', () => {
        element.setAttribute('draggable', 'true');
      });
    } else {
      element.setAttribute('draggable', 'true');
    }

    element.addEventListener('drag', handleDrag);
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('dragover', handleDragOver);

    return () => {
      element.removeEventListener('drag', handleDrag);
      element.removeEventListener('dragstart', handleDragStart);
      element.removeEventListener('dragend', handleDragEnd);
      element.removeEventListener('dragenter', handleDragEnter);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('dragover', handleDragOver);
    };
  }, [
    id,
    type,
    handleDragStart,
    handleDragEnd,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrag,
  ]);

  return { ref, dragHandlerRef, isDragging };
}
