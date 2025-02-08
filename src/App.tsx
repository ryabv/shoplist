import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { DraggableCategory } from './DraggableComponents';
import styles from './App.module.css';
import { categorizeShoppingList } from './api';
import { Category } from './types';

export default function ShopList() {
  const [inputText, setInputText] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const categorizedList: Category[] = await categorizeShoppingList(inputText);
    setCategories(categorizedList);
    setLoading(false);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId !== overId) {
      setCategories((prev) => {
        const oldIndex = prev.findIndex((cat) => cat.id === activeId);
        const newIndex = prev.findIndex((cat) => cat.id === overId);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ShopList AI</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          className={styles.textarea}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your shopping list..."
        />
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Categorize'}
        </button>
      </form>
      {categories.length > 0 && (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={categories.map((cat) => cat.id)} strategy={verticalListSortingStrategy}>
            <div className={styles.result}>
              {categories.map((category) => (
                <DraggableCategory key={category.id} category={category} setCategories={setCategories} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
