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
- `src/content/blog/`: the blog posts as Markdown, with their images. Article URLs stay at the root (`/slug/`), so they match the old WordPress URLs.
- `src/consts/`: the content that changes most, including navigation, frameworks, pricing and testimonials.
- `src/components/sections/`: page sections, all built on `Section.astro`.
- `src/components/product/`: product UI rebuilt in HTML, such as the timeline and the agent session.
- `src/components/ui/`: small shared pieces, such as buttons, quotes and the logo.
- `src/styles/variables/`: the design tokens.

Change a price in `src/consts/pricing.ts`, a framework in `src/consts/frameworks.ts` and a menu in `src/consts/navigation.ts`.

## Before launch

- Set `NEWSLETTER_ENDPOINT` in `src/consts/links.ts`. The form stays disabled until it has a value.
- Decide what happens to the other WordPress pages that are not on this site, and to the 47 Neuron AI posts that are not in this blog, because their URLs still live on inspector.dev.
- Set up the redirects in `inspector-website/blog/redirects.csv` on the host.
- Move the privacy and terms PDFs, which WordPress serves today, and add a cookie policy.
- Replace the PNG logos with a vector master.
- Clear the framework logos in `public/images/frameworks/`. Symfony's policy requires written authorization for any logo use, and Laravel's requires permission for commercial use. Check Drupal's license terms too, and whether CodeIgniter has any logo terms.
