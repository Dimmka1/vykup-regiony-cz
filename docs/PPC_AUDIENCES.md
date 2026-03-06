# PPC Retargeting Audiences — dataLayer Events

## Events Overview

| Event                  | Trigger                                          | dataLayer example                                             |
| ---------------------- | ------------------------------------------------ | ------------------------------------------------------------- |
| `calculator_completed` | User enters a price in the comparison calculator | `{ event: "calculator_completed", price: 3000000 }`           |
| `form_step_1`          | Form step 1 displayed (property type)            | `{ event: "form_step_1", region: "brno" }`                    |
| `form_step_2`          | User proceeds to step 2 (address)                | `{ event: "form_step_2", region: "brno" }`                    |
| `form_step_3`          | User proceeds to step 3 (contact)                | `{ event: "form_step_3", region: "brno" }`                    |
| `form_submitted`       | Form successfully submitted                      | `{ event: "form_submitted", region: "brno" }`                 |
| `high_value_visitor`   | ≥3 pageviews (session) OR >2 min on site         | `{ event: "high_value_visitor", trigger: "pages", pages: 3 }` |
| `return_visitor`       | User has visited before (localStorage flag)      | `{ event: "return_visitor" }`                                 |
| `blog_reader`          | Scrolled >50% on a blog article                  | `{ event: "blog_reader", slug: "jake-dokumenty" }`            |

## Google Ads — Audience Setup

### Prerequisites

- GTM container firing on the site
- GA4 connected to Google Ads

### Creating Audiences in Google Ads

1. Go to **Tools & Settings → Shared Library → Audience Manager**
2. Click **+ New Audience** → **Website visitors**
3. For each segment below, create a custom audience:

| Audience Name                | Rule                                                                  |
| ---------------------------- | --------------------------------------------------------------------- |
| Calculator Users             | Event = `calculator_completed`                                        |
| Form Started (not submitted) | Event = `form_step_1` AND NOT Event = `form_submitted` (last 30 days) |
| Form Abandoners Step 2       | Event = `form_step_2` AND NOT Event = `form_submitted`                |
| Form Abandoners Step 3       | Event = `form_step_3` AND NOT Event = `form_submitted`                |
| Converters                   | Event = `form_submitted`                                              |
| High Value Visitors          | Event = `high_value_visitor`                                          |
| Return Visitors              | Event = `return_visitor`                                              |
| Blog Readers                 | Event = `blog_reader`                                                 |

### Recommended Campaigns

- **Form abandoners** → Search/Display remarketing with urgency messaging
- **Calculator users (not converted)** → Display ads with specific offer
- **High value + return visitors** → Higher bid adjustments
- **Blog readers** → Content-focused display ads
- **Converters** → Exclude from acquisition campaigns, use for lookalikes

## Sklik (Seznam) — Audience Setup

### Prerequisites

- Sklik retargeting pixel installed via GTM
- Retargeting code ID from Sklik admin

### Creating Audiences in Sklik

1. Go to **Nástroje → Retargeting → Seznamy**
2. Click **Nový seznam**
3. Choose **Vlastní pravidlo**

| Audience Name        | URL/Event Rule                                                                  |
| -------------------- | ------------------------------------------------------------------------------- |
| Kalkulačka           | dataLayer event `calculator_completed` (use GTM trigger → Sklik audience pixel) |
| Formulář zahájený    | dataLayer event `form_step_1` (exclude `form_submitted`)                        |
| Formulář odeslaný    | dataLayer event `form_submitted`                                                |
| Hodnotní návštěvníci | dataLayer event `high_value_visitor`                                            |
| Vracející se         | dataLayer event `return_visitor`                                                |
| Čtenáři blogu        | dataLayer event `blog_reader`                                                   |

### GTM Integration for Sklik

For each dataLayer event, create a **GTM trigger** (Custom Event) and a corresponding **tag** that fires the Sklik retargeting pixel with the audience list ID. Example:

1. **Trigger:** Custom Event → Event name = `calculator_completed`
2. **Tag:** Custom HTML → Sklik conversion/retargeting pixel with list ID
3. Repeat for each event

## Testing

1. Open browser DevTools → Console
2. Type `dataLayer` to inspect all pushed events
3. Use GTM Preview mode to verify triggers fire correctly
4. Check Google Ads / Sklik audience lists populate within 24–48h
