export type ToolResult = {
	tool: string;
	passed: boolean;
	output: string;
	duration: number;
};

export const printResults = (
	results: ToolResult[],
	totalDuration: number,
) => {
	for (const result of results) {
		if (result.output) {
			console.log(result.output);
		}
	}

	const parts = results
		.map(r => `${r.tool}: ${Math.round(r.duration)}ms`)
		.join(', ');
	console.log(
		`\nCompleted in ${Math.round(totalDuration)}ms (${parts})`,
	);
};

export const getExitCode = (results: ToolResult[]) => {
	if (results.some(r => !r.passed)) {
		return 1;
	}
	return 0;
};
