# PPC Launch Plan — Google Ads + Sklik

> Проект: vykoupim-nemovitost.cz | Дата: 2026-03-03
> Landing: /ppc (stripped-down конверсионная страница)
> Tracking: UTM, DNI call tracking, form step tracking, lead scoring, GA4, Meta Pixel, Google Ads tag, Sklik retargeting

---

## 1. Google Ads — Campaign Structure

### 1.1 Search — Non-Brand (основной трафик)

**Campaign: `GS_NonBrand_Vykup`**

| Ad Group                 | Match Types                                               | Landing                                                                        |
| ------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| AG_Vykup_Praha           | výkup nemovitosti praha, výkup bytu praha                 | /ppc?region=praha&utm_source=google&utm_medium=cpc&utm_campaign=nonbrand_vykup |
| AG_Vykup_Brno            | výkup nemovitosti brno, výkup bytu brno                   | /ppc?region=brno&...                                                           |
| AG_Vykup_Ostrava         | výkup nemovitosti ostrava                                 | /ppc?region=ostrava&...                                                        |
| AG_Vykup_Plzen           | výkup nemovitosti plzeň                                   | /ppc?region=plzen&...                                                          |
| AG_Vykup_Liberec         | výkup nemovitosti liberec                                 | /ppc?region=liberec&...                                                        |
| AG_ProdejRychle_Praha    | prodej bytu rychle praha, rychlý prodej nemovitosti praha | /ppc?region=praha&...                                                          |
| AG_ProdejRychle_Brno     | prodej bytu rychle brno                                   | /ppc?region=brno&...                                                           |
| AG_ProdejRychle_Ostrava  | prodej bytu rychle ostrava                                | /ppc?region=ostrava&...                                                        |
| AG_ProdejRychle_Plzen    | prodej bytu rychle plzeň                                  | /ppc?region=plzen&...                                                          |
| AG_ProdejRychle_Liberec  | prodej bytu rychle liberec                                | /ppc?region=liberec&...                                                        |
| AG_Exekuce_Praha         | výkup při exekuci praha, prodej nemovitosti exekuce       | /ppc?region=praha&...                                                          |
| AG_Exekuce_Brno          | výkup při exekuci brno                                    | /ppc?region=brno&...                                                           |
| AG_Exekuce_Ostrava       | výkup při exekuci ostrava                                 | /ppc?region=ostrava&...                                                        |
| AG_Exekuce_Plzen         | výkup při exekuci plzeň                                   | /ppc?region=plzen&...                                                          |
| AG_Exekuce_Liberec       | výkup při exekuci liberec                                 | /ppc?region=liberec&...                                                        |
| AG_OkamzityVykup_Praha   | okamžitý výkup domu praha, rychlý výkup domu              | /ppc?region=praha&...                                                          |
| AG_OkamzityVykup_Brno    | okamžitý výkup domu brno                                  | /ppc?region=brno&...                                                           |
| AG_OkamzityVykup_Ostrava | okamžitý výkup domu ostrava                               | /ppc?region=ostrava&...                                                        |
| AG_OkamzityVykup_Plzen   | okamžitý výkup domu plzeň                                 | /ppc?region=plzen&...                                                          |
| AG_OkamzityVykup_Liberec | okamžitý výkup domu liberec                               | /ppc?region=liberec&...                                                        |

**Celkem: 20 ad groups** (5 regionů × 4 intent types)

#### Keywords per Ad Group (příklad AG_Vykup_Praha)

```
[výkup nemovitosti praha]          — exact
"výkup nemovitosti praha"          — phrase
[výkup bytu praha]                 — exact
"prodej nemovitosti výkup praha"   — phrase
[vykup nemovitosti praha]          — exact (bez diakritiky)
```

### 1.2 Search — Brand

**Campaign: `GS_Brand`**

| Ad Group       | Keywords                                                               |
| -------------- | ---------------------------------------------------------------------- |
| AG_Brand_Exact | [vykoupim nemovitost], [vykoupím nemovitost], [vykoupim-nemovitost.cz] |
| AG_Brand_Broad | "vykoupím nemovitost cz", "vykoupim nemovitost recenze"                |

