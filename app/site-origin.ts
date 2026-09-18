const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const siteOrigin = vercelHost
  ? `https://${vercelHost}`
  : 'https://freedocs-summit-2026.tommasocavalli-08.chatgpt.site';
