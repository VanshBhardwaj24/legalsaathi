import React from 'react';
import * as Icons from 'lucide-react';
import { CATEGORIES } from '../../data/legalLiteracy';
import styles from './Intelligence.module.css';

interface CategorySidebarProps {
  activeCategory: string;
  onSelect: (id: string) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ activeCategory, onSelect }) => {
  return (
    <div className={styles.categorySidebar}>
      <h4 className={styles.sidebarTitle}>Categories</h4>
      <div className={styles.sidebarList}>
        {CATEGORIES.map((cat) => {
          const Icon = (Icons as any)[cat.icon] || Icons.Book;
          return (
            <button
              key={cat.id}
              className={`${styles.sidebarItem} ${activeCategory === cat.id ? styles.active : ''}`}
              onClick={() => onSelect(cat.id)}
            >
              <div className={styles.sidebarIcon}>
                <Icon size={18} />
              </div>
              <span className={styles.sidebarName}>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
