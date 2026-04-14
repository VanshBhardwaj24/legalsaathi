import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runIntake } from './agents/intake.js';
import { runIPCSearch } from './agents/ipcSearch.js';
import { runPrecedent } from './agents/precedent.js';
import { runDrafter } from './agents/drafter.js';

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

        // Step 3: Precedent Search
        console.log('  → [3/4] Running precedent search...');
        const precedent = await runPrecedent(intake);
        console.log('  ✅ Precedent search complete.');

        // Step 4: Drafting
        console.log('  → [4/4] Running drafter...');
        const draft = await runDrafter(intake, ipc, precedent);
        console.log('  ✅ Draft complete.');

        res.json({
            status: 'success',
            intake,
            ipc_sections: ipc,
            precedents: precedent,
            raw: draft,
            structured: {
                ...intake,
                ipc_sections: ipc,
                precedents: precedent.cases,
                precedents_summary: precedent.summary,
                draft
            }
        });
    } catch (error) {
        console.error('\n❌ Analysis failed!');
        console.error('   Message:', error.message);
        console.error('   Stack:', error.stack);
        res.status(500).json({
            status: 'error',
            message: error.message,
            hint: 'Check the server terminal for more details.'
        });
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
