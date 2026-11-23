import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  'https://qihlqrmbcbfzjwfegsxv.supabase.co'

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpaGxxcm1iY2Jmemp3ZmVnc3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NTA5NjMsImV4cCI6MjA5ODQyNjk2M30.zuNzWH4iYUoejb5dhLvGPuq097lBWIE2RP3jsfrzvng'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/* ════════════════════════════════════════════════════════════════
   LA VISITE — ce qui doit survivre au passage d'une page à l'autre.

   Créé le 2026-11-23, sur une mesure de Basekou. Le défaut, et il rendait
   faux le seul chiffre qui compte :

   ⛔ `getUtm()` lisait `window.location.search` AU MOMENT DE CHAQUE
   ÉVÉNEMENT. Or ce site n'est pas une application à navigation interne :
   chaque lien (`<a href="/commander">`) provoque un CHARGEMENT NEUF, et la
   nouvelle page n'a aucune chaîne de requête. La source était donc perdue
   dès le premier clic.

   📊 Mesuré le 20/11 à 19h05 (18h05 UTC), quatre lignes de `page_events` :
      page_view            ig      18:05:15,335
      hero_commander_click ig      18:05:18,021
      commander_view     (null)    18:05:18,365   ← 0,344 s plus tard
   ⇒ Le visiteur Instagram EST arrivé sur la page de commande. La mesure,
   elle, l'a enregistré comme venu de nulle part.

   🎯 CONSÉQUENCE À RETENIR : sur les 38 `commander_view` de toute la table,
   ZÉRO ne portait de source — non parce qu'aucun visiteur Instagram n'y
   arrive, mais parce qu'AUCUN n'aurait PU y arriver avec son étiquette.
   Un zéro structurel, qui ne mesure rien.

   ✅ Ce qu'on fait : la source, le site d'origine et un identifiant de
   visite sont lus UNE FOIS, à l'arrivée, puis conservés dans
   `sessionStorage` pour toute la visite.

   ⚠️ POURQUOI LE REFERRER EST FIGÉ À L'ARRIVÉE, et c'est le piège : après
   une navigation interne, `document.referrer` vaut « ledje.fr ». Relu à
   chaque événement, il dirait que tout visiteur de /commander vient de
   notre propre site. On ne garde donc que le referrer EXTERNE du premier
   affichage, et on ignore le nôtre.

   📌 `sessionStorage` et non `localStorage` : une visite, pas un visiteur.
   Il vit dans l'onglet et s'efface à sa fermeture — donc aucun suivi
   durable, et pas de cookie. Un onglet ouvert à côté est une autre visite :
   accepté, c'est le prix de ne pas pister les gens.

   ⚠️ L'accès peut ÉCHOUER (navigation privée, stockage bloqué) : tout est
   en try/catch et on retombe sur une visite en mémoire. La mesure dégrade,
   elle ne casse jamais la page.
   ════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════
   « C'EST MOI » — le repère qui sort Basekou de ses propres chiffres.

   Demandé le 2026-11-23. Il répond au but écrit du 16/11, que les trois
   mesures précédentes ne suffisaient pas à atteindre : `visit_id` recoud
   une visite, il ne dit pas DE QUI elle est.

   📌 Pourquoi ça manquait : le 15/11 à 03h56, une visite complète avec
   `utm_source=ig` — et rien ne permettait de dire si c'était un visiteur
   ou Basekou à trois heures du matin. Tant que ses propres passages sont
   indistincts, aucun chiffre du site ne veut dire quoi que ce soit.

   ✅ USAGE : ouvrir `?moi=1` UNE FOIS sur un appareil. Le repère y reste.
   ✅ POUR L'ENLEVER : `?moi=0`. Prévu dès le départ, parce qu'un appareil
   se prête, et qu'il faut pouvoir se remettre dans la peau d'un visiteur.

   ⚠️ `localStorage` ici, et c'est l'INVERSE du choix fait pour la visite :
   on veut justement que ça SURVIVE à la fermeture de l'onglet. C'est un
   appareil qu'on marque, pas une visite.

   ⚠️ CE QUE LE REPÈRE N'EST PAS : une identification de personne. C'est un
   drapeau que Basekou pose lui-même sur ses propres appareils. Aucune
   donnée personnelle, aucun pistage de visiteur — la règle « pas de
   cookies invasifs » tient.

   🎯 UN APERÇU VERCEL EST INTERNE PAR DÉFINITION : personne n'achète sur
   une URL `*.vercel.app`. On le marque donc sans rien demander, ce qui
   évite que nos propres essais de PR polluent la mesure.
   ⇒ Si ce choix ne convient pas, retirer la condition sur l'hôte suffit.

   ⛔ Et ce qu'on ne peut PAS rattraper : les 1477 lignes d'avant le 23/11
   restent indistinctes. La colonne y vaut `null`, et `null` ne se lit
   JAMAIS comme « pas Basekou ».
   ════════════════════════════════════════════════════════════════ */

