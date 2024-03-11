export interface Feed {
  title: string;
  feed_url: string;
  logo_url: string;
  id?: string;
}

// TODO: Write a script to check stuff on these like if the icon works or not.
// NOTE: The ids were for a prevoius version of the app. They are not used anymore.

export const TechDiscoverFeeds: Feed[] = [
  {
    title: "The Verge",
    feed_url: "https://www.theverge.com/rss/full.xml",
    logo_url: "https://cdn.vox-cdn.com/verge/favicon.ico",
    id: "",
  },
  {
    title: "TechCrunch",
    feed_url: "https://techcrunch.com/feed/",
    logo_url:
      "https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png",
    id: "",
  },
  {
    title: "Ars Technica",
    feed_url: "https://arstechnica.com/feed/",
    logo_url: "https://arstechnica.com/favicon.ico",
    id: "",
  },
  {
    title: "Hacker News",
    feed_url: "https://news.ycombinator.com/rss",
    logo_url: "https://news.ycombinator.com/favicon.ico",
    id: "",
  },
  {
    title: "Engadget",
    feed_url: "https://www.engadget.com/rss-full.xml",
    logo_url:
      "https://cdn.icon-icons.com/icons2/3914/PNG/512/engadget_logo_icon_248941.png",
    id: "",
  },
  {
    title: "The Next Web",
    feed_url: "https://thenextweb.com/feed/",
    logo_url: "https://next.tnwcdn.com/assets/img/favicon/favicon-96x96.png",
    id: "",
  },
];

export const BusinessDiscoverItems: Feed[] = [
  {
    title: "Bloomberg",
    feed_url: "https://feeds.bloomberg.com/markets/news.rss",
    logo_url: "https://www.bloomberg.com/favicon.ico",
    id: "",
  },
  {
    title: "The Economist",
    feed_url: "https://www.economist.com/business/rss.xml",
    logo_url: "https://www.economist.com/favicon.ico",
    id: "",
  },
  {
    title: "The Wall Street Journal",
    feed_url: "https://feeds.a.dj.com/rss/RSSWSJD.xml",
    logo_url: "https://www.wsj.com/favicon.ico",
    id: "",
  },
  {
    title: "The New York Times",
    feed_url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
    logo_url: "https://www.nytimes.com/favicon.ico",
    id: "",
  },
  {
    title: "Entrepreneur",
    feed_url: "http://feeds.feedburner.com/entrepreneur/latest",
    logo_url: "https://assets.entrepreneur.com/favicon.ico",
    id: "",
  },
  {
    title: "The Atlantic",
    feed_url: "https://www.theatlantic.com/feed/all/",
    logo_url: "https://www.theatlantic.com/favicon.ico",
    id: "",
  },
];

export const ScienceDiscoverItems: Feed[] = [
  {
    title: "Nature",
    feed_url: "http://www.nature.com/nature/current_issue/rss",
    logo_url:
      "https://www.nature.com/static/images/favicons/nature/favicon-32x32-3fe59ece92.png",
    id: "",
  },
  {
    title: "Science Daily",
    feed_url: "https://www.sciencedaily.com/rss/all.xml",
    logo_url:
      "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://sciencedaily.com&size=64",
    id: "",
  },
  {
    title: "Scientific American",
    feed_url: "https://rss.sciam.com/ScientificAmerican-News",
    logo_url:
      "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.scientificamerican.com/&size=64",
    id: "",
  },
  {
    title: "New Scientist",
    feed_url: "https://www.newscientist.com/feed/home/",
    logo_url:
      "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.newscientist.com/&size=64",
    id: "",
  },
  {
    title: "The Guardian - Science",
    feed_url: "https://www.theguardian.com/science/rss",
    logo_url: "https://www.theguardian.com/favicon.ico",
    id: "",
  },
  {
    title: "BBC News - Science & Environment",
    feed_url: "http://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
    logo_url: "https://news.bbcimg.co.uk/nol/shared/img/bbc_news_120x60.gif",
    id: "",
  },
  {
    title: "NASA",
    feed_url: "https://www.nasa.gov/rss/dyn/breaking_news.rss",
    logo_url:
      "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.nasa.gov/&size=64",
    id: "",
  },
];
