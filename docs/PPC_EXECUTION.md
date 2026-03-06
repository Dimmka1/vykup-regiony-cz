# PPC Execution Checklist — Google Ads + Sklik

> Проект: vykoupim-nemovitost.cz | Дата: 2026-03-06
> Цель: step-by-step инструкция для owner, чтобы запустить PPC-кампании и получить первые лиды
> Зависимость: PPC_LAUNCH.md (структура кампаний), ANALYTICS_SETUP.md (GTM events)

---

## 1. Pre-Launch Checklist

### 1.1 Google Ads — Создание и настройка аккаунта

| #   | Действие                                                                 | URL                                                           | Дедлайн | ✅  |
| --- | ------------------------------------------------------------------------ | ------------------------------------------------------------- | ------- | --- |
| 1   | Создать Google Ads аккаунт (или войти в существующий)                    | https://ads.google.com/signup                                 | День 1  | ☐   |
| 2   | Выбрать "Переключить в режим эксперта" (Expert Mode) — НЕ Smart Campaign | На первом экране после регистрации                            | День 1  | ☐   |
| 3   | Настроить биллинг: добавить кредитную карту, выбрать валюту CZK          | Ads → Tools → Billing → Settings                              | День 1  | ☐   |
| 4   | Установить часовой пояс: Europe/Prague                                   | При создании аккаунта (нельзя изменить позже!)                | День 1  | ☐   |
| 5   | Связать Google Analytics 4 с Google Ads                                  | Ads → Tools → Linked accounts → Google Analytics              | День 1  | ☐   |
| 6   | Создать Conversion Action: "Lead Form Submit"                            | Ads → Tools → Conversions → + New conversion action → Website | День 1  | ☐   |
| 7   | Настроить Conversion Action: Category=Lead, Value=2000 CZK, Count=One    | В настройках conversion action                                | День 1  | ☐   |
| 8   | Скопировать Conversion ID и Conversion Label                             | Из настроек conversion action → Tag setup                     | День 1  | ☐   |
| 9   | Привязать Google Ads Conversion Tag в GTM (см. раздел 4)                 | https://tagmanager.google.com                                 | День 2  | ☐   |
| 10  | Создать аудитории ремаркетинга: All visitors (30d), Form starters (14d)  | Ads → Tools → Audience manager → + New audience               | День 2  | ☐   |

### 1.2 Sklik (Seznam) — Создание и настройка аккаунта

| #   | Действие                                                           | URL                                           | Дедлайн | ✅  |
| --- | ------------------------------------------------------------------ | --------------------------------------------- | ------- | --- |
| 1   | Создать Sklik аккаунт (через Seznam účet)                          | https://www.sklik.cz/registrace               | День 1  | ☐   |
| 2   | Пополнить бюджет: минимум 5 000 Kč на старт                        | Sklik → Účet → Dobít kredit                   | День 1  | ☐   |
| 3   | Создать конверзní akci: "Lead Form Submit"                         | Sklik → Nástroje → Konverze → + Nová konverze | День 1  | ☐   |
| 4   | Получить Sklik conversion pixel код                                | Из настроек конверзní akce                    | День 1  | ☐   |
| 5   | Добавить Sklik pixel в GTM (Custom HTML tag, trigger: form_submit) | https://tagmanager.google.com                 | День 2  | ☐   |
| 6   | Убедиться что Sklik retargeting pixel уже установлен (VR-020 done) | GTM → Tags → Sklik retargeting                | День 2  | ☐   |

### 1.3 Общие проверки

| #   | Действие                                       | Как проверить                                                                | Дедлайн | ✅  |
| --- | ---------------------------------------------- | ---------------------------------------------------------------------------- | ------- | --- |
| 1   | Landing /ppc работает и загружается            | Открыть https://vykoupim-nemovitost.cz/ppc?region=praha                      | День 1  | ☐   |
| 2   | UTM параметры не ломают страницу               | Открыть /ppc?region=praha&utm_source=google&utm_medium=cpc&utm_campaign=test | День 1  | ☐   |
| 3   | Lead form → Google Sheets работает             | Сабмитнуть тестовую заявку, проверить в Sheets                               | День 1  | ☐   |
| 4   | Lead form → Telegram notification работает     | Сабмитнуть тестовую заявку, проверить Telegram                               | День 1  | ☐   |
| 5   | GTM контейнер опубликован (не в Draft)         | GTM → Versions → проверить что есть Published version                        | День 2  | ☐   |
| 6   | GA4 получает events (lead_form_submit_success) | GA4 → Realtime → Events                                                      | День 2  | ☐   |

