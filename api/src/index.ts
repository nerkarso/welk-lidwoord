import { serve } from '@hono/node-server';
import * as cheerio from 'cheerio';
import { Hono } from 'hono';
import { addHistory, getHistory, listHistory } from './queries.js';

const app = new Hono();

app.get('/history', async (c) => {
	try {
		const records = await listHistory();
		return c.json(records);
	} catch (error) {
		return c.json({ error: error }, 500);
	}
});

app.get('/search/:word', async (c) => {
	const { word } = c.req.param();
	const cached = await getHistory(word);

	if (cached) {
		c.header('x-cache', 'HIT');
		return c.text(cached.result ?? 'Nothing found');
	}

	let output = 'Nothing found';

	try {
		const res = await fetch(`https://www.welklidwoord.nl/${word}`);
		const html = await res.text();

		const $ = cheerio.load(html);
		output = $('#content > h2.nieuwH2').text().trim();
	} catch (error) {
		return c.json({ error: error }, 500);
	}

	await addHistory(word, output);
	c.header('x-cache', 'MISS');
	return c.text(output);
});

serve(
	{
		fetch: app.fetch,
		port: 5000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
