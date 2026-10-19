import { useState } from 'react'
import { submitDemande, trackEvent, type DemandeType } from './lib/supabase'

/* ════════════════════════════════════════════════════════════════
   Le formulaire de demande — /offrir et /prestations

   Créé le 2026-10-16 pour remplacer les `mailto:` qui terminaient ces deux
   pages. Le motif est dans les chiffres Vercel du jour : 91 % des visiteurs
   sont sur téléphone, et un `mailto:` y est une impasse. On demandait à
   quelqu'un venu voir un produit d'écrire un mail depuis zéro, debout, sur
   son téléphone.

   ⚠️ DEUX PRINCIPES TIENNENT LA FORME DU FORMULAIRE, et ils expliquent ce
   qui n'y est pas :

   ① UN SEUL CHAMP OBLIGATOIRE — « comment on te répond ». Tout le reste est
     facultatif, y compris le nom. Chaque champ obligatoire est une occasion
     d'abandonner, et on préfère une demande incomplète à une demande qui
     n'arrive jamais : on peut toujours rappeler pour le reste.

   ② AUCUN FORMAT IMPOSÉ. Le contact accepte un email OU un téléphone, la
     date et la quantité sont du texte libre (« samedi 25 », « une centaine »).
     Valider un format, c'est refuser une demande pour une virgule.

   Le mail reste accessible en second rideau : certains préfèrent, et une
   panne du formulaire ne doit pas fermer la porte.
   ════════════════════════════════════════════════════════════════ */

type Etat = 'idle' | 'loading' | 'done' | 'invalid' | 'network'

type Props = {
  type: DemandeType
  /** Libellé du champ « structure » : il ne se dit pas pareil selon la page. */
  labelStructure: string
  placeholderStructure: string
  /** Le mail de repli, déjà préparé par la page appelante. */
  mailto: string
}

export default function DemandeForm({ type, labelStructure, placeholderStructure, mailto }: Props) {
  const [nom, setNom] = useState('')
  const [contact, setContact] = useState('')
  const [structure, setStructure] = useState('')
  const [dateSouhaitee, setDateSouhaitee] = useState('')
  const [quantite, setQuantite] = useState('')
  const [message, setMessage] = useState('')
  const [etat, setEtat] = useState<Etat>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!contact.trim()) {
      setEtat('invalid')
      return
    }
    setEtat('loading')
    const { error } = await submitDemande({
      type, nom, contact, structure, dateSouhaitee, quantite, message,
    })
    if (error) {
      setEtat('network')
      return
    }
    trackEvent(`demande_${type}`)
    setEtat('done')
  }

  if (etat === 'done') {
    return (
      <p className="v-success" role="status">
        C’est reçu. On revient vers toi rapidement — c’est encore nous qui
        préparons chaque bouteille, donc on répond vite.
      </p>
    )
  }

  return (
    <form className="v-demande" onSubmit={onSubmit} noValidate>
      <div className="v-demande-row">
        <label className="v-field">
          <span>Ton nom</span>
          <input
            type="text"
            value={nom}
            onChange={e => setNom(e.target.value)}
            autoComplete="name"
            placeholder="Facultatif"
          />
        </label>
        <label className="v-field">
          <span>Comment on te répond <em>*</em></span>
          <input
            type="text"
            value={contact}
            onChange={e => { setContact(e.target.value); if (etat !== 'idle') setEtat('idle') }}
            aria-invalid={etat === 'invalid'}
            placeholder="Email ou téléphone"
          />
        </label>
      </div>

      <label className="v-field">
        <span>{labelStructure}</span>
        <input
          type="text"
          value={structure}
          onChange={e => setStructure(e.target.value)}
          placeholder={placeholderStructure}
        />
      </label>

      <div className="v-demande-row">
        <label className="v-field">
          <span>Pour quand</span>
          <input
            type="text"
            value={dateSouhaitee}
            onChange={e => setDateSouhaitee(e.target.value)}
            placeholder="« samedi 25 », « fin novembre »…"
          />
        </label>
        <label className="v-field">
          <span>Combien de bouteilles</span>
          <input
            type="text"
            value={quantite}
            onChange={e => setQuantite(e.target.value)}
            placeholder="Une estimation suffit"
          />
        </label>
      </div>

      <label className="v-field">
        <span>Autre chose à dire</span>
        <textarea
          rows={3}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Facultatif"
        />
      </label>

      {etat === 'invalid' && (
        <p className="v-error" role="alert">
          Il nous faut au moins un moyen de te répondre.
        </p>
      )}
      {etat === 'network' && (
        <p className="v-error" role="alert">
          L’envoi a échoué. Réessaie, ou écris-nous à{' '}
          <a href={mailto}>basekou@ledje.fr</a>.
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={etat === 'loading'}>
        {etat === 'loading' ? 'Un instant…' : 'Envoyer'}
      </button>
      <p className="v-note">
        Un seul champ est obligatoire. On s’occupe du reste au téléphone.
      </p>
    </form>
  )
}
