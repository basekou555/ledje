/* ════════════════════════════════════════════════════════════════
   Où le client prévient Basekou, et comment on y arrive.

   Extrait de Commander.tsx le 2026-10-23, quand l'ordre du parcours a été
   inversé : le geste « prévenir » a quitté la page de commande pour la page
   d'APRÈS paiement. Deux pages ont donc besoin des mêmes adresses et de la
   même logique — et un numéro de téléphone dupliqué à deux endroits, c'est
   celui qui dérive à la première retouche.

   ⚠️ LE NUMÉRO PART DANS LE BUNDLE PUBLIC. Un lien `wa.me` ne peut pas faire
   autrement : il porte le numéro en clair dans l'URL. C'est assumé parce que
   Basekou a nommé WhatsApp comme canal pour le joindre (22/10), mais le vider
   suffit à le retirer — le canal WhatsApp bascule alors sur le mail, sans
   rien casser.
   ════════════════════════════════════════════════════════════════ */

export const WHATSAPP = '33652036548'
export const MAIL_BASEKOU = 'basekou@ledje.fr'
export const INSTA_DM = 'https://ig.me/m/its.ledje'

export type Canal = {
  href: string
  libelle: string
  note: string
  /** Faut-il copier le message dans le presse-papier ? */
  copier: boolean
  /** Faut-il AFFICHER le message, pour qu'il soit recopié à la main ? */
  montrer: boolean
}

/* ⚠️ CE QU'AUCUN DE CES LIENS NE FAIT : envoyer le message. Un site ne peut
   pas écrire à la place de quelqu'un — on pré-remplit, le client appuie.

   Et chaque canal porte SA note, parce que ce qui est pré-rempli diffère de
   l'un à l'autre : une note commune mentirait sur l'un des quatre. C'est un
   défaut qui s'est produit (22/10) — le canal Téléphone affichait « recopie
   ce message », sur un appel. */
export function lienCanal(canal: string, message: string, copie = false): Canal {
  const t = encodeURIComponent(message)

  if (canal === 'WhatsApp' && WHATSAPP) {
    return {
      href: `https://wa.me/${WHATSAPP}?text=${t}`,
      libelle: 'Envoyer sur WhatsApp',
      note: 'Le message est déjà écrit, tu n’as plus qu’à l’envoyer.',
      copier: false,
      montrer: false,
    }
  }

  if (canal === 'Instagram') {
    // Aucune API publique ne pré-remplit un DM Instagram : on ouvre la
    // conversation, et le message passe par le presse-papier.
    return {
      href: INSTA_DM,
      libelle: 'Ouvrir Instagram',
      note: copie
        ? 'Ton message est copié : colle-le dans la conversation.'
        : 'Instagram ne permet pas de pré-remplir un message — recopie celui-ci :',
      copier: true,
      montrer: true,
    }
  }

  if (canal === 'Téléphone' && WHATSAPP) {
    // Un appel ne transporte pas de texte : rien à copier, rien à montrer.
    return {
      href: `tel:+${WHATSAPP}`,
      libelle: 'Appeler',
      note: 'Si ça ne décroche pas, laisse un message — on rappelle.',
      copier: false,
      montrer: false,
    }
  }

  return {
    href: `mailto:${MAIL_BASEKOU}?subject=${encodeURIComponent('Commande lédjé')}&body=${t}`,
    libelle: 'Envoyer le mail',
    note: 'Le message est déjà écrit, tu n’as plus qu’à l’envoyer.',
    copier: false,
    montrer: false,
  }
}
