import { getCollection } from 'astro:content';

export async function GET({ params, request }) {
  const articles = await getCollection('articles');

  return Response.json(
    articles.map((article) => ({
      objectID: article.slug,
      title: article.data.title,
      description: article.data.description || '',
      content: article.body,
      categories: article.data.categories || [],
      tags: article.data.tags || [],
      cover: article.data.cover,
      date: article.data.date ? article.data.date.toISOString() : new Date().toISOString(),
      link: `/articles/${article.slug}/`,
      slug: article.slug,
    })),
  );
}