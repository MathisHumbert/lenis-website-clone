import express from 'express';
import errorHandler from 'errorhandler';
import logger from 'morgan';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import path from 'path';
import 'dotenv/config';

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const base = process.env.BASE || '/';

const fetchDefaults = async (api) => {
  const assets = [];

  const meta = api.getSingle('meta');

  return { meta, assets };
};

const fetchHome = async (api) => {
  const home = await api.getSingle('home');

  return home;
};

const fetchAbout = async (api) => {
  const about = await api.getSingle('about');

  return about;
};

const app = express();

if (!isProduction) {
  app.use(logger('dev'));
  app.use(errorHandler());
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

if (!isProduction) {
  const { createServer } = await import('vite');

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });

  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;

  app.use(compression());
  app.use(base, sirv(path.resolve('dist'), { extensions: [] }));
}

app.set('views', path.resolve('src/views'));
app.set('view engine', 'pug');

const homeData = {
  why_features: [
    {
      title: null,
      text: 'We’ve heard all the reasons to not use smooth scroll. It feels  hacky. It’s inaccessible. It’s not performant. It’s over-engineered. And historically, those were all true. But we like to imagine things as they could be, then build them. So, why should you use smooth scroll?',
    },
    {
      title: 'Create more immersive interfaces',
      text: 'Unlock the creative potential and impact of your web experiences. Smoothing the scroll pulls users into the flow of the experience that feels so substantial that they forget they’re navigating a web page.',
    },
    {
      title: 'Normalize all your user inputs',
      text: 'Give all your users the same (dope) experience whether they’re using trackpads, mouse wheels, or otherwise. With smooth scroll, you control how silky, heavy, or responsive the experience should be — no matter the input. Magic!',
    },
    {
      title: 'Make your animations flawless',
      text: 'Synchronization with native scroll is not reliable. Those jumps and delays with scroll-linked animations are caused by multi-threading, where modern browsers run animations/effects asynchronously with the scroll. Smooth scroll fixes this.',
    },
  ],
  rethink_cards: [
    'Loss of performance budget due to using CSS transforms',
    'Inaccessibility from no page search support and native scrollbar',
    'Non-negligible import costs (12.1kb - 24.34kb gzipped)',
    'Limited animation systems for complex, scroll-based animations',
    'Erasing native APIs like Intersection-Observer, CSS Sticky, etc.',
  ],
};

app.get('/', async (req, res) => {
  try {
    res.render('pages/home', {
      ...homeData,
      isProduction,
    });
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.use((req, res, next) => {
  try {
    res.status(404).send('404 PAGE');
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
