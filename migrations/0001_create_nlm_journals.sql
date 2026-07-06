create table if not exists journals (
  id integer primary key,
  jr_id text,
  journal_title text not null,
  med_abbr text,
  iso_abbr text,
  issn_print text,
  issn_online text,
  nlm_id text,
  normalized_title text not null,
  normalized_med_abbr text,
  normalized_iso_abbr text
);

create index if not exists journals_normalized_title_idx
  on journals(normalized_title);

create index if not exists journals_normalized_med_abbr_idx
  on journals(normalized_med_abbr);

create index if not exists journals_normalized_iso_abbr_idx
  on journals(normalized_iso_abbr);