---

## 2. Бюджет, CPC и ROI

### 2.1 Рекомендуемый стартовый бюджет (Starter tier)

| Платформа  | Дневной бюджет  | Месячный бюджет        |
| ---------- | --------------- | ---------------------- |
| Google Ads | 500 Kč/день     | 15 000 Kč              |
| Sklik      | 270 Kč/день     | 8 000 Kč               |
| **Итого**  | **770 Kč/день** | **23 000 Kč (~920 €)** |

### 2.2 Ожидаемый CPC по типам ключевых слов

| Тип ключевого слова         | Google Ads CPC | Sklik CPC | Примечание                     |
| --------------------------- | -------------- | --------- | ------------------------------ |
| Výkup nemovitosti + region  | 25–65 Kč       | 15–40 Kč  | Основной intent, самый дорогой |
| Prodej bytu rychle + region | 20–50 Kč       | 12–35 Kč  | Высокий intent                 |
| Exekuce + region            | 15–40 Kč       | 10–25 Kč  | Ниже конкуренция               |
| Okamžitý výkup              | 30–70 Kč       | 18–45 Kč  | Высокий intent                 |
| Brand                       | 2–8 Kč         | 1–5 Kč    | Дешёвый, защитный              |
| Remarketing (display)       | 3–10 Kč        | 2–8 Kč    | Дожимаем тёплых                |

**Средний CPC (взвешенный):** ~35 Kč (Google), ~22 Kč (Sklik)

### 2.3 Прогноз CPL (Cost Per Lead)

| Сценарий       | CR (Conversion Rate) | Средний CPC | CPL          |
| -------------- | -------------------- | ----------- | ------------ |
| Пессимистичный | 3%                   | 35 Kč       | **1 167 Kč** |
| Реалистичный   | 4%                   | 30 Kč       | **750 Kč**   |
| Оптимистичный  | 5%                   | 25 Kč       | **500 Kč**   |

### 2.4 ROI прогноз

| Метрика                 | Значение                             |
| ----------------------- | ------------------------------------ |
| Средняя маржа на сделку | 100 000 – 200 000 Kč                 |
| CPL (реалистичный)      | 750 Kč                               |
| Lead → Deal conversion  | 5–10% (real estate standard)         |
| Cost per Deal (CAC)     | 750 / 0.075 = **10 000 Kč**          |
| **ROI**                 | Deal margin 150K / CAC 10K = **15x** |

**Вывод:** При бюджете 23 000 Kč/мес → ~30 лидов → 2–3 сделки → 200–450K Kč маржи. ROI крайне положительный даже при пессимистичном сценарии.

### 2.5 Прогноз по месяцам (Starter budget)

| Месяц | Бюджет            | Клики              | Лиды (4% CR) | Сделки (7.5%) | Маржа       |
| ----- | ----------------- | ------------------ | ------------ | ------------- | ----------- |
| 1     | 23 000 Kč         | ~770               | ~31          | 2–3           | 200–450K Kč |
| 2     | 23 000 Kč         | ~850 (оптимизация) | ~38          | 3             | 300–450K Kč |
| 3     | 35 000 Kč (scale) | ~1 300             | ~58          | 4–5           | 400–750K Kč |

---

## 3. Campaign Structure — Executable Version

### 3.1 Google Ads — Что создать

#### Campaign 1: `GS_NonBrand_Vykup` (Search)

- **Тип:** Search
- **Стратегия ставок:** Manual CPC (первые 2 недели), потом Maximize Conversions
- **Дневной бюджет:** 400 Kč
- **Геотаргетинг:** Česká republika
- **Языки:** Čeština
- **Сеть:** Только Search (ОТКЛЮЧИТЬ Display Network в настройках кампании!)

**20 Ad Groups** (полная структура в PPC_LAUNCH.md, раздел 3):

- 5 регионов × 4 intent types (Výkup, ProdejRychle, Exekuce, OkamžitýVýkup)
- В каждом AG: 3–5 keywords (exact + phrase match)
- В каждом AG: 1 Responsive Search Ad (15 headlines + 4 descriptions — варианты A/B/C из PPC_LAUNCH.md)

**Создание step-by-step:**

1. Ads → Campaigns → + → New campaign → Sales → Search
2. Ввести название `GS_NonBrand_Vykup`
3. Bid strategy → Manual CPC (снять галку "Enhanced CPC")
4. Budget → 400 Kč/day
5. Networks → СНЯТЬ "Include Google Display Network"
6. Locations → Czech Republic
7. Languages → Czech
8. Для каждого из 20 AG: + New ad group → ввести название → добавить keywords → создать RSA

