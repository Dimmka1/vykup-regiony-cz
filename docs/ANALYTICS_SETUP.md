# Analytics Setup (GTM)

## Goal

Track key conversion events without sending personal data.

## Events

- `cta_click` — Hero CTA click
- `scroll_50` — User reached 50% page depth
- `lead_form_submit_success` — Lead form submitted successfully
- `lead_form_submit_error` — Lead form submission failed

## Payload fields

- `region` (e.g. "Praha")
- `form_name` (lead_form)
- `cta_location` (hero)
- `page` (home)

## GTM steps

1. Create GTM container and install script in production shell.
2. Create GA4 Event tags for each event above.
3. Use Custom Event triggers with exact event names.
4. Publish and validate in GTM Preview + GA4 DebugView.

## Privacy

- No name/phone/address/email is sent in event payloads.
- Event tracking is behavioral only.
