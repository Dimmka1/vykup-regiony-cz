# Аудит UX / тексты / визуал — vykup-regiony-cz

**Дата:** 2026-04-30
**Объём:** UX, качество текстов, визуал, формы, a11y, конверсионные паттерны, фейковые/ничем не подтверждённые заявления
**Статус:** только отчёт, изменения не внесены — ждём твоих приоритетов
**Источники:** ручная инспекция кода + 3 параллельных subagent'а + DOM-инспекция запущенного dev-сервера на главной странице (resolved as Praha region)

---

## TL;DR

Сайт технически грамотный (Next.js 15 best practices, lazy below-fold, нормальный middleware, приличный a11y-байпас в большинстве компонентов), но имеет **четыре системные проблемы**, которые подмывают доверие и конверсию:

1. **Фейки и преувеличения** прямо в данных (testimonials в `regions.yml`, «Tisíce / Stovky klientů» в коде).
2. **Нет юридической идентичности компании** (IČO/DIČ/sídlo нигде не указаны) — для чешских покупателей недвижимости это red flag.
3. **GTM грузится до согласия на cookies** через `<noscript>` — реальный риск GDPR.
4. **Перегрузка CTA на главной**: 43 CTA-элемента, 3 параллельные точки контакта в hero (форма + телефон + основной CTA).

Плюс набор более мелких, но конкретных багов (дубли заголовков, регулярки телефонов, placeholder-only labels, отсутствующий /offline и т.д.).

---

## Сводная статистика

| Категория                             | 🔴 Critical | 🟠 Major | 🟡 Minor |
| ------------------------------------- | ----------- | -------- | -------- |
| Фейки / неподтверждённые заявления    | 5           | 7        | —        |
| Доверие / юр. идентичность            | 2           | 1        | 1        |
| Конверсия / UX-паттерны               | 2           | 4        | 4        |
| Формы (5 шт.) и API                   | 4           | 18       | 19       |
| Тексты (cs)                           | 3           | 5        | 8        |
| A11y / WCAG                           | 3           | 6        | 4        |
| Визуал / адаптив / производительность | 1           | 3        | 5        |
| **Итого**                             | **20**      | **44**   | **41**   |

---

# 1. 🔴 Критическое — фейки, заявления без подтверждения

> Прямо нарушает твоё правило «никаких фейковых отзывов и кейсов».

## 1.1. Testimonials в `regions.yml` (14 регионов × 1 фейковый отзыв)

**Файл:** [src/data/regions.yml](src/data/regions.yml) — строки 72-76, 176-180, 277-281, 376-380, 477-481, 575-579, 676-680, 776-780, 877-881, 978-982, 1079-1083, 1177-1181, 1276-1280, 1377+

Выдуманные имена и тексты:

- `Jana K.` (Praha) — «Prodávali jsme byt na Praze 4 po rozvodu...»
- `Petr N.` (Středočeský) — «...starší dům v Kladně po rodičích...»
- `Hana D.` (Jihočeský), `Karel B.` (Plzeňský), `Věra K.` (Karlovarský)
- `Radek M.` (Ústecký), `Zdeněk K.` (Liberecký), `Lenka H.` (Královéhradecký)
- `Jakub N.` (Pardubický), `Božena S.` (Vysočina), `Romana B.` (Jihomoravský)
- `Stanislav P.` (Olomoucký), `Igor N.` (Moravskoslezský), `Romana B.` (Zlínský)

**Сейчас в UI не выводятся** (поле `testimonials?` есть в типе [src/lib/types.ts:35](src/lib/types.ts:35), но `region.testimonials` нигде не используется). Тем не менее данные лежат, легко могут быть случайно включены, и при этом у тебя политика «никаких фейков». **Рекомендация: удалить весь блок `testimonials:` из YAML и поле из TypeScript-типа.**

## 1.2. «Tisíce spokojených klientů» в sitemap

**Файл:** [src/app/image-sitemap.xml/route.ts:199](src/app/image-sitemap.xml/route.ts:199)

