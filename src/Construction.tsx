/* Page « en construction » — ce que voit un visiteur sur ledje.fr aujourd'hui.
   Alvéole retirée le 2026-09-08 (décision Basekou) : le symbole tirait vers le
   registre médical/cosmétique. Traitement typographique en attendant le logo. */

export default function Construction() {
  return (
    <main className="construction">
      <div className="construction-inner">
        <p className="construction-brand">
          <img src="/brand/wordmark-green.svg" alt="lédjé" width={2208} height={1040} />
        </p>
        <p className="construction-kicker">Eau miellée</p>
        <div className="construction-rule" aria-hidden="true" />
        <h1 className="construction-title">Le site est en construction.</h1>
        <p className="construction-text">
          On prépare quelque chose de beau et de simple.<br />
          Reviens bientôt — ou écris-nous en attendant.
        </p>
        <a className="construction-cta" href="mailto:basekou@ledje.fr">
          Nous écrire
        </a>
        <p className="construction-mail">
          <a href="mailto:basekou@ledje.fr">basekou@ledje.fr</a>
        </p>
        <p className="construction-tagline">Parmi les bienfaits de ce bas monde</p>
      </div>
    </main>
  )
}