const CLE_MOI = 'ledje_moi'

function estInterne(): boolean {
  /* L'aperçu de PR : interne par nature, aucun repère à poser. */
  if (window.location.hostname.endsWith('.vercel.app')) return true

  const moi = new URLSearchParams(window.location.search).get('moi')
  try {
    if (moi === '1') localStorage.setItem(CLE_MOI, '1')
    if (moi === '0') localStorage.removeItem(CLE_MOI)
    return localStorage.getItem(CLE_MOI) === '1'
  } catch {
    /* Stockage refusé : le repère ne tient pas d'une page à l'autre, mais
       le paramètre vaut au moins pour le chargement en cours. */
    return moi === '1'
  }
}

const CLE_VISITE = 'ledje_visite'

type Visite = {
  visit_id: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  referrer: string | null
}

/* Repli si le stockage est refusé : la visite vit alors le temps du
   chargement de page. On perd le recoudre entre pages, pas l'événement. */
let visiteEnMemoire: Visite | null = null

function nouvelleVisite(): Visite {
  const params = new URLSearchParams(window.location.search)

  /* Le referrer ne vaut que s'il est EXTERNE. Le nôtre n'apprend rien. */
  let referrer: string | null = null
  try {
    const r = document.referrer
    if (r && new URL(r).host !== window.location.host) referrer = r
  } catch {
    referrer = null
  }

  return {
    visit_id: crypto.randomUUID(),
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    referrer,
  }
}

function visite(): Visite {
  let v: Visite | null = null
  try {
    const brut = sessionStorage.getItem(CLE_VISITE)
    if (brut) v = JSON.parse(brut) as Visite
  } catch {
    v = null
  }
  if (!v?.visit_id) v = visiteEnMemoire ?? nouvelleVisite()

  /* ⚠️ UNE SOURCE VUE EN COURS DE VISITE GAGNE SUR UNE ABSENCE, jamais sur
     une autre source : si quelqu'un revient par un second lien étiqueté, on
     garde le premier — c'est lui qui a amené la visite. */
  const params = new URLSearchParams(window.location.search)
  const vu = params.get('utm_source')
  if (vu && !v.utm_source) {
    v = {
      ...v,
      utm_source: vu,
      utm_medium: params.get('utm_medium') ?? v.utm_medium,
      utm_campaign: params.get('utm_campaign') ?? v.utm_campaign,
    }
  }

  visiteEnMemoire = v
  try {
    sessionStorage.setItem(CLE_VISITE, JSON.stringify(v))
  } catch {
    /* stockage refusé : `visiteEnMemoire` fait le travail pour ce chargement */
  }
  return v
}

function getUtm() {
  const v = visite()
  return {
    utm_source: v.utm_source,
    utm_medium: v.utm_medium,
    utm_campaign: v.utm_campaign,
  }
}

export async function trackEvent(
  event_type: string,
  time_on_page_sec?: number,
) {
  const v = visite()
  await supabase.from('page_events').insert({
    event_type,
    time_on_page_sec: time_on_page_sec ?? null,
    utm_source: v.utm_source,
    /* Mesures décidées le 16/11 — colonnes ajoutées par la migration
       `page_events_referrer_page_visite`. ⛔ Ne pas déployer ce code sans
       elle : un insert nommant une colonne absente échoue EN ENTIER, et
       c'est toute la mesure qui s'arrête, pas seulement la nouveauté. */
    referrer: v.referrer,
    page_path: window.location.pathname,
    visit_id: v.visit_id,
    /* Colonne `interne` — migration `page_events_interne`. On envoie
       TOUJOURS le booléen, jamais null : `false` veut dire « mesuré comme
       visiteur ordinaire », alors que `null` veut dire « on ne sait pas »
       et ne concerne que les lignes d'avant le 23/11. */
    interne: estInterne(),
  })
}

export async function submitEmail(email: string): Promise<{ error: string | null; waitlistId: string | null }> {
  const utm = getUtm()
  // Generate UUID client-side to avoid needing a SELECT policy after insert
  const id = crypto.randomUUID()
  const { error } = await supabase
    .from('waitlist')
    .insert({ id, email, ...utm })

  if (error) {
    if (error.code === '23505') return { error: 'duplicate', waitlistId: null }
    return { error: 'network', waitlistId: null }
  }
  return { error: null, waitlistId: id }
}

export async function submitSurvey(
  waitlistId: string,
  frequency: string,
  attraction: string[],
  entryFormat: string,
) {
  await supabase.from('survey_responses').insert({
    waitlist_id: waitlistId,
    frequency,
    attraction,
    entry_format: entryFormat,
  })
}

