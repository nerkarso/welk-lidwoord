import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { HistoryRepository } from './repositories/history.js';
import { registerDocumentationRoutes } from './routes/documentation.js';
import { registerHistoryRoutes } from './routes/history.js';
import { registerSearchRoutes } from './routes/search.js';
import {
	WelklidwoordSource,
	WordSearchService,
} from './services/word-search.js';

const app = new Hono();
const historyRepository = new HistoryRepository();
const welklidwoordSource = new WelklidwoordSource();
const wordSearchService = new WordSearchService(
	historyRepository,
	welklidwoordSource,
);

registerHistoryRoutes(app, historyRepository);
registerSearchRoutes(app, wordSearchService);
registerDocumentationRoutes(app);

serve(
	{
		fetch: app.fetch,
		port: parseInt(process.env.PORT || '5000', 10),
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