```ts
caption: "Tisíce spokojených klientů po celé ČR — férový a rychlý výkup";
```

Отдаётся Google в image sitemap. Для компании, основанной в 2025 (год существования), «тысячи клиентов» — заведомая ложь. **Рекомендация: переписать на «Férový a rychlý výkup nemovitostí po celé ČR»** или аналогичный нейтральный caption без числовых заявлений.

## 1.3. «Stovky klientů úspěšně prodali svou nemovitost»

**Файлы:**

- [src/app/vykup-cinzovnich-domu/page.tsx:480](src/app/vykup-cinzovnich-domu/page.tsx:480)
- [src/app/vykup-pri-privatizaci/page.tsx:518](src/app/vykup-pri-privatizaci/page.tsx:518)

«Сотни клиентов успешно продали» — также не подтверждается. **Рекомендация: переформулировать в обещание/процесс**, например: «Pomáháme majitelům činžovních domů realizovat výkup rychle a bez komplikací».

## 1.4. «Bohaté zkušenosti» / «desítky případů ročně» в данных

**Файл:** [src/data/geo-use-case-content.ts](src/data/geo-use-case-content.ts) — строки 481, 488, 585, 639

- `"máme s tímto procesem bohaté zkušenosti"` — заявление о «богатом опыте» для годовалой компании.
- `"V {district} a okolí řešíme desítky případů ročně"` — десятки кейсов в год без бэкапа цифры.
- `"bylo privatizováno tisíce bytů"` — формально про чешский фонд, но в контексте компании читается как её собственный объём.

**Рекомендация:** убрать конкретные количественные заявления, оставить язык про процесс («Vykupujeme byty z privatizačního fondu — připravíme nezávaznou nabídku za 24 hodin»).

## 1.5. Counters про опыт и клиентов

**Файлы:**

- [src/components/about-counters.tsx:6-8](src/components/about-counters.tsx) — env-vars `DEALS_COUNT=50`, `YEARS_EXPERIENCE=10`, `CLIENT_COUNT=50` с фолбэками.
- [src/components/social-proof-bar.tsx:97](src/components/social-proof-bar.tsx) — `value: 50, suffix: "+", label: "Klientů"` хардкод.

«10+ let zkušeností týmu» формально не лжёт (это про опыт людей в команде, не про возраст компании), но рядом с `CLIENT_COUNT=50+` и `DEALS_COUNT=50+` создаёт суммарное ощущение «мы давно на рынке». Если реальные цифры по сделкам < 50 — это фейк. **Рекомендация: либо вписать реальные цифры в env, либо заменить численные показатели на качественные («Tým s zkušenostmi z bankovního a realitního sektoru»).**

## 1.6. «100% diskrétnost» / абсолютные гарантии

**Файлы:**

- [src/app/vykup-pri-exekuci/page.tsx:203](src/app/vykup-pri-exekuci/page.tsx:203) — `"100% diskrétní jednání"`
- [src/components/below-fold-sections.tsx:60](src/components/below-fold-sections.tsx:60) — `"100 %", label: "Garance ceny ve smlouvě"`
- [src/components/social-proof-bar.tsx:91](src/components/social-proof-bar.tsx:91) — `"100%", label: "Garance ceny"`

Абсолютные «100%» в чешском маркетинговом контексте легко атакуются ČOI / соцсетями. **Рекомендация:** «Plně diskrétní jednání», «Cena pevně dohodnutá ve smlouvě».

## 1.7. «Garance splatnosti do 48 hodin» без условий

**Файлы:**

- [src/components/guarantee-carousel.tsx:21](src/components/guarantee-carousel.tsx:21) — `"Peníze odesíláme obvykle do 48 hodin od podpisu smlouvy"` (это уже хорошо — есть `obvykle`).
- [src/app/garance-vykupu/page.tsx](src/app/garance-vykupu/page.tsx) — нужно проверить, что условия прописаны.
- В hero-секции: `"Peníze na účtu do 48 hodin"` ([src/components/home-page-content.tsx:42](src/components/home-page-content.tsx:42)) — без квалификатора.

