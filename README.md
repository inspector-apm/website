# Inspector website

The static marketing website for https://inspector.dev, built with Astro, TypeScript and SCSS.

## Commands

| Command           | Action                                         |
| :---------------- | :--------------------------------------------- |
| `npm install`     | Install dependencies                           |
| `npm run dev`     | Start the dev server at `localhost:4321`       |
| `npm run build`   | Build the production site to `./dist/`         |
| `npm run preview` | Preview the build locally                      |

## Where things live

- `src/pages/`: one file per page. `[framework].astro` generates the Laravel, Symfony, CakePHP, CodeIgniter and Drupal pages.
- `src/consts/`: the content that changes most, including navigation, frameworks, pricing and testimonials.
- `src/components/product/`: product UI rebuilt in HTML, such as the timeline and the agent session.
- `src/styles/variables/`: the design tokens.

Change a price in `src/consts/pricing.ts`, a framework in `src/consts/frameworks.ts` and a menu in `src/consts/navigation.ts`.

## Before launch

- Set `NEWSLETTER_ENDPOINT` in `src/consts/links.ts`. The form stays disabled until it has a value.
- Decide what happens to the WordPress blog and the other pages that are not on this site.
- Move the privacy and terms PDFs, which WordPress serves today, and add a cookie policy.
- Replace the PNG logos with a vector master.