Bid strategy: Target Impression Share (top of page, 95%+). Бренд нужно защищать от конкурентов.

### 1.3 Remarketing

**Campaign: `GD_Remarketing`** (Display)

| Ad Group              | Audience                                | Format                 |
| --------------------- | --------------------------------------- | ---------------------- |
| AG_Remarket_Visitors  | All /ppc visitors, last 30 days         | Responsive Display Ads |
| AG_Remarket_FormStart | Started form but didn't submit, 14 days | Responsive Display Ads |

**Campaign: `GS_RLSA`** (Search remarketing)

| Ad Group        | Audience                              | Bid Adj  |
| --------------- | ------------------------------------- | -------- |
| AG_RLSA_Generic | Past visitors searching generic terms | +50% bid |

---

## 2. Sklik (Seznam.cz) — Campaign Structure

### 2.1 Specifics для чешского рынка

- **Seznam.cz = ~25-30% search market share** в ЧР (desktop больше, mobile меньше)
- CPC обычно **на 20-40% ниже** чем Google Ads
- Sklik поддерживает **phrase match** и **broad match modifier** (аналог Google)
- **Firmy.cz** (Seznam бизнес-каталог) — отдельный канал, уже есть таск VR-124
- Retargeting через **Sklik Retargeting pixel** (уже установлен)

### 2.2 Search Campaigns

**Campaign: `SK_Vykup_Regiony`** (аналог GS_NonBrand)

Структура 1:1 с Google Ads — те же 20 ad groups:

| Ad Group               | Keywords                                                |
| ---------------------- | ------------------------------------------------------- |
| SK_Vykup_Praha         | [výkup nemovitosti praha], "výkup bytu praha"           |
| SK_ProdejRychle_Praha  | [prodej bytu rychle praha], "rychlý prodej nemovitosti" |
| SK_Exekuce_Praha       | [výkup při exekuci praha]                               |
| SK_OkamzityVykup_Praha | [okamžitý výkup domu praha]                             |
| ...                    | (все 20 AG аналогично Google)                           |

**Campaign: `SK_Brand`**

| Ad Group | Keywords                                                            |
| -------- | ------------------------------------------------------------------- |
| SK_Brand | [vykoupim nemovitost], [vykoupím nemovitost], "vykoupim nemovitost" |

### 2.3 Sklik Remarketing

**Campaign: `SK_Remarketing`**

| Ad Group                  | Audience                             |
| ------------------------- | ------------------------------------ |
| SK_Remarket_All           | All visitors, 30 days                |
| SK_Remarket_FormAbandoned | Form started, not submitted, 14 days |

---

## 3. Keyword Groups (20 Ad Groups Detail)

### 3.1 Intent Type: Výkup nemovitosti {region}

| #   | Ad Group      | Primary Keywords                                                                     |
| --- | ------------- | ------------------------------------------------------------------------------------ |
| 1   | Vykup_Praha   | výkup nemovitosti praha, výkup bytu praha, výkup domu praha, odkup nemovitosti praha |
| 2   | Vykup_Brno    | výkup nemovitosti brno, výkup bytu brno, odkup bytu brno                             |
| 3   | Vykup_Ostrava | výkup nemovitosti ostrava, výkup bytu ostrava                                        |
| 4   | Vykup_Plzen   | výkup nemovitosti plzeň, výkup bytu plzeň                                            |
| 5   | Vykup_Liberec | výkup nemovitosti liberec, výkup domu liberec                                        |

### 3.2 Intent Type: Prodej bytu rychle {region}

| #   | Ad Group             | Primary Keywords                                                                   |
| --- | -------------------- | ---------------------------------------------------------------------------------- |
| 6   | ProdejRychle_Praha   | prodej bytu rychle praha, rychlý prodej nemovitosti praha, prodat byt rychle praha |
| 7   | ProdejRychle_Brno    | prodej bytu rychle brno, rychlý prodej bytu brno                                   |
| 8   | ProdejRychle_Ostrava | prodej bytu rychle ostrava, prodat nemovitost rychle ostrava                       |
| 9   | ProdejRychle_Plzen   | prodej bytu rychle plzeň, rychlý prodej plzeň                                      |
| 10  | ProdejRychle_Liberec | prodej bytu rychle liberec, rychlý prodej liberec                                  |

