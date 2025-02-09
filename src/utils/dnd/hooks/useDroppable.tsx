import { useRef, useState, useEffect } from "react";
import { UniqueId } from "../../../types";
import { useDragDropContext } from "../DragDropContext";


interface DroppableProps {
    id: UniqueId;
    onDrop?: (draggedId: UniqueId, targetId: UniqueId) => void;
  }
  
  export function useDroppable({ id, onDrop }: DroppableProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const { activeId, setActiveId } = useDragDropContext();
    const [isOver, setIsOver] = useState(false);
  
    useEffect(() => {
      const element = ref.current;
      if (!element) return;
  
      const handleDragOver = (event: DragEvent) => {
        event.preventDefault();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
        }
        setIsOver(true);
      };
  
      const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        setIsOver(false);
        setActiveId(null);
        if (event.dataTransfer) {
            const draggedId = event.dataTransfer.getData('text/plain');
            onDrop?.(draggedId, id);
        }
      };
  
      const handleDragLeave = () => {
        setIsOver(false);
      };
  
      element.addEventListener('dragover', handleDragOver);
      element.addEventListener('drop', handleDrop);
      element.addEventListener('dragleave', handleDragLeave);
  
      return () => {
        element.removeEventListener('dragover', handleDragOver);
        element.removeEventListener('drop', handleDrop);
        element.removeEventListener('dragleave', handleDragLeave);
      };
    }, [id, onDrop]);
  
    return { ref, isOver, isActive: activeId === id };
  }
  