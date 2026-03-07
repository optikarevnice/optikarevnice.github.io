# Optika Řevnice — Web

Webové stránky oční optiky a ordinace v Řevnicích a Dejvicích.

**🌐 [optikarevnice.cz](https://optikarevnice.cz/)**

## Technologie

- [Jekyll](https://jekyllrb.com/) — statický generátor stránek
- [GitHub Pages](https://pages.github.com/) — hosting
- [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter) — typografie

## Lokální vývoj

```bash
bundle install
bundle exec jekyll serve
```

Stránka bude dostupná na `http://localhost:4000/`.

## Úprava obsahu

Obsah stránek je uložen v snadno editovatelných YAML a Markdown souborech:

| Soubor | Obsah |
|--------|-------|
| `_data/opening_hours.yml` | Otevírací doba obou poboček |
| `_data/pricing.yml` | Ceník vyšetření a služeb |
| `_data/contact.yml` | Kontaktní údaje, adresy, sociální sítě |
| `_data/services.yml` | Popis nabízených služeb |
| `_includes/hero.html` | Novinky a aktualní oznámení |

Soubory lze přímo upravovat v editoru na GitHubu.

## Nasazení

Stránky se automaticky sestaví a nasadí na GitHub Pages po pushnutí do hlavní větve.
