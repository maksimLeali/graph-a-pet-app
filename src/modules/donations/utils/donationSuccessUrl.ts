// Stripe deve reindirizzare qui a fine checkout: alla pagina dell'app che
// fa il polling dello stato reale (webhook-driven, vedi backend
// domain/donations/webhooks.py), non a una route del backend. window.location.origin
// è sempre l'origine con cui gira l'app stessa (dev locale, Firebase Hosting
// dev/staging/prod...), quindi funziona in ogni ambiente senza hardcodare
// un dominio. Il backend aggiunge poi `donation_id` e `session_id` come
// query params (vedi domain/donations/checkout.py) prima di passarlo a
// Stripe — il router li legge in DonationPendingPage.
export const DONATION_SUCCESS_URL = `${window.location.origin}/donations/pending`;
