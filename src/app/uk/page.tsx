import type { ReactElement } from "react";
import type { Metadata } from "next";
import { safeJsonLd } from "@/lib/jsonld";
import { UkLeadForm } from "@/components/uk-lead-form";
import { FaqAccordion } from "@/components/faq-accordion";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  Check,
  Phone,
  Shield,
  Clock,
  Banknote,
  FileSignature,
  Star,
  Users,
  Scale,
  Home,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

const PHONE = "+420 776 424 145";
const EMAIL = "info@vykoupim-nemovitost.cz";
const DOMAIN = "https://vykoupim-nemovitost.cz";

const UK_FAQ: { question: string; answer: string }[] = [
  {
    question: "Як швидко ви можете викупити мою нерухомість?",
    answer:
      "Весь процес від першого контакту до отримання грошей зазвичай займає 7–14 днів. У термінових випадках ми можемо завершити все протягом 48 годин. Ми розуміємо, що для українців у Чехії час часто є критичним фактором, тому працюємо максимально оперативно.",
  },
  {
    question:
      "Чи потрібно мені мати чеське громадянство для продажу нерухомості?",
    answer:
      "Ні, громадянство не потрібне. Якщо ви є власником нерухомості в Чехії (зареєстровані в katastru nemovitostí), ви маєте повне право її продати незалежно від вашого громадянства чи типу дозволу на проживання. Ми допоможемо з усіма документами.",
  },
  {
    question: "Які документи мені потрібні для продажу?",
    answer:
      "Основні документи: виписка з кадастру нерухомості (výpis z katastru), документ про власність, та ваш паспорт або посвідчення особи. Якщо є іпотека або інші обтяження — ми допоможемо їх вирішити. Наш юрист підготує всі необхідні документи безкоштовно.",
  },
  {
    question:
      "Чи можете ви допомогти, якщо на нерухомості є іпотека (hypotéka)?",
    answer:
      "Так, ми регулярно працюємо з нерухомістю, обтяженою іпотекою. Ми можемо погасити залишок іпотеки з купівельної ціни і виплатити вам різницю. Весь процес координуємо з банком — вам не потрібно нічого вирішувати самостійно.",
  },
  {
    question: "Хто оплачує юридичні послуги та переоформлення?",
    answer:
      "Усі витрати на юридичні послуги, оцінку нерухомості, підготовку договору та переоформлення в кадастрі оплачуємо ми. Для вас весь процес абсолютно безкоштовний — жодних комісій чи прихованих платежів.",
  },
  {
    question: "Як гарантується безпека угоди?",
    answer:
      "Гроші зберігаються на рахунку адвокатського депозиту (advokátní úschova) — це найбезпечніший спосіб проведення угод з нерухомістю в Чехії. Кошти переводяться вам тільки після успішного запису в кадастрі. Договір готує незалежний адвокат.",
  },
  {
    question: "Чи можу я спілкуватися українською?",
    answer:
      "Так! Ми розуміємо потреби українських клієнтів і забезпечуємо комунікацію зрозумілою мовою. Ми також надаємо всі пояснення щодо чеського законодавства та процедур простою і доступною мовою.",
  },
];

const TRUST_POINTS = [
  {
    icon: Shield,
    title: "Advokátní úschova",
    description:
      "Гроші захищені на депозитному рахунку адвоката до завершення переоформлення",
  },
  {
    icon: Clock,
    title: "Гроші за 48 годин",
    description:
      "Після підписання договору кошти надходять на ваш рахунок протягом 48 годин",
  },
  {
    icon: Banknote,
    title: "Без комісії",
    description:
      "Жодних прихованих платежів — юрист, оцінка та переоформлення безкоштовно",
  },
  {
    icon: FileSignature,
    title: "Záloha при підписанні",
    description:
      "Завдаток до 500 000 Kč виплачується одразу при підписанні попереднього договору",
  },
  {
    icon: Scale,
    title: "Правовий захист",
    description:
      "Незалежний адвокат готує договір і захищає ваші інтереси на кожному етапі",
  },
  {
    icon: Users,
    title: "Досвід з українськими клієнтами",
    description:
      "Ми розуміємо специфіку ситуацій українських власників нерухомості в Чехії",
  },
] as const;