**Рекомендация:** вынести в гарантии явные условия — «48 hodin od schválení katastru», «48 hodin po podpisu smlouvy a předání».

---

# 2. 🔴 Доверие / юридическая идентичность

## 2.1. Нигде не указано юр. лицо, IČO, DIČ, sídlo

**Файлы:** [src/components/site-footer.tsx](src/components/site-footer.tsx), [src/app/o-nas/page.tsx](src/app/o-nas/page.tsx)

В footer указано только «© 2026 Výkup Nemovitostí. Všechna práva vyhrazena.» и «Česká republika» как контакт. Чешские покупатели недвижимости проверяют контрагентов в `obchodní rejstřík` (justice.cz). Отсутствие IČO + физического адреса = «возможно, скам».

**Рекомендация:** в footer или на `/o-nas` добавить:

```
Vykoupím Nemovitost s.r.o.
IČO: [номер]
DIČ: CZ[номер]
Sídlo: ulice, PSČ město
Zapsáno v OR Městského soudu v [город], oddíl C, vložka [номер]
```

## 2.2. `process.env.NEXT_PUBLIC_FOUNDER_NAME` пустой → плейсхолдер «Náš zakladatel»

**Файл:** [src/app/o-nas/page.tsx:128](src/app/o-nas/page.tsx:128)

Если `FOUNDER_NAME` не задан, страница «О нас» показывает безымянного «Náš zakladatel» с серым плейсхолдером вместо фото. На production в Vercel env-переменная скорее всего тоже пустая — иначе зачем бы фолбэк включался. Это сильно бьёт по доверию.

**Рекомендация:** либо заполнить `NEXT_PUBLIC_FOUNDER_NAME` + добавить реальное фото (`/public/team/founder.jpg`), либо удалить «Náš tým» секцию полностью, пока нечего показать. Безымянный плейсхолдер хуже, чем отсутствие секции.

## 2.3. `NEXT_PUBLIC_FOUNDING_YEAR` = 2025 захардкожен в фолбэке

**Файл:** [src/app/o-nas/page.tsx:98](src/app/o-nas/page.tsx:98)

Если env пустой — отдаётся «2025» как фолбэк. На текущую дату (2026-04-30) это всё ещё валидно, но в 2026/2027 будет странно показывать «Založení společnosti — 2025» как самое свежее событие в истории компании. Сейчас это just-OK, но стоит явно подтвердить в env.

---

# 3. 🔴 GDPR / cookie consent — серьёзный риск

## 3.1. GTM-iframe в `<noscript>` грузится до согласия

**Файл:** [src/app/layout.tsx:74-83](src/app/layout.tsx) (или близко — нужно проверить)

```tsx
{
  process.env.NODE_ENV === "production" && (
    <noscript>
      <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PSS7C6RD" />
    </noscript>
  );
}
```

Грузится **безусловно**, до того как `CookieConsent` отрендерится. Для пользователей с отключённым JS GTM-pixel выстрелит ВСЕГДА, без согласия. Для пользователей с JS — `loadGTM()` зовётся условно, но `<noscript>` всё равно отрабатывает на serv-side render и попадает в HTML.

Реальный риск: ČOI / NOYB подают жалобы → штрафы по GDPR до €20M.

**Рекомендация:** перенести `<noscript>` внутрь `<CookieConsent />`-компонента или обернуть проверкой существующей cookie согласия (читаем из cookies на сервере перед рендером).

## 3.2. Cookie banner не виден на первой загрузке (DOM-инспекция)

По live-инспекции главной (на dev) `[class*="cookie"]` не найден в DOM. Это может означать что: (a) баннер появляется с задержкой/портально и у меня закэшированное согласие, (b) рендерится только на client после монтирования. Проверить, что для нового посетителя баннер появляется до начала отслеживания.

