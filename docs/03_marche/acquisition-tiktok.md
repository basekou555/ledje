---
statut: en_cours
domaine: marche
maj: 2026-11-20
source: "SOT §5.6, §8.1 canal B, Partie 11 (archive 2026-07-24)"
resume: "Le canal d'acquisition digital : TikTok organique (des publications existent depuis l'automne 2026 — fiche à recaler, le reste date de juillet), UTM en place, canal B créateurs payés en secours (trigger fin octobre 2026)."
---

# Acquisition — TikTok & canal B

## Statut : le canal n'est plus inactif *(mis à jour le 2026-11-10)*

> **Basekou, 2026-11-10 : « y'a du contenu depuis peu, faut mettre à jour ».** Chiffres déclarés le 08/11 (`grille-contenu.md`) : 5 publications sur Instagram, 2 sur TikTok, une publication par semaine. Instagram : `@its.ledje`. **Le nom du compte TikTok n'est écrit nulle part au dépôt : à compléter.**
>
> ⚠️ **Tout ce qui suit date du 13/07 et décrit un canal inactif.** Le titre ci-dessous est conservé pour l'histoire ; le contenu (UTM, canal B, déclencheur de fin octobre) est **à relire avec Basekou** avant de s'y appuyer. Rien n'a été vérifié sur les comptes eux-mêmes : une session ne lit pas les réseaux sociaux.

### Ancien statut (13/07) : canal toujours inactif

Lancer le trafic TikTok (lien bio + UTM) une fois hero vidéo et vue inscrits prêts — **canal toujours inactif à ce jour malgré la stratégie posée depuis le début.** Prérequis avant lancement :
1. Vidéo hero satisfaisante (cf. `contenu-et-pubs.md`).
2. Vue/export des inscrits waitlist (cf. `../04_operations/site-technique.md`) — indispensable avant de lancer du trafic.

## Le hook (règle établie)

Hook du pratiquant : **un rappel du rituel oublié en ouverture, PAS le geste sensoriel/food porn** — grille complète dans `../01_adn/cibles-et-contenu.md`. Le premier TikTok test est à réécrire selon cette grille.

## Tracking

UTM depuis le lien bio TikTok (`?utm_source=tiktok&utm_campaign=<video>`), stockés avec l'email et les événements (détail technique : `../04_operations/site-technique.md`). Pas d'outil tiers, pas de cookies invasifs.

## Canal B — créateurs payés (décision 2026-07-04)

