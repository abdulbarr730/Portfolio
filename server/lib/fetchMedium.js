import Parser from 'rss-parser';

const parser = new Parser();

export async function fetchMediumPosts() {
  const feed = await parser.parseURL('https://medium.com/feed/@abdulbarr730');
  return feed.items.map(item => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    contentSnippet: item.contentSnippet,
  }));
}