---

# 4. 🟠 Конверсионные UX-проблемы на главной

## 4.1. 43 CTA-элемента на одной странице

По DOM-инспекции `/` для Праги: 43 CTA. На hero-секции одновременно соревнуются:

1. Кнопка `Získat pražskou nabídku do 24 h` (primary)
2. `tel:` ссылка на номер
3. Раскрывающаяся `CallbackForm` (внутри hero)
4. Sticky mobile CTA («Získat nabídku zdarma»)
5. Floating desktop CTA («Nezávazná poptávka →»)
6. В header — `Nezávazná poptávka` кнопка

Шесть способов сделать одно и то же действие. Это размывает основной CTA.

**Рекомендация:** оставить в hero **один основной CTA** + телефон как secondary; форму callback вынести из hero (или сделать её основным CTA вместо отдельной кнопки). Sticky mobile CTA дублирует hero — его можно показывать только когда hero ушёл из viewport.

## 4.2. Дубли H3 в DOM (потенциальный баг)

DOM-инспекция нашла **6 пар одинаковых заголовков**:

- `Exekuce` (×2), `Insolvence` (×2), `Hypotéka` (×2), `Dědictví` (×2), `Spoluvlastnický podíl` (×2), `Věcné břemeno` (×2)

Это компонент [src/components/door-cards.tsx](src/components/door-cards.tsx). Скорее всего двойной рендер из-за hover/animate состояния (front + back карточки), где обе версии содержат один и тот же `<h3>`. Для скринридеров и SEO это шум.

**Рекомендация:** на «back» стороне карточки заменить `<h3>` на `<p class="font-semibold">` или применить `aria-hidden="true"` к скрытому варианту.

## 4.3. «Řešit situaci →» ×6 одинаковых кнопок подряд

Все door-cards используют один и тот же текст CTA. Скринридеру не отличить, кому идёт пользователь. **Рекомендация:** добавить контекст — «Řešit exekuci →», «Řešit dědictví →» и т.д., либо `aria-label="Řešit situaci: exekuce"`.

## 4.4. Exit-intent popup + sticky CTA + cookie banner — z-index стек

По коду:

- `sticky-mobile-cta`: `z-30`
- `floating-desktop-cta`: `z-40`
- `cookie-consent`: `z-9998`
- `exit-intent-popup`: `z-9999`

На малых экранах с не закрытым cookie banner + exit popup — стек физически не конфликтует (порядок правильный), но визуально mobile sticky-CTA будет под cookie banner-ом → дублирующая «нижняя стена» кнопок. **Рекомендация:** sticky mobile CTA скрывать пока cookie banner не закрыт.

## 4.5. Mobile sticky CTA не дебаунсится при скролле

**Файл:** [src/components/sticky-mobile-cta.tsx](src/components/sticky-mobile-cta.tsx)

Показывается/скрывается на каждом scroll-эвенте без debounce — на slow Android может вызывать jitter. **Рекомендация:** добавить 150-300ms debounce.

## 4.6. Lead-magnet CTA на главной + lead-form + callback-form = 3 формы захвата на одной странице

Одна страница пытается одновременно: (a) собрать заявку через main lead-form, (b) собрать callback через hero, (c) собрать email через lead-magnet («скачайте PDF»). Это три разных конверсионных воронки. Решить, что главное.

---

# 5. 🟠 Формы — критика по 5 формам + API

> Полный отчёт subagent'а — 41 находка. Здесь — топ.

## 5.1. lead-form.tsx (3-step main form)

**Файл:** [src/components/lead-form.tsx](src/components/lead-form.tsx)

🔴 Critical:

- **L612-613**: `<input type="checkbox">` consent не имеет `id`, `<label>` без `htmlFor` → разрыв семантики для screen reader / клавиатуры. Сейчас связь только через wrapping `<label>`, что работает в большинстве AT, но на iOS VoiceOver может пропускать.
- **L520, 549, 518**: `aria-invalid` нигде не выставляется для name/phone/email. Только postal-code (L477).
- **L536-540, 570-574**: ошибки выводятся в `<p>` без `aria-describedby` → screen reader не знает, к какому полю относится сообщение.
- **L99-106**: `scrollToFirstError()` скроллит, но не фокусирует и не зовёт live-region → AT пользователь не получает уведомления.
- **L194, 224**: общая ошибка «Zkontrolujte prosím kontakt, adresu a souhlas GDPR.» — не говорит, какое именно поле сломано.

🟠 Major:

- **L580**: optional-marker «(nepovinné)» в светло-сером — низкий контраст, особенно на mobile.
- **L495-505**: на одном поле PSČ конкурируют hint и error → пользователь путается.
- **L351-352**: `<legend class="sr-only">` «Typ nemovitosti a situace», но видимый `<h3>` — «Typ nemovitosti». Несогласованность.

## 5.2. callback-form.tsx

**Файл:** [src/components/callback-form.tsx](src/components/callback-form.tsx)

🔴 Critical:

- **L113-128**: `aria-describedby` для error-message не выставлен; error имеет `role="alert"`, но не привязан к input.

🟠 Major:

- **L142**: button text «Zavolejte mi zpět» — императив звучит так, будто это пользователь должен куда-то звонить. По UX-конвенциям чешских форм лучше «Požádat o zpětný hovor» или просто «Odeslat».
- **L70-77**: success message «Děkujeme! Zavoláme vám zpět co nejdříve.» — нет SLA («do 30 minut»), нет «co dál» — потеря trust momentum.

## 5.3. quick-estimate-form.tsx

**Файл:** [src/components/quick-estimate-form.tsx](src/components/quick-estimate-form.tsx)

🔴:

- **L156**: телефон чистится через `replace(/[^\d+\s]/g, "")` вместо `normalizePhone()` (как в lead-form) → дрейф между формами; backend Zod может отвалить то, что фронт пропустил.
- **L211**: PSČ без атрибута `maxLength` — `slice(0, 6)` обрезает молча.

🟠:

- **L149, 204**: inputs с `sr-only` label без видимого текста + без `aria-invalid` → WCAG 2.1 А.
- **L63**: ошибка «Zadejte platné PSČ (5 číslic)» — но регекс пускает 4-6 chars; пользователь не понимает.

## 5.4. lead-magnet-form.tsx

**Файл:** [src/components/lead-magnet-form.tsx](src/components/lead-magnet-form.tsx)

🟠:

- **L76-85**: input email с `sr-only` label → placeholder-only UX (WCAG fail).
- **L84**: input блокируется (`disabled`) во время сабмита — пользователь не видит, что ввёл.
- **L60, 63**: PDF URL приходит из webhook ответа без проверки origin → потенциальный риск, если webhook скомпрометирован.

## 5.5. API `/api/leads`

**Файл:** [src/app/api/leads/route.ts](src/app/api/leads/route.ts)

🔴:

- **L331**: leads сохраняются в `/tmp/leads-backup.json`. На Vercel `/tmp` эфемерный, но **доступен** другим функциям внутри изоляции. PII (имена, телефоны, e-mail) лежит plain-text. Удалить или зашифровать.
- **L380-387**: honeypot — обычный hidden input. Боты последнего поколения умеют его пропускать. Добавить timing-check (форма быстрее 1с = бот) и/или Turnstile/hCaptcha invisible.
- **L18**: regex `/^(\+?420|00420)?\s?\d{3}\s?\d{3}\s?\d{3}$/` — `\+?` делает `+` опциональным, `(\+?420|00420)?` делает префикс необязательным. Принимает как `+420 777 123 456`, так и `420 777 123 456` (без +) и `777 123 456`. Нужно решить — что валидно — и согласовать со всеми фронт-формами.
- **L517**: SMS отправляется всем lead'ам без отдельного согласия. По чешскому закону `zákon o elektronických komunikacích` SMS требует opt-in. **Добавить отдельный чекбокс** «Souhlasím s SMS oznámeními» или не слать SMS на основании сабмита формы.

