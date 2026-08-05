import * as cheerio from 'cheerio';
import type { HistoryRepository } from '../repositories/history.js';

export interface WordDefinitionSource {
	find(word: string): Promise<string>;
}

export type WordSearchResult = {
	cache: 'HIT' | 'MISS';
	result: string;
};

export class WelklidwoordSource implements WordDefinitionSource {
	async find(word: string): Promise<string> {
		const response = await fetch(`https://www.welklidwoord.nl/${word}`);
		const html = await response.text();
		const $ = cheerio.load(html);
		const resultElement = $('#content > h2.nieuwH2');

		if (resultElement.length === 0) {
			throw new Error(
				'Expected word definition element was not found in the response',
			);
		}

		return resultElement.text().trim();
	}
}

export class WordSearchService {
	constructor(
		private readonly history: HistoryRepository,
		private readonly source: WordDefinitionSource,
	) {}

	async find(word: string): Promise<WordSearchResult> {
		const cached = await this.history.findByWord(word);

		if (cached) {
			return {
				cache: 'HIT',
				result: cached.result ?? 'Nothing found',
			};
		}

		const result = await this.source.find(word);
		await this.history.createIfAbsent({ word, result });

		return {
			cache: 'MISS',
			result,
		};
	}
}
