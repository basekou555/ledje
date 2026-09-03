# Alerte email sur réclamation

Décision SOT du 2026-08-17 : une réclamation produit (bouteille gonflée, goût
anormal…) doit alerter par email, contrairement à un avis ordinaire. Les
réclamations sont traitées dans la journée.

## Comment ça marche

```
/avis (champ « J'ai un problème avec ma bouteille »)
        ↓ insert dans public.avis
trigger trg_avis_reclamation   (ne tire QUE si reclamation non nul)
        ↓ pg_net.http_post — asynchrone, ne bloque jamais l'insertion
Edge Function alerte-reclamation
        ↓ API Resend (HTTP)
boîte d'alerte  →  puis marque avis.alerte_envoyee_at
```

Points de conception :

- **L'appel est asynchrone** (`pg_net`) : si l'email échoue, l'avis est quand
  même enregistré. Jamais de perte de donnée à cause du mail.
- **Le trigger ne tire que sur réclamation** : aucun email sur un avis normal
  (amendement Basekou du 17/08).
- **Authentification** par secret partagé (en-tête `x-alerte-secret`), généré
  aléatoirement en base et rangé dans le Vault Supabase. La fonction est en
  `verify_jwt: false` car l'appelant est un trigger Postgres, pas un
  utilisateur connecté.
- **Aucun secret dans le dépôt.** Tout vient des secrets Edge Function.
- **Conformité** : le contenu du mail est purement factuel, aucune allégation
  santé même implicite (`docs/01_adn/conformite.md`).

## Historique : pourquoi Resend et pas Zoho

La v1 passait par SMTP Zoho (`ZOHO_USER`/`ZOHO_APP_PASSWORD`). Abandonné le
2026-09-03 : le **plan gratuit Zoho Mail bloque IMAP/POP/SMTP**, réservé au
plan payant Mail Lite. Les logs montraient `535: Authentication Failed` même
avec un mot de passe d'application valide et fraîchement régénéré — ce n'était
pas un secret mal réglé, mais le protocole SMTP fermé côté Zoho.

Resend est une **API HTTP** : aucun protocole SMTP en jeu, donc ce blocage ne
s'applique pas.

## Activation (à faire une fois)

### 1. Créer un compte Resend et une clé API

Sur [resend.com](https://resend.com) : inscription, puis **API Keys → Create
API Key**. La clé (`re_...`) ne s'affiche qu'une fois.

Tant qu'aucun domaine n'est vérifié sur Resend, l'envoi ne peut se faire que
depuis `onboarding@resend.dev` et **uniquement vers l'adresse email du compte
Resend**. Pour envoyer vers une autre adresse ou depuis `@ledje.fr`, il faut
vérifier le domaine `ledje.fr` dans Resend (ajout d'enregistrements DNS) puis
régler `RESEND_FROM` en conséquence (voir étape 3).

### 2. Récupérer le secret partagé

Dans le SQL Editor Supabase :

```sql
select decrypted_secret
  from vault.decrypted_secrets
 where name = 'alerte_reclamation_secret';
```

### 3. Régler les secrets de l'Edge Function

Dashboard Supabase → **Edge Functions → alerte-reclamation → Secrets** :

| Nom | Valeur |
|---|---|
| `RESEND_API_KEY` | la clé de l'étape 1 (`re_...`) |
| `ALERTE_SECRET` | la valeur lue à l'étape 2 |
| `ALERTE_DESTINATAIRE` | l'adresse qui doit recevoir les alertes (`basekou@ledje.fr`) |
| `RESEND_FROM` | *(facultatif)* `Lédjé <onboarding@resend.dev>` par défaut ; à passer à une adresse `@ledje.fr` une fois le domaine vérifié |

Tant que `ALERTE_SECRET` n'est pas réglé, la fonction répond `401` et aucun
email ne part — l'avis, lui, est bien enregistré. Tant que `RESEND_API_KEY`
ou `ALERTE_DESTINATAIRE` manque, elle répond `500 resend_not_configured`.

### 4. Vérifier

Envoyer un avis de test depuis `ledje.fr/avis` avec le champ réclamation
rempli, puis :

```sql
-- la réponse HTTP de la fonction (200 = mail parti)
select status_code, content, created
  from net._http_response order by created desc limit 1;

-- la ligne marquée comme alertée
select id, created_at, alerte_envoyee_at, reclamation
  from public.avis where reclamation is not null order by created_at desc limit 5;
```

Si le statut n'est pas 200, les logs détaillés (`resend_failed` avec le
message renvoyé par l'API) sont visibles dans Supabase → Edge Functions →
alerte-reclamation → Logs.