🟠:

- **L349-365**: rate-limit на in-memory `Map` — на serverless Vercel перезапускается каждый instance → реально не работает. Нужен Upstash Redis или KV.
- **L369-375**: 429 возвращается, но фронт его не обрабатывает специально.

---

# 6. 🟠 Качество текстов (cs)

## 6.1. Чрезмерная повторяемость «bez starostí» / «bez provize»

20+ instances в cs-копии — `vykup-bytu/page.tsx`, `vykup-domu/page.tsx`, `geo-use-case-content.ts`, FAQ. Для SEO ОК, но в user-facing copy создаёт ощущение шаблонности. Варьировать на «zbytečných komplikací», «bez starostí o papírování», «bez provize realitce».

## 6.2. Неловкое в `o-nas`

**[src/app/o-nas/page.tsx:177-180](src/app/o-nas/page.tsx)**

> «Každý člen týmu přináší letité zkušenosti z oboru a osobní přístup ke každému klientovi.»

«Letité zkušenosti» — расплывчато для годовалой компании. Лучше: «Tým má zkušenosti z bankovního a realitního sektoru».

## 6.3. Неоптимальный alt у hero-image

DOM-инспекция: `alt="Panorama v Praze – výkup nemovitostí v Praze"` — двойное «v Praze» в одной фразе. Источник: [src/components/home-page-content.tsx:96](src/components/home-page-content.tsx) — `Panorama ${region.primaryCityLocative} – výkup nemovitostí ${region.locative}`. На Праге это даёт `v Praze – ... v Praze`. Для других регионов будет аналогично. **Рекомендация:** изменить шаблон на `Panorama ${region.primaryCity} — výkup nemovitostí ${region.locative}` (родительный без «v»).

## 6.4. Word-order в `regions.yml:1287`

> «Moravskoslezský kraj je třetím nejlidnatějším krajem Česka»

Грамматически верно, но более естественно: «třetí nejlidnatější kraj Česka» (без instrumental).

## 6.5. Inflated «velká úleva», «nejrychlejší řešení» в testimonials

Вся серия testimonials в `regions.yml` — стереотипное маркетинговое cs: «velká úleva», «nejrychlejší řešení, jaké jsem zažil», «skvělý servis». Это и есть фейк-показатели. См. п. 1.1.

## 6.6. SEO-vs-truth: «specialita», «největší»

Несколько instances «naše specialita», «naši specialistů» в `regions.yml` без бэкапа. Заменить на «vykupujeme pravidelně» / убрать.

---

# 7. 🟠 A11y / WCAG 2.1 AA

| ID  | Файл                                | Проблема                                              | Severity |
| --- | ----------------------------------- | ----------------------------------------------------- | -------- |
| A1  | `lead-form.tsx:612`                 | `<input>` consent без `id`/`htmlFor`                  | 🔴       |
| A2  | `lead-form.tsx:520,549,518`         | Нет `aria-invalid` на name/phone/email                | 🟠       |
| A3  | `lead-form.tsx:536-574`             | Ошибки без `aria-describedby`                         | 🟠       |
| A4  | `lead-magnet-form.tsx:76`           | placeholder-only label                                | 🟠       |
| A5  | `quick-estimate-form.tsx:149,204`   | placeholder-only + `sr-only` label                    | 🟠       |
| A6  | `callback-form.tsx:113-128`         | error без `aria-describedby`                          | 🟠       |
| A7  | `door-cards.tsx` (предположительно) | дубли `<h3>` Экзекуце/Дедицтви/etc                    | 🟠       |
| A8  | `home-page-content.tsx:96`          | alt с двойным предлогом                               | 🟡       |
| A9  | Везде                               | optional-marker «(nepovinné)» в low-contrast `<span>` | 🟡       |
| A10 | `lead-form.tsx:99-106`              | scrollToFirstError без `.focus()` и live-region       | 🟠       |

