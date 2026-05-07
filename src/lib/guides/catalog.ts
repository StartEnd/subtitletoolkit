export const guideCategoryMeta = {
	'conversion-guides': {
		label: 'Conversion guides',
		description: 'Format-specific tutorials for getting subtitle files ready for the right destination.',
		hubPath: '/guides/conversion-guides',
	},
	'sync-fixes': {
		label: 'Sync fixes',
		description: 'Repair timing drift, malformed timestamps, and other subtitle file problems.',
		hubPath: '/guides/sync-fixes',
	},
	'format-comparisons': {
		label: 'Format comparisons',
		description: 'Choose the right subtitle format for browser playback, uploads, and delivery.',
		hubPath: '/guides/format-comparisons',
	},
	'workflow-guides': {
		label: 'Workflow guides',
		description: 'Practical step-by-step advice for common subtitle publishing and editing workflows.',
		hubPath: '/guides/workflow-guides',
	},
} as const;

export type GuideCategory = keyof typeof guideCategoryMeta;

export const guideCategoryOrder: GuideCategory[] = [
	'conversion-guides',
	'sync-fixes',
	'format-comparisons',
	'workflow-guides',
];
