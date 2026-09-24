# Optika Řevnice — web

Webové stránky oční optiky a ordinace v Řevnicích a v Praze-Dejvicích.

**🌐 [www.optikarevnice.cz](https://www.optikarevnice.cz/)**

## Technologie

- [Astro](https://astro.build/) — statický generátor stránek
- [GitHub Pages](https://pages.github.com/) — hosting, nasazení přes GitHub Actions
- [Pages CMS](https://pagescms.org/) — redakční rozhraní pro úpravu obsahu

## Úprava obsahu

Obsah se upravuje v [Pages CMS](https://app.pagescms.org/) (přihlášení přes GitHub).
Po uložení se změna uloží do repozitáře a web se během 1–2 minut sám znovu sestaví a zveřejní.

| Sekce v Pages CMS | Soubor | Obsah |
|---|---|---|
| Aktuality | `src/content/pages/aktuality.md` | Oznámení nahoře na úvodní stránce (prázdný text = rámeček se nezobrazí) |
| Pobočky a otevírací doba | `src/data/locations.yml` | Adresy, telefony, otevírací doba optiky a ordinace |
| Služby | `src/data/services.yml` | Karty služeb |
| Ceník | `src/data/pricing.yml` | Ceník vyšetření |
| Galerie | `src/data/gallery.yml` | Fotografie (nahrávají se do `src/assets/gallery/`) |
| Stránka OCT | `src/content/pages/oct.md` | Text stránky /oct/ |
| Úvodní stránka a SEO | `src/data/site.yml` | Nadpis, úvodní text, titulek a popis pro vyhledávače |
| Kontakt a firemní údaje | `src/data/contact.yml` | E-mail, sociální sítě, údaje o společnosti |

Tipy:

- **Otevírací doba** — hodiny pište ve tvaru `8:30–16:30`, zavřeno jako `—`. Z těchto údajů se generují i strukturovaná data pro Google.
- **Galerie** — u každé fotky vyplňte *Popis obrázku (alt)*. Fotky není třeba zmenšovat, web je optimalizuje sám.
- Pokud se po úpravě web neaktualizuje, podívejte se na záložku *Actions* v repozitáři — chybný údaj zastaví sestavení a zobrazí srozumitelnou chybu, stávající web zůstane beze změny.

## SEO a AI vyhledávače

- strukturovaná data schema.org (Organization, Optician, MedicalClinic, otevírací doba, ceník, galerie, MedicalWebPage)
- `sitemap-index.xml`, `robots.txt`, kanonické URL, Open Graph obrázek (`public/og-image.png`)
- `/llms.txt` — textové shrnutí firmy, poboček, otevírací doby, služeb a ceníku pro AI asistenty

Vše se generuje ze stejných dat jako stránka, takže je vždy aktuální.

## Lokální vývoj

Vyžaduje Node.js 22.12+.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # sestavení do dist/
npm run check    # typová kontrola
```

## Nasazení

Workflow `.github/workflows/deploy.yml` sestaví a nasadí web při každém pushi do `main`.
V nastavení repozitáře musí být **Settings → Pages → Build and deployment → Source: GitHub Actions**.