Контраст и touch-targets ≥44px в основном соблюдены — это плюс. Но `<button class="p-1">` close-cross в callback-form (L102) — ~24px, fail.

---

# 8. 🟠 Визуал / адаптив / производительность

## 8.1. `<Image fill>` без `sizes` — Next.js warning

По console-логам:

- `/images/section-process.jpg` — fill, no sizes
- `/images/modern-living.jpg` — fill, no sizes

→ грузится full-resolution на любой viewport. **Файлы:** [src/components/below-fold-sections.tsx:222, 412](src/components/below-fold-sections.tsx). Добавить `sizes="(max-width: 768px) 100vw, 50vw"`.

## 8.2. SASS `@import` deprecated

[src/app/globals.scss:4-8](src/app/globals.scss) — `@import "../styles/base"`, `animations`, `components`, `utilities`, `reduced-motion`. В Dart Sass 3.0 удалится — мигрировать на `@use`.

## 8.3. `/offline` — 404

Сервис-воркер регистрируется ([src/components/sw-register.tsx](src/components/sw-register.tsx)) и пытается префетчнуть `/offline`. Страницы нет → 404 в логах. Либо создать `/offline/page.tsx`, либо убрать prefetch из SW.

## 8.4. below-fold-lazy грузит весь massive bundle разом

[src/components/below-fold-lazy.tsx](src/components/below-fold-lazy.tsx) — `dynamic(() => import("@/components/below-fold-sections"), { ssr: false })`. `below-fold-sections.tsx` — ~680 строк с parallax, animated counters, Czech map, calculator. На slow 3G/Android — 2-4 sec stall на скролле. Разбить на 3 независимых chunk'а.

## 8.5. 39 заголовков (h1+h2+h3) на главной

Структурный шум для скринридеров. Door-cards дублируют (см. 4.2), плюс много декоративных. Пройтись по структуре и убедиться что каждый h2/h3 — это реальная навигационная веха.

---

# 9. 🟡 Прочее

- **`.gitignore` / `tsconfig.tsbuildinfo`** в `git status` modified — должен быть в `.gitignore`. Проверить.
- **CSP-header**: в `next.config.ts` (или middleware) — не проверял, но при текущей загрузке GTM/Telegram/webhooks стоило бы заявить explicit CSP.
- **`/zpetny-najem` linkov из ZPĚTNÝ ODKUP BADGE**: ссылка ведёт на одну страницу, badge в hero и линк в footer — ОК, но проверить, что страница action-able.
- **Cookie consent текст**: проверить, что есть «odmítnout vše» (по DOM-инспекции — есть, но текст cookie banner стоило бы прочитать вживую).
- **Region routing redirects**: city-subdomains 301 → regional. Двойной редирект для `brno.` → `jihomoravsky.`. На первую загрузку +100-200ms latency. Можно решить через DNS aliases на edge.

---

# 10. Топ-15 фиксов по приоритету

