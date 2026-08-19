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
        ↓ SMTP Zoho
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

## Activation (à faire une fois)

### 1. Générer le mot de passe d'application Zoho

Dans Zoho Mail : **Paramètres → Sécurité → Mots de passe d'application** →
en générer un pour « Supabase ». Ce n'est **pas** le mot de passe du compte.

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
| `ZOHO_USER` | `basekou@ledje.fr` |
| `ZOHO_APP_PASSWORD` | le mot de passe d'application de l'étape 1 |
| `ALERTE_SECRET` | la valeur lue à l'étape 2 |
| `ALERTE_DESTINATAIRE` | *(facultatif)* adresse de réception, sinon `ZOHO_USER` |
| `ZOHO_SMTP_HOST` | *(facultatif)* `smtp.zoho.eu` par défaut ; `smtp.zoho.com` si le compte est sur la région US |

Tant que `ALERTE_SECRET` n'est pas réglé, la fonction répond `401` et aucun
email ne part — l'avis, lui, est bien enregistré.

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

## Réserve connue

L'envoi **SMTP sortant peut être bloqué** selon le plan Supabase / la
politique réseau du runtime Edge. Si l'étape 4 renvoie `smtp_failed` alors
que les identifiants sont bons, il faudra basculer sur une **API HTTP**
d'envoi (ZeptoMail de Zoho, ou Resend) plutôt que le SMTP direct — seule la
partie « envoi » de `index.ts` est à remplacer, le reste de la chaîne ne bouge
pas.
