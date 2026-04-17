import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Scale, CheckCircle2, AlertCircle, MapPin, ExternalLink, Users, HeartHandshake } from 'lucide-react';

interface EligibilityData {
  category: string;
  income: string;
  state: string;
}

export default function LegalAid() {
  const [data, setData] = useState<EligibilityData>({
    category: '',
    income: '',
    state: ''
  });
  const [result, setResult] = useState<{ eligible: boolean; reason: string } | null>(null);

  const categories = [
    'SC (Scheduled Castes)',
    'ST (Scheduled Tribes)',
    'Woman',
    'Child',
    'Disabled Person',
    'Industrial Workman',
    'Person in Custody',
    'Victim of Mass Disaster',
    'General Category'
  ];

  const incomeSlabs = [
    { id: 'below_1l', label: 'Below ₹1,00,000' },
    { id: '1l_3l', label: '₹1,00,000 - ₹3,00,000' },
    { id: 'above_3l', label: 'Above ₹3,00,000' }
  ];

  const handleCheck = () => {
    // Simple logic based on NALSA Section 12
    const isSpecialCategory = data.category !== 'General Category';
    const isLowIncome = data.income === 'below_1l';
    const isStateExtended = data.income === '1l_3l' && ['Delhi', 'Maharashtra', 'Gujarat'].includes(data.state);

    if (isSpecialCategory || isLowIncome || isStateExtended) {
      setResult({
        eligible: true,
        reason: isSpecialCategory 
          ? `You qualify for free legal aid under Section 12 of the Legal Services Authorities Act for your category.`
          : `You qualify for free legal aid based on the income criteria for ${data.state}.`
      });
    } else {
      setResult({
        eligible: false,
        reason: `Based on current NALSA guidelines, you may not qualify for free legal aid. However, you can still approach Pro-bono legal clinics.`
      });
    }
  };

  return (
    <div className="page-container" style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'inline-flex', padding: '12px', background: 'var(--color-bg-alt)', borderRadius: '20px', marginBottom: '20px' }}
        >
          <HeartHandshake size={32} color="var(--color-accent)" />
        </motion.div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px' }}>Legal Aid Portal</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
          Access free legal assistance provided by the National Legal Services Authority (NALSA) of India.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Eligibility Checker */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
          style={{ padding: '40px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <Scale color="var(--color-accent)" />
            <h2 style={{ fontSize: '1.5rem' }}>Eligibility Checker</h2>
          </div>

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>1. Which category do you belong to?</label>
                  <select 
                    value={data.category}
                    onChange={(e) => setData({ ...data, category: e.target.value })}
                    className="input-base"
                    style={{ width: '100%' }}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>2. Annual Family Income</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {incomeSlabs.map(slab => (
                      <button
                        key={slab.id}
                        onClick={() => setData({ ...data, income: slab.id })}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: `2px solid ${data.income === slab.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)'}`,
                          background: data.income === slab.id ? 'rgba(124, 58, 237, 0.1)' : 'rgba(255,255,255,0.02)',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                      >
                        {slab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>3. State of Residence</label>
                  <input 
                    type="text"
                    placeholder="e.g., Delhi"
                    className="input-base"
                    style={{ width: '100%' }}
                    value={data.state}
                    onChange={(e) => setData({ ...data, state: e.target.value })}
                  />
                </div>

                <button 
                  className="btn-accent" 
                  style={{ width: '100%' }}
                  disabled={!data.category || !data.income || !data.state}
                  onClick={handleCheck}
                >
                  CHECK ELIGIBILITY
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '20px 0' }}
              >
                {result.eligible ? (
                  <CheckCircle2 size={64} color="#10B981" style={{ marginBottom: '20px' }} />
                ) : (
                  <AlertCircle size={64} color="#F59E0B" style={{ marginBottom: '20px' }} />
                )}
                <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
                  {result.eligible ? 'You qualify!' : 'Pro-bono recommended'}
                </h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>{result.reason}</p>
                <button 
                  className="btn-ghost" 
                  onClick={() => setResult(null)}
                  style={{ width: '100%' }}
                >
                  START OVER
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Clinic Locator */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
          style={{ padding: '40px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <MapPin color="var(--color-accent)" />
            <h2 style={{ fontSize: '1.5rem' }}>Aid Clinic Locator</h2>
          </div>

          <div style={{ 
            height: '250px', 
            background: 'var(--color-bg-alt)', 
            borderRadius: '20px', 
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <Users size={48} style={{ opacity: 0.2, marginBottom: '12px' }} />
            <p style={{ fontSize: '0.875rem', opacity: 0.5 }}>OSM Map Integration Pending API keys</p>
            <button className="btn-accent" style={{ marginTop: '20px', padding: '8px 16px', fontSize: '0.75rem' }}>
              LOCATE NEAREST DLSA
            </button>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '16px' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Landmark size={18} color="var(--color-accent)" /> Important Resources
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem' }}>
              <li style={{ marginBottom: '12px' }}>
                <a href="https://nalsa.gov.in" target="_blank" className="link-hover" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  NALSA Official Website <ExternalLink size={14} />
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="https://nalsa.gov.in/services/legal-aid/eligibility" target="_blank" className="link-hover" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  Legal Aid Handbook <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a href="https://probono-doj.in/" target="_blank" className="link-hover" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  Nyaya Bandhu (Pro Bono) <ExternalLink size={14} />
                </a>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      <section style={{ marginTop: '60px', padding: '40px', background: 'var(--grad-glass)', borderRadius: '32px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>Not eligible for free aid?</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          We provide pro-bono level analysis for all users. Use our automated intelligence to build your case foundation.
        </p>
        <button className="btn-accent">START FREE ANALYSIS</button>
      </section>
    </div>
  );
}