const PROCESS_STEPS = [
  {
    step: 1,
    title: "Заповніть форму",
    description:
      "Вкажіть основну інформацію про вашу нерухомість — це займе лише 2 хвилини",
    time: "2 хв",
  },
  {
    step: 2,
    title: "Отримайте пропозицію",
    description:
      "Протягом 24 годин ми підготуємо безкоштовну та необов'язкову цінову пропозицію",
    time: "24 год",
  },
  {
    step: 3,
    title: "Підписання договору",
    description:
      "Наш адвокат підготує купівельний договір з advokátní úschovou — все безкоштовно",
    time: "за домовленістю",
  },
  {
    step: 4,
    title: "Гроші на рахунку",
    description:
      "Після підписання договору кошти надходять на ваш банківський рахунок протягом 48 годин",
    time: "48 год",
  },
] as const;

const TESTIMONIALS = [
  {
    name: "Олена К.",
    text: "Продала квартиру в Празі за 10 днів. Все було прозоро, юрист пояснив кожен крок. Дуже рекомендую!",
    location: "Прага",
  },
  {
    name: "Андрій М.",
    text: "Мав іпотеку на будинок і думав, що продати буде складно. Команда все вирішила — і іпотеку закрили, і гроші отримав швидко.",
    location: "Брно",
  },
  {
    name: "Ірина Т.",
    text: "Після переїзду до Чехії купила квартиру, але ситуація змінилась. Викуп пройшов швидко, без стресу. Дякую!",
    location: "Острава",
  },
] as const;

const jsonLdData = [
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${DOMAIN}/uk#business`,
    name: "Швидкий викуп нерухомості в Чехії",
    description:
      "Викуп квартир, будинків та земельних ділянок по всій Чехії. Пропозиція протягом 24 годин, гроші на рахунку за 48 годин. Без комісії, юридичний сервіс безкоштовно.",
    url: `${DOMAIN}/uk`,
    telephone: PHONE,
    email: EMAIL,
    areaServed: {
      "@type": "Country",
      name: "Česká republika",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "CZ",
    },
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    availableLanguage: [
      { "@type": "Language", name: "Ukrainian" },
      { "@type": "Language", name: "Czech" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Як швидко ви можете викупити мою нерухомість?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Весь процес від першого контакту до отримання грошей зазвичай займає 7–14 днів. У термінових випадках ми можемо завершити все протягом 48 годин.",
        },
      },
      {
        "@type": "Question",
        name: "Чи потрібно мені мати чеське громадянство для продажу нерухомості?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ні, громадянство не потрібне. Якщо ви є власником нерухомості в Чехії, ви маєте повне право її продати незалежно від вашого громадянства чи типу дозволу на проживання.",
        },
      },
      {
        "@type": "Question",
        name: "Які документи мені потрібні для продажу?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Основні документи: виписка з кадастру нерухомості (výpis z katastru), документ про власність, та ваш паспорт або посвідчення особи.",
        },
      },
      {
        "@type": "Question",
        name: "Чи можете ви допомогти, якщо на нерухомості є іпотека?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Так, ми регулярно працюємо з нерухомістю, обтяженою іпотекою. Ми можемо погасити залишок іпотеки з купівельної ціни і виплатити вам різницю.",
        },
      },
      {
        "@type": "Question",
        name: "Хто оплачує юридичні послуги та переоформлення?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Усі витрати на юридичні послуги, оцінку нерухомості, підготовку договору та переоформлення в кадастрі оплачуємо ми. Для вас весь процес абсолютно безкоштовний.",
        },
      },
      {
        "@type": "Question",
        name: "Як гарантується безпека угоди?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Гроші зберігаються на рахунку адвокатського депозиту (advokátní úschova). Кошти переводяться вам тільки після успішного запису в кадастрі.",
        },
      },
      {
        "@type": "Question",
        name: "Чи можу я спілкуватися українською?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Так! Ми розуміємо потреби українських клієнтів і забезпечуємо комунікацію зрозумілою мовою.",
        },
      },
    ],
  },
];

export const metadata: Metadata = {
  title: "Швидкий викуп нерухомості в Чехії | Vykoupím Nemovitost",
  description:
    "Викуп квартир, будинків та земельних ділянок по всій Чехії. Пропозиція за 24 години, гроші за 48 годин. Без комісії. Юридичний сервіс безкоштовно. Advokátní úschova.",
  keywords: [
    "викуп нерухомості Чехія",
    "продати квартиру Прага",
    "výkup nemovitostí",
    "продаж нерухомості Чехія",
    "українці Чехія нерухомість",
    "швидкий продаж квартири",
    "викуп будинку Чехія",
  ],
  alternates: {
    canonical: `${DOMAIN}/uk`,
    languages: {
      cs: DOMAIN,
      uk: `${DOMAIN}/uk`,
      "x-default": DOMAIN,
    },
  },
  openGraph: {
    title: "Швидкий викуп нерухомості в Чехії",
    description:
      "Пропозиція за 24 години, гроші за 48 годин. Без комісії. Юридичний сервіс безкоштовно.",
    url: `${DOMAIN}/uk`,
    siteName: "Vykoupím Nemovitost",
    locale: "uk_UA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Швидкий викуп нерухомості в Чехії",
    description:
      "Пропозиція за 24 години, гроші за 48 годин. Без комісії. Юридичний сервіс безкоштовно.",
  },
};