// ── Avis produit (page /avis) ──
// Table `avis` : INSERT-only pour le rôle anon, horodatée (created_at) pour
// rattacher chaque retour au lot de production. Pas de .select() après l'insert
// (aucune policy SELECT anon) — id généré côté client comme pour waitlist.
export type AvisPayload = {
  consumptionSince: string   // Q1 — depuis quand
  frequencyIntent: string    // Q2 — fréquence envisagée
  tasteRating: number | null // Q3 — note 1..5
  tasteWords: string[]       // Q3 — mots (max 3, « Autre » inclus)
  tasteWordOther: string     // Q3 — texte libre si « Autre »
  chooseReason: string       // Q4 — pourquoi lédjé (libre, sans exemple)
  improvement: string        // Q5 — remarque / idée (libre)
  reclamation: string        // Réclamation produit (section dédiée, dépliable) — distincte de Q5
  email: string              // facultatif
}

export async function submitAvis(a: AvisPayload): Promise<{ error: string | null }> {
  const utm = getUtm()
  const id = crypto.randomUUID()
  const { error } = await supabase.from('avis').insert({
    id,
    consumption_since: a.consumptionSince || null,
    frequency_intent: a.frequencyIntent || null,
    taste_rating: a.tasteRating,
    taste_words: a.tasteWords.length ? a.tasteWords : null,
    taste_word_other: a.tasteWordOther.trim() || null,
    choose_reason: a.chooseReason.trim() || null,
    improvement: a.improvement.trim() || null,
    reclamation: a.reclamation.trim() || null,
    email: a.email.trim() || null,
    utm_source: utm.utm_source,
  })
  if (error) return { error: 'network' }
  return { error: null }
}

/* ── Demandes entrantes (/offrir et /prestations) ─────────────────────────
   Ajouté le 2026-10-16. Remplace les `mailto:` qui terminaient les deux
   pages faites pour générer du business.

   ⚠️ POURQUOI : 91 % des visiteurs sont sur téléphone (Vercel, 30 j au
   16/10). Un `mailto:` y est une impasse — il jette la personne hors du
   site dans un écran de rédaction vide, quand une application mail est
   seulement configurée. C'était la cause mécanique du « rien ne crée la
   discussion » : 28 visiteurs sur ces deux pages en un mois, et aucun
   moyen de répondre sans quitter le site.

   Table `demandes` : INSERT-only pour anon, aucune policy SELECT, id
   généré côté client — même patron que `waitlist` et `avis`, et surtout
   PAS de `.select()` après l'insert (piège connu du projet). */
export type DemandeType = 'offrir' | 'prestation'

export type DemandePayload = {
  type: DemandeType
  nom: string
  contact: string        // email OU téléphone : on ne force pas le format
  structure: string      // la mosquée, l'école, l'association
  dateSouhaitee: string  // texte libre : « samedi 25 », « fin novembre »
  quantite: string       // texte libre : on ne demande pas un chiffre exact
  message: string
}

export async function submitDemande(d: DemandePayload): Promise<{ error: string | null }> {
  const { utm_source } = getUtm()
  const id = crypto.randomUUID()
  const { error } = await supabase.from('demandes').insert({
    id,
    type: d.type,
    nom: d.nom.trim() || null,
    contact: d.contact.trim(),
    structure: d.structure.trim() || null,
    date_souhaitee: d.dateSouhaitee.trim() || null,
    quantite: d.quantite.trim() || null,
    message: d.message.trim() || null,
    utm_source,
  })
  if (error) return { error: 'network' }
  return { error: null }
}

/* ── Commandes (page /commander) ──────────────────────────────────────────
   Ajouté le 2026-10-16. Première réponse à « où est-ce que j'en trouve »,
   posé au journal le 14/10 comme la fuite la plus coûteuse du dossier :
   15 à 20 % des visiteurs le demandaient, 117 bouteilles sorties, et un
   client qui a aimé ne pouvait pas en racheter.

   Table `commandes` : INSERT-only pour anon, aucune policy SELECT, id
   généré côté client — même patron que waitlist, avis et demandes. */
export type CommandePayload = {
  packs: number
  ville: string
  horsZone: boolean
  quand: string
  nom: string
  contact: string
  canal: string
  message: string
}

/* Renvoie l'identifiant de la ligne écrite, en plus de l'erreur : depuis le
   21/10 il part dans l'URL du Payment Link comme `client_reference_id`, ce
   qui permet de rapprocher un paiement Stripe de SA commande. Sans lui, deux
   commandes du même montant le même soir sont indiscernables à l'encaissement.
   ⚠️ On continue de NE PAS faire de `.select()` après l'insert anon — l'id est
   celui qu'on a généré nous-mêmes, pas un id relu de la base. */
export async function submitCommande(c: CommandePayload): Promise<{ error: string | null; id: string | null }> {
  const { utm_source } = getUtm()
  const id = crypto.randomUUID()
  const { error } = await supabase.from('commandes').insert({
    id,
    packs: c.packs,
    ville: c.ville.trim(),
    hors_zone: c.horsZone,
    quand: c.quand.trim() || null,
    nom: c.nom.trim() || null,
    contact: c.contact.trim(),
    canal: c.canal,
    message: c.message.trim() || null,
    utm_source,
  })
  if (error) return { error: 'network', id: null }
  return { error: null, id }
}
