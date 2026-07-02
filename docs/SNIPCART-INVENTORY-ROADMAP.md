# Snipcart Inventory Roadmap

This plan adapts the proposed Snipcart + Git-tracked inventory workflow to the current `obair-lann-monny` Eleventy repository.

The goal is to keep the site static, keep inventory in Git, use Snipcart + Stripe for checkout, and automatically mark purchased work as sold by committing inventory changes back to the repository.

## Current repository fit

| Area | Current state | Plan impact |
|---|---|---|
| Static site generator | Eleventy `^3.1.2` | Good fit; product pages can be Markdown/Nunjucks content. |
| Node runtime | Node `22` | Use Node 22 for any future inventory scripts and GitHub Actions. |
| Eleventy input | `content/` | Product pages should live under `content/` unless there is a strong reason to create a different input path. |
| Global data | `_data/` | Inventory and Snipcart config should live here so templates can read them globally. |
| Layouts | `_includes/layouts/` | Add a dedicated shop/product layout rather than overloading the current post layout. |
| Existing work sections | `content/design/`, `content/inProgress/`, `content/galleries/` | Store content should probably be separate from design archive and process writing. |
| Build command | `npm run build` | Every inventory/template change should be validated with this command. |
| Deployment docs/config | README and architecture docs mention Netlify; requested target is GitHub → Vercel | Confirm the live target before adding webhook/API instructions. |
| Existing commerce content | Process notes mention store planning and Shopify rough work | Useful context, but no production store system exists yet. |

## Recommended target architecture

```text
Git repository
  ├─ content/shop/                 Product pages
  ├─ _data/inventory.json          Source of truth for availability, price, and edition counts
  ├─ inventory/sales-ledger.json    Transaction/order IDs for idempotency and audit history
  ├─ _data/snipcart.js             Public Snipcart configuration from environment
  ├─ _includes/layouts/product.njk Product page layout
  ├─ _includes/shop-card.njk       Optional product card partial
  ├─ scripts/update-inventory.js   Sale payload processor
  └─ .github/workflows/            Inventory update workflow

Snipcart + Stripe
  └─ order.completed webhook

Vercel
  └─ webhook relay endpoint
      └─ GitHub repository_dispatch
          └─ GitHub Action commits inventory update
              └─ Vercel rebuilds from the Git commit
```

This keeps the static site as the public storefront and treats Git history as the inventory ledger.

## Key adaptation decisions

### 1. Use a new `content/shop/` section

The current `content/design/` section is a portfolio archive, not a store catalog. Add a new shop section so commerce rules, URLs, collection filters, and layouts can evolve without changing the design archive.

Recommended URL shape:

| Content | Source | URL |
|---|---|---|
| Shop landing page | `content/shop.njk` | `/shop/` |
| Individual work | `content/shop/<sku>.md` or `content/shop/<series>/<sku>.md` | `/shop/<sku>/` or `/shop/<series>/<sku>/` |

### 2. Keep inventory in `_data/inventory.json`

The proposed `src/_data/inventory.json` should become `_data/inventory.json` in this repository because Eleventy is configured with `dir.data: "../_data"`.

The inventory file should be the source of truth for:

- SKU/product ID
- availability
- price
- currency
- original vs edition type
- edition size and remaining count
- optional fulfillment metadata
- optional archive visibility flags

### 3. Keep product description in Markdown frontmatter/content

Product pages should own human-facing content:

- title
- description
- date
- images
- dimensions
- medium/materials
- series
- tags
- display order

Inventory should own transactional state:

- available/sold
- price
- edition remaining
- Snipcart ID/SKU

### 4. Add a dedicated product layout

The existing `layouts/post.njk` includes date/tag metadata and blog-style presentation. A dedicated `layouts/product.njk` should handle:

- inventory lookup by SKU
- image rendering via the existing `{% image %}` shortcode
- Snipcart add-to-cart button attributes
- sold/available states
- edition remaining copy
- optional archive behavior for sold works

### 5. Use Snipcart public key through Eleventy data

Add Snipcart public configuration through `_data/snipcart.js`, reading from Vercel environment variables. This keeps secrets out of Git and lets templates render the public Snipcart setup only when configured.

### 6. Use a Vercel serverless relay, not Snipcart directly to GitHub

Snipcart webhooks cannot safely contain a GitHub token directly. A Vercel serverless endpoint should:

- receive the Snipcart webhook
- verify the Snipcart signature before doing anything else
- normalize the payload
- call GitHub `repository_dispatch`
- return a success/failure response to Snipcart

### 7. Treat GitHub Action updates as inventory transactions

The GitHub Action should:

- check out the repository
- run the inventory updater script
- validate the changed inventory file
- commit only when inventory actually changes
- use a clear bot identity and commit message
- rely on the commit to trigger the Vercel rebuild

### 8. Keep transaction history out of product inventory

Inventory should describe current product state. Processed order IDs, assigned edition numbers, and audit metadata should live in a companion Git-tracked ledger file such as `inventory/sales-ledger.json`.

