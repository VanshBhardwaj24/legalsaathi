import React, { useState } from 'react';
import {
  Copy, FileText, Search, Scale, FileSignature,
  Clock, ClipboardList, Map as MapIcon,
  Navigation, Circle, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Chrono } from "react-chrono";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import styles from './ResultViewer.module.css';
import type { AnalysisResult } from '../types/index';

// Fix for default marker icon in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface ResultViewerProps {
  data: AnalysisResult;
}

// Component to handle map center updates
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center, 12);
  return null;
};

export const ResultViewer: React.FC<ResultViewerProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'ipc' | 'precedents' | 'chrono' | 'evidence' | 'map' | 'draft'>('summary');
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]); // New Delhi default
  const [foundCourts, setFoundCourts] = useState<any[]>([]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const findNearestCourt = async () => {
    // POC: Using OSM Nominatim to find courts near current map center
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=court&lat=${mapCenter[0]}&lon=${mapCenter[1]}&addressdetails=1&limit=5`);
      const results = await resp.json();
      setFoundCourts(results);
      if (results.length > 0) {
        setMapCenter([parseFloat(results[0].lat), parseFloat(results[0].lon)]);
      }
    } catch (e) {
      console.error("Court lookup failed", e);
    }
  };

  const tabs = [
    { id: 'summary', label: 'Summary', icon: <FileText size={18} /> },
    { id: 'ipc', label: 'Codes', icon: <Search size={18} /> },
    { id: 'precedents', label: 'Cases', icon: <Scale size={18} /> },
    { id: 'chrono', label: 'Chronology', icon: <Clock size={18} /> },
    { id: 'evidence', label: 'Evidence', icon: <ClipboardList size={18} /> },
    // { id: 'map', label: 'Legal Map', icon: <MapIcon size={18} /> },
    { id: 'draft', label: 'Draft', icon: <FileSignature size={18} /> },
  ] as const;

  const getEvidenceColor = (imp: string) => {
    if (imp === 'High') return styles.itemHigh;
    if (imp === 'Medium') return styles.itemMedium;
    return styles.itemLow;
  };

  const getImpBadge = (imp: string) => {
    if (imp === 'High') return styles.impHigh;
    if (imp === 'Medium') return styles.impMedium;
    return styles.impLow;
  };

  return (
    <div className={`${styles.wrapper} glass-ui`}>
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'summary' && (
              <div className={styles.section}>
                <h3>Case Intake Summary</h3>
                <div className={styles.markdownContent}>
                  <p>{data.structured?.summary || "Analysis in progress..."}</p>
                </div>
                <div className={styles.actions}>
                  <span className={styles.tag}>Classification: {data.structured?.case_type}</span>
                  <span className={styles.tag}>Domain: {data.structured?.legal_domain}</span>
                  <span className={styles.tag}>Jurisdiction: {data.structured?.jurisdiction}</span>
                </div>
              </div>
            )}

            {activeTab === 'chrono' && (
              <div className={styles.section}>
                <h3>Case Chronology</h3>
                <div className={styles.timelineContainer}>
                  {data.structured?.timeline_data && data.structured.timeline_data.length > 0 ? (
                    <Chrono
                      items={data.structured.timeline_data}
                      mode="VERTICAL"
                      theme={{ primary: 'var(--color-primary)', secondary: 'var(--color-accent-vibrant)', cardBgColor: 'white', titleColor: 'var(--color-primary)' }}
                      disableToolbar
                      cardHeight={100}
                    />
                  ) : (
                    <p>No temporal events identified for this case.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'evidence' && (
              <div className={styles.section}>
                <h3>Evidence Matrix</h3>
                <div className={styles.evidenceChecklist}>
                  {data.structured?.evidence_checklist?.map((item, i) => (
                    <div key={i} className={`${styles.evidenceItem} ${getEvidenceColor(item.importance)}`}>
                      <button className={styles.evidenceStatus}>
                        <Circle size={16} />
                      </button>
                      <div className={styles.evidenceInfo}>
                        <h4>{item.document}</h4>
                        <p>{item.reason}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <span className={styles.badge}>{item.category}</span>
                        <span className={`${styles.evidenceImportance} ${getImpBadge(item.importance)}`}>
                          {item.importance} Priority
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'map' && (
              <div className={styles.section}>
                <div className={styles.mapControls}>
                  <button className="btn-accent" onClick={findNearestCourt}>
                    <Navigation size={16} /> FIND NEAREST COURT
                  </button>
                </div>
                <div className={styles.mapContainer}>
                  <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' />
                    <ChangeView center={mapCenter} />
                    {foundCourts.map((court, idx) => (
                      <Marker key={idx} position={[parseFloat(court.lat), parseFloat(court.lon)]}>
                        <Popup>
                          <strong>{court.display_name}</strong>
                          <br /> Court Facility identified via OSM.
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>
            )}

            {activeTab === 'ipc' && (
              <div className={styles.section}>
                <h3>Relevant Legal Sections</h3>
                <div className={styles.cards}>
                  {data.structured?.ipc_sections?.map((ipc, i) => (
                    <div key={i} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <span className={styles.badge}>{ipc.section}</span>
                        <span>{ipc.chapter}</span>
                      </div>
                      <h4 className={styles.cardTitle}>{ipc.section_title}</h4>
                      <p className={styles.cardBody}>{ipc.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'precedents' && (
              <div className={styles.section}>
                <h3>Research & Jurisprudence</h3>
                <div className={styles.cards}>
                  {data.structured?.precedents?.map((prec, i) => (
                    <div key={i} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <span className={styles.badge}>PREDEDENT</span>
                        {prec.link && <a href={prec.link} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Source</a>}
                      </div>
                      <h4 className={styles.cardTitle}>{prec.title}</h4>
                      <p className={styles.cardBody}>{prec.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'draft' && (
              <div className={styles.section}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h3>Magistrate's Draft</h3>
                  <button className="btn-outlined" onClick={() => handleCopy(data.structured?.draft || "")}>
                    <Copy size={16} /> Copy Text
                  </button>
                </div>
                <div className="glass-ui" style={{ padding: '40px', background: 'white', borderRadius: 'var(--radius-md)' }}>
                  <ReactMarkdown>{data.structured?.draft || ""}</ReactMarkdown>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
