// Loads the YAML files in src/data that Pages CMS edits, and validates them so
// a broken edit fails the build with a readable error instead of a broken page.
import { parse } from 'yaml';
import { z } from 'astro/zod';

const files = import.meta.glob<string>('/src/data/*.yml', { query: '?raw', import: 'default', eager: true });

function load<T extends z.ZodType>(file: string, schema: T): z.infer<T> {
  const source = files[`/src/data/${file}`];
  if (source === undefined) throw new Error(`Missing content file src/data/${file}`);
  const raw = parse(source);
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new Error(`Invalid content in src/data/${file}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

const text = z.string().trim();
const optionalText = z.string().trim().nullish().transform((v) => v || undefined);

export const site = load(
  'site.yml',
  z.object({ name: text, title: text, description: text, headline: text, intro: optionalText }),
);

export const contact = load(
  'contact.yml',
  z.object({
    email: text,
    social: z.object({ instagram: optionalText, facebook: optionalText }),
    company: z.object({
      name: text,
      ico: z.coerce.string(),
      directors: z.array(text).default([]),
      registry: text,
      address: text,
    }),
  }),
);

const day = z.object({ day: text, hours: text, note: optionalText });

export const locations = load(
  'locations.yml',
  z.array(
    z.object({
      id: text,
      name: text,
      phone: text,
      street: text,
      postal_code: z.coerce.string(),
      city: text,
      note: optionalText,
      map_url: optionalText,
      units: z.array(
        z.object({
          title: text,
          kind: z.enum(['optika', 'ordinace']),
          note: optionalText,
          phone: optionalText,
          days: z.array(day),
        }),
      ),
    }),
  ),
);

export const services = load(
  'services.yml',
  z.array(z.object({ title: text, icon: optionalText, description: text })),
);

export const pricing = load(
  'pricing.yml',
  z.array(z.object({ service: text, price: z.coerce.string() })),
);

export const gallery = load(
  'gallery.yml',
  z.object({
    title: text.default('Galerie'),
    intro: optionalText,
    photos: z
      .array(
        z.object({
          image: text,
          alt: text,
          title: optionalText,
          caption: optionalText,
          date: z.coerce.date().nullish(),
          link: optionalText,
        }),
      )
      .nullish()
      .transform((v) => v ?? []),
  }),
);

export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`;

export const fullAddress = (l: { street: string; postal_code: string; city: string }) =>
  `${l.street}, ${l.postal_code} ${l.city}`;

export const isClosed = (hours: string) => /^[—–\-\s]*$|zavřeno/i.test(hours);

/** Czech typography: keep one-letter prepositions and conjunctions off line ends. */
export const typo = (value: string) => value.replace(/(^|[\s(])([kvszouaiKVSZOUAI])\s+/g, '$1$2 ');
