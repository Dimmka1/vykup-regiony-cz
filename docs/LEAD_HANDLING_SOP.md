# Lead Handling SOP — Výkup Nemovitostí CZ

> Verze 1.0 | Platnost od: 2026-03-09
> Kontakt: +420 776 424 145

---

## Obsah

1. [Response Rules — Pravidla první reakce](#1-response-rules--pravidla-první-reakce)
2. [Call Scripts — Telefonní scénáře](#2-call-scripts--telefonní-scénáře)
   - 2.1 Scénář: Exekuce (urgentní)
   - 2.2 Scénář: Dědictví
   - 2.3 Scénář: Běžný prodej
3. [Qualification Checklist — Kvalifikace leadů](#3-qualification-checklist--kvalifikace-leadů)
4. [Follow-up Cadence — Plán opakovaného kontaktu](#4-follow-up-cadence--plán-opakovaného-kontaktu)
5. [CRM Guide — Google Sheets](#5-crm-guide--google-sheets)

---

## 1. Response Rules — Pravidla první reakce

### Speed-to-Lead

| Priorita | Typ leadu                 | Max. doba reakce | Kanál první reakce |
| -------- | ------------------------- | ---------------- | ------------------ |
| 🔴 P0    | Exekuce / dražba          | **5 minut**      | Telefonát          |
| 🟡 P1    | Dědictví                  | **15 minut**     | Telefonát          |
| 🟢 P2    | Běžný prodej              | **30 minut**     | Telefonát nebo SMS |
| ⚪ P3    | Obecný dotaz / newsletter | **2 hodiny**     | Email              |

### Pravidla

1. **Telegram alert = start stopek.** Každý nový lead vyvolá Telegram notifikaci. Od této chvíle běží SLA.
2. **Zavolej, nepiš.** Telefon je vždy první volba. SMS/email pouze pokud volání nevyzvedne.
3. **3 pokusy o volání** v rámci prvních 2 hodin (čas 0, +30 min, +90 min). Pokud nezvedne → SMS + email follow-up.
4. **Nikdy nevolej po 20:00.** Pokud lead přijde večer (20:00–08:00), SMS ihned + zavolej ráno v 08:30.
5. **Představ se jménem.** "Dobrý den, tady [jméno] z Výkupu nemovitostí." Nikdy anonymní volání.
6. **Zapiš výsledek hovoru** do CRM (Google Sheets) ihned po hovoru — max. do 5 minut.
7. **Fraud score > 70 = STOP.** Nekontaktuj. Označ v Sheets jako `fraud_blocked`. Pokud je 50–70, zavolej ale buď opatrný.

### Tón komunikace

- **Profesionální a empatický.** Lidé jsou v těžké situaci (exekuce, dědictví). Nikdy netlačíme.
- **Pomáháme, neprodáváme.** "Jsme tu, abychom vám pomohli najít řešení."
- **Transparentní.** Výkupní cena = 70–80 % tržní hodnoty. Říkáme to rovnou.
- **Bez slibů, které nemůžeme splnit.** "Odhad do 24–48 hodin, celý proces 7–14 dní."

---

## 2. Call Scripts — Telefonní scénáře

> Každý scénář je psán jako reálný rozhovor. Přizpůsobte podle situace, ale držte strukturu.

---

### 2.1 Scénář: Exekuce (urgentní prodej)

**Kontext:** Lead má exekuci, hrozí dražba, potřebuje rychlé řešení. Často ve stresu.

---

**[ZAHÁJENÍ]**

— _"Dobrý den, tady [jméno] z firmy Výkup nemovitostí. Volám vám, protože jste nám zanechal/a kontakt na webu ohledně vaší nemovitosti. Mám na vás chvilku?"_

**[Pokud ANO:]**

— _"Děkuji. Chci vás ujistit, že tento hovor je nezávazný a zcela důvěrný. Mým cílem je zjistit, jestli a jak bychom vám mohli pomoct. Můžete mi prosím říct trochu víc o vaší situaci?"_

**[Naslouchej. Nech klienta mluvit. Nepřerušuj.]**

**[ZJIŠTĚNÍ SITUACE]**

— _"Rozumím. To je opravdu nepříjemná situace a chápu, že vás to stresuje. Mohu se zeptat — víte, v jakém stádiu exekuce se to aktuálně nachází? Máte nějaké usnesení od exekutora?"_

— _"A ta nemovitost — je to byt, nebo dům? V jakém je stavu a kde přesně se nachází?"_

— _"Je nemovitost zatížena hypotékou nebo zástavním právem?"_

**[NABÍDKA ŘEŠENÍ]**

— _"Podívejte, my se specializujeme právě na takové situace. Funguje to tak: do 24 až 48 hodin vám dáme nezávazný odhad výkupní ceny. Ta se typicky pohybuje mezi 70 a 80 procenty tržní hodnoty — záleží na stavu a lokalitě. Vím, že to není plná cena, ale výhoda je, že peníze můžete mít do 7 až 14 dnů a exekuci zastavíme."_

— _"Zálohu až 500 tisíc korun můžeme poslat ještě před podpisem kupní smlouvy, pokud to situace vyžaduje."_

**[DALŠÍ KROKY]**

— _"Jestli máte zájem, postup by byl následující: pošlete mi základní informace o nemovitosti — adresu, případně fotky. My připravíme odhad a do dvou dnů se vám ozveme s konkrétní nabídkou. Je to zcela nezávazné."_

— _"Mohu si potvrdit vaši emailovou adresu, abych vám mohl poslat shrnutí? ... Výborně."_

**[ZÁVĚR]**

— _"[Jméno klienta], moc děkuji za důvěru. Vím, že to není jednoduchá situace, ale jsme tu proto, abychom vám pomohli. Ozvu se vám do [konkrétní den/čas]. Kdybyste měl/a jakýkoli dotaz, neváhejte zavolat zpět na toto číslo. Přeji vám hezký den."_

---

**Poznámky pro operátora:**

- U exekucí NIKDY neříkej "to se dá zařídit snadno". Situace je vážná.
- Pokud klient pláče nebo je výrazně ve stresu — zpomal, buď lidský. "Chápu, je to těžké. Nemusíme spěchat."
- Zeptej se na termín dražby — pokud je do 30 dní, eskaluj jako P0.

---

### 2.2 Scénář: Dědictví

**Kontext:** Lead zdědil nemovitost, chce ji prodat. Často neví, jak na to. Může být emocionální (zemřel blízký).

---

**[ZAHÁJENÍ]**

— _"Dobrý den, tady [jméno] z Výkupu nemovitostí. Volám vám, protože jste nás kontaktoval/a ohledně prodeje nemovitosti. Volám vhod?"_

**[Pokud ANO:]**

— _"Děkuji. Než se pustíme do detailů — předem vám chci říct, že je mi líto vaší ztráty, pokud se jedná o zděděnou nemovitost. Vím, že to není snadné období. Tento hovor je zcela nezávazný, jen bych rád zjistil, jak bychom vám mohli pomoct."_

**[ZJIŠTĚNÍ SITUACE]**

— _"Můžete mi prosím přiblížit, o jakou nemovitost se jedná? Jde o byt, dům, pozemek?"_

— _"A kde se nemovitost nachází?"_

— _"Už proběhlo dědické řízení? Máte usnesení o dědictví, nebo je řízení ještě v běhu?"_

— _"Je nemovitost ve spoluvlastnictví s dalšími dědici, nebo jste jediný/á vlastník/ce?"_

— _"V jakém stavu je ta nemovitost? Je obydlená, prázdná, potřebuje rekonstrukci?"_

**[NABÍDKA ŘEŠENÍ]**

— _"Rozumím. My máme s výkupem zděděných nemovitostí bohaté zkušenosti. Hodně lidí řeší podobnou situaci — nemovitost je třeba v jiném městě, nechcete se o ni starat, nebo se potřebujete domluvit s dalšími dědici."_

— _"Náš postup je jednoduchý: připravíme nezávazný odhad ceny do 48 hodin. Výkupní cena se obvykle pohybuje kolem 70 až 80 procent tržní hodnoty. Celý prodej vyřídíme za 7 až 14 dní, včetně veškeré administrativy — právník, smlouvy, katastr."_

— _"Pokud je nemovitost ve spoluvlastnictví, můžeme odkoupit i jen váš podíl — to je pro lidi často velká úleva."_

**[DALŠÍ KROKY]**

— _"Pokud vás to zaujalo, dal/a byste mi adresu nemovitosti a ideálně pár fotek? Na základě toho připravíme odhad a ozveme se vám s konkrétní částkou."_

— _"Mohu vám také poslat email s přehledem, jak celý proces funguje krok za krokem, abyste měl/a přehled. Jaká je vaše emailová adresa?"_

**[ZÁVĚR]**

— _"Děkuji, [jméno klienta]. Ozvu se vám [konkrétní den]. Kdykoli se na nás můžete obrátit, i kdybyste měl/a jen dotaz. Přeji vám klidný den."_

---

**Poznámky pro operátora:**

- U dědictví je KLÍČOVÝ respekt a empatie. Nikdy nespěchej.
- Spoluvlastnictví je častý problém — zdůrazni, že umíme odkoupit podíl.
- Pokud dědické řízení neproběhlo, vysvětli, že je to podmínka, ale můžeme předjednat smlouvu.
- Pokud je nemovitost v jiném kraji → zdůrazni, že fungujeme celostátně.

---

### 2.3 Scénář: Běžný prodej

**Kontext:** Lead chce prodat nemovitost bez urgence. Porovnává nabídky, zjišťuje ceny. Racionálnější rozhodování.

---

**[ZAHÁJENÍ]**

— _"Dobrý den, tady [jméno] z Výkupu nemovitostí. Volám ohledně vašeho dotazu na prodej nemovitosti, který jste nám poslal/a přes web. Máte chvilku?"_

**[Pokud ANO:]**

— _"Výborně, děkuji. Rád bych se dozvěděl víc o vaší nemovitosti, abych vám mohl dát konkrétní informace. Je to zcela nezávazné."_

**[ZJIŠTĚNÍ SITUACE]**

— _"O jakou nemovitost se jedná? Byt, dům, pozemek?"_

— _"Kde přesně se nachází? Město, ulice případně?"_

— _"Jak velká je — kolik metrů čtverečních, kolik pokojů?"_

— _"V jakém je stavu? Po rekonstrukci, původní stav, potřebuje opravy?"_

— _"A mohu se zeptat — z jakého důvodu prodáváte? Stěhujete se, nebo je to investiční nemovitost?"_

— _"Máte nějakou představu o ceně, za kterou byste chtěl/a prodat?"_

**[NABÍDKA ŘEŠENÍ]**

— _"Děkuji za informace. Rád bych vám vysvětlil, jak u nás výkup funguje a v čem je rozdíl oproti klasickému prodeji přes realitku."_

— _"Za prvé — rychlost. Celý proces trvá 7 až 14 dní. Za druhé — žádné provize, žádné prohlídky s desítkami zájemců, žádná nejistota. Za třetí — postaráme se o veškerou administrativu, od smlouvy až po zápis do katastru."_

— _"Výkupní cena se pohybuje korun 70 až 80 procent tržní hodnoty. Je to méně než přes realitku, ale dostanete jistotu, rychlost a nulové starosti. Pro spoustu lidí je to výhodnější, než čekat měsíce na kupce."_

— _"Rád bych vám připravil nezávazný odhad — do 48 hodin vám dám konkrétní číslo."_

**[NÁMITKY — typické]**

_Námitka: "To je málo, přes realitku dostanu víc."_
— _"Rozumím, a máte pravdu, že přes realitku můžete dosáhnout vyšší ceny. Je to ale otázka času a jistoty — s realitkou to může trvat 3 až 6 měsíců a není to zaručené. U nás máte peníze na účtu do 14 dnů. Záleží, co je pro vás důležitější."_

_Námitka: "Musím se poradit s partnerkou/partnerem."_
— _"Samozřejmě, to je naprosto v pořádku. Rád vám pošlu shrnutí emailem, abyste to mohli společně probrat. Kdy se vám mohu ozvat zpět?"_

_Námitka: "Ještě jsem se nerozhodl/a."_
— _"Žádný problém. Nechci na vás vůbec tlačit. Můžu vám poslat nezávazný odhad a vy se rozhodnete, až budete připraven/a. Dává vám to smysl?"_

**[DALŠÍ KROKY]**

— _"Výborně. Pošlu vám odhad na email do 48 hodin. Potom se vám ozvu a projdeme to spolu. Můžete mi prosím potvrdit emailovou adresu?"_

**[ZÁVĚR]**

— _"Děkuji za váš čas, [jméno klienta]. Těším se na další kontakt. Kdybyste měl/a jakýkoli dotaz, zavolejte mi klidně přímo na toto číslo. Hezký den."_

---

**Poznámky pro operátora:**

- Běžný prodej = klient porovnává. Buď transparentní a netlač.
- Hlavní selling points: rychlost, jistota, nulové starosti.
- Pokud klient chce víc než 80 % → pravděpodobně lepší přes realitku. Řekni mu to upřímně. Buduje důvěru a často se vrátí.
- Vždy nabídni nezávazný odhad jako next step — snižuje bariéru.

---

## 3. Qualification Checklist — Kvalifikace leadů

### Kvalifikační matice

Po prvním hovoru ohodnoť lead podle těchto kritérií:

#### A) Urgence (0–30 bodů)

| Otázka                                       | Hot (30)                    | Warm (15)              | Cold (5)             |
| -------------------------------------------- | --------------------------- | ---------------------- | -------------------- |
| _"Máte termín, do kdy potřebujete prodat?"_  | Do 30 dní (exekuce, dražba) | 1–3 měsíce             | "Časem", bez termínu |
| _"Co se stane, pokud nemovitost neprodáte?"_ | Dražba, exekutor, ztráta    | Nepohodlí, dva náklady | Nic závažného        |

#### B) Motivace (0–25 bodů)

| Otázka                              | Hot (25)                                      | Warm (12)                                    | Cold (5)            |
| ----------------------------------- | --------------------------------------------- | -------------------------------------------- | ------------------- |
| _"Z jakého důvodu prodáváte?"_      | Exekuce, rozvod, dluhy, dědictví s konfliktem | Stěhování, investice, dědictví bez konfliktu | "Jen zjišťuji cenu" |
| _"Už jste se na někoho obrátil/a?"_ | "Ano, nikdo mi nepomohl"                      | "Zkoumám možnosti"                           | "Teprve začínám"    |

#### C) Nemovitost — kvalita obchodu (0–25 bodů)

| Otázka                                                                            | Hot (25)                 | Warm (12)                        | Cold (5)                            |
| --------------------------------------------------------------------------------- | ------------------------ | -------------------------------- | ----------------------------------- |
| _"Jste jediný/á vlastník/ce?"_                                                    | Ano, nebo plná moc       | Spoluvlastnictví s dohodou       | Spoluvlastnictví bez dohody         |
| _"Jsou na nemovitosti nějaké závazky — hypotéka, zástavní právo, věcné břemeno?"_ | Žádné, nebo jen hypotéka | Zástavní právo k vyřešení        | Exekuce na nemovitosti třetí strany |
| _"V jakém je stavu?"_                                                             | Dobrý / obydlený         | Potřebuje částečnou rekonstrukci | Ruina / bez přístupu                |

#### D) Rozhodovací proces (0–20 bodů)

| Otázka                       | Hot (20)            | Warm (10)                      | Cold (5)                                |
| ---------------------------- | ------------------- | ------------------------------ | --------------------------------------- |
| _"Kdo rozhoduje o prodeji?"_ | "Já sám/sama"       | "Musím se poradit s partnerem" | "Rozhodujeme celá rodina / více dědiců" |
| _"Kdy byste chtěl/a začít?"_ | "Hned / co nejdřív" | "Tento měsíc"                  | "Nevím, uvidím"                         |

### Celkové hodnocení

| Skóre      | Kategorie   | Akce                                                       |
| ---------- | ----------- | ---------------------------------------------------------- |
| **70–100** | 🔴 **HOT**  | Okamžitý follow-up. Odhad do 24h. Schůzka do 48h.          |
| **40–69**  | 🟡 **WARM** | Odhad do 48h. Follow-up dle cadence. Nurturing email.      |
| **0–39**   | 🟢 **COLD** | Email drip. Follow-up Day 7 a Day 30. Re-qualify za měsíc. |

### Disqualifikace (okamžitá)

Označ jako `disqualified` pokud:

- ❌ Nemovitost je v zahraničí
- ❌ Klient nechce prodat pod 95 % tržní ceny (doporuč realitku)
- ❌ Právní spor o vlastnictví bez jasného výhledu
- ❌ Fraud score > 70
- ❌ Podezření na podvod (nemá základní info o nemovitosti, vyhýbá se otázkám)

---

## 4. Follow-up Cadence — Plán opakovaného kontaktu

### HOT Lead (skóre 70–100)

| Den                   | Čas       | Kanál      | Akce                                                                           | Poznámka                |
| --------------------- | --------- | ---------- | ------------------------------------------------------------------------------ | ----------------------- |
| **Day 0** (ihned)     | Do 5 min  | 📞 Telefon | První hovor, kvalifikace, domluvení odhadu                                     | 3 pokusy / 2h           |
| **Day 0** (po hovoru) | Do 15 min | 📧 Email   | Shrnutí hovoru + jak funguje výkup + kontakt                                   | Auto-drip email #1      |
| **Day 1**             | 10:00     | 📞 Telefon | Follow-up: "Posílám odhad, máte dotazy?"                                       | Pokud nezvedne → SMS    |
| **Day 1**             | 14:00     | 📧 Email   | Nezávazný odhad ceny (PDF nebo email)                                          | Příloha: odhad          |
| **Day 2**             | 10:00     | 📞 Telefon | "Dostal/a jste odhad? Co na to říkáte?"                                        | Cíl: domluvit schůzku   |
| **Day 3**             | 11:00     | 💬 SMS     | "Dobrý den, chtěl jsem se ujistit, že máte vše potřebné. Mohu s něčím pomoct?" | Pokud neodpovídá        |
| **Day 5**             | 10:00     | 📞 Telefon | Poslední pokus o kontakt. "Nechci obtěžovat, jen kontroluji..."                | Pokud neodpovídá → warm |
| **Day 7**             | —         | 📧 Email   | "Stále máme zájem vám pomoct. Naše nabídka platí."                             | Auto-drip               |

### WARM Lead (skóre 40–69)

| Den        | Čas       | Kanál      | Akce                                                 | Poznámka               |
| ---------- | --------- | ---------- | ---------------------------------------------------- | ---------------------- |
| **Day 0**  | Do 30 min | 📞 Telefon | První hovor, kvalifikace                             | 2 pokusy / 3h          |
| **Day 0**  | Po hovoru | 📧 Email   | Shrnutí + jak to funguje                             | Auto-drip              |
| **Day 1**  | 10:00     | 📧 Email   | Odhad ceny (pokud máme info)                         | Nebo žádost o doplnění |
| **Day 3**  | 11:00     | 📞 Telefon | Follow-up: "Stihli jste se podívat na odhad?"        | Pokud nezvedne → SMS   |
| **Day 7**  | —         | 📧 Email   | Case study: "Jak jsme pomohli paní Novákové"         | Auto-drip email #3     |
| **Day 14** | 10:00     | 📞 Telefon | Re-qualification: "Změnilo se něco ve vaší situaci?" | Přehodnoť skóre        |
| **Day 30** | —         | 📧 Email   | "Stále tu jsme. Pokud se cokoli změní, ozvěte se."   | Auto-drip email #5     |

### COLD Lead (skóre 0–39)

| Den        | Čas   | Kanál      | Akce                                        | Poznámka                  |
| ---------- | ----- | ---------- | ------------------------------------------- | ------------------------- |
| **Day 0**  | Do 2h | 📞 Telefon | Krátký hovor: kvalifikace, zjistit zájem    | 1 pokus                   |
| **Day 1**  | —     | 📧 Email   | "Děkujeme za zájem. Jak to u nás funguje."  | Auto-drip email #1        |
| **Day 3**  | —     | 📧 Email   | FAQ: nejčastější dotazy o výkupu            | Auto-drip email #2        |
| **Day 7**  | —     | 📧 Email   | Case study                                  | Auto-drip email #3        |
| **Day 14** | —     | 📧 Email   | "Zjistěte cenu své nemovitosti zdarma"      | Auto-drip email #4        |
| **Day 30** | —     | 📧 Email   | "Poslední připomenutí — naše nabídka platí" | Auto-drip email #5        |
| **Day 60** | —     | 📧 Email   | Re-activation: "Stále uvažujete o prodeji?" | Pokud otevře → re-qualify |

### Eskalační pravidla

- **Hot lead neodpovídá 5 dní** → Přeřaď na Warm, pokračuj warm cadence od Day 7.
- **Warm lead neodpovídá 30 dní** → Přeřaď na Cold, email-only nurturing.
- **Cold lead otevře email po 30+ dnech** → Zavolej do 24h, re-qualify.
- **Jakýkoli lead zavolá zpět** → Okamžitě přeřaď na Hot.

---

## 5. CRM Guide — Google Sheets

### Struktura sloupců

Hlavní sheet: **"Leads"**

| Sloupec | Název               | Typ         | Popis                                                                          |
| ------- | ------------------- | ----------- | ------------------------------------------------------------------------------ |
| A       | `timestamp`         | Datetime    | Datum a čas příchodu leadu (automaticky z formuláře)                           |
| B       | `name`              | Text        | Jméno klienta                                                                  |
| C       | `phone`             | Text        | Telefon (formát: +420 XXX XXX XXX)                                             |
| D       | `email`             | Text        | Email                                                                          |
| E       | `region`            | Dropdown    | Kraj (Praha, Brno, Ostrava, Plzeň, ...)                                        |
| F       | `type`              | Dropdown    | Typ: `exekuce` / `dedictvi` / `bezny_prodej` / `jiny`                          |
| G       | `score`             | Číslo 0–100 | Lead score (automatický z formuláře + manuální po hovoru)                      |
| H       | `source`            | Text        | Zdroj: `web_form` / `ppc_google` / `ppc_seznam` / `referral` / `phone_inbound` |
| I       | `status`            | Dropdown    | Viz tabulka níže                                                               |
| J       | `qualification`     | Dropdown    | `hot` / `warm` / `cold` / `disqualified`                                       |
| K       | `first_contact`     | Datetime    | Kdy proběhl první kontakt (vyplnit ručně)                                      |
| L       | `response_time_min` | Číslo       | Čas od leadu do prvního kontaktu v minutách                                    |
| M       | `last_contact`      | Datetime    | Datum posledního kontaktu                                                      |
| N       | `next_action`       | Text        | Co je třeba udělat + kdy ("Zavolat 12.3." / "Poslat odhad")                    |
| O       | `property_address`  | Text        | Adresa nemovitosti                                                             |
| P       | `property_type`     | Dropdown    | `byt` / `dum` / `pozemek` / `komercni`                                         |
| Q       | `estimated_price`   | Číslo       | Náš odhad výkupní ceny (Kč)                                                    |
| R       | `notes`             | Text        | Volné poznámky z hovorů (chronologicky, s datem)                               |
| S       | `utm_campaign`      | Text        | UTM campaign (automaticky)                                                     |
| T       | `utm_source`        | Text        | UTM source (automaticky)                                                       |
| U       | `gclid`             | Text        | Google Click ID (automaticky)                                                  |
| V       | `fraud_score`       | Číslo 0–100 | Fraud score (automaticky). >70 = blokace                                       |

### Statusy leadu

| Status              | Význam                                        | Další akce                        |
| ------------------- | --------------------------------------------- | --------------------------------- |
| `new`               | Nový lead, ještě nekontaktován                | Zavolej dle SLA                   |
| `contacted`         | Proběhl první kontakt                         | Vyplň qualification + next_action |
| `qualifying`        | Probíhá kvalifikace (čeká na info od klienta) | Follow-up dle cadence             |
| `estimate_sent`     | Odhad ceny odeslán                            | Follow-up Day +1                  |
| `negotiating`       | Klient obdržel nabídku, probíhá jednání       | Aktivní komunikace                |
| `meeting_scheduled` | Domluvená schůzka / prohlídka                 | Připravit podklady                |
| `contract_sent`     | Smlouva odeslána                              | Follow-up Day +2                  |
| `won`               | Deal uzavřen, smlouva podepsána               | 🎉 Aktualizuj metriky             |
| `lost`              | Klient odmítl / odešel ke konkurenci          | Zapsat důvod do notes             |
| `nurturing`         | Long-term nurture (cold lead)                 | Email drip only                   |
| `disqualified`      | Nesplňuje podmínky / fraud                    | Žádná další akce                  |
| `fraud_blocked`     | Fraud score > 70, automaticky blokován        | NEKONTAKTOVAT                     |

### Jak aktualizovat status

1. **Po každém hovoru / kontaktu:**
   - Aktualizuj `status` a `last_contact`
   - Zapiš shrnutí do `notes` (formát: `[2026-03-09] Volal, zvedl, má byt v Brně, exekuce za 3 týdny. Hot.`)
   - Nastav `next_action` s konkrétním datem

2. **Po kvalifikaci:**
   - Vyplň `qualification` (hot/warm/cold)
   - Aktualizuj `score` — přepočítej podle kvalifikační matice (sekce 3)
   - Vyplň `property_type` a `property_address`

3. **Po odeslání odhadu:**
   - Status → `estimate_sent`
   - Zapiš `estimated_price`
   - `next_action` → "Follow-up [datum]"

4. **Po uzavření / ztrátě:**
   - Status → `won` nebo `lost`
   - U `lost`: zapiš důvod do `notes` ("Cena příliš nízká" / "Šel ke konkurenci" / "Rozmyslel se")

### Lead Score — jak přepočítat

Automatický score z formuláře je baseline. Po prvním hovoru PŘEPIŠ manuálně:

```
Nový score = Urgence (0-30) + Motivace (0-25) + Kvalita obchodu (0-25) + Rozhodování (0-20)
```

Viz kvalifikační matice v sekci 3.

### Dashboard metriky (sleduj týdně)

- **Speed-to-lead:** Průměrný `response_time_min` za týden. Cíl: < 15 min.
- **Conversion rate:** `won` / celkový počet leadů. Cíl: > 5 %.
- **Pipeline value:** Součet `estimated_price` u statusů `negotiating` + `contract_sent`.
- **Hot lead ratio:** Počet `hot` / celkový počet kvalifikovaných. Benchmark: 20–30 %.
- **Lost reasons:** Top 3 důvody u `lost` leadů za měsíc. Optimalizuj messaging.

---

## Přílohy

### Checklist: Co mít připravené před hovorem

- [ ] Otevřený Google Sheets s daty leadu
- [ ] Informace o regionu (průměrné ceny — viz PRICE_RESEARCH.json)
- [ ] Kalkulačka / odhad tržní ceny (pokud lead poslal adresu)
- [ ] Klidné prostředí, bez rušení
- [ ] Poznámkový blok / otevřený notes sloupec v Sheets

### Zakázané fráze

| ❌ Neříkej                    | ✅ Řekni místo toho                                  |
| ----------------------------- | ---------------------------------------------------- |
| "Musíte se rozhodnout rychle" | "Naše nabídka je nezávazná, máte čas na rozmyšlenou" |
| "Je to výhodná cena"          | "Cena odpovídá rychlému a bezstarostnému prodeji"    |
| "Konkurence vám dá méně"      | "Rád vám vysvětlím, jak jsme k ceně došli"           |
| "Garantujeme cenu"            | "Připravíme nezávazný odhad do 48 hodin"             |
| "Nebojte se"                  | "Chápu vaše obavy"                                   |

---

_Dokument spravuje Growth tým. Poslední aktualizace: 2026-03-09._
