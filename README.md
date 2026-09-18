# FreeDoc$ Summit 2026

Sito del summit del Dr. Fernando Borges, sviluppato con Next.js, React e TypeScript.

## Sviluppo locale

Node.js 22.13 o successivo e pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Vercel

Importare questa repository in Vercel e mantenere la directory radice. Il file `vercel.json` configura il framework Next.js, l’installazione e la build.

Il dominio per canonical, sitemap e robots viene ricavato da `VERCEL_PROJECT_PRODUCTION_URL`; verificare il dominio di produzione dopo il collegamento.

## Note

I pulsanti arancioni hanno angoli leggermente arrotondati (6 px). Il sito comprende dati strutturati, sitemap, robots e `/llms.txt`.

Le iscrizioni usano l’endpoint Google Apps Script configurato nella route `/api/registration`. Prima di aprire le iscrizioni, eseguire una prova completa con il gestore dell’endpoint.
