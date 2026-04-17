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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());



app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/analyze', async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    console.log(`\n🚀 Starting analysis for: "${query}"`);

    try {
        // Step 1: Intake
        console.log('  → [1/4] Running intake agent...');
        const intake = await runIntake(query);
        console.log('  ✅ Intake complete:', JSON.stringify(intake).slice(0, 120));

        // Step 2: IPC Search
        console.log('  → [2/4] Running IPC search...');
        const ipc = await runIPCSearch(intake);
        console.log(`  ✅ IPC Search complete: ${ipc.length} sections found.`);

        // Stage 3: Research & Intelligence (Parallel)
        console.log('  → [3/4] Running advanced research agents...');
        const [precedent, evidence, timeline] = await Promise.all([
            runPrecedent(intake),
            runEvidence(intake, ipc),
            runTimeline(intake)
        ]);
        console.log('  ✅ Advanced intelligence complete.');

        // Stage 4: Drafting
        console.log('  → [4/4] Running drafter...');
        const draft = await runDrafter(intake, ipc, precedent);
        console.log('  ✅ Draft complete.');

        res.json({
            status: 'success',
            intake,
            ipc_sections: ipc,
            precedents: precedent,
            evidence_checklist: evidence,
            timeline_data: timeline,
            raw: draft,
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