### 3.3 Intent Type: Výkup při exekuci {region}

| #   | Ad Group        | Primary Keywords                                                               |
| --- | --------------- | ------------------------------------------------------------------------------ |
| 11  | Exekuce_Praha   | výkup při exekuci praha, prodej nemovitosti v exekuci praha, exekuce byt praha |
| 12  | Exekuce_Brno    | výkup při exekuci brno, prodej bytu exekuce brno                               |
| 13  | Exekuce_Ostrava | výkup při exekuci ostrava, nemovitost v exekuci ostrava                        |
| 14  | Exekuce_Plzen   | výkup při exekuci plzeň, exekuce nemovitost plzeň                              |
| 15  | Exekuce_Liberec | výkup při exekuci liberec, exekuce byt liberec                                 |

### 3.4 Intent Type: Okamžitý výkup domu {region}

| #   | Ad Group              | Primary Keywords                                                               |
| --- | --------------------- | ------------------------------------------------------------------------------ |
| 16  | OkamzityVykup_Praha   | okamžitý výkup domu praha, rychlý výkup domu praha, výkup domu za hotové praha |
| 17  | OkamzityVykup_Brno    | okamžitý výkup domu brno, výkup domu za hotové brno                            |
| 18  | OkamzityVykup_Ostrava | okamžitý výkup domu ostrava, rychlý výkup domu ostrava                         |
| 19  | OkamzityVykup_Plzen   | okamžitý výkup domu plzeň, výkup domu za hotové plzeň                          |
| 20  | OkamzityVykup_Liberec | okamžitý výkup domu liberec, rychlý výkup domu liberec                         |

---

## 4. Ad Copy — Responsive Search Ads (3 варианта)

### Varianta A — "Rychlost" focus

**Headlines (15):**

1. Výkup Nemovitosti {Region}
2. Peníze Do 24 Hodin
3. Záloha Až 500 000 Kč
4. Bez Provize a Poplatků
5. Nabídka Do 24 Hodin Zdarma
6. Vykoupíme Váš Byt Rychle
7. Prodejte Nemovitost Bez Starostí
8. Výkup Bytů a Domů {Region}
9. Férová Cena - Rychlé Jednání
10. Řešíme i Exekuce a Dluhy
11. Diskrétní a Profesionální Přístup
12. Žádné Opravy - Kupujeme Jak Je
13. Zavolejte - Poradíme Zdarma
14. 100% Garance Výkupu
15. Nejrychlejší Výkup v {Region}

**Descriptions (4):**

1. Vykoupíme vaši nemovitost v {region} rychle a bez provize. Nabídku dostanete do 24 hodin. Záloha až 500 000 Kč ihned.
2. Potřebujete prodat byt nebo dům rychle? Vykoupíme za férovou cenu bez realitky. Vyřídíme vše za vás včetně právního servisu.
3. Výkup nemovitostí v {region} - bez provize, bez oprav, bez čekání. Peníze na účtu do 24 hodin od podpisu smlouvy.
4. Řešíme výkup při exekuci, dědictví i rozvodu. Diskrétní jednání, férové podmínky. Zavolejte pro nezávaznou konzultaci.

### Varianta B — "Bez starostí" focus

**Headlines (15):**

1. Prodejte Nemovitost v {Region}
2. Vyřídíme Vše Za Vás
3. Bez Realitky - Bez Provize
4. Peníze Ihned Na Účet
5. Kupujeme Byty a Domy {Region}
6. Nezávazná Nabídka Zdarma
7. Výkup Bez Oprav a Úklidu
8. Záloha Až 500 000 Kč
9. Právní Servis V Ceně
10. Řešení Do 7 Dnů
11. Výkup Při Exekuci {Region}
12. Férová Cena Bez Skrytých Poplatků
13. Prodejte Byt Bez Prohlídek
14. Bezpečný Výkup S Garancí
15. Volejte +420 776 424 145

