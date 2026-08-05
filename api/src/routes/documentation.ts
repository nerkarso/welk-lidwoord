import { Scalar } from '@scalar/hono-api-reference';
import type { Hono } from 'hono';
import { openAPIRouteHandler } from 'hono-openapi';

export const registerDocumentationRoutes = (app: Hono) => {
	app.get(
		'/openapi.json',
		openAPIRouteHandler(app, {
			documentation: {
				info: {
					title: 'Welk Lidwoord API',
					version: '1.0.0',
				},
			},
		}),
	);

	app.get(
		'/docs',
		Scalar({
			url: '/openapi.json',
			pageTitle: 'Welk Lidwoord API Reference',
		}),
	);
};