#### Campaign 2: `GS_Brand` (Search)

- **Дневной бюджет:** 50 Kč
- **Стратегия ставок:** Target Impression Share (top of page, 95%)
- **2 Ad Groups:** Brand_Exact, Brand_Broad
- Keywords: `[vykoupim nemovitost]`, `[vykoupím nemovitost]`, `"vykoupim nemovitost"`

#### Campaign 3: `GD_Remarketing` (Display)

- **Дневной бюджет:** 50 Kč (запустить после набора 100+ посетителей)
- **2 Ad Groups:** Remarket_Visitors (30d), Remarket_FormStart (14d)
- Responsive Display Ads

**Negative Keywords** (добавить как Shared List → применить ко всем кампаниям):

- Полный список (32 слова) в PPC_LAUNCH.md, раздел 6

**Ad Extensions** (добавить на уровне аккаунта):

- Sitelinks: Jak to funguje, Garance výkupu, Reference, Kontakt
- Callouts: Bez provize, Peníze do 24h, Záloha ihned, Právní servis v ceně
- Structured snippets: Typy: Byty, Domy, Pozemky, Nemovitosti v exekuci
- Call extension: +420 776 424 145

### 3.2 Sklik — Что создать

Структура зеркалит Google Ads 1:1. Отличия:

| Параметр     | Google Ads                  | Sklik                                                   |
| ------------ | --------------------------- | ------------------------------------------------------- |
| Создание     | ads.google.com              | sklik.cz                                                |
| Bid strategy | Manual CPC → Maximize Conv. | Manual CPC → eCPC                                       |
| Match types  | Exact `[]` + Phrase `""`    | Фrazové + Volné s modifikátorem                         |
| Remarketing  | GD_Remarketing              | SK_Remarketing (через Sklik pixel)                      |
| Ad format    | RSA (15 headlines)          | Rozšířená textová inzerce (3 headlines, 2 descriptions) |

**Campaigns в Sklik:**

1. `SK_Vykup_Regiony` — 20 AG, зеркало GS_NonBrand (бюджет 200 Kč/день)
2. `SK_Brand` — brand keywords (бюджет 30 Kč/день)
3. `SK_Remarketing` — ремаркетинг (бюджет 40 Kč/день)

**Sklik step-by-step:**

1. Sklik → Kampaně → + Nová kampaň → Vyhledávací síť
2. Název: `SK_Vykup_Regiony`
3. Rozpočet: 200 Kč/den
4. Cílení: Česká republika
5. Для каждого AG: + Nová sestava → keywords → inzeráty

### 3.3 Первые 2 недели — Мониторинг и оптимизация

| День | Что делать                                                                               |
| ---- | ---------------------------------------------------------------------------------------- |
| 1–3  | Проверять что все объявления одобрены (Approved). Если Disapproved → исправить           |
| 1–3  | Проверять Search Terms Report ежедневно → добавлять negative keywords                    |
| 3    | Проверить что конверсии записываются (хотя бы 1 тестовый лид)                            |
| 7    | Первый срез: CTR по ad groups. Если CTR < 2% → переписать объявления                     |
| 7    | Паузить keywords с 50+ кликами и 0 конверсий                                             |
| 7    | Проверить Quality Score. Если < 5 → улучшить landing relevance                           |
| 14   | Если набрали 15+ конверсий → переключить на Maximize Conversions (Google) / eCPC (Sklik) |
| 14   | Перераспределить бюджет: больше на top-performing AG, меньше на слабые                   |
| 14   | Решение: scale бюджет или оптимизировать дальше                                          |

**KPI цели на первые 2 недели:**

- CTR: > 3% (Search)
- CR: > 3% (landing page)
- CPC: < 50 Kč (средний)
- Минимум 10 лидов

---

## 4. Conversion Setup Verification

### 4.1 GTM Debug Mode — Пошаговая инструкция

1. Открыть https://tagmanager.google.com
2. Выбрать контейнер vykoupim-nemovitost.cz
3. Нажать **Preview** (правый верхний угол)
4. В открывшемся окне ввести URL: `https://vykoupim-nemovitost.cz/ppc?region=praha`
5. Нажать **Connect** → откроется сайт с debug-панелью внизу
6. На сайте заполнить и сабмитнуть lead form (тестовые данные)
7. В debug-панели GTM проверить:
   - Слева: появился event `lead_form_submit_success`
   - Нажать на этот event → вкладка **Tags Fired** → должны быть:
     - ✅ GA4 Event tag (lead_form_submit_success)
     - ✅ Google Ads Conversion tag (если уже настроен)
     - ✅ Sklik conversion pixel (если уже настроен)
   - Вкладка **Variables** → проверить что dataLayer содержит правильные значения