**Descriptions (4):**

1. Nechcete řešit realitku, prohlídky a opravy? Vykoupíme vaši nemovitost v {region} jak stojí a leží. Záloha ihned po dohodě.
2. Prodej nemovitosti bez stresu. Žádná provize, žádné skryté poplatky. Nabídku s cenou obdržíte do 24 hodin od kontaktování.
3. Specializujeme se na rychlý výkup bytů a domů v {region}. Právní servis zajistíme. Peníze do 24h od podpisu.
4. Exekuce, dědictví, rozvod? Poradíme si s každou situací. Diskrétní a profesionální přístup. Nezávazná konzultace zdarma.

### Varianta C — "Exekuce/urgence" focus

**Headlines (15):**

1. Nemovitost v Exekuci? Pomůžeme
2. Rychlý Výkup {Region}
3. Záloha 500 000 Kč Ihned
4. Zbavte Se Dluhů Prodejem
5. Diskrétní Výkup Nemovitostí
6. Peníze Do 24 Hodin
7. Bez Provize - Bez Poplatků
8. Řešíme Složité Situace
9. Výkup Při Dědictví {Region}
10. Výkup Při Rozvodu {Region}
11. Férový Výkup Za Hotové
12. Volejte Nonstop - Poradíme
13. Kupujeme Byty i Domy
14. Nabídka Zdarma Do 24h
15. Spolehlivý Partner v {Region}

**Descriptions (4):**

1. Nemovitost v exekuci nebo s dluhy? Vykoupíme rychle a diskrétně. Záloha až 500 000 Kč ihned. Pomůžeme vyřešit vaši situaci.
2. Rychlý výkup nemovitostí v {region} při exekuci, dědictví nebo rozvodu. Bez provize, bez zbytečného čekání. Volejte ještě dnes.
3. Potřebujete peníze rychle? Vykoupíme váš byt nebo dům v {region} za férovou cenu. Právní servis a veškeré náklady hradíme my.
4. Specializujeme se na výkup nemovitostí ve složitých situacích. Exekuce, spoluvlastnictví, věcná břemena. Diskrétní přístup garantován.

---

## 5. Budget & Bid Strategy

### 5.1 Měsíční rozpočet

| Tier           | Google Ads | Sklik     | Celkem/měsíc              | Poznámka                                       |
| -------------- | ---------- | --------- | ------------------------- | ---------------------------------------------- |
| **Starter**    | 15 000 Kč  | 8 000 Kč  | **23 000 Kč** (~920 €)    | 5 regionů, omezené AG, testovací fáze          |
| **Growth**     | 35 000 Kč  | 18 000 Kč | **53 000 Kč** (~2 120 €)  | Všech 5 regionů, všechny intent types          |
| **Aggressive** | 80 000 Kč  | 40 000 Kč | **120 000 Kč** (~4 800 €) | 5+ regionů, broad match expansion, remarketing |

### 5.2 Bid Strategy — Doporučení

| Fáze                         | Google Ads           | Sklik                   | Doba                             |
| ---------------------------- | -------------------- | ----------------------- | -------------------------------- |
| **Launch (1-2 týdny)**       | Manual CPC           | Manual CPC              | Sbíráme data, testujeme keywords |
| **Optimalizace (3-6 týdnů)** | Maximize Conversions | eCPC                    | Min. 15-30 konverzí za 30 dnů    |
| **Scale (7+ týdnů)**         | Target CPA           | eCPC / budget optimizer | Stabilní CPA, škálování budgetu  |

**Target CPA benchmark:** 800-2 500 Kč za lead (CZ real estate výkup je high-value, margin na deal 50-200K Kč)

### 5.3 Expected CPC Ranges (CZ real estate)

| Keyword Type               | Google Ads CPC | Sklik CPC |
| -------------------------- | -------------- | --------- |
| Brand                      | 2-8 Kč         | 1-5 Kč    |
| Výkup nemovitosti + region | 25-65 Kč       | 15-40 Kč  |
| Prodej rychle + region     | 20-50 Kč       | 12-35 Kč  |
| Exekuce + region           | 15-40 Kč       | 10-25 Kč  |
| Okamžitý výkup             | 30-70 Kč       | 18-45 Kč  |
| Remarketing (display)      | 3-10 Kč        | 2-8 Kč    |

