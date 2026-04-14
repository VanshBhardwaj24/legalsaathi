import React from 'react';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  ctaText: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, ctaText }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <Icon size={24} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <button className={styles.cta}>
        {ctaText} &rsaquo;
      </button>
    </div>
  );
};
