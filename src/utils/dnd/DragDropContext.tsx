import { createContext, useContext, useState } from "react";
import { UniqueId } from "../../types";

type GroupHoverOffsets = Record<UniqueId, number>;

interface DragDropContextProps {
  activeId: UniqueId | null;
  setActiveId: (id: UniqueId | null) => void;
  setHoverTarget: (id: UniqueId | null) => void;
  hoverTarget: UniqueId | null;
  elementHeight: number;
  setElementHeight: (height: number) => void;
  groupHoverOffsets: GroupHoverOffsets;
  setGroupHoverOffsets: (offsets: GroupHoverOffsets) => void;
}

const DragDropContext = createContext<DragDropContextProps | undefined>(
  undefined
);

export function DragDropProvider({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState<UniqueId | null>(null);
  const [hoverTarget, setHoverTarget] = useState<UniqueId | null>(null);
  const [elementHeight, setElementHeight] = useState<number>(0);
  const [groupHoverOffsets, setGroupHoverOffsets] = useState<GroupHoverOffsets>({});
  console.log('activeId', activeId);
  return (
    <DragDropContext.Provider value={{ activeId, setActiveId, hoverTarget, setHoverTarget, elementHeight, setElementHeight, groupHoverOffsets, setGroupHoverOffsets }}>
      {children}
    </DragDropContext.Provider>
  );
}

export function useDragDropContext() {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error(
      'useDragDropContext must be used within a DragDropProvider'
    );
  }
  return context;
}