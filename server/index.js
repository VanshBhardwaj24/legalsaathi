import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runIntake } from './agents/intake.js';
import { runIPCSearch } from './agents/ipcSearch.js';
import { runPrecedent } from './agents/precedent.js';
import { runDrafter } from './agents/drafter.js';
import { runEvidence } from './agents/evidence.js';
import { runTimeline } from './agents/timeline.js';
import { handleChat } from './agents/chat.js';
import { fetchLegalNews } from './tools/newsScanner.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());



app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/news', async (req, res) => {
    try {
        const news = await fetchLegalNews();
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

app.post('/api/analyze', async (req, res) => {
    const { query, language = "English", document_type = "generic" } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    console.log(`\n🚀 Starting analysis for: "${query}" | Type: ${document_type} | Language: ${language}`);

    try {
        const activities = [];

        // Step 1: Intake
        console.log('  → [1/4] Running intake agent...');
        const intake = await runIntake(query, language);
        activities.push({ agent: 'Intake Agent', type: 'analysis', description: 'Analyzed user query and extracted case domain.' });

        // Step 2: IPC Search
        console.log('  → [2/4] Running IPC search...');
        const ipc = await runIPCSearch(intake);
        activities.push({ agent: 'Legal Search Agent', type: 'research', description: `Identified ${ipc.length} legal sections with authoritative links.` });

        // Stage 3: Research & Intelligence (Parallel)
        console.log('  → [3/4] Running advanced research agents...');
        const [precedent, evidence, timeline] = await Promise.all([
            runPrecedent(intake),
            runEvidence(intake, ipc),
            runTimeline(intake)
        ]);
        activities.push({ agent: 'Research Agent', type: 'research', description: 'Extracted judicial precedents from high-court records.' });
        activities.push({ agent: 'Intelligence Agent', type: 'analysis', description: 'Generated structured evidence checklist and chronology.' });

        // Stage 4: Drafting
        console.log('  → [4/4] Running drafter...');
        const draft = await runDrafter(intake, ipc, precedent, document_type, language);
        activities.push({ agent: 'Drafting Agent', type: 'drafting', description: `Generated a professional ${document_type} document.` });

        res.json({
            status: 'success',
            activities,
            structured: {
                ...intake,
                ipc_sections: ipc,
                precedents: precedent.cases,
                precedents_summary: precedent.summary,
                evidence_checklist: evidence,
                timeline_data: timeline,
                draft
            }
        });
    } catch (error) {
        console.error('\n❌ Analysis failed!');
        console.error('   Message:', error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.post('/api/chat', async (req, res) => {
    const { message, context } = req.body;
    if (!message || !context) return res.status(400).json({ error: 'Message and context required' });

    try {
        const response = await handleChat(message, context);
        res.json({ response });
    } catch (error) {
        console.error('❌ Chat failed:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

const server = app.listen(PORT, () => {
    console.log(`🚀 LegalSaathi server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use!`);
        console.error(`   Run this command to fix it: npx kill-port ${PORT}`);
        console.error(`   Or change PORT in server/.env`);
        process.exit(1);
    } else {
        throw err;
    }
});