export default function UkrainianLandingPage(): ReactElement {
  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div
          className="absolute inset-0 bg-[url('/images/hero-prague.jpg')] bg-cover bg-center opacity-20"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/95"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[1400px] px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Hero content */}
            <div className="flex flex-col justify-center">
              <div className="mb-6 flex flex-wrap gap-3">
                <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300 backdrop-blur-md">
                  🇺🇦 Для українців у Чехії
                </span>
                <span className="inline-flex rounded-full border border-yellow-400/30 bg-yellow-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-yellow-300 backdrop-blur-md">
                  Прямий покупець — не ріелтор
                </span>
              </div>

              <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Швидкий викуп
                <br />
                <span className="text-[var(--theme-400)]">
                  нерухомості в Чехії
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
                Ви — власник квартири, будинку чи земельної ділянки в Чехії?
                Допоможемо продати швидко, безпечно та за справедливу ціну.
                Пропозиція протягом 24 годин, гроші на рахунку за 48 годин.
                Працюємо по всій Чеській Республіці — Прага, Брно, Острава,
                Пльзень та всі 14 країв.
              </p>

              <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                {[
                  "Záloha до 500 000 Kč одразу",
                  "Гроші за 48 годин",
                  "Без комісії та платежів",
                ].map((badge) => (
                  <li
                    key={badge}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white backdrop-blur-md"
                  >
                    <Check
                      className="h-4 w-4 text-[var(--theme-400)]"
                      aria-hidden="true"
                    />
                    {badge}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#kontakt"
                  className="cta-glow btn-ripple inline-flex min-h-[52px] items-center justify-center rounded-xl bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-8 py-4 text-lg font-semibold text-white transition hover:from-[var(--theme-500)] hover:to-[var(--theme-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
                >
                  Отримати пропозицію — безкоштовно
                </a>
                <a
                  href="tel:+420776424145"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
                  aria-label={`Зателефонувати ${PHONE}`}
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  {PHONE}
                </a>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-white/70">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span>Довіряють 500+ клієнтів по всій Чехії</span>
              </div>
            </div>

            {/* Right: Lead form */}
            <div className="flex items-center" id="kontakt">
              <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
                <UkLeadForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST SECTION ===== */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1400px] px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--theme-600)]">
                Чому нам довіряють
              </p>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                Гарантії безпеки вашої угоди
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Ми забезпечуємо повну прозорість та юридичний захист на кожному
                етапі продажу вашої нерухомості
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST_POINTS.map((point, idx) => (
              <ScrollReveal key={point.title} delay={idx * 100}>
                <div className="flex h-full gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--theme-50)] text-[var(--theme-600)]">
                    <point.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {point.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {point.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1400px] px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                Як відбувається викуп
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Від першого контакту до грошей на рахунку — простий та
                зрозумілий процес
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, idx) => (
              <ScrollReveal key={step.step} delay={idx * 150}>
                <div className="relative rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--theme-600)] text-xl font-bold text-white">
                    {step.step}
                  </div>
                  <span className="mb-2 inline-block rounded-full bg-[var(--theme-50)] px-3 py-1 text-xs font-semibold text-[var(--theme-700)]">
                    {step.time}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOR UKRAINIANS SECTION ===== */}
      <section className="bg-gradient-to-br from-blue-50 to-yellow-50 py-16 sm:py-24">
        <div className="mx-auto max-w-[1400px] px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                Спеціально для українців у Чехії
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Понад 500 000 українців живуть у Чехії. Ми розуміємо ваші
                потреби та специфіку вашої ситуації
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 lg:grid-cols-2">
            <ScrollReveal>
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-slate-900">
                  <Home className="mb-1 mr-2 inline h-5 w-5 text-[var(--theme-600)]" />
                  Які нерухомості ми викуповуємо
                </h3>
                <ul className="space-y-3 text-slate-700">
                  {[
                    "Квартири (byty) — від гарсоньєр до великих квартир",
                    "Будинки (domy) — родинні будинки, котеджі, вілли",
                    "Земельні ділянки (pozemky) — будівельні та інші",
                    "Частки (podíly) — навіть без згоди інших співвласників",
                    "Нерухомість з іпотекою (hypotéka) — погасимо за вас",
                    "Нерухомість під екзекуцією — допоможемо вирішити",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 h-5 w-5 shrink-0 text-[var(--theme-600)]"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-slate-900">
                  <HelpCircle className="mb-1 mr-2 inline h-5 w-5 text-[var(--theme-600)]" />
                  Типові ситуації наших клієнтів
                </h3>
                <ul className="space-y-3 text-slate-700">
                  {[
                    "Повернення на Україну — потрібно швидко продати нерухомість",
                    "Переїзд в інше місто Чехії — немає часу на довгий продаж",
                    "Розлучення — потрібно розділити майно справедливо",
                    "Спадщина — отримали нерухомість і хочете її продати",
                    "Фінансові труднощі — потрібні гроші якнайшвидше",
                    "Інвестиція не виправдалась — хочете вийти з проєкту",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 h-5 w-5 shrink-0 text-[var(--theme-600)]"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={300}>
            <div className="mt-12 rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-slate-900">
                Чому українці обирають нас
              </h3>
              <p className="mb-4 text-slate-700">
                Ми працюємо з українськими клієнтами вже багато років і
                розуміємо специфіку їхніх ситуацій. Наша команда надає
                професійний сервіс з урахуванням особливостей, з якими
                стикаються іноземні власники нерухомості в Чехії.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-bold text-[var(--theme-700)]">
                    500 000+
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    українців у Чехії
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-bold text-[var(--theme-700)]">
                    7–14 днів
                  </p>
                  <p className="mt-1 text-sm text-slate-600">весь процес</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-bold text-[var(--theme-700)]">
                    100%
                  </p>
                  <p className="mt-1 text-sm text-slate-600">безпечні угоди</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1400px] px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Відгуки наших клієнтів
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t, idx) => (
              <ScrollReveal key={t.name} delay={idx * 150}>
                <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-slate-50 p-6">
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="flex-1 text-slate-700">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-4 text-sm font-semibold text-slate-900">
                    {t.name}
                    <span className="ml-2 font-normal text-slate-500">
                      {t.location}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-[var(--theme-700)] py-12">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
            {[
              { value: "500+", label: "задоволених клієнтів" },
              { value: "14", label: "країв Чехії" },
              { value: "48 год", label: "гроші на рахунку" },
              { value: "0 Kč", label: "комісія" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold text-white sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <ScrollReveal>
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Часті запитання
              </h2>
              <p className="mt-3 text-lg text-slate-600">
                Відповіді на найпоширеніші питання про викуп нерухомості в Чехії
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <FaqAccordion items={UK_FAQ} />
          </ScrollReveal>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="bg-slate-900 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Готові продати нерухомість?
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Заповніть форму вище або зателефонуйте нам — перша консультація
            безкоштовна та не зобов&#39;язує
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#kontakt"
              className="cta-glow btn-ripple inline-flex min-h-[52px] items-center justify-center rounded-xl bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-8 py-4 text-lg font-semibold text-white transition hover:from-[var(--theme-500)] hover:to-[var(--theme-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
            >
              Отримати безкоштовну пропозицію
            </a>
            <a
              href="tel:+420776424145"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-4 text-lg font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
              aria-label={`Зателефонувати ${PHONE}`}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              {PHONE}
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Контакт: {PHONE} · {EMAIL}
          </p>
        </div>
      </section>

      {/* ===== FOOTER LINK BACK ===== */}
      <div className="bg-slate-950 py-4 text-center text-sm text-slate-500">
        <Link href="/" className="transition hover:text-white">
          ← Hlavní stránka (česky)
        </Link>
      </div>

      {/* ===== STICKY MOBILE BAR ===== */}
      <nav
        aria-label="Швидкі дії"
        className="mobile-bar-glass fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 px-4 py-3 supports-[padding:max(0px)]:pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        <p className="mb-2 text-center text-xs text-slate-500">
          ✓ Без комісії &nbsp;·&nbsp; ✓ Пропозиція за 24 год &nbsp;·&nbsp; ✓
          Юрист безкоштовно
        </p>
        <div className="mx-auto flex max-w-7xl gap-2">
          <a
            href="#kontakt"
            className="cta-glow btn-ripple inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-4 py-3 text-sm font-semibold text-white"
          >
            Заповнити форму
          </a>
          <a
            href="tel:+420776424145"
            className="btn-ripple inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800"
            aria-label={`Зателефонувати ${PHONE}`}
          >
            Зателефонувати
          </a>
        </div>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLdData) }}
      />
    </div>
  );
}
