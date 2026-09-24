// /llms.txt — a plain-text summary of the business for AI assistants and
// answer engines (https://llmstxt.org), generated from the same CMS data.
import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { contact, fullAddress, isClosed, locations, pricing, services, site } from '../lib/data';
import { SITE_URL } from '../lib/schema';

export const GET: APIRoute = async () => {
  const news = await getEntry('pages', 'aktuality');
  const oct = await getEntry('pages', 'oct');
  const lines: string[] = [];

  lines.push(`# ${site.name}`, '', `> ${site.description}`, '');
  if (site.intro) lines.push(site.intro, '');
  lines.push(
    `Provozovatel: ${contact.company.name}, IČO ${contact.company.ico}, sídlo ${contact.company.address}.`,
    `E-mail: ${contact.email}`,
    '',
  );

  if (news?.body?.trim()) lines.push('## Aktuality', '', news.body.trim(), '');

  lines.push('## Pobočky a otevírací doba', '');
  for (const l of locations) {
    lines.push(`### ${l.name}`, '', `- Adresa: ${fullAddress(l)}${l.note ? ` (${l.note})` : ''}`, `- Telefon: ${l.phone}`);
    if (l.map_url) lines.push(`- Mapa: ${l.map_url}`);
    lines.push('');
    for (const u of l.units) {
      lines.push(`${u.title}:`);
      for (const d of u.days) lines.push(`- ${d.day}: ${isClosed(d.hours) ? 'zavřeno' : d.hours}${d.note ? ` (${d.note})` : ''}`);
      if (u.note) lines.push(`- ${u.note}${u.phone ? ` Tel.: ${u.phone}` : ''}`);
      lines.push('');
    }
  }

  lines.push('## Služby', '');
  for (const s of services) lines.push(`- **${s.title}**: ${s.description}`);
  if (oct) lines.push(`- **OCT vyšetření**: ${oct.data.summary ?? oct.data.description ?? ''} Více: ${SITE_URL}/oct/`);
  lines.push('', '## Ceník vyšetření', '');
  for (const p of pricing) lines.push(`- ${p.service}: ${p.price}`);

  lines.push(
    '',
    '## Odkazy',
    '',
    `- [Úvodní stránka](${SITE_URL}/): otevírací doba, služby, ceník, galerie, kontakt`,
    `- [OCT – optická koherentní tomografie](${SITE_URL}/oct/): popis vyšetření a jeho výhody`,
    ...[contact.social.instagram && `- [Instagram](${contact.social.instagram})`, contact.social.facebook && `- [Facebook](${contact.social.facebook})`].filter(
      (v): v is string => !!v,
    ),
    '',
  );

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