Créateurs payés (seeding rémunéré) comme plan de secours si le trafic TikTok organique ne décolle pas, la pub payée servant d'amplificateur une fois qu'un contenu a fait ses preuves (pas de découverte à l'aveugle par la pub). **Trigger : si la waitlist n'est pas sur trajectoire cible fin octobre 2026.** À préparer avant activation : mini-brief de conformité pour les créateurs (mêmes règles que la marque — `../01_adn/conformite.md`).

## 📡 2026-11-16 — CE QUE LES RÉSEAUX ENVOIENT VRAIMENT AU SITE, MESURÉ POUR LA PREMIÈRE FOIS

**Basekou demande que la routine suive les réseaux** — *« on poste mais je n'ai pas toujours les infos à ce niveau-là »*. ⇒ La séance a d'abord mesuré ce qui est lisible, au lieu de supposer.

### ⛔ Ce qui n'est PAS lisible, et c'est testé

| Voie | Résultat du test | Date |
|---|---|---|
| Lire `instagram.com` / `tiktok.com` depuis une session | **`HTTP 000` — injoignables.** La liste blanche du réseau les refuse | **16/11** *(redate la mesure du 11/10)* |
| Connecteur **OpusClip** | ⛔ **ÉCARTÉ : on ne l'utilise pas** — *« on n'utilise pas Opus Clip »* (Basekou, 16/11). Ce n'est pas une piste bloquée, c'est un connecteur hors outillage. *(Il répond `plan: FREE`, `has_api_access: false` — il n'aurait rien donné de toute façon.)* ⚠️ Branché sans servir : à verser au tri des connecteurs du 10/11 | **16/11** |

➡️ **Aucune métrique de plateforme n'est accessible : ni vues, ni abonnés, ni la liste de ce qui a été publié.** ⚠️ **Ça reste DÉCLARATIF, et la parade du dossier tient : Basekou dit l'état du canal, la séance le date comme déclaration.** 🎯 **C'est le second des deux trous qu'il avait nommés le 14/10, et le seul encore ouvert.**

### ✅ Ce qui EST lisible, et personne ne l'avait regardé

**`page_events`, colonne `utm_source` — 119 visites depuis Instagram depuis le 28/09.**

| Semaine ISO | Vues | Lu jusqu'au bout | `commander_view` | Emails |
|---|---|---|---|---|
| **S40** *(28/09 → 04/10)* | **79** | **61** | **0** | **3** |
| S41 | 17 | 9 | 0 | 0 |
| S42 | 11 | 6 | 0 | 0 |
| S43 | 1 | 0 | 0 | 0 |
| S44 | 2 | 1 | 0 | 0 |
| S45 | 8 | 1 | 0 | 0 |
| S46 | 1 | 1 | 0 | 0 |

🎯 **TROIS FAITS, et le troisième est le plus dur.**

**① Le pic de la semaine 40 est réel et bon** : 79 vues et **77 % de lecture jusqu'au bout**. ⇒ **Le contenu intéressait.** Et il a produit les **3 seuls envois d'email** jamais attribués à une source.

**② L'effondrement est net** : de 79 vues à 1 par semaine — **≈ -99 % en six semaines**.

**③ 🔴 ZÉRO `commander_view` depuis Instagram, sur 119 visites.** ⇒ **Le trafic social lit la page d'accueil et n'atteint JAMAIS la page de commande.** 📌 **À rapprocher du constat du 12/11 : la chaîne de paiement est prouvée et personne ne commande. Ce n'est pas le paiement qui bloque, c'est que le trafic ne va pas jusqu'au bouton.**

⚠️ **Réserve tenue** : la leçon du 12/11 s'applique — rien ne distingue le trafic de Basekou de celui d'un visiteur. **79 vues sur 6 jours actifs rendent l'hypothèse « c'est lui » peu probable, sans l'exclure.**

### ⛔ Correction d'un énoncé faux, écrit le matin même

**« Première arrivée tracée depuis le lien en bio : dimanche 15/11 »** — repris du digest du 16/11 et relayé deux fois par la séance. ⛔ **Faux : les premières datent du 28/09.** ✅ Ce qui était vrai de la session du 15/11 : la première depuis des semaines à aller jusqu'au bout **et** à finir par un clic vers TikTok.

🎯 **Cause racine, transférable : un énoncé construit sur UNE FENÊTRE a été écrit comme un fait depuis toujours.** ➔ **Un superlatif — « première », « jamais », « aucune » — exige une requête SANS BORNE DE DATE, pas la fenêtre du digest.**

### 🔧 Le geste d'une ligne qui rendrait TikTok mesurable

⛔ **La seule valeur non vide de `utm_source` dans toute la table est `ig`.** Les événements `social_click_tiktok` sont des **départs vers** TikTok ; **aucune arrivée DEPUIS TikTok n'est distinguable d'un visiteur direct.**

⇒ **Les 5 publications TikTok sont invisibles à la mesure — non parce que le dispositif ne sait pas lire, mais parce que le lien ne dit pas d'où il vient.**

✅ **Geste : ajouter `?utm_source=tk` au lien en bio TikTok** *(le lien est chez Basekou, pas au dépôt)*. **Coût : une ligne. Effet : les deux canaux deviennent comparables.**

📌 **Et ça se généralise** : tout lien posé hors du site doit porter sa source — bio Instagram, bio TikTok, lien LinkedIn, **QR de l'affiche mosquée**. Sans ça, le soir parrainé ne sera pas mesurable non plus.

## 🔗 2026-11-20 — `utm_source=tk` : ESSAYÉ, AUCUN RÉSULTAT À CE JOUR

*(Déclaré par Basekou le 20/11 en séance Claude Code, en réponse au digest du jour.)*

📌 *« J'ai essayé ce qu'il fallait faire pour TikTok, il n'y a pas eu de résultat. »* ✅ **Vérifié en base le 20/11 vers 15h40 : aucun événement avec `utm_source = tk` depuis l'ouverture de la table** *(seules valeurs : vide, 1131 événements ; `ig`, 307, la dernière le 15/11)*. ⇒ **Soit le lien en bio ne porte pas encore le paramètre, soit personne n'a cliqué depuis.** ⏳ À vérifier : l'adresse exacte posée dans la bio TikTok.
