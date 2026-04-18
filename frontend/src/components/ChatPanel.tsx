import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import styles from './ChatPanel.module.css';
import type { AnalysisResult } from '../types/index';
import { CONFIG } from '../config';

interface ChatPanelProps {
  context: AnalysisResult;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMsg = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const resp = await axios.post(`${CONFIG.API_URL}/api/chat`, {
        message: userMsg,
        context: context
      });
      setChatHistory(prev => [...prev, { role: 'ai', content: resp.data.response }]);
    } catch (e) {
      console.error("Chat failed", e);
      setChatHistory(prev => [...prev, { role: 'ai', content: "⚠️ I apologize, but I encountered an error connecting to the Legal Intelligence server. Please ensure the backend is running." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={styles.toggle} onClick={() => setIsOpen(true)}>
        <MessageSquare size={32} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.panel}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <Sparkles className="text-accent" size={24} />
                 <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Legal Consultant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}>
                 <X size={24} />
              </button>
            </div>

            <div className={styles.messages}>
              {chatHistory.length === 0 && (
                <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '40px' }}>
                  <p>Consult with the AI about this specific case analysis. Ask about bail, strategies, or specific sections.</p>
                </div>
              )}
              {chatHistory.map((chat, idx) => (
                <div key={idx} className={`${styles.message} ${chat.role === 'user' ? styles.userMessage : styles.aiMessage}`}>
                  {chat.role === 'ai' ? (
                    <div className={styles.markdown}>
                      <ReactMarkdown>{chat.content}</ReactMarkdown>
                    </div>
                  ) : (
                    chat.content
                  )}
                </div>
              ))}
              {isLoading && (
                <div className={`${styles.message} ${styles.aiMessage}`}>
                  Searching Jurisprudence...
                </div>
              )}
            </div>

            <div className={styles.inputArea}>
              <input 
                type="text" 
                placeholder="Ask a follow-up question..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="btn-accent" onClick={handleSend} disabled={isLoading} style={{ padding: '0 20px' }}>
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
