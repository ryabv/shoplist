import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './App.module.css';
import { Category, Item } from './types';

interface CategoryProps {
  category: Category;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

interface ItemProps {
  item: Item;
  categoryId: number;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export function DraggableCategory({ category, setCategories }: CategoryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const { setNodeRef: setDroppableRef } = useDroppable({ id: category.id });

  const [categoryName, setCategoryName] = useState(category.title);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setCategoryName(newName);
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === category.id ? { ...cat, title: newName } : cat
      )
    );
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.category}>
      <div className={styles.dragHandle} {...attributes} {...listeners} />
      <input
        className={styles.categoryTitle}
        value={categoryName}
        onChange={handleCategoryChange}
      />
      <div ref={setDroppableRef} className={styles.itemsList}>
        <SortableContext
          items={category.items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {category.items.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              categoryId={category.id}
              setCategories={setCategories}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export function DraggableItem({ item, categoryId, setCategories }: ItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, data: { categoryId } });

  const [itemName, setItemName] = useState(item.title);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setItemName(newName);
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((i) =>
                i.id === item.id ? { ...i, title: newName } : i
              ),
            }
          : cat
      )
    );
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.item}>
      <div className={styles.dragHandle} {...attributes} {...listeners} />
      <input
        className={styles.itemInput}
        value={itemName}
        onChange={handleItemChange}
      />
    </div>
  );
}