### 4.2 Google Ads Conversion Tag — Настройка в GTM

**Если ещё не настроен:**

1. GTM → Tags → New
2. Tag type: **Google Ads Conversion Tracking**
3. Заполнить:
   - Conversion ID: `AW-XXXXXXXXX` (из Google Ads → Tools → Conversions → tag setup)
   - Conversion Label: `XXXXXXXXXXX` (оттуда же)
   - Conversion Value: `2000`
   - Currency Code: `CZK`
4. Trigger: выбрать **Custom Event** → Event name: `lead_form_submit_success`
5. Save → Submit (опубликовать новую версию)

### 4.3 Sklik Conversion Pixel — Настройка в GTM

1. GTM → Tags → New
2. Tag type: **Custom HTML**
3. HTML:

```html
<script>
  var convId = "XXXXXXX"; // ID конверзní akce из Sklik
  var img = new Image();
  img.src =
    "https://c.imedia.cz/checkConversion?c=XXXXXXX&color=ffffff&v=" + convId;
</script>
```

4. Trigger: Custom Event → `lead_form_submit_success`
5. Save → Submit

> **Примечание:** Актуальный формат пикселя взять из Sklik → Nástroje → Konverze → Kód konverze. Sklik может обновить формат.

### 4.4 Тестирование End-to-End

**Тест 1: GTM Preview**

1. Включить GTM Preview mode (раздел 4.1)
2. Сабмитнуть form → проверить что все 3 тега сработали
3. ✅ Если все теги в "Tags Fired" — GTM настроен правильно

**Тест 2: Google Ads Conversion**

1. Google Ads → Tools → Conversions
2. Статус должен быть: **Recording conversions** (может занять до 24ч после первого fire)
3. Если "No recent conversions" через 24ч → проверить Conversion ID/Label в GTM

**Тест 3: Google Ads Tag Assistant**

1. Установить расширение [Google Tag Assistant](https://tagassistant.google.com/)
2. Открыть сайт → сабмитнуть форму
3. В Tag Assistant должен появиться Google Ads tag с записанной конверсией

**Тест 4: Sklik Conversion**

1. Sklik → Nástroje → Konverze
2. Статус: "Aktivní" + последняя конверзе = сегодня
3. Если нет → проверить что Custom HTML tag fires в GTM

**Тест 5: Full Pipeline**

1. Открыть /ppc с UTM параметрами: `?region=praha&utm_source=google&utm_medium=cpc&utm_campaign=test`
2. Заполнить форму тестовыми данными
3. Проверить:
   - [ ] Запись в Google Sheets появилась (с UTM данными)
   - [ ] Telegram notification пришёл
   - [ ] GA4 Realtime → event `lead_form_submit_success` виден
   - [ ] Google Ads → Conversions → +1 (через 1–24ч)
   - [ ] Sklik → Konverze → +1 (через 1–24ч)

---

## 5. Timeline — Общий план запуска

| День     | Действие                                                     | Ответственный |
| -------- | ------------------------------------------------------------ | ------------- |
| День 1   | Создать Google Ads + Sklik аккаунты, настроить биллинг       | Owner         |
| День 1   | Проверить landing + lead pipeline (form → Sheets → Telegram) | Owner         |
| День 2   | Настроить conversion actions (Google Ads + Sklik)            | Owner         |
| День 2   | Добавить conversion tags в GTM + опубликовать                | Owner         |
| День 2   | Протестировать всё через GTM Preview (раздел 4)              | Owner         |
| День 3   | Создать кампании в Google Ads (структура из раздела 3.1)     | Owner         |
| День 4   | Создать кампании в Sklik (структура из раздела 3.2)          | Owner         |
| День 4   | Добавить negative keywords + ad extensions                   | Owner         |
| День 5   | **🚀 LAUNCH** — включить кампании                            | Owner         |
| День 5–7 | Ежедневно: проверять одобрение объявлений, search terms      | Owner         |
| День 7   | Первый performance review (CTR, CPC, конверсии)              | Owner         |
| День 14  | Оптимизация: bid strategy, бюджет, паузить слабые AG         | Owner         |
| День 30  | Решение о scale: Growth tier бюджет                          | Owner         |
