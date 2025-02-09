import { useRef, useEffect } from "react";
import { UniqueId } from "../../../types";
import { useDragDropContext } from "../DragDropContext";

interface DraggableProps {
  id: UniqueId;
  type: 'category' | 'item';
  onDragStart?: (id: UniqueId) => void;
  onDragEnd?: (id: UniqueId) => void;
  onDragEnter?: (id: UniqueId) => void;
}

export function useDraggable({
  id,
  type,
  onDragStart,
  onDragEnd,
  onDragEnter,
}: DraggableProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { activeId, setActiveId, setHoverTarget, setElementHeight, setGroupHoverOffsets } = useDragDropContext();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // setElementHeight(element.getBoundingClientRect().height);

    const handleDragStart = (event: DragEvent) => {
      event.stopPropagation(); // 🛑 Останавливаем всплытие, чтобы категория не срабатывала
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', String(id));
        event.dataTransfer.setData('type', type); // 🆕 Добавляем тип элемента
        event.dataTransfer.effectAllowed = 'move';
        setActiveId(id);
        setElementHeight(element.getBoundingClientRect().height);
        onDragStart?.(id);
      }
    };

    const handleDragEnter = () => {
        setHoverTarget(id);
        onDragEnter?.(id);
      };

    const handleDragEnd = () => {
      setActiveId(null);
      setHoverTarget(null);
      setElementHeight(0);
      setGroupHoverOffsets({});
      onDragEnd?.(id);
    };

    element.setAttribute('draggable', 'true');
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
    element.addEventListener("dragenter", handleDragEnter);

    return () => {
      element.removeEventListener('dragstart', handleDragStart);
      element.removeEventListener('dragend', handleDragEnd);
      element.removeEventListener("dragenter", handleDragEnter);

    };
  }, [id, type, onDragStart, onDragEnd, setActiveId, setHoverTarget]);

  return { ref, isDragging: activeId === id };
}
  