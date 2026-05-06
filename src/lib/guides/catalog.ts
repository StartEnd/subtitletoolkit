export const guideCategoryMeta = {
	'conversion-guides': {
		label: 'Conversion guides',
		description: 'Format-specific tutorials for getting subtitle files ready for the right destination.',
	},
	'sync-fixes': {
		label: 'Sync fixes',
		description: 'Repair timing drift, malformed timestamps, and other subtitle file problems.',
	},
	'format-comparisons': {
		label: 'Format comparisons',
		description: 'Choose the right subtitle format for browser playback, uploads, and delivery.',
	},
	'workflow-guides': {
		label: 'Workflow guides',
		description: 'Practical step-by-step advice for common subtitle publishing and editing workflows.',
	},
} as const;

export type GuideCategory = keyof typeof guideCategoryMeta;

export const guideCategoryOrder: GuideCategory[] = [
	'conversion-guides',
	'sync-fixes',
	'format-comparisons',
	'workflow-guides',
];
