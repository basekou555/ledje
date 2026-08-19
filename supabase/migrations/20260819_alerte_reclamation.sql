-- Alerte email sur réclamation (SOT 2026-08-17). Appliquée le 2026-08-19.
-- Voir supabase/functions/alerte-reclamation/README.md pour l'activation.
-- (Copie versionnée de la migration appliquée en base.)

create extension if not exists pg_net with schema extensions;

alter table public.avis add column if not exists alerte_envoyee_at timestamptz;
comment on column public.avis.alerte_envoyee_at is 'Horodatage de l envoi de l alerte email de reclamation. NULL = pas (encore) envoyee.';

-- Secret partagé trigger <-> Edge Function, généré aléatoirement en base.
do $$
begin
  if not exists (select 1 from vault.secrets where name = 'alerte_reclamation_secret') then
    perform vault.create_secret(
      encode(extensions.gen_random_bytes(32), 'hex'),
      'alerte_reclamation_secret',
      'Secret partage trigger avis -> Edge Function alerte-reclamation (= ALERTE_SECRET).'
    );
  end if;
end $$;

create or replace function public.notifier_reclamation()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  v_secret text;
  v_url text := 'https://qihlqrmbcbfzjwfegsxv.supabase.co/functions/v1/alerte-reclamation';
begin
  if new.reclamation is null or btrim(new.reclamation) = '' then
    return new;
  end if;

  select decrypted_secret into v_secret
    from vault.decrypted_secrets
   where name = 'alerte_reclamation_secret'
   limit 1;

  if v_secret is null then
    raise warning 'alerte_reclamation : secret absent du vault, alerte non envoyee';
    return new;
  end if;

  perform net.http_post(
    url     := v_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-alerte-secret', v_secret
    ),
    body    := jsonb_build_object('record', to_jsonb(new)),
    timeout_milliseconds := 8000
  );

  return new;
end $$;

drop trigger if exists trg_avis_reclamation on public.avis;
create trigger trg_avis_reclamation
  after insert on public.avis
  for each row
  when (new.reclamation is not null)
  execute function public.notifier_reclamation();