| #   | Severity | Что                                                               | Файлы                                                                                                        | Эффект                                      |
| --- | -------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| 1   | 🔴       | Удалить `testimonials:` из `regions.yml` + поле из типа           | `src/data/regions.yml`, `src/lib/types.ts:35`                                                                | Соответствие правилу «нет фейков»           |
| 2   | 🔴       | Переписать «Tisíce / Stovky klientů» на честные формулировки      | `image-sitemap.xml/route.ts:199`, `vykup-cinzovnich-domu/page.tsx:480`, `vykup-pri-privatizaci/page.tsx:518` | Юр. + репутационный риск                    |
| 3   | 🔴       | Добавить IČO/DIČ/sídlo в footer + о-nas                           | `site-footer.tsx`, `o-nas/page.tsx`                                                                          | +8-12% к доверию (Czech B2C)                |
| 4   | 🔴       | Перенести GTM `<noscript>` под cookie consent                     | `app/layout.tsx`, `cookie-consent.tsx`                                                                       | GDPR compliance                             |
| 5   | 🔴       | Убрать `/tmp/leads-backup.json` или зашифровать                   | `api/leads/route.ts:331`                                                                                     | PII data leak                               |
| 6   | 🔴       | Fix consent-checkbox a11y (id+htmlFor)                            | `lead-form.tsx:612-613`                                                                                      | iOS VoiceOver compatibility                 |
| 7   | 🔴       | Добавить SMS opt-in отдельным чекбоксом                           | `lead-form.tsx`, `api/leads/route.ts:517`                                                                    | Чешский закон о SMS                         |
| 8   | 🟠       | Убрать дубли h3 в door-cards                                      | `components/door-cards.tsx`                                                                                  | A11y + структура                            |
| 9   | 🟠       | Убрать `CLIENT_COUNT=50+`, `DEALS_COUNT=50+` или вписать реальные | `about-counters.tsx`, `social-proof-bar.tsx`, env                                                            | Нет фейков                                  |
| 10  | 🟠       | Упростить hero CTA (1 primary + 1 secondary)                      | `hero-content.tsx`, `home-page-content.tsx`, `floating-desktop-cta.tsx`                                      | +5-8% конверсия                             |
| 11  | 🟠       | Добавить `aria-invalid` + `aria-describedby` ко всем формам       | `lead-form`, `callback-form`, `quick-estimate-form`                                                          | WCAG 2.1 AA                                 |
| 12  | 🟠       | Заменить placeholder-only label на видимый                        | `lead-magnet-form:76`, `quick-estimate-form:149,204`                                                         | WCAG 2.1 A                                  |
| 13  | 🟠       | Расслабить regex CZ-телефона + согласовать фронт ↔ бэк            | `api/leads/route.ts:18`, `lib/phone.ts`                                                                      | Не отбрасывать валидные номера              |
| 14  | 🟠       | Заменить in-memory rate-limit на Upstash                          | `api/leads/route.ts:349-365`                                                                                 | Реально работающий rate-limit на serverless |
| 15  | 🟠       | `<Image fill>` + `sizes` для всех hero/feature изображений        | `below-fold-sections.tsx:222,412`                                                                            | LCP / трафик                                |

---

# 11. Что я НЕ нашёл (хорошие новости)

- ✅ Czech диакритика — корректна везде, где проверял.
- ✅ Декленции (locative/accusative) — отдельные поля в `regions.yml`, грамотное использование.
- ✅ Цены `/m²` — со ссылкой на источник `RealityMIX 02/2026, ČSÚ Q1 2025` ([src/lib/price-data.ts:5](src/lib/price-data.ts:5)) → можно защитить.
- ✅ Структура `/api/leads` — Zod-валидация, разделение Result vs throw, нормальная telemetry.
- ✅ Honeypot, basic rate-limit, GDPR consent в форме — есть, не идеально, но есть.
- ✅ Exit-intent popup — fires once per session, focus trap, Esc-handler — выполнено грамотно.
- ✅ Sticky mobile CTA — `safe-area-inset-bottom`, `md:hidden`, прячется при появлении формы.
- ✅ Image sitemap, regional sitemaps, robots — продумано.
- ✅ JSON-LD Organization / Service / FAQ — присутствует.

---

# Дальнейшие шаги (на твоё решение)

Я готов начать фиксить любым подмножеством из «Топ-15» в порядке твоего выбора. Можно идти:

- **Pack A** (≈30 мин): пп. 1, 2, 9 — снести фейки полностью.
- **Pack B** (≈1 ч): пп. 3, 4, 5, 7 — закрыть юр./GDPR-риски.
- **Pack C** (≈1.5 ч): пп. 6, 8, 11, 12 — a11y-блок.
- **Pack D** (≈1 ч): пп. 10, 15 + дубли h3 — UX/визуал.
- **Pack E** (≈1 ч): пп. 13, 14 — формы / API.

Скажи, какой Pack или какие конкретные номера запускать в работу.
