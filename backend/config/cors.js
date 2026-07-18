const DEFAULT_DEV_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://192.168.0.116:5173',
  'http://192.168.0.116:5174',
  'http://192.168.0.116:5175',
];

const LOCAL_ORIGIN_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.\d+\.\d+)(:\d+)?$/;

const normalizeOrigin = (origin) => origin?.replace(/\/$/, '');

const getAllowedOrigins = () => {
  const envOrigins = [process.env.CLIENT_URL, process.env.FRONTEND_URL]
    .filter(Boolean)
    .map(normalizeOrigin);

  return [...DEFAULT_DEV_ORIGINS, ...envOrigins];
};

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  const allowedOrigins = getAllowedOrigins();

  return allowedOrigins.includes(normalizedOrigin) || LOCAL_ORIGIN_PATTERN.test(normalizedOrigin);
};

export const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
};