**Poznámka:** CPC v Praze je ~2x vyšší než v menších regionech. Ostrava a Liberec jsou nejlevnější.

---

## 6. Negative Keywords (32 slov)

### Sdílený seznam pro všechny kampaně

```
pronájem
pronájem bytu
pronájem domu
podnájem
novostavba
novostavby
developerský projekt
developer
hypotéka
hypoteční kalkulačka
hypotéka kalkulačka
úvěr na bydlení
stavební spoření
realitní kancelář
sreality
bezrealitky
reality idnes
realitní makléř
jak prodat nemovitost
prodat nemovitost postup
daň z prodeje nemovitosti
odhad ceny nemovitosti online
katastr nemovitostí
katastrální mapa
geometrický plán
stavební povolení
rekonstrukce
zateplení
bazar
inzerát zdarma
pronájem kanceláře
garážové stání
```

### Negative keywords specifické pro Exekuce AG

```
exekuční řízení postup
exekutor kontakt
exekuce na plat
oddlužení kalkulačka
insolvence postup
osobní bankrot
```

---

## 7. Tracking & Conversion Setup

### Conversion Actions (už implementováno)

| Event                         | Typ                | Priorita |
| ----------------------------- | ------------------ | -------- |
| `form_submit` (lead form)     | Primary conversion | P0       |
| `form_step_1/2/3`             | Micro-conversion   | P1       |
| `phone_click` (click-to-call) | Primary conversion | P0       |
| `callback_request`            | Primary conversion | P0       |
| `lead_magnet_download`        | Micro-conversion   | P2       |

### UTM Convention

```
utm_source=google|sklik
utm_medium=cpc
utm_campaign={campaign_name}
utm_content={ad_group}
utm_term={keyword}
```

### DNI (Dynamic Number Insertion)

- Google Ads → tracking číslo A
- Sklik → tracking číslo B
- Organic → default číslo
- Konfigurace přes env vars (VR-126 done)

---

## 8. Launch Checklist

- [ ] Google Ads account setup + billing
- [ ] Sklik account setup + billing
- [ ] Import campaign structure (20 AG x 2 platforms)
- [ ] Upload ad copy (3 varianty RSA)
- [ ] Set negative keywords (shared list)
- [ ] Configure conversion tracking (Google Ads conversion tag -> form_submit + phone_click)
- [ ] Configure Sklik conversion tracking
- [ ] Verify /ppc landing loads correctly s UTM params
- [ ] Test DNI phone switching per source
- [ ] Test lead flow: form -> Google Sheets -> Telegram notification
- [ ] Set daily budget caps (prevent overspend in first week)
- [ ] Enable ad extensions: sitelinks, callouts, structured snippets, call extension
- [ ] Launch with Starter budget, manual CPC
- [ ] Daily monitoring first 2 weeks -> optimize search terms, pause low performers

---

## 9. Ad Extensions (Rozšíření reklam)

### Google Ads

| Typ                     | Obsah                                                          |
| ----------------------- | -------------------------------------------------------------- |
| **Sitelinks**           | Jak to funguje, Garance výkupu, Reference klientů, Kontakt     |
| **Callouts**            | Bez provize, Peníze do 24h, Záloha ihned, Právní servis v ceně |
| **Structured snippets** | Typy: Byty, Domy, Pozemky, Nemovitosti v exekuci               |
| **Call extension**      | +420 776 424 145                                               |
| **Location**            | (po nastavení Google Business Profile)                         |

### Sklik

| Typ               | Obsah                                        |
| ----------------- | -------------------------------------------- |
| **Rychlé odkazy** | Jak to funguje, Garance, Reference, Kontakt  |
| **Popisky**       | Bez provize, Peníze ihned, Záloha 500 000 Kč |

---

_Dokument připraven: 2026-03-03 | Agent: Growth_
