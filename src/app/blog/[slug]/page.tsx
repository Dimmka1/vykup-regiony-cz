import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { safeJsonLd } from "@/lib/jsonld";
import { BLOG_POSTS } from "../data";

interface ArticleContent {
  title: string;
  date: string;
  body: React.ReactElement;
}

const ARTICLES: Record<string, ArticleContent> = {
  "jak-probiha-rychly-vykup": {
    title: "Jak probíhá rychlý výkup nemovitosti",
    date: "2026-02-15",
    body: (
      <>
        <p>
          Rychlý výkup nemovitosti je stále populárnější způsob, jak prodat byt,
          dům nebo pozemek bez zdlouhavého čekání na kupce. Celý proces je
          navržen tak, aby byl co nejjednodušší a nejrychlejší. Podívejme se na
          jednotlivé kroky.
        </p>

        <h2>1. Nezávazná poptávka</h2>
        <p>
          Vše začíná vyplněním krátkého formuláře na našich stránkách nebo
          telefonickým kontaktem. Potřebujeme základní informace o nemovitosti —
          typ, lokalitu, velikost a aktuální stav. Formulář zabere maximálně 2
          minuty a je zcela nezávazný.
        </p>

        <h2>2. Ocenění nemovitosti</h2>
        <p>
          Na základě poskytnutých údajů naši odborníci provedou předběžné
          ocenění. Zohledňujeme aktuální tržní ceny v dané lokalitě, stav
          nemovitosti a případná právní břemena. Do 24 hodin vám představíme
          cenovou nabídku.
        </p>

        <h2>3. Prohlídka a finální nabídka</h2>
        <p>
          Pokud vás předběžná nabídka zaujme, domluvíme osobní prohlídku
          nemovitosti. Na místě posoudíme skutečný stav a připravíme finální
          cenovou nabídku. Prohlídka obvykle trvá 30–60 minut a je samozřejmě
          zdarma.
        </p>

        <h2>4. Kupní smlouva</h2>
        <p>
          Po odsouhlasení finální ceny naši právníci připraví kupní smlouvu.
          Veškeré právní náklady hradíme za vás. Smlouvu si můžete nechat
          zkontrolovat vlastním právníkem — na transparentnosti nám záleží.
        </p>

        <h2>5. Podpis a vyplacení</h2>
        <p>
          Podpis smlouvy probíhá u notáře. Peníze jsou převedeny přes advokátní
          úschovu, což zaručuje maximální bezpečnost transakce. Celou částku
          obdržíte obvykle do 3–5 pracovních dnů od podpisu.
        </p>

        <h2>Proč zvolit rychlý výkup?</h2>
        <p>
          Klasický prodej přes realitní kancelář trvá v průměru 3–6 měsíců.
          Rychlý výkup zvládneme za 2–4 týdny. Nemusíte řešit inzerci, prohlídky
          s desítkami zájemců ani nejistotu, zda se kupec nakonec nerozhodne
          jinak. Je to ideální řešení pro ty, kdo potřebují prodat rychle a bez
          starostí.
        </p>
      </>
    ),
  },
  "5-duvodu-proc-prodat": {
    title: "5 důvodů proč prodat nemovitost přes výkupní firmu",
    date: "2026-02-10",
    body: (
      <>
        <p>
          Prodej nemovitosti je zásadní životní rozhodnutí. Stále více majitelů
          v České republice volí prodej přes výkupní firmu místo klasické
          realitní kanceláře. Proč? Zde je pět hlavních důvodů.
        </p>

        <h2>1. Rychlost celého procesu</h2>
        <p>
          Největší výhodou je bezkonkurenční rychlost. Zatímco prodej přes
          realitku trvá průměrně 3–6 měsíců, výkupní firma dokáže celou
          transakci zvládnout za 2–4 týdny. Nabídku dostanete do 24 hodin od
          prvního kontaktu. To je klíčové zejména v situacích, kdy potřebujete
          rychle získat finanční prostředky — například při rozvodu, dědictví
          nebo finančních potížích.
        </p>

        <h2>2. Žádné provize a skryté poplatky</h2>
        <p>
          Realitní kanceláře si účtují provizi obvykle 3–5 % z prodejní ceny. U
          nemovitosti za 3 miliony korun to znamená 90 000–150 000 Kč. Při
          výkupu neplatíte žádnou provizi. Veškeré náklady na právní služby,
          odhad a převod hradí výkupní firma.
        </p>

        <h2>3. Prodej v jakémkoliv stavu</h2>
        <p>
          Nemovitost nemusíte před prodejem opravovat, malovat ani uklízet.
          Výkupní firma kupuje nemovitosti ve stávajícím stavu — ať už jde o
          zanedbaný byt, starší dům vyžadující rekonstrukci nebo pozemek s
          ekologickou zátěží. Ušetříte čas i peníze za případné úpravy.
        </p>

        <h2>4. Řešení právně komplikovaných nemovitostí</h2>
        <p>
          Máte na nemovitosti exekuci, zástavní právo nebo věcné břemeno?
          Klasický kupec se takové nemovitosti většinou bojí. Výkupní firmy se
          na tyto případy specializují a dokáží celou situaci vyřešit — včetně
          jednání s věřiteli a exekutory. Více o tomto tématu najdete v našem
          článku o{" "}
          <Link
            href="/blog/vykup-v-exekuci"
            className="text-emerald-600 hover:text-emerald-500"
          >
            výkupu nemovitosti v exekuci
          </Link>
          .
        </p>

        <h2>5. Jistota a bezpečnost</h2>
        <p>
          U klasického prodeje se může stát, že kupec na poslední chvíli couvne,
          banka neschválí hypotéku nebo se objeví jiné komplikace. Při výkupu
          máte od začátku jasnou dohodu. Peníze jsou zajištěny přes advokátní
          úschovu a celý proces je právně ošetřen. Žádná nejistota, žádné
          překvapení.
        </p>

        <h2>Je výkup správná volba pro vás?</h2>
        <p>
          Rychlý výkup není pro každého. Pokud nemáte na spěch a chcete získat
          maximální tržní cenu, může být klasický prodej lepší volbou. Ale pokud
          potřebujete rychlost, jistotu a bezstarostnost, výkupní firma je
          ideální řešení. Podívejte se na naše{" "}
          <Link
            href="/caste-dotazy"
            className="text-emerald-600 hover:text-emerald-500"
          >
            časté dotazy
          </Link>{" "}
          nebo nás rovnou{" "}
          <Link href="/" className="text-emerald-600 hover:text-emerald-500">
            kontaktujte pro nezávaznou nabídku
          </Link>
          .
        </p>
      </>
    ),
  },
  "vykup-v-exekuci": {
    title: "Výkup nemovitosti v exekuci — co potřebujete vědět",
    date: "2026-02-05",
    body: (
      <>
        <p>
          Exekuce na nemovitosti je stresující situace, která může skončit
          nuceným prodejem v dražbě — často hluboko pod tržní cenou. Existuje
          ale lepší řešení: dobrovolný prodej nemovitosti výkupní firmě. Pojďme
          se podívat, jak to funguje a co k tomu potřebujete.
        </p>

        <h2>Co je exekuce na nemovitost?</h2>
        <p>
          Exekuce je nucený výkon rozhodnutí soudu, kdy exekutor může zabavit a
          prodat váš majetek k úhradě dluhů. U nemovitostí to znamená zápis
          exekučního příkazu do katastru nemovitostí a následně dražbu. V dražbě
          se nemovitost často prodá za 60–70 % tržní hodnoty, přičemž z výtěžku
          se přednostně hradí náklady exekuce.
        </p>

        <h2>Proč je dobrovolný prodej lepší než dražba?</h2>
        <p>
          Při dobrovolném prodeji přes výkupní firmu získáte výrazně vyšší cenu
          — obvykle 80–90 % tržní hodnoty. Navíc máte kontrolu nad celým
          procesem a můžete vyjednat lepší podmínky. Klíčové je jednat včas,
          dokud exekutor nenařídil dražbu.
        </p>

        <h2>Jak probíhá výkup nemovitosti v exekuci?</h2>
        <p>
          Proces je složitější než u běžného výkupu, ale zkušená firma vše
          zvládne za vás. Prvním krokem je analýza dluhů a exekučních řízení.
          Následuje ocenění nemovitosti a příprava nabídky. Klíčovou fází je
          jednání s exekutorem o udělení souhlasu s prodejem. Po dohodě se
          připraví kupní smlouva a z kupní ceny se přímo uhradí dluhy věřitelům.
        </p>

        <h2>Co potřebujete k zahájení?</h2>
        <p>
          Pro rychlé posouzení vaší situace budeme potřebovat: výpis z katastru
          nemovitostí (list vlastnictví), přehled exekučních řízení (můžete
          zjistit na centrální evidenci exekucí), informace o výši dluhů a
          kontakt na exekutora. Pokud tyto dokumenty nemáte, pomůžeme vám je
          získat.
        </p>

        <h2>Časté obavy a mýty</h2>
        <p>
          Mnoho lidí se bojí, že prodej v exekuci není možný bez souhlasu
          exekutora. To není pravda — dobrovolný prodej je možný, ale vyžaduje
          součinnost exekutora a jeho písemný souhlas. Dalším mýtem je, že po
          prodeji zůstanou dluhy. Ve většině případů se z kupní ceny pokryjí
          všechny pohledávky. Pokud kupní cena nepokryje vše, zbývající dluh je
          výrazně nižší a lze dojednat splátkový kalendář.
        </p>

        <h2>Neváhejte jednat</h2>
        <p>
          Čím dříve začnete řešit prodej, tím větší máte šanci na lepší
          výsledek. Jakmile exekutor nařídí dražbu, vaše možnosti se výrazně
          zúží. Podívejte se,{" "}
          <Link
            href="/blog/jak-probiha-rychly-vykup"
            className="text-emerald-600 hover:text-emerald-500"
          >
            jak probíhá rychlý výkup
          </Link>
          , nebo nás{" "}
          <Link href="/" className="text-emerald-600 hover:text-emerald-500">
            kontaktujte pro nezávaznou konzultaci
          </Link>
          . Poradíme vám zdarma a diskrétně.
        </p>
      </>
    ),
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return {};
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  return {
    title: article.title,
    description: post?.excerpt ?? "",
    openGraph: {
      title: article.title,
      description: post?.excerpt ?? "",
      type: "article",
      publishedTime: article.date,
      images: ["/blog/" + slug + "/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: post?.excerpt ?? "",
    },
  };
}

export default async function BlogArticlePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.date,
    author: {
      "@type": "Organization",
      name: "Výkup Regiony CZ",
    },
    publisher: {
      "@type": "Organization",
      name: "Výkup Regiony CZ",
    },
  };

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />

      <article className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-8">
            <Link
              href="/blog"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
            >
              ← Zpět na blog
            </Link>
          </div>

          <header>
            <time dateTime={article.date} className="text-sm text-slate-500">
              {new Date(article.date).toLocaleDateString("cs-CZ", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {article.title}
            </h1>
          </header>

          <div className="prose-article mt-10 rounded-2xl bg-white p-8 shadow-sm">
            {article.body}
          </div>

          <div className="mt-12 rounded-2xl bg-emerald-50 p-8 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              Chcete prodat nemovitost rychle?
            </h2>
            <p className="mt-2 text-slate-600">
              Získejte nezávaznou nabídku do 24 hodin.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Získat nabídku zdarma
            </Link>
          </div>

          {otherPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-slate-900">Další články</h2>
              <div className="mt-4 space-y-4">
                {otherPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <h3 className="font-semibold text-slate-900">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {post.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center gap-4 text-sm">
            <Link
              href="/caste-dotazy"
              className="text-emerald-600 hover:text-emerald-500"
            >
              Časté dotazy
            </Link>
            <Link href="/" className="text-emerald-600 hover:text-emerald-500">
              Domovská stránka
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
