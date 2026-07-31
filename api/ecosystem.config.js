export const apps = [
	{
		name: 'welklidwoord-api',
		script: 'dist/index.js',
		output: './logs/out.log',
		error: './logs/err.log',
		env: {
			HOST: '0.0.0.0',
			PORT: 8806,
		},
	},
];
