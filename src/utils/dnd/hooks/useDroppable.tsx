import { useRef, useState, useEffect, useCallback } from 'react';
import { UniqueId } from '../../../types';

interface DroppableProps {
  id: UniqueId;
  onDrop?: (targetId: UniqueId, event: DragEvent) => void;
  onDragEnter?: (dragOverId: UniqueId, event: DragEvent) => void;
}

export function useDroppable({ id, onDrop, onDragEnter }: DroppableProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    setIsOver(true);
  };

  const handleDragEnter = useCallback(
    (event: DragEvent) => {
      onDragEnter?.(id, event);
    },
    [id, onDragEnter]
  );

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      setIsOver(false);
      onDrop?.(id, event);
    },
    [id, onDrop]
  );

  const handleDragLeave = () => {
    setIsOver(false);
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragleave', handleDragLeave);

    return () => {
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragenter', handleDragEnter);
      element.removeEventListener('drop', handleDrop);
      element.removeEventListener('dragleave', handleDragLeave);
    };
  }, [handleDragEnter, handleDrop, id]);

  return { ref, isOver };
}
