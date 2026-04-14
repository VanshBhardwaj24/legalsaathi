import Fuse from 'fuse.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ipcPath = path.resolve(__dirname, '../ipc.json');

let fuseInstance = null;

export const initFuse = () => {
    try {
        if (!fs.existsSync(ipcPath)) {
            console.warn('⚠️ ipc.json not found! IPC Search will return empty results.');
            return;
        }

        const rawData = fs.readFileSync(ipcPath, 'utf8');
        const data = JSON.parse(rawData);

        const options = {
            keys: [
                { name: 'Section', weight: 0.2 },
                { name: 'section_title', weight: 0.4 },
                { name: 'section_desc', weight: 0.3 },
                { name: 'chapter_title', weight: 0.1 }
            ],
            threshold: 0.6,
            includeScore: true,
            minMatchCharLength: 2
        };

        fuseInstance = new Fuse(data, options);
        console.log('✅ Fuse.js index initialized with', data.length, 'sections.');
    } catch (error) {
        console.error('❌ Error initializing Fuse.js index:', error);
    }
};

export const searchIPC = (query, limit = 5) => {
    if (!fuseInstance) initFuse();
    if (!fuseInstance) return [];

    const results = fuseInstance.search(query);
    return results.slice(0, limit).map(r => ({
        ...r.item,
        score: r.score
    }));
};
