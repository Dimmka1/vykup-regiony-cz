# Deal Conversion Funnel Playbook

> SOP для каждого этапа lead → deal pipeline  
> Проект: vykoupim-nemovitost.cz | Телефон: +420 776 424 145  
> Последнее обновление: 2026-03-10

---

## Содержание

1. [Pipeline Overview](#1-pipeline-overview)
2. [Stage 1: Speed-to-Contact](#2-stage-1-speed-to-contact)
3. [Stage 2: Kvalifikace leadu](#3-stage-2-kvalifikace-leadu)
4. [Stage 3: Nabídka (Offer Presentation)](#4-stage-3-nabídka)
5. [Stage 4: Jednání + Objection Handling](#5-stage-4-jednání--objection-handling)
6. [Stage 5: Closing](#6-stage-5-closing)
7. [Follow-up Sequence Day 0→14](#7-follow-up-sequence-day-014)
8. [5 Objection Handling Scripts (CZ)](#8-objection-handling-scripts)
9. [Offer Presentation Template (Email)](#9-offer-presentation-template)
10. [Google Sheets Deal Pipeline Template](#10-google-sheets-deal-pipeline-template)
11. [Telegram Alert Templates](#11-telegram-alert-templates)
12. [Deal Lost Reasons Tracking](#12-deal-lost-reasons-tracking)
13. [KPIs & Metrics](#13-kpis--metrics)

---

## 1. Pipeline Overview

```
Lead In → Speed-to-Contact → Kvalifikace → Nabídka → Jednání → Closing → Deal Won
  │              │                │            │          │          │
  │         <5 min           Qual Score    Email/PDF   Objections  Smlouva
  │                          (0-100)       + Call      Handling    + Záloha
  │
  └─→ [Deal Lost] → Reason tracked → Nurture sequence
```

**Конверсионные бенчмарки (target):**

| Stage           | Metric           | Target  |
| --------------- | ---------------- | ------- |
| Lead → Contact  | Speed-to-contact | < 5 min |
| Lead → Contact  | Contact rate     | ≥ 80%   |
| Contact → Offer | Offer rate       | ≥ 60%   |
| Offer → Deal    | Close rate       | ≥ 25%   |
| End-to-end      | Lead → Deal      | ≥ 12%   |

---

## 2. Stage 1: Speed-to-Contact

### SOP: Первый контакт

**Benchmark: < 5 минут после получения лида.**

Исследования показывают: шансы на конверсию падают на 80% после 5 минут. В výkup nemovitostí клиент часто отправляет форму 3-5 конкурентам одновременно. Кто позвонит первым — тот выигрывает.

#### Процесс:

1. **0-1 мин:** Telegram notification приходит (автоматически через /api/leads)
2. **1-2 мин:** Открыть Google Sheets → вкладка "Deal Pipeline" → найти лид
3. **2-3 мин:** Оценить lead score (автоматически рассчитан в Sheets)
4. **3-5 мин:** ПОЗВОНИТЬ клиенту

#### Скрипт первого звонка (CZ):

```
"Dobrý den, tady [jméno] z vykoupim-nemovitost.cz.
Volám ohledně Vaší poptávky na výkup nemovitosti v [region].
Děkuji, že jste nás kontaktoval/a — rád/a bych Vám pomohl/a
co nejrychleji. Mohl/a byste mi říct víc o Vaší situaci?"
```

#### Pokud klient neodpovídá (nedostupný):

- Nechat SMS: viz Follow-up Day 0 template
- Zavolat znovu za 30 min
- Zavolat znovu za 2h
- Po 3 neúspěšných pokusech → přejít na email/SMS follow-up sérii

#### Telegram alert при > 5 min bez odpovědi:

Автоматический alert (VR-222) отправляется если лид не обработан за 5 мин.

---

## 3. Stage 2: Kvalifikace leadu

### Kvalifikační checklist (во время первого звонка):

| #   | Otázka                                                                 | Proč ptáme                |
| --- | ---------------------------------------------------------------------- | ------------------------- |
| 1   | Jaký typ nemovitosti prodáváte? (byt/dům/pozemek)                      | Определить категорию      |
| 2   | Kde se nemovitost nachází? (město, ulice)                              | Región + odhad ceny       |
| 3   | Jaká je rozloha? (m²)                                                  | Kalkulace nabídky         |
| 4   | V jakém je stavu? (po rekonstrukci / původní / k demolici)             | Koeficient stavu          |
| 5   | Jsou na nemovitosti nějaké závazky? (hypotéka, exekuce, věcné břemeno) | Právní risk               |
| 6   | Do kdy potřebujete prodat? (urgence)                                   | Prioritizace              |
| 7   | Máte představu o ceně?                                                 | Anchor price              |
| 8   | Proč zvažujete rychlý výkup?                                           | Motivace = objection prep |

### Lead Scoring (автоматический + ручной):

**Автоматический score** (рассчитан в /api/leads, 0-100):

- Typ nemovitosti: byt (30), dům (25), pozemek (15)
- Kontaktní údaje: telefon+email (20), jen telefon (15), jen email (10)
- Urgence (если указана): vysoká (20), střední (10)
- Region: Praha (20), Brno (15), ostatní (10)

**Ручная квалификация** (добавить в Sheets после звонка):

- A (Hot): urgence < 1 měsíc, jasná motivace, bez komplikací → 80-100
- B (Warm): urgence 1-3 měsíce, zvažuje možnosti → 50-79
- C (Cold): jen zjišťuje, nemá urgenci → 20-49
- D (Disqualified): nesplňuje kritéria (mimo region, nereálná očekávání) → 0-19

---

## 4. Stage 3: Nabídka

### SOP: Příprava nabídky

**Timeline: nabídka do 24h po kvalifikaci (ideálně do 4h)**

1. Zjistit tržní cenu (Sreality, cenová mapa, PRICE_RESEARCH.json)
2. Aplikovat výkupní koeficient (70-80% tržní ceny)
3. Zohlednit stav, závazky, urgenci
4. Připravit email s nabídkou (viz template níže)
5. ZAVOLAT klientovi → projít nabídku telefonicky
6. Následně poslat email jako písemné potvrzení

### Pricing Formula:

```
Výkupní cena = Tržní cena × Koeficient stavu × Výkupní discount

Koeficient stavu:
- Po rekonstrukci: 1.0
- Dobrý stav: 0.9
- Původní stav: 0.8
- K rekonstrukci: 0.7
- K demolici: 0.5

Výkupní discount: 0.70 - 0.80 (dle urgence a komplikací)
- Bez komplikací: 0.80
- Exekuce/hypotéka: 0.75
- Více závazků: 0.70
```

---

## 5. Stage 4: Jednání + Objection Handling

### Pravidla vyjednávání:

1. **Nikdy nezvyšovat nabídku při prvním "ne"** — nejdřív pochopit důvod
2. **Vždy ptát se, ne obhajovat** — "Co byste považoval/a za férovou cenu?"
3. **Zdůraznit rychlost a jistotu** — "U nás máte peníze na účtu do 48h, u realitky čekáte 6-12 měsíců"
4. **Maximální cenový strop:** 85% tržní ceny (schvaluje owner)
5. **Vždy nabídnout zpětný nájem** jako alternativu ke zvýšení ceny

### Eskalační matice:

| Situace                        | Akce                         |
| ------------------------------ | ---------------------------- |
| Klient chce > 85% tržní ceny   | Eskalace na owner            |
| Exekuce / právní komplikace    | Konzultace s právníkem       |
| Klient chce čas na rozmyšlenou | Follow-up cadence (viz níže) |
| Konkurenční nabídka            | Objection script #3          |

---

## 6. Stage 5: Closing

### SOP: Uzavření obchodu

1. **Dohoda na ceně** → ústní potvrzení po telefonu
2. **Záloha** → převod zálohy (výše dle dohody, typicky 50-100K Kč)
3. **Smlouva** → advokátní úschova, kupní smlouva
4. **Podpis** → osobní schůzka nebo ověřené podpisy
5. **Katastr** → podání na katastr nemovitostí
6. **Doplatek** → po zápisu v katastru

### Telegram notifikace:

Při každé změně stavu → automatická Telegram notifikace (viz templates níže).

---

## 7. Follow-up Sequence Day 0→14

### Cadence po odeslání nabídky:

| Den                          | Kanál                 | Akce                                                    | Template            |
| ---------------------------- | --------------------- | ------------------------------------------------------- | ------------------- |
| **Day 0** (instant)          | 📞 Telefon + 📧 Email | Zavolat + poslat nabídku emailem                        | Viz Offer Template  |
| **Day 0** (+30 min)          | 💬 SMS                | Potvrzení odeslání nabídky                              | SMS Template 1      |
| **Day 1**                    | 📞 Telefon            | Follow-up call: "Měl/a jste čas se podívat na nabídku?" | Call Script 1       |
| **Day 1** (pokud nedostupný) | 💬 SMS                | Krátká zpráva                                           | SMS Template 2      |
| **Day 3**                    | 📧 Email              | Value-add: case study z regionu                         | Email Template 2    |
| **Day 3**                    | 💬 WhatsApp           | Osobní zpráva                                           | WhatsApp Template 1 |
| **Day 7**                    | 📞 Telefon            | Soft push: "Stále máme pro Vás rezervovanou nabídku"    | Call Script 2       |
| **Day 7** (pokud nedostupný) | 📧 Email              | Urgency: nabídka platí do [datum]                       | Email Template 3    |
| **Day 14**                   | 📞 Telefon            | Last chance: "Naše nabídka brzy vyprší"                 | Call Script 3       |
| **Day 14**                   | 📧 Email              | Finální email s omezenou platností                      | Email Template 4    |

---

### SMS Templates:

**SMS Template 1 (Day 0, +30 min po nabídce):**

```
Dobrý den, tady vykoupim-nemovitost.cz. Právě jsem Vám poslal/a
nabídku na výkup Vaší nemovitosti v [region] na email.
Pokud máte dotazy, zavolejte na +420 776 424 145. [jméno]
```

**SMS Template 2 (Day 1, pokud nedostupný):**

```
Dobrý den, snažil/a jsem se Vám dnes zavolat ohledně nabídky
na výkup v [region]. Rád/a Vám vše vysvětlím — zavolejte mi
prosím zpět na +420 776 424 145. [jméno]
```

---

### Call Scripts:

**Call Script 1 (Day 1 — follow-up):**

```
"Dobrý den, [jméno klienta], tady [jméno] z vykoupim-nemovitost.cz.
Volám ohledně nabídky, kterou jsem Vám včera poslal/a.
Měl/a jste možnost se na ni podívat?
...
Rád/a bych Vám odpověděl/a na jakékoliv dotazy."
```

**Call Script 2 (Day 7 — soft push):**

```
"Dobrý den, [jméno klienta], tady [jméno] z vykoupim-nemovitost.cz.
Chtěl/a jsem se zeptat, jak pokračují Vaše úvahy o prodeji
nemovitosti v [region]. Stále pro Vás máme rezervovanou nabídku
[částka] Kč. Je něco, co bych mohl/a udělat, aby se Vám
rozhodování usnadnilo?"
```

**Call Script 3 (Day 14 — last chance):**

```
"Dobrý den, [jméno klienta], tady [jméno] z vykoupim-nemovitost.cz.
Volám naposledy ohledně naší nabídky na Vaši nemovitost v [region].
Nabídka [částka] Kč je platná do [datum — za 3 dny].
Po tomto datu bohužel nemůžeme garantovat stejné podmínky,
protože zpracováváme další poptávky z [region].
Chcete pokračovat?"
```

---

### Email Templates:

**Email Template 2 (Day 3 — value-add):**

```
Předmět: Jak jsme pomohli klientovi z [region] — příběh výkupu

Dobrý den, [jméno klienta],

chtěl/a bych se s Vámi podělit o příběh pana/paní [X] z [region],
který/á se ocitl/a v podobné situaci jako Vy.

[Krátký case study — 3-4 věty o situaci, řešení, výsledku]

Klíčové body:
• Peníze na účtu do 48 hodin
• Celý proces trval [X] dní
• Bez provize, bez skrytých poplatků
• Advokátní úschova pro maximální bezpečnost

Vaše nabídka [částka] Kč je stále platná.
Máte-li jakékoliv dotazy, neváhejte zavolat na +420 776 424 145.

S pozdravem,
[jméno]
vykoupim-nemovitost.cz
```

**Email Template 3 (Day 7 — urgency):**

```
Předmět: Vaše nabídka na výkup v [region] — platnost do [datum]

Dobrý den, [jméno klienta],

rád/a bych Vás informoval/a, že naše nabídka [částka] Kč
za Vaši nemovitost v [region] je platná do [datum].

Proč neváhat:
✅ Záloha [částka zálohy] Kč ihned po podpisu
✅ Celková částka na účtu do 48 hodin
✅ Bez provize, bez starostí s realitkou
✅ Advokátní úschova = 100% bezpečnost

Pokud máte zájem pokračovat, stačí odpovědět na tento email
nebo zavolat na +420 776 424 145.

S pozdravem,
[jméno]
vykoupim-nemovitost.cz
```

**Email Template 4 (Day 14 — last chance):**

```
Předmět: Poslední možnost: nabídka [částka] Kč za nemovitost v [region]

Dobrý den, [jméno klienta],

toto je poslední připomínka ohledně naší nabídky na výkup Vaší
nemovitosti v [region].

Nabídka [částka] Kč je platná do [datum — za 3 dny].

Po tomto datu bohužel nemůžeme garantovat stejné podmínky —
zpracováváme nové poptávky a naše kapacita je omezená.

Pokud se rozhodnete pokračovat, stačí:
📞 Zavolat: +420 776 424 145
📧 Odpovědět na tento email

Děkuji za Váš čas a přeji hodně štěstí s prodejem.

S pozdravem,
[jméno]
vykoupim-nemovitost.cz
```

---

## 8. Objection Handling Scripts

### Námitka 1: "Cena je nízká"

**Kontext:** Nejčastější námitka. Klient srovnává s tržní cenou na Sreality.

```
KLIENT: "Ta cena je nízká, na Sreality vidím podobné byty za mnohem víc."

ODPOVĚĎ:
"Rozumím Vám, [jméno]. Ceny na Sreality jsou inzerátní ceny —
ne skutečné prodejní ceny. Reálně se byty prodávají za 10-15% méně
než je inzerováno, a to po 3-6 měsících čekání.

U nás dostáváte:
• Peníze na účtu do 48 hodin — ne za půl roku
• Žádnou provizi realitce (běžně 3-5%, což u Vašeho bytu je [X] Kč)
• Žádné opravy, staging, prohlídky — kupujeme v aktuálním stavu
• Jistotu prodeje — žádné padající kupci, žádné odmítnuté hypotéky

Když to sečtete: reálná cena přes realitku minus provize, minus čas,
minus nejistota... naše nabídka je velmi konkurenceschopná.

Mohu Vám připravit podrobné srovnání — prodej přes nás vs. přes realitku?"

POKUD STÁLE NESOUHLASÍ:
"Jakou cenu byste považoval/a za přijatelnou? Rád/a se podívám,
co je v našich možnostech."

→ Max eskalace: +5-10% od původní nabídky (schvaluje owner nad 85%)
→ Alternativa: nabídnout zpětný nájem ("Prodáte za [X] a můžete dál bydlet")
```

---

### Námitka 2: "Potřebuji čas na rozmyšlenou"

**Kontext:** Klient odkládá rozhodnutí. Potřebuje jistotu, ne tlak.

```
KLIENT: "Musím si to ještě rozmyslet / probrat s rodinou."

ODPOVĚĎ:
"Samozřejmě, [jméno], rozumím — je to velké rozhodnutí.
Dovolte mi jen upřesnit pár věcí, abyste měl/a všechny informace:

1. Naše nabídka [částka] Kč je platná [7/14 dní] — po té době
   se cena může změnit kvůli tržním podmínkám.
2. Celý proces zabere jen 3-5 dní od Vašeho rozhodnutí.
3. Nic Vás k ničemu nezavazuje — podepsat můžete kdykoliv během platnosti.

Mohu Vám ještě s něčím pomoct, abyste se mohl/a lépe rozhodnout?
Například Vám mohu poslat:
• Reference od klientů z [region]
• Podrobné srovnání výkup vs. realitka
• Informace o advokátní úschově

Kdy se Vám hodí, abych zavolal/a znovu? Středa? Pátek?"

→ VŽDY domluvit konkrétní datum dalšího kontaktu
→ Zaznamenat do Sheets: follow-up datum
→ Pokračovat follow-up cadence
```

---

### Námitka 3: "Mám jinou nabídku"

**Kontext:** Klient srovnává s konkurencí. Klíč: diferenciace, ne cena.

```
KLIENT: "Mám nabídku od jiné firmy / jiný zájemce nabízí víc."

ODPOVĚĎ:
"Děkuji za upřímnost, [jméno]. Mohu se zeptat — o kolik je ta nabídka vyšší?

[POSLECHNOUT]

Rozumím. Než se rozhodnete, doporučuji porovnat nejen cenu,
ale celkové podmínky:

1. RYCHLOST: Kdy přesně slibují peníze na účtu?
   My garantujeme 48 hodin od podpisu.
2. ZÁLOHA: Nabízejí zálohu ihned?
   My vyplácíme zálohu [částka] Kč při podpisu smlouvy.
3. BEZPEČNOST: Používají advokátní úschovu?
   U nás je advokátní úschova standard — Vaše peníze jsou 100% chráněny.
4. SKRYTÉ POPLATKY: Účtují si něco navíc?
   U nás je cena finální — žádné provize, žádné poplatky.
5. REFERENCE: Mají ověřitelné reference z [region]?

Často se stává, že firmy nabídnou vyšší cenu, ale pak ji 'upraví'
po prohlídce, nebo proces trvá měsíce.

Chcete, abych Vám připravil/a písemné srovnání obou nabídek?"

→ Pokud konkurent nabízí reálně víc: eskalace na owner
→ Nabídnout bonusy: rychlejší termín, vyšší záloha, zpětný nájem
```

---

### Námitka 4: "Nevěřím online firmám"

**Kontext:** Klient má obavy z podvodu. Potřebuje důvěru a transparentnost.

```
KLIENT: "Nevěřím firmám z internetu / jak vím, že to není podvod?"

ODPOVĚĎ:
"Naprosto Vás chápu, [jméno] — opatrnost je na místě.
Dovolte mi vysvětlit, jak zajišťujeme bezpečnost:

1. ADVOKÁTNÍ ÚSCHOVA: Všechny peníze jdou přes advokátní úschovu.
   To znamená, že advokát drží peníze na svém účtu a vyplatí je
   až po splnění všech podmínek. Žádné riziko pro Vás.

2. SMLOUVA: Kupní smlouvu připravuje nezávislý advokát.
   Můžete si ji nechat zkontrolovat vlastním právníkem —
   na to máte plné právo.

3. OSOBNÍ SCHŮZKA: Rád/a se s Vámi setkám osobně v [region].
   Nejsme jen webová stránka — jsme skuteční lidé.

4. REFERENCE: Na našem webu najdete reference od klientů z [region]:
   vykoupim-nemovitost.cz/reference
   Mohu Vám také poskytnout telefonní číslo na předchozího klienta
   (s jeho souhlasem), abyste si mohl/a ověřit naše služby.

5. VEŘEJNÉ HODNOCENÍ: Najdete nás na Google s hodnocením [X] hvězd.

Chcete se sejít osobně? Mohu přijet do [region] kdykoliv tento týden."

→ VŽDY nabídnout osobní schůzku
→ Poslat link na /reference a /garance-vykupu
→ Nabídnout kontakt na referenčního klienta
```

---

### Námitka 5: "Chci to zkusit přes realitku"

**Kontext:** Klient preferuje tradiční cestu. Potřebuje srovnání.

```
KLIENT: "Myslím, že to raději zkusím přes realitní kancelář."

ODPOVĚĎ:
"Rozumím, [jméno] — je to jedna z možností.
Než se rozhodnete, dovolte mi malé srovnání:

                        REALITKA          MY (VÝKUP)
Doba prodeje:          3-12 měsíců       3-5 dní
Provize:               3-5% (= [X] Kč)  0 Kč
Jistota prodeje:       Žádná             100%
Prohlídky:             10-30+            Žádné
Opravy/staging:        Často nutné       Kupujeme jak je
Padající kupci:        Běžné             Nemůže se stát
Peníze na účtu:        Po vkladu         Do 48 hodin
                       do katastru

U Vaší nemovitosti to konkrétně znamená:
• Přes realitku: cena [tržní] minus provize [X] Kč = [Y] Kč za [3-12] měsíců
• Přes nás: [nabídka] Kč za 3-5 dní, záloha ihned

A navíc: pokud nemovitost přes realitku neprodáte za 3 měsíce,
naše nabídka pravděpodobně klesne kvůli tržním podmínkám.

Co kdybychom udělali toto: dáme Vám nabídku s platností 14 dní.
Pokud se s realitkou nedohodnete, máte jistotu, že se k nám
můžete vrátit."

→ Nechat dveře otevřené
→ Zaznamenat do Sheets: "chce realitku" + follow-up za 30 dní
→ Po 30 dnech automatický follow-up: "Jak se daří s prodejem?"
```

---

## 9. Offer Presentation Template

### Email s nabídkou (posílat VŽDY po telefonickém hovoru):

```
Předmět: Nabídka na výkup Vaší nemovitosti v [region] — [částka] Kč

Dobrý den, [jméno klienta],

děkuji za náš dnešní rozhovor. Jak jsem slíbil/a, posílám Vám
písemnou nabídku na výkup Vaší nemovitosti.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 NEMOVITOST
   Typ: [byt/dům/pozemek]
   Adresa: [adresa]
   Rozloha: [m²] m²

💰 NAŠE NABÍDKA
   Výkupní cena: [částka] Kč
   Záloha při podpisu: [záloha] Kč
   Doplatek: do 48 hodin od podpisu

⏱️ ČASOVÝ RÁMEC
   Příprava smlouvy: 1-2 dny
   Podpis + záloha: den 3
   Doplatek na účet: den 3-5

🔒 GARANCE
   ✅ Advokátní úschova
   ✅ Bez provize a skrytých poplatků
   ✅ Smlouva k nahlédnutí předem
   ✅ Možnost zpětného nájmu

📅 PLATNOST NABÍDKY
   Tato nabídka je platná do [datum +14 dní].
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Další kroky:
1. Prostudujte si nabídku
2. Pokud souhlasíte, zavolejte mi na +420 776 424 145
3. Připravíme kupní smlouvu (1-2 dny)
4. Podpis + záloha na účet

Máte-li jakékoliv dotazy, jsem Vám k dispozici:
📞 +420 776 424 145
📧 info@vykoupim-nemovitost.cz

S pozdravem,
[jméno]
vykoupim-nemovitost.cz
```

---

## 10. Google Sheets Deal Pipeline Template

### Struktura tabulky "Deal Pipeline":

#### Columns:

| Column | Název                  | Typ         | Popis                            |
| ------ | ---------------------- | ----------- | -------------------------------- |
| A      | Lead ID                | Text        | Automaticky z /api/leads (token) |
| B      | Datum příchodu         | Datum       | Kdy přišel lead                  |
| C      | Jméno                  | Text        | Jméno klienta                    |
| D      | Telefon                | Text        | Telefonní číslo                  |
| E      | Email                  | Text        | Email klienta                    |
| F      | Region                 | Text        | Z jakého regionu                 |
| G      | Typ nemovitosti        | Text        | Byt / Dům / Pozemek              |
| H      | m²                     | Číslo       | Rozloha                          |
| I      | Lead Score             | Číslo       | 0-100 (auto)                     |
| J      | Qual Grade             | Text        | A/B/C/D (ruční)                  |
| K      | **Stage**              | Dropdown    | Viz stages níže                  |
| L      | Stage Changed          | Datum       | Kdy se změnil stage              |
| M      | Speed-to-Contact       | Číslo (min) | Kolik minut do prvního kontaktu  |
| N      | Nabídka (Kč)           | Číslo       | Výše nabídky                     |
| O      | Estimated Market Value | Číslo       | Odhad tržní ceny                 |
| P      | Discount %             | Formula     | = N/O                            |
| Q      | Záloha (Kč)            | Číslo       | Výše zálohy                      |
| R      | Next Follow-up         | Datum       | Kdy volat/psát                   |
| S      | Follow-up Step         | Text        | Day 0/1/3/7/14                   |
| T      | Deal Lost Reason       | Dropdown    | Viz Lost Reasons                 |
| U      | Source                 | Text        | UTM source                       |
| V      | Campaign               | Text        | UTM campaign                     |
| W      | Notes                  | Text        | Poznámky z hovorů                |
| X      | Assigned To            | Text        | Kdo řeší                         |

#### Stages (dropdown):

| Stage               | Emoji | Popis                         |
| ------------------- | ----- | ----------------------------- |
| 📥 Nový lead        | 📥    | Právě přišel, čeká na kontakt |
| 📞 Kontaktován      | 📞    | Proběhl první kontakt         |
| ✅ Kvalifikován     | ✅    | Kvalifikační hovor dokončen   |
| 💰 Nabídka odeslána | 💰    | Nabídka připravena a odeslána |
| 🤝 Jednání          | 🤝    | Probíhá vyjednávání           |
| 📝 Smlouva          | 📝    | Příprava/podpis smlouvy       |
| 🏠 Deal Won         | 🏠    | Obchod uzavřen                |
| ❌ Deal Lost        | ❌    | Obchod neuzavřen              |
| ⏸️ On Hold          | ⏸️    | Klient chce čas               |

#### Conditional Formatting:

- Speed-to-Contact > 5 min → červené pozadí
- Stage = "Nový lead" a datum > 5 min → červené pozadí
- Qual Grade A → zelené pozadí
- Deal Won → zelený řádek
- Deal Lost → šedý řádek

#### Metriky (summary row / separate tab):

| Metrika               | Formula                                                 |
| --------------------- | ------------------------------------------------------- |
| Total Leads (měsíc)   | COUNTIF(B:B, ">="&DATE())                               |
| Contact Rate          | COUNTIF(K:K, "<>Nový lead") / COUNTA(K:K)               |
| Avg Speed-to-Contact  | AVERAGE(M:M)                                            |
| Offer Rate            | COUNTIF(K:K, "Nabídka\*") / COUNTIF(K:K, "<>Nový lead") |
| Close Rate            | COUNTIF(K:K, "Deal Won") / COUNTIF(K:K, "Nabídka\*")    |
| Avg Deal Size         | AVERAGEIF(K:K, "Deal Won", N:N)                         |
| Avg Time-to-Close     | AVERAGE(L(won) - B)                                     |
| Total Revenue (měsíc) | SUMIF(K:K, "Deal Won", N:N)                             |

---

## 11. Telegram Alert Templates

### Alert 1: Nový lead

```
🔔 NOVÝ LEAD

👤 {jméno} | 📞 {telefon}
📍 {region} | 🏠 {typ}
📊 Score: {score}/100
🔗 Zdroj: {utm_source}

⏱️ TIMER: Zavolej do 5 minut!
```

### Alert 2: Stage change

```
📋 STAGE CHANGE

👤 {jméno} ({region})
{old_stage} → {new_stage}
📅 {datum} {čas}

{komentář_pokud_je}
```

### Alert 3: Nabídka odeslána

```
💰 NABÍDKA ODESLÁNA

👤 {jméno} | 📍 {region}
🏠 {typ} | {m²} m²
💵 Nabídka: {částka} Kč
📊 Market value: {tržní} Kč ({discount}%)
📅 Platnost do: {datum}

Next: Follow-up Day 1 ({zítra})
```

### Alert 4: Deal Won 🎉

```
🎉 DEAL WON!

👤 {jméno} | 📍 {region}
🏠 {typ} | {m²} m²
💵 Cena: {částka} Kč
⏱️ Lead-to-Close: {dní} dní
📊 Source: {utm_source} / {utm_campaign}

🏆 Total deals this month: {count}
💰 Total revenue: {sum} Kč
```

### Alert 5: Deal Lost

```
❌ DEAL LOST

👤 {jméno} | 📍 {region}
🏠 {typ} | 💵 Nabídka: {частка} Kč
📉 Důvod: {reason}
📅 Pipeline days: {dní}

💡 Notes: {poznámky}
```

### Alert 6: Speed-to-Contact SLA Breach

```
🚨 SLA BREACH: > 5 MIN BEZ KONTAKTU

👤 {jméno} | 📞 {telefon}
📍 {region} | 📊 Score: {score}
⏱️ Čeká: {minut} minut

ZAVOLEJ TEĎ: +{telefon_klienta}
```

### Alert 7: Follow-up Due

```
📅 FOLLOW-UP DUE

👤 {jméno} | 📍 {region}
📋 Stage: {stage}
🔄 Follow-up: Day {den}
📞 Kanál: {telefon/email/sms}

Action: {popis_akce}
```

---

## 12. Deal Lost Reasons Tracking

### Standardizované důvody (dropdown v Sheets):

| Kód               | Důvod                                   | Akce                                |
| ----------------- | --------------------------------------- | ----------------------------------- |
| PRICE_LOW         | Cena příliš nízká                       | Review pricing model pro region     |
| COMPETITOR        | Zvolil konkurenci                       | Competitor intel update             |
| REALTOR           | Zvolil realitku                         | Follow-up za 30/60/90 dní           |
| NO_CONTACT        | Nedostupný (3+ pokusů)                  | Nurture email sequence              |
| CHANGED_MIND      | Změnil názor / nechce prodávat          | Archive, follow-up za 6 měsíců      |
| LEGAL_ISSUES      | Právní komplikace (neřešitelné)         | Archive                             |
| UNREALISTIC_PRICE | Nereálná cenová očekávání               | Nurture + market update emails      |
| TRUST_ISSUES      | Nedůvěra / obavy z podvodu              | Poslat reference, nabídnout schůzku |
| TIMING            | Špatné načasování (ne teď)              | Follow-up za 3 měsíce               |
| FINANCIAL         | Nepotřebuje peníze (situace se změnila) | Archive                             |
| OTHER             | Jiný důvod                              | Zaznamenat v Notes                  |

### Měsíční analýza Lost Reasons:

Každý měsíc udělat pivot:

- Top 3 lost reasons → akční plán
- Lost reasons by region → regionální specifika
- Lost reasons by source → kvalita traffic source
- Lost reasons by lead score → scoring calibration

---

## 13. KPIs & Metrics

### Primary KPIs (sledovat týdně):

| KPI              | Target   | Formula                        | Alert                          |
| ---------------- | -------- | ------------------------------ | ------------------------------ |
| Speed-to-Contact | < 5 min  | Avg(first_contact - lead_time) | > 5 min → Telegram             |
| Contact Rate     | ≥ 80%    | Contacted / Total leads        | < 70% → review                 |
| Offer Rate       | ≥ 60%    | Offers / Contacted             | < 50% → review kvalifikace     |
| Close Rate       | ≥ 25%    | Deals / Offers                 | < 15% → review pricing/scripts |
| Lead-to-Deal     | ≥ 12%    | Deals / Total leads            | < 8% → full funnel review      |
| Avg Deal Size    | ≥ 2M Kč  | Avg(deal_value)                | Region-dependent               |
| Time-to-Close    | ≤ 14 dní | Avg(close_date - lead_date)    | > 21 dní → review process      |

### Secondary KPIs (sledovat měsíчně):

| KPI                       | Popis                                  |
| ------------------------- | -------------------------------------- |
| Cost per Lead (CPL)       | Ad spend / Leads (by source)           |
| Cost per Deal (CPA)       | Ad spend / Deals (by source)           |
| Revenue per Lead          | Total revenue / Total leads            |
| ROI per Channel           | (Revenue - Cost) / Cost × 100%         |
| Follow-up Completion Rate | Follow-ups done / Follow-ups scheduled |
| Lost Reason Distribution  | % per reason category                  |
| Regional Conversion Rate  | Close rate per region                  |
| Lead Score Accuracy       | Correlation: high score → deal won     |

### Weekly Report Template (Telegram):

```
📊 WEEKLY PIPELINE REPORT
Week: {week_number} ({dates})

📥 New leads: {count} ({vs_last_week})
📞 Contacted: {count} ({contact_rate}%)
💰 Offers sent: {count} ({offer_rate}%)
🏠 Deals closed: {count} ({close_rate}%)
💵 Revenue: {sum} Kč

⏱️ Avg Speed-to-Contact: {min} min
📈 Lead-to-Deal: {rate}%
📉 Top Lost Reason: {reason} ({count})

🔥 Hot pipeline: {count_offers_pending} offers pending
📅 Follow-ups due this week: {count}
```

---

## Приложения

### A. Checklist перед запуском Playbook

- [ ] Google Sheets настроен с вкладкой "Deal Pipeline" (columns как в разделе 10)
- [ ] Telegram notifications работают (VR-081, VR-222)
- [ ] Follow-up cadence прописана в calendar/reminder system
- [ ] Objection scripts распечатаны / быстро доступны
- [ ] Email templates загружены в почтовый клиент как черновики
- [ ] SMS templates загружены в GoSMS.cz (VR-164)
- [ ] Speed-to-Contact alert настроен (VR-222)
- [ ] Deal stage change alerts настроены
- [ ] Lost reason dropdown добавлен в Sheets

### B. Эскалационная матрица

| Ситуация                              | Эскалация на   |
| ------------------------------------- | -------------- |
| Клиент хочет > 85% рыночной цены      | Owner          |
| Юридические сложности (exekuce, spor) | Právník        |
| Технические проблемы (web, forms)     | Developer      |
| Клиент жалуется публично              | Owner + PR     |
| Конкурент демпингует в регионе        | Growth → Owner |

---

_Документ создан: 2026-03-10 | Автор: Growth Agent | Проект: vykoupim-nemovitost.cz_
