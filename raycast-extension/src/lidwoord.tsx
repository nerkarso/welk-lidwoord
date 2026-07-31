import { Action, ActionPanel, Detail } from '@raycast/api';
import { useEffect, useState } from 'react';

type Props = {
	arguments: {
		word: string;
	};
};

export default function Command(props: Props) {
	const [result, setResult] = useState<string>();

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(
				`http://localhost:8006/search/${props.arguments.word}`,
			);
			const data = await response.text();
			setResult(data);
		};
		fetchData();
	}, []);

	return (
		<Detail
			navigationTitle={`De of het ${props.arguments.word}?`}
			isLoading={result === undefined}
			markdown={`# ${result || 'Searching...'}`}
			actions={
				<ActionPanel>
					<Action.CopyToClipboard
						content={result || ''}
						shortcut={{ modifiers: ['cmd'], key: '.' }}
					/>
				</ActionPanel>
			}
		/>
	);
}
