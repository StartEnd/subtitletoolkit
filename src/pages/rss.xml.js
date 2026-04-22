import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const guides = await getCollection('guides');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: guides.map((guide) => ({
			...guide.data,
			link: `/guides/${guide.id}/`,
		})),
	});
}
