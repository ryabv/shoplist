import { FC } from 'react';
import styles from './MainList.module.css';
import Category from '../Category';
import { useDataContext } from '../../contexts/DataContext/hooks';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { UniqueId } from '../../types';

const MainList: FC = () => {
  const { data, onDataChange } = useDataContext();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // ✅ Перемещение категории
    if (
      data.categoryOrder.includes(activeId) &&
      data.categoryOrder.includes(overId)
    ) {
      const oldIndex = data.categoryOrder.indexOf(activeId);
      const newIndex = data.categoryOrder.indexOf(overId);
      onDataChange({
        ...data,
        categoryOrder: arrayMove(data.categoryOrder, oldIndex, newIndex),
      });
      return;
    }

    // ✅ Перемещение элемента между категориями
    let fromCategoryId;
    let toCategoryId;

    Object.values(data.categories).forEach((category) => {
      if (category.items.includes(activeId)) fromCategoryId = category.id;
      if (category.items.includes(overId)) toCategoryId = category.id;
    });

    if (!fromCategoryId || !toCategoryId) return;

    const updatedCategories = { ...data.categories };
    updatedCategories[fromCategoryId].items = updatedCategories[
      fromCategoryId
    ].items.filter((id) => id !== activeId);
    updatedCategories[toCategoryId].items.push(activeId);

    onDataChange({ ...data, categories: updatedCategories });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    let activeType = active.data.current?.type;
    let overType = over.data.current?.type;

    // ✅ Категории могут видеть только другие категории
    if (activeType === 'category' && overType !== 'category') return;

    // ✅ Элементы могут видеть категории и другие элементы
    if (activeType === 'item' && overType !== 'item' && overType !== 'category')
      return;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <SortableContext
        items={data.categoryOrder}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.mainList}>
          {data.categoryOrder.map((catId) => (
            <Category
              key={data.categories[catId].id}
              id={data.categories[catId].id}
              title={data.categories[catId].title}
              items={data.categories[catId].items}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default MainList;