This separation keeps `_data/inventory.json` easy for Eleventy templates to consume while still giving the webhook updater a durable idempotency record.

## Immediate next steps

These are the assignable MVP items to turn the plan into a working first version.

### Item 1 — Confirm commerce requirements

**Type:** Product decision  
**Depends on:** None  
**Assignable outcome:** A short decision record in the issue/PR.

Decide:

- Whether sold works stay visible, move to an archive state, or are hidden from shop listings.
- Whether the first launch includes originals only, editions only, or both.
- Whether print-on-demand items are allowed in inventory or deferred.
- Whether product URLs should live under `/shop/`, `/works/`, or another path.
- Whether Vercel is already the live deployment target and whether existing deployment docs/config need a separate update.

### Item 2 — Define SKU and inventory schema

**Type:** Data model  
**Depends on:** Item 1  
**Assignable outcome:** Documented schema and initial empty or sample inventory file.

Define the canonical inventory shape for:

- one-off originals
- limited editions
- future open editions or made-to-order items
- prices and currency
- sold/available state
- display/visibility state
- SKU naming conventions

Suggested SKU convention:

- Lowercase kebab-case.
- Stable forever after publishing.
- Series prefix when useful, such as `five-lines-001`.
- Use consistent zero-padding for numbered series when sort order matters, such as `oyster-edition-014`.

### Item 3 — Choose product content structure

**Type:** Content architecture  
**Depends on:** Item 1, Item 2  
**Assignable outcome:** A documented folder and frontmatter convention.

Decide whether product content should be:

- flat: `content/shop/<sku>.md`
- grouped: `content/shop/<series>/<sku>.md`

For this repository, grouped content is useful if shop work will contain multiple series. Flat content is simpler for MVP.

### Item 4 — Create shop collection plan

**Type:** Eleventy architecture  
**Depends on:** Item 3  
**Assignable outcome:** Implementation notes for a future `shop` collection.

Plan the Eleventy collection behavior:

- collect product pages from `content/shop/**/*.md`
- sort by date or explicit order
- filter draft products using existing `draft: true` behavior
- optionally filter sold items from the shop landing page while leaving direct product URLs available

### Item 5 — Design product page states

**Type:** UX/content  
**Depends on:** Item 1, Item 2  
**Assignable outcome:** State list and required copy for product template.

Define template states:

- available original
- sold original
- available edition with remaining count
- sold-out edition
- missing inventory entry
- draft/unpublished product
- Snipcart unavailable because environment config is missing

### Item 6 — Add Snipcart account and Stripe setup checklist

**Type:** External service setup  
**Depends on:** Item 1  
**Assignable outcome:** Setup checklist with required environment variables.

Create Snipcart and Stripe configuration, then define required environment variables:

- Snipcart public API key for the site build/runtime.
- Snipcart secret/signing key for webhook validation.
- GitHub token or GitHub App credential for repository dispatch.
- Repository owner/name values if not hardcoded by deployment environment.

Do not commit any keys.

### Item 7 — Plan product layout integration

**Type:** Template work  
**Depends on:** Item 2, Item 5  
**Assignable outcome:** Template requirements ready for implementation.

Future implementation should add a product layout that:

- reads the product SKU from frontmatter
- looks up the SKU in `_data/inventory.json`
- renders current image shortcodes correctly
- outputs a Snipcart add-to-cart button only for purchasable items
- shows sold/sold-out states otherwise
- preserves accessibility for button labels and product images

### Item 8 — Plan shop landing page

**Type:** Template/content work  
**Depends on:** Item 4, Item 5  
**Assignable outcome:** Shop index requirements ready for implementation.

Future implementation should add a shop landing page that:

- lists available products first
- optionally includes sold work under an archive section
- shows price and edition status
- links to product pages
- uses existing visual system and CSS conventions instead of introducing a separate design framework

### Item 9 — Plan webhook relay

**Type:** Integration/security  
**Depends on:** Item 6  
**Assignable outcome:** Relay requirements ready for implementation.

Future implementation should add a Vercel API endpoint that:

- accepts only supported Snipcart events
- verifies Snipcart webhook signatures
- rejects invalid methods and invalid payloads
- sends a minimal normalized payload to GitHub Actions
- avoids logging sensitive headers or full payment details

### Item 10 — Plan GitHub Action workflow

**Type:** Automation  
**Depends on:** Item 2, Item 9  
**Assignable outcome:** Workflow requirements ready for implementation.

Future workflow should:

- trigger from `repository_dispatch` event type for Snipcart sales
- run on Node 22
- update `_data/inventory.json`
- commit only when the inventory file changes
- fail safely when payload validation fails
- avoid changing product Markdown or unrelated files

### Item 11 — Plan inventory updater script

**Type:** Automation/data safety  
**Depends on:** Item 2, Item 10  
**Assignable outcome:** Script behavior specification ready for implementation.

Future updater should:

- validate payload shape before mutating inventory
- ignore unknown SKUs but report them clearly
- decrement edition counts by purchased quantity
- prevent negative remaining counts
- mark originals unavailable after purchase
- be idempotent by tracking processed order IDs in the companion sales ledger
- write deterministic JSON formatting

### Item 12 — Create MVP test checklist

**Type:** QA  
**Depends on:** Items 7–11  
**Assignable outcome:** Manual and automated test checklist.

MVP validation should cover:

- `npm run build`
- product page renders available item
- product page renders sold item
- product page renders edition remaining count
- shop landing page excludes or labels sold items according to the decision in Item 1
- webhook relay rejects invalid signatures
- inventory updater handles duplicate order payloads safely
- GitHub Action commits only `_data/inventory.json`
- Vercel rebuilds after the inventory commit

## MVP implementation sequence

Use this sequence after the planning decisions above are complete.

1. Add initial inventory data and product content conventions.
2. Add product layout and shop collection.
3. Add shop landing page.
4. Add Snipcart public configuration and global Snipcart assets.
5. Add available/sold/edition display states.
6. Add manual build validation.
7. Add inventory updater script.
8. Add tests or fixture-driven validation for inventory updater behavior.
9. Add GitHub Action for repository dispatch.
10. Add Vercel webhook relay with signature validation.
11. Configure Snipcart webhook.
12. Run a sandbox checkout from Snipcart through inventory commit and Vercel rebuild.

## Long-term roadmap

### Phase 1 — Stable catalog foundation

Goal: make product pages and inventory reliable before automating sales.

Assignable items:

- Finalize SKU conventions.
- Add shop/product documentation to `docs/ARCHITECTURE.md`.
- Add a content authoring checklist for new products.
- Add inventory validation to the build or a separate npm script.
- Add sample products behind `draft: true` for template testing.

### Phase 2 — Automated sale handling

Goal: make completed Snipcart orders update Git inventory safely.

Assignable items:

- Add signed Snipcart webhook relay.
- Add repository dispatch workflow.
- Add inventory updater.
- Add duplicate-order protection.
- Add workflow failure notifications.
- Add sandbox end-to-end test order.

### Phase 3 — Edition management

Goal: support limited editions without hidden SaaS state.

Assignable items:

- Track edition size and remaining count.
- Track assigned edition numbers per order.
- Use the companion sales ledger from the core architecture to associate processed orders with assigned edition numbers.
- Generate packing/certificate metadata from the same transaction.
- Add reconciliation process for cancelled/refunded orders.

### Phase 4 — Storefront polish

Goal: make the store feel integrated with the portfolio site.

Assignable items:

- Add product card partials that match existing homepage/archive styling.
- Add filters for originals, editions, series, and sold/archive work.
- Add product structured data for search engines.
- Add Open Graph image handling for product pages.
- Add related work links from product pages to design/process/galleries content.

### Phase 5 — Operations and auditability

Goal: keep the no-backend system maintainable as sales volume grows.

Assignable items:

- Expand the sales ledger with additional audit fields if commit history and processed order IDs are not enough.
- Add scheduled inventory reconciliation against Snipcart orders.
- Add alerting for webhook or workflow failures.
- Add branch protection or workflow permissions review for bot commits.
- Add documentation for manually correcting inventory.

### Phase 6 — Future integrations

Goal: extend without replacing the source-of-truth model.

Assignable items:

- Certificate generation for editions.
- Fulfillment export for shipping labels.
- Private collector notes or provenance fields.
- Preview-only archive pages for sold bodies of work.
- Optional migration path to a CMS if content editing needs outgrow Git.

## Security and reliability requirements

Do not start implementation until these requirements are accepted:

- Snipcart webhook signatures must be verified.
- GitHub credentials must be stored only in Vercel/GitHub secrets.
- The GitHub token should have the minimum permissions required to dispatch the workflow.
- The GitHub Action should only mutate inventory and ledger files.
- The updater should be idempotent so repeated webhooks do not decrement inventory twice.
- Workflow logs should not print full payment details or secret headers.
- Unknown SKUs should not silently succeed without an alert.
- Sold-out editions should never produce negative remaining counts.

## Open questions

1. Is Vercel already the live deployment target, or should the existing Netlify documentation/config be updated as part of the store work?
2. Should sold works remain visible on product pages?
3. Should sold works appear on the shop landing page, a separate archive page, or only via direct links?
4. Should MVP include editions, or launch with one-off originals first?
5. Should inventory track only availability, or also fulfillment/provenance metadata?
6. Should the site support print-on-demand items, or keep those out of inventory for now?

## Definition of done for MVP

The MVP is complete when:

- A product can be added to the cart from a static Eleventy product page.
- Snipcart can complete a test Stripe checkout.
- The Snipcart webhook can trigger a GitHub Action through Vercel.
- `_data/inventory.json` is updated and committed automatically.
- The resulting Git commit triggers a Vercel rebuild.
- The purchased product page changes to sold or decrements edition availability.
- Duplicate webhook delivery does not double-decrement inventory.
- `npm run build` succeeds after the inventory update.
