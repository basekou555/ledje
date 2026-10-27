/* ════════════════════════════════════════════════════════════════
   Une page HTML par route, avec ses vraies balises.

   Lancé après `vite build` (cf. `npm run build`).

   ⚠️ LE PROBLÈME QU'IL RÉSOUT, ET IL NE SE VOIT PAS DANS UN NAVIGATEUR :
   ce site est une SPA. Les titres et descriptions étaient posés en
   JavaScript (`document.title` dans un `useEffect`), donc le HTML SERVI
   portait exactement les mêmes balises pour les cinq pages.

   ⛔ Or AUCUN robot de prévisualisation n'exécute de JavaScript — ni
   WhatsApp, ni iMessage, ni Messenger, ni Signal. Un lien partagé sur
   WhatsApp montrait donc toujours le même titre générique, quelle que soit
   la page, et aucune image. Comme la diffusion de lédjé passe justement par
   les messageries, chaque partage perdait l'essentiel de son effet.

   ✅ Ce que fait ce script : il recopie `dist/index.html` une fois par
   route en y substituant titre, description, image de partage, canonique
   et `robots`. Il n'y a AUCUN autre changement — les liens vers le JS et le
   CSS restent ceux que Vite a écrits.

   ⚠️ Le routage de `vercel.json` doit envoyer chaque route vers SON fichier
   AVANT le repli `/(.*) → /index.html`, sinon le repli avale tout. Les
   réécritures sont évaluées dans l'ordre, la première qui matche gagne.

   📌 Le chemin de l'URL n'est PAS modifié par une réécriture : le routeur
   de `src/main.tsx`, qui lit `window.location.pathname`, continue donc
   d'afficher la bonne page.
   ════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DIST = 'dist'
const SITE = 'https://ledje.fr'

/* L'image de partage. 1200×630, le format que lisent Facebook, iMessage et
   LinkedIn ; WhatsApp y recadre sa vignette. Composée depuis la photo de
   dégustation validée et le wordmark officiel.
   ⚠️ Elle est RÉFÉRENCÉE EN ABSOLU : une URL relative n'est pas résolue par
   les robots de prévisualisation. */
const IMAGE = `${SITE}/og.jpg`

/* Une entrée par route. Les textes reprennent ceux des pages — on ne réécrit
   pas la marque ici, on la rend seulement lisible par les robots.
   `robots: 'noindex'` sur ce qui n'a rien à faire dans Google. */
const PAGES = [
  {
    fichier: 'index.html',
    titre: 'lédjé — eau miellée artisanale, miel français',
    description:
      "De l'eau et du miel. Rien de plus. Eau miellée artisanale, miel français pur, origine tracée, jamais chauffé.",
    url: '/',
  },
  {
    fichier: 'commander.html',
    titre: 'Commander — eau miellée livrée à Lyon | lédjé',
    description:
      'Un pack de 6 bouteilles de 33 cl, 10 €. Préparé le soir même, livré le lendemain à Lyon et dans son agglomération.',
    url: '/commander',
  },
  {
    fichier: 'offrir.html',
    titre: 'Offrir un lot à ta mosquée | lédjé',
    description:
      "Une mosquée n'achète pas ses boissons : ce sont les fidèles qui les offrent. Tu offres un lot, on l'apporte.",
    url: '/offrir',
  },
  {
    fichier: 'prestations.html',
    titre: 'Une boisson pour votre événement | lédjé',
    description:
      "Kermesse, fête d'école, portes ouvertes, événement d'association : on apporte de l'eau miellée fraîche et on s'adapte à votre organisation.",
    url: '/prestations',
  },
  {
    // Le QR des dégustations pointe ici, mais la page n'a rien à faire dans
    // un moteur de recherche : c'est un formulaire, pas un contenu.
    fichier: 'avis.html',
    titre: 'Ton avis — lédjé',
    description: 'Dis-nous ce que tu as pensé de la boisson.',
    url: '/avis',
    robots: 'noindex, follow',
  },
  {
    // ⛔ Page d'APRÈS paiement : on n'y arrive que par la redirection de
    // Stripe. Indexée, elle annoncerait un paiement qui n'a pas eu lieu.
    fichier: 'commande-confirmee.html',
    titre: 'Commande confirmée — lédjé',
    description: 'Ta commande est enregistrée.',
    url: '/commande-confirmee',
    robots: 'noindex, nofollow',
  },
]

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function balises(p) {
  const canonique = `${SITE}${p.url}`
  return [
    `<title>${esc(p.titre)}</title>`,
    `<meta name="description" content="${esc(p.description)}" />`,
    `<link rel="canonical" href="${canonique}" />`,
    p.robots ? `<meta name="robots" content="${p.robots}" />` : '',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="lédjé" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:title" content="${esc(p.titre)}" />`,
    `<meta property="og:description" content="${esc(p.description)}" />`,
    `<meta property="og:url" content="${canonique}" />`,
    `<meta property="og:image" content="${IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Une bouteille d'eau miellée lédjé posée au soleil" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(p.titre)}" />`,
    `<meta name="twitter:description" content="${esc(p.description)}" />`,
    `<meta name="twitter:image" content="${IMAGE}" />`,
  ]
    .filter(Boolean)
    .map((l) => `    ${l}`)
    .join('\n')
}

const source = readFileSync(join(DIST, 'index.html'), 'utf8')

// Le gabarit de Vite porte un <title> et une <meta name="description"> :
// on les retire pour ne pas les laisser en double.
const nu = source
  .replace(/^\s*<title>[\s\S]*?<\/title>\s*$/m, '')
  .replace(/^\s*<meta\s+name="description"[\s\S]*?\/>\s*$/m, '')

let n = 0
for (const p of PAGES) {
  const html = nu.replace('</head>', `${balises(p)}\n  </head>`)
  if (html === nu) throw new Error(`Pas de </head> dans dist/index.html — gabarit inattendu`)
  writeFileSync(join(DIST, p.fichier), html)
  n++
}

/* robots.txt — sans lui, rien n'indique où est le plan du site. Les deux
   pages `noindex` y sont aussi refusées, par ceinture et bretelles. */
writeFileSync(
  join(DIST, 'robots.txt'),
  [
    'User-agent: *',
    'Allow: /',
    'Disallow: /commande-confirmee',
    'Disallow: /avis',
    '',
    `Sitemap: ${SITE}/sitemap.xml`,
    '',
  ].join('\n'),
)

/* sitemap.xml — seulement les pages qu'on veut voir dans Google. */
const indexables = PAGES.filter((p) => !p.robots?.includes('noindex'))
const jour = new Date().toISOString().slice(0, 10)
writeFileSync(
  join(DIST, 'sitemap.xml'),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...indexables.map(
      (p) =>
        `  <url><loc>${SITE}${p.url}</loc><lastmod>${jour}</lastmod></url>`,
    ),
    '</urlset>',
    '',
  ].join('\n'),
)

console.log(
  `pages : ${n} fichiers HTML · robots.txt · sitemap.xml (${indexables.length} URL indexables)`,
)
