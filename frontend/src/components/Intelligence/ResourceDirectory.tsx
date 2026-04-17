import React from 'react';
import { ExternalLink, Info, Globe, Shield, Scale, MapPin } from 'lucide-react';
import styles from './Intelligence.module.css';

const RESOURCES = [
  {
    category: 'Government Portals',
    links: [
      { name: 'RTI Online', url: 'https://rtionline.gov.in/', desc: 'File and track RTIs directly with Central Government departments.', icon: Globe },
      { name: 'E-Daakhil', url: 'https://edaakhil.nic.in/', desc: 'Digital portal for filing consumer complaints in District/State/National Commissions.', icon: Scale },
      { name: 'Cyber Crime Portal', url: 'https://cybercrime.gov.in/', desc: 'Report cyber fraud, harassment, and financial thefts.', icon: Shield }
    ]
  },
  {
    category: 'Legal Aid & Rights',
    links: [
      { name: 'NALSA', url: 'https://nalsa.gov.in/', desc: 'National Legal Services Authority - Find free legal aid for eligible citizens.', icon: Scale },
      { name: 'Know Your Station', url: 'https://egazette.nic.in/', desc: 'Identify jurisdictional police stations and official gazette notifications.', icon: MapPin },
      { name: 'UGC Ragging Portal', url: 'https://www.antiragging.in/', desc: 'Specialized portal for reporting college harassment and ragging.', icon: Info }
    ]
  }
];

export const ResourceDirectory: React.FC = () => {
  return (
    <div className={styles.directoryContainer}>
      <div className={styles.directoryHeader}>
        <div className={styles.headerTitle}>
          <ExternalLink className={styles.accentIcon} />
          <h3>Official Resource Directory</h3>
        </div>
        <p className={styles.subtitle}>Curated links to verified government portals for legal action and aid.</p>
      </div>

      <div className={styles.categoryGrid}>
        {RESOURCES.map((group, idx) => (
          <div key={idx} className={styles.resourceGroup}>
            <h4 className={styles.groupLabel}>{group.category}</h4>
            <div className={styles.linkGrid}>
              {group.links.map((link, lIdx) => (
                <a 
                  key={lIdx} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.resourceCard}
                >
                  <div className={styles.cardTop}>
                    <link.icon className={styles.linkIcon} size={20} />
                    <ExternalLink size={14} className={styles.externalArrow} />
                  </div>
                  <h5>{link.name}</h5>
                  <p>{link.desc}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
