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
    id: "clnf8qsks004rla0smxmtz2lb",
  },
  {
    title: "TechCrunch",
    feed_url: "https://techcrunch.com/feed/",
    logo_url:
      "https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png",
    id: "clmvmijlt000zlap50twyo1e7",
  },
  {
    title: "Ars Technica",
    feed_url: "https://arstechnica.com/feed/",
    logo_url: "https://arstechnica.com/favicon.ico",
    id: "clmvwj0it0008la11l7kto3fa",
  },
  {
    title: "Hacker News",
    feed_url: "https://news.ycombinator.com/rss",
    logo_url: "https://news.ycombinator.com/favicon.ico",
    id: "clnf8qptw004hla0s33b56z3v",
  },
  {
    title: "Engadget",
    feed_url: "https://www.engadget.com/rss-full.xml",
    logo_url:
      "https://cdn.icon-icons.com/icons2/3914/PNG/512/engadget_logo_icon_248941.png",
    id: "clmvwjs7s000tla11z64kvfb5",
  },
  {
    title: "The Next Web",
    feed_url: "https://thenextweb.com/feed/",
    logo_url: "https://next.tnwcdn.com/assets/img/favicon/favicon-96x96.png",
    id: "clnf8qptw004hla0s33b56z3v",
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
