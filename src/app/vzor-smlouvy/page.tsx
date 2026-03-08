import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, FileText } from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title:
    "Vzor smlouvy o v\u00FDkupu nemovitosti \u2014 co obsahuje a na co si d\u00E1t pozor",
  description:
    "Pod\u00EDvejte se na vzor kupn\u00ED smlouvy p\u0159i v\u00FDkupu nemovitosti. Vysv\u011Btlujeme ka\u017Ed\u00FD bod srozumiteln\u011B \u2014 od kupn\u00ED ceny p\u0159es advok\u00E1tn\u00ED \u00FAschovu a\u017E po z\u00E1ruky prod\u00E1vaj\u00EDc\u00EDho.",
  keywords: [
    "vzor smlouvy v\u00FDkup nemovitosti",
    "kupn\u00ED smlouva v\u00FDkup",
    "smlouva o v\u00FDkupu nemovitosti",
    "vzor kupn\u00ED smlouvy",
  ],
  alternates: { canonical: "https://vykoupim-nemovitost.cz/vzor-smlouvy" },
};

const SITE_URL = "https://vykoupim-nemovitost.cz";

const JSON_LD_ARTICLE = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Vzor smlouvy o v\u00FDkupu nemovitosti \u2014 co obsahuje a na co si d\u00E1t pozor",
  description:
    "Pod\u00EDvejte se na vzor kupn\u00ED smlouvy p\u0159i v\u00FDkupu nemovitosti. Vysv\u011Btlujeme ka\u017Ed\u00FD bod srozumiteln\u011B.",
  url: `${SITE_URL}/vzor-smlouvy`,
  datePublished: "2026-03-08",
  dateModified: "2026-03-08",
  author: {
    "@type": "Organization",
    name: "V\u00FDkup Nemovitost\u00ED",
    url: SITE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "V\u00FDkup Nemovitost\u00ED",
    url: SITE_URL,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE_URL}/vzor-smlouvy`,
  },
};

const JSON_LD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Je smlouva o v\u00FDkupu nemovitosti bezpe\u010Dn\u00E1?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ano. Smlouvu p\u0159ipravuje nez\u00E1visl\u00FD advok\u00E1t, kter\u00FD dohl\u00ED\u017E\u00ED na cel\u00FD proces. Pen\u00EDze jsou ulo\u017Eeny v advok\u00E1tn\u00ED \u00FAschov\u011B a vyplaceny a\u017E po z\u00E1pisu do katastru nemovitost\u00ED. Ob\u011B strany jsou tak maxim\u00E1ln\u011B chr\u00E1n\u011Bny.",
      },
    },
    {
      "@type": "Question",
      name: "Kdo plat\u00ED poplatky spojen\u00E9 s p\u0159evodem nemovitosti?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ve\u0161ker\u00E9 poplatky spojen\u00E9 s p\u0159evodem \u2014 v\u010Detn\u011B spr\u00E1vn\u00EDho poplatku za vklad do katastru a odm\u011Bny advok\u00E1ta za p\u0159\u00EDpravu smlouvy a \u00FAschovu \u2014 hrad\u00ED v\u00FDkupn\u00ED spole\u010Dnost. Prod\u00E1vaj\u00EDc\u00ED neplat\u00ED nic.",
      },
    },
    {
      "@type": "Question",
      name: "Jak prob\u00EDh\u00E1 advok\u00E1tn\u00ED \u00FAschova p\u0159i v\u00FDkupu nemovitosti?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kupuj\u00EDc\u00ED slo\u017E\u00ED celou kupn\u00ED cenu na \u00FAschovn\u00ED \u00FA\u010Det advok\u00E1ta je\u0161t\u011B p\u0159ed pod\u00E1n\u00EDm n\u00E1vrhu na vklad do katastru. Advok\u00E1t pen\u00EDze uvoln\u00ED prod\u00E1vaj\u00EDc\u00EDmu a\u017E po \u00FAsp\u011B\u0161n\u00E9m z\u00E1pisu p\u0159evodu vlastnick\u00E9ho pr\u00E1va. T\u00EDm je zaji\u0161t\u011Bno, \u017Ee prod\u00E1vaj\u00EDc\u00ED dostane zaplaceno a kupuj\u00EDc\u00ED z\u00EDsk\u00E1 nemovitost bez rizika.",
      },
    },
    {
      "@type": "Question",
      name: "Mohu si smlouvu nechat zkontrolovat vlastn\u00EDm pr\u00E1vn\u00EDkem?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Samoz\u0159ejm\u011B. Doporu\u010Dujeme ka\u017Ed\u00E9mu prod\u00E1vaj\u00EDc\u00EDmu, aby si smlouvu nechal nez\u00E1visle posoudit. Transparentnost je pro n\u00E1s priorita \u2014 smlouvu pos\u00EDl\u00E1me s dostate\u010Dn\u00FDm p\u0159edstihem, abyste m\u011Bli \u010Das na jej\u00ED prostudov\u00E1n\u00ED.",
      },
    },
  ],
};

interface ContractSection {
  id: string;
  title: string;
  sample: string;
  explanation: string;
}

const CONTRACT_SECTIONS: ContractSection[] = [
  {
    id: "strany",
    title: "\u010Cl\u00E1nek I \u2014 Smluvn\u00ED strany",
    sample:
      "Prod\u00E1vaj\u00EDc\u00ED: Jan Nov\u00E1k, r.\u010D. xxxxxx/xxxx, bytem ulice xxxxxxx xx, xxx xx Praha x\nKupuj\u00EDc\u00ED: V\u00DDKUP NEMOVITOST\u00CD s.r.o., I\u010CO: xxxxxxxx, se s\u00EDdlem ulice xxxxxxx xx, xxx xx Praha x, zapsan\u00E1 v obchodn\u00EDm rejst\u0159\u00EDku veden\u00E9m M\u011Bstsk\u00FDm soudem v Praze, odd\u00EDl C, vlo\u017Eka xxxxx",
    explanation:
      "V \u00FAvodu smlouvy se p\u0159esn\u011B identifikuj\u00ED ob\u011B strany \u2014 prod\u00E1vaj\u00EDc\u00ED i kupuj\u00EDc\u00ED. Uv\u00E1d\u00ED se jm\u00E9no, rodn\u00E9 \u010D\u00EDslo (u fyzick\u00FDch osob), I\u010CO (u firem), bydli\u0161t\u011B nebo s\u00EDdlo. To zaji\u0161\u0165uje, \u017Ee je zcela jasn\u00E9, kdo nemovitost prod\u00E1v\u00E1 a kdo ji kupuje. Pokud prod\u00E1v\u00E1 v\u00EDce vlastn\u00EDk\u016F (nap\u0159. man\u017Eel\u00E9 nebo spoluvlastn\u00EDci), mus\u00ED b\u00FDt uvedeni v\u0161ichni.",
  },
  {
    id: "predmet",
    title: "\u010Cl\u00E1nek II \u2014 P\u0159edm\u011Bt p\u0159evodu",
    sample:
      "Prod\u00E1vaj\u00EDc\u00ED je v\u00FDlu\u010Dn\u00FDm vlastn\u00EDkem pozemku parc. \u010D. xxxx/x o v\u00FDm\u011B\u0159e xxx m\u00B2, jeho\u017E sou\u010D\u00E1st\u00ED je stavba \u010D.p. xxxx (rodinn\u00FD d\u016Fm), v\u0161e v k.\u00FA. xxxxxxx, obec Praha, zapsan\u00E9 na LV \u010D. xxxx u Katastr\u00E1ln\u00EDho \u00FA\u0159adu pro hlavn\u00ED m\u011Bsto Prahu, Katastr\u00E1ln\u00ED pracovi\u0161t\u011B Praha.\n\nProd\u00E1vaj\u00EDc\u00ED touto smlouvou p\u0159ev\u00E1d\u00ED na kupuj\u00EDc\u00EDho vlastnick\u00E9 pr\u00E1vo k v\u00FD\u0161e uveden\u00FDm nemovit\u00FDm v\u011Bcem a kupuj\u00EDc\u00ED tyto nemovit\u00E9 v\u011Bci do sv\u00E9ho vlastnictv\u00ED p\u0159ij\u00EDm\u00E1.",
    explanation:
      "Tento \u010Dl\u00E1nek jednozna\u010Dn\u011B vymezuje, o jakou nemovitost se jedn\u00E1. Uv\u00E1d\u00ED se parceln\u00ED \u010D\u00EDslo, \u010D\u00EDslo popisn\u00E9, katastr\u00E1ln\u00ED \u00FAzem\u00ED a \u010D\u00EDslo listu vlastnictv\u00ED (LV). D\u00EDky t\u011Bmto \u00FAdaj\u016Fm je nemovitost nezam\u011Bniteln\u011B identifikov\u00E1na v katastru nemovitost\u00ED. Popis mus\u00ED p\u0159esn\u011B odpov\u00EDdat \u00FAdaj\u016Fm na listu vlastnictv\u00ED \u2014 jak\u00E1koliv odchylka m\u016F\u017Ee v\u00E9st k zam\u00EDtnut\u00ED n\u00E1vrhu na vklad.",
  },
  {
    id: "cena",
    title:
      "\u010Cl\u00E1nek III \u2014 Kupn\u00ED cena a zp\u016Fsob \u00FAhrady",
    sample:
      "Smluvn\u00ED strany se dohodly na kupn\u00ED cen\u011B ve v\u00FD\u0161i x.xxx.xxx K\u010D (slovy: x milion\u016F xxxxxxx xxxxx korun \u010Desk\u00FDch).\n\nKupn\u00ED cena bude uhrazena n\u00E1sledovn\u011B:\na) Z\u00E1loha ve v\u00FD\u0161i xxx.xxx K\u010D bude vyplacena prod\u00E1vaj\u00EDc\u00EDmu na jeho bankovn\u00ED \u00FA\u010Det do 48 hodin od podpisu t\u00E9to smlouvy.\nb) Zb\u00FDvaj\u00EDc\u00ED \u010D\u00E1st kupn\u00ED ceny ve v\u00FD\u0161i x.xxx.xxx K\u010D bude slo\u017Eena do advok\u00E1tn\u00ED \u00FAschovy dle \u010Dl\u00E1nku IV t\u00E9to smlouvy.",
    explanation:
      "Kupn\u00ED cena je z\u00E1vazn\u00E1 a nem\u011Bnn\u00E1 \u2014 to, co je ve smlouv\u011B, p\u0159esn\u011B dostanete. Jasn\u011B se stanov\u00ED celkov\u00E1 \u010D\u00E1stka i zp\u016Fsob jej\u00ED \u00FAhrady. Typicky se \u010D\u00E1st vypl\u00E1c\u00ED jako z\u00E1loha p\u0159\u00EDmo prod\u00E1vaj\u00EDc\u00EDmu a zbytek je ulo\u017Een v advok\u00E1tn\u00ED \u00FAschov\u011B. D\u016Fle\u017Eit\u00E9 je, \u017Ee p\u0159i v\u00FDkupu nemovitosti neplat\u00EDte \u017E\u00E1dnou provizi ani skryt\u00E9 poplatky \u2014 v\u00FDkupn\u00ED cena je \u010Dist\u00E1 \u010D\u00E1stka, kterou obdr\u017E\u00EDte.",
  },
  {
    id: "uschova",
    title: "\u010Cl\u00E1nek IV \u2014 Advok\u00E1tn\u00ED \u00FAschova",
    sample:
      "Smluvn\u00ED strany se dohodly, \u017Ee zbytkov\u00E1 \u010D\u00E1st kupn\u00ED ceny bude ulo\u017Eena v advok\u00E1tn\u00ED \u00FAschov\u011B u JUDr. xxxxxxxxx xxxxxxxx, advok\u00E1ta, ev. \u010D. \u010CAK xxxxx, se s\u00EDdlem ulice xxxxxxx xx, xxx xx Praha x.\n\nAdvok\u00E1t slo\u017Eenou \u010D\u00E1stku vyplat\u00ED prod\u00E1vaj\u00EDc\u00EDmu na jeho bankovn\u00ED \u00FA\u010Det \u010D. xxxxxxxxxxxx/xxxx do 5 pracovn\u00EDch dn\u016F pot\u00E9, co bude kupuj\u00EDc\u00EDmu doru\u010Deno vyrozum\u011Bn\u00ED katastr\u00E1ln\u00EDho \u00FA\u0159adu o povolen\u00ED vkladu vlastnick\u00E9ho pr\u00E1va ve prosp\u011Bch kupuj\u00EDc\u00EDho.\n\nV p\u0159\u00EDpad\u011B, \u017Ee katastr\u00E1ln\u00ED \u00FA\u0159ad n\u00E1vrh na vklad zam\u00EDtne nebo \u0159\u00EDzen\u00ED zastav\u00ED, advok\u00E1t vr\u00E1t\u00ED slo\u017Eenou \u010D\u00E1stku zp\u011Bt kupuj\u00EDc\u00EDmu.",
    explanation:
      "Advok\u00E1tn\u00ED \u00FAschova je kl\u00ED\u010Dov\u00FD bezpe\u010Dnostn\u00ED prvek cel\u00E9 transakce. Funguje jako nez\u00E1visl\u00FD prost\u0159edn\u00EDk \u2014 kupuj\u00EDc\u00ED slo\u017E\u00ED pen\u00EDze k advok\u00E1tovi, kter\u00FD je dr\u017E\u00ED na sv\u00E9m \u00FAschovn\u00EDm \u00FA\u010Dtu. Pen\u00EDze se uvoln\u00ED prod\u00E1vaj\u00EDc\u00EDmu a\u017E po z\u00E1pisu nov\u00E9ho vlastn\u00EDka v katastru. Pokud by p\u0159evod z jak\u00E9hokoliv d\u016Fvodu nevy\u0161el, pen\u00EDze se vrac\u00ED kupuj\u00EDc\u00EDmu. Prod\u00E1vaj\u00EDc\u00ED tak m\u00E1 jistotu, \u017Ee pen\u00EDze existuj\u00ED a jsou p\u0159ipraveny k vyplacen\u00ED, a kupuj\u00EDc\u00ED v\u00ED, \u017Ee nezaplat\u00ED, dokud nez\u00EDsk\u00E1 nemovitost.",
  },
  {
    id: "zaruky",
    title: "\u010Cl\u00E1nek V \u2014 Z\u00E1ruky prod\u00E1vaj\u00EDc\u00EDho",
    sample:
      "Prod\u00E1vaj\u00EDc\u00ED prohla\u0161uje a zaru\u010Duje, \u017Ee:\na) je v\u00FDlu\u010Dn\u00FDm vlastn\u00EDkem p\u0159ev\u00E1d\u011Bn\u00FDch nemovit\u00FDch v\u011Bc\u00ED a je opr\u00E1vn\u011Bn s nimi voln\u011B nakl\u00E1dat;\nb) na nemovit\u00FDch v\u011Bcech nev\u00E1znou \u017E\u00E1dn\u00E9 dluhy, z\u00E1stavn\u00ED pr\u00E1va, v\u011Bcn\u00E1 b\u0159emena ani jin\u00E9 pr\u00E1vn\u00ED vady, s v\u00FDjimkou t\u011Bch, kter\u00E9 jsou uvedeny v t\u00E9to smlouv\u011B;\nc) nemovit\u00E9 v\u011Bci nejsou p\u0159edm\u011Btem \u017E\u00E1dn\u00E9ho soudn\u00EDho, rozhod\u010D\u00EDho ani spr\u00E1vn\u00EDho \u0159\u00EDzen\u00ED;\nd) prod\u00E1vaj\u00EDc\u00ED nezatajil \u017E\u00E1dn\u00E9 podstatn\u00E9 vady nemovit\u00FDch v\u011Bc\u00ED, kter\u00E9 by mohly ovlivnit rozhodnut\u00ED kupuj\u00EDc\u00EDho.",
    explanation:
      "Prod\u00E1vaj\u00EDc\u00ED v tomto \u010Dl\u00E1nku potvrzuje, \u017Ee nemovitost je \u010Dist\u00E1 \u2014 bez skryt\u00FDch dluh\u016F, z\u00E1stavn\u00EDch pr\u00E1v nebo pr\u00E1vn\u00EDch spor\u016F. Tyto z\u00E1ruky chr\u00E1n\u00ED kupuj\u00EDc\u00EDho, ale i prod\u00E1vaj\u00EDc\u00EDho, proto\u017Ee jasn\u011B definuj\u00ED v\u00FDchoz\u00ED stav. Pokud na nemovitosti v\u00E1zne nap\u0159\u00EDklad hypot\u00E9ka, mus\u00ED to b\u00FDt v\u00FDslovn\u011B uvedeno a smlouva pop\u00ED\u0161e, jak se tato situace vy\u0159e\u0161\u00ED (typicky splacen\u00EDm z kupn\u00ED ceny).",
  },
  {
    id: "predani",
    title:
      "\u010Cl\u00E1nek VI \u2014 Term\u00EDn p\u0159ed\u00E1n\u00ED nemovitosti",
    sample:
      "Prod\u00E1vaj\u00EDc\u00ED se zavazuje p\u0159edat kupuj\u00EDc\u00EDmu nemovit\u00E9 v\u011Bci ve lh\u016Ft\u011B do xx dn\u016F od vyplacen\u00ED cel\u00E9 kupn\u00ED ceny, nejpozd\u011Bji v\u0161ak do xx. xx. 2026.\n\nO p\u0159ed\u00E1n\u00ED nemovit\u00FDch v\u011Bc\u00ED bude seps\u00E1n p\u0159ed\u00E1vac\u00ED protokol, ve kter\u00E9m smluvn\u00ED strany zaznamenaj\u00ED stav m\u011B\u0159idel energi\u00ED (elekt\u0159ina, plyn, voda), stav nemovitosti a seznam p\u0159ed\u00E1van\u00FDch kl\u00ED\u010D\u016F a dokument\u016F.",
    explanation:
      "\u010Cl\u00E1nek stanov\u00ED p\u0159esn\u00E9 datum, do kdy mus\u00ED prod\u00E1vaj\u00EDc\u00ED nemovitost vyklidit a fyzicky p\u0159edat. P\u0159ed\u00E1n\u00ED se dokumentuje p\u0159ed\u00E1vac\u00EDm protokolem, kter\u00FD zachycuje stavy m\u011B\u0159idel (elekt\u0159ina, plyn, voda) a stav nemovitosti. Protokol slou\u017E\u00ED jako d\u016Fkaz pro p\u0159\u00EDpadn\u00E9 reklamace a pro p\u0159epis energi\u00ED na nov\u00E9ho vlastn\u00EDka. Obvykle se nemovitost p\u0159ed\u00E1v\u00E1 do 14\u201330 dn\u016F po vyplacen\u00ED kupn\u00ED ceny.",
  },
  {
    id: "zaverecna",
    title:
      "\u010Cl\u00E1nek VII \u2014 Z\u00E1v\u011Bre\u010Dn\u00E1 ustanoven\u00ED",
    sample:
      "Tato smlouva nab\u00FDv\u00E1 platnosti a \u00FA\u010Dinnosti dnem jej\u00EDho podpisu ob\u011Bma smluvn\u00EDmi stranami. Vlastnick\u00E9 pr\u00E1vo k nemovit\u00FDm v\u011Bcem p\u0159ech\u00E1z\u00ED na kupuj\u00EDc\u00EDho vkladem do katastru nemovitost\u00ED.\n\nN\u00E1vrh na vklad vlastnick\u00E9ho pr\u00E1va do katastru nemovitost\u00ED pod\u00E1 kupuj\u00EDc\u00ED, a to bez zbyte\u010Dn\u00E9ho odkladu po podpisu t\u00E9to smlouvy. Spr\u00E1vn\u00ED poplatek za pod\u00E1n\u00ED n\u00E1vrhu na vklad hrad\u00ED kupuj\u00EDc\u00ED.\n\nSmlouva je vyhotovena ve 4 stejnopisech, z nich\u017E ka\u017Ed\u00E1 smluvn\u00ED strana obdr\u017E\u00ED po jednom a dva jsou ur\u010Deny pro katastr\u00E1ln\u00ED \u00FA\u0159ad.\n\nV Praze dne xx. xx. 2026\n\n_________________________          _________________________\nProd\u00E1vaj\u00EDc\u00ED: Jan Nov\u00E1k             Kupuj\u00EDc\u00ED: V\u00DDKUP NEMOVITOST\u00CD s.r.o.",
    explanation:
      "Z\u00E1v\u011Bre\u010Dn\u00E1 ustanoven\u00ED upravuj\u00ED form\u00E1ln\u00ED n\u00E1le\u017Eitosti \u2014 kdy smlouva nab\u00FDv\u00E1 \u00FA\u010Dinnosti, kdo pod\u00E1v\u00E1 n\u00E1vrh na vklad do katastru a kdo hrad\u00ED souvisej\u00EDc\u00ED poplatky. P\u0159i v\u00FDkupu nemovitosti ve\u0161ker\u00E9 poplatky hrad\u00ED v\u00FDkupn\u00ED spole\u010Dnost, tak\u017Ee prod\u00E1vaj\u00EDc\u00ED neplat\u00ED za vklad do katastru ani za pr\u00E1vn\u00ED slu\u017Eby. Smlouva se podepisuje ve v\u00EDce vyhotoven\u00EDch, proto\u017Ee katastr\u00E1ln\u00ED \u00FA\u0159ad vy\u017Eaduje origin\u00E1ly.",
  },
];

export default function VzorSmlouvyPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD_ARTICLE) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD_FAQ) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--theme-800)] to-[var(--theme-900)] pb-16 pt-28 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <FileText className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Vzor smlouvy o&nbsp;v{"\u00FD"}kupu nemovitosti
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--theme-100)]">
            Pod{"\u00ED"}vejte se, co p{"\u0159"}esn{"\u011B"} obsahuje kupn
            {"\u00ED"} smlouva p{"\u0159"}i v{"\u00FD"}kupu nemovitosti. Ka
            {"\u017Ed\u00FD"} {"\u010Dl\u00E1"}nek vysv{"\u011B"}tlujeme
            srozumitelnou {"\u010De\u0161"}tinou, abyste v{"\u011B"}d{"\u011B"}
            li, na co si d{"\u00E1"}t pozor.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="mx-auto max-w-4xl px-6 pt-6">
        <Breadcrumbs
          items={[{ label: "Vzor smlouvy", href: "/vzor-smlouvy" }]}
        />
      </div>

      {/* Intro */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-900">
                  D{"\u016Fle\u017Eit\u00E9"} upozorn{"\u011Bn\u00ED"}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-amber-800">
                  N{"\u00ED\u017Ee"} uveden{"\u00FD"} vzor slou{"\u017E\u00ED"}{" "}
                  pouze pro informa{"\u010Dn\u00ED \u00FA\u010De"}ly a p
                  {"\u0159"}edstavuje zjednodu{"\u0161"}enou uk{"\u00E1"}zku
                  typick{"\u00E9"} kupn{"\u00ED"} smlouvy p{"\u0159"}i v
                  {"\u00FD"}kupu nemovitosti. Ka{"\u017Ed\u00E1"} smlouva je p
                  {"\u0159"}ipravov{"\u00E1"}na individu{"\u00E1"}ln{"\u011B"}{" "}
                  nez{"\u00E1"}visl{"\u00FD"}m advok{"\u00E1"}tem podle konkr
                  {"\u00E9"}tn{"\u00ED"} situace. Doporu{"\u010D"}ujeme v
                  {"\u017E"}dy konzultovat fin{"\u00E1"}ln{"\u00ED"} zn
                  {"\u011B"}n{"\u00ED"} s vlastn{"\u00ED"}m pr{"\u00E1"}vn
                  {"\u00ED"}m z{"\u00E1"}stupcem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contract sections */}
      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-10">
            {CONTRACT_SECTIONS.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-24"
              >
                <h2 className="mb-4 text-2xl font-bold text-slate-900">
                  {section.title}
                </h2>

                {/* Contract sample */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Vzorov{"\u00FD"} text smlouvy
                  </p>
                  <div className="whitespace-pre-line font-serif text-[15px] leading-relaxed text-slate-700">
                    {section.sample}
                  </div>
                </div>

                {/* Plain language explanation */}
                <div className="mt-4 rounded-xl border-l-4 border-[var(--theme-500)] bg-white p-6 shadow-sm">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--theme-600)]">
                    Co to znamen{"\u00E1"} v praxi
                  </p>
                  <p className="font-sans leading-relaxed text-slate-600">
                    {section.explanation}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="border-t border-slate-100 bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">
            {"\u010C"}ast{"\u00E9"} dotazy ke smlouv{"\u011B"}
          </h2>
          <div className="space-y-4">
            {JSON_LD_FAQ.mainEntity.map((faq) => (
              <details
                key={faq.name}
                className="group rounded-2xl border border-slate-200 bg-white p-6"
              >
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                  {faq.name}
                  <span className="ml-4 shrink-0 text-slate-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Dal{"\u0161\u00ED"} u{"\u017Eite\u010Dn\u00E9"} informace
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/jak-to-funguje"
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-bold text-slate-900 group-hover:text-[var(--theme-700)]">
                Jak funguje v{"\u00FD"}kup nemovitosti?
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Cel{"\u00FD"} proces od prvn{"\u00ED"}ho kontaktu po vyplacen
                {"\u00ED"} pen{"\u011B"}z v 5 kroc{"\u00ED"}ch.
              </p>
            </Link>
            <Link
              href="/garance-vykupu"
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-bold text-slate-900 group-hover:text-[var(--theme-700)]">
                Na{"\u0161"}e garance v{"\u00FD"}kupu
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                5 p{"\u00ED"}semn{"\u00FD"}ch garanc{"\u00ED"}, kter{"\u00E9"} v
                {"\u00E1"}s chr{"\u00E1"}n{"\u00ED"} po celou dobu spolupr
                {"\u00E1"}ce.
              </p>
            </Link>
            <Link
              href="/blog/jake-dokumenty-potrebuji"
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-bold text-slate-900 group-hover:text-[var(--theme-700)]">
                Jak{"\u00E9"} dokumenty pot{"\u0159"}ebuji k v{"\u00FD"}kupu?
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Kompletn{"\u00ED"} p{"\u0159"}ehled v{"\u0161"}ech pot
                {"\u0159"}ebn{"\u00FD"}ch dokument{"\u016F"} pro prodej
                nemovitosti.
              </p>
            </Link>
            <Link
              href="/caste-dotazy"
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-bold text-slate-900 group-hover:text-[var(--theme-700)]">
                {"\u010C"}ast{"\u00E9"} dotazy
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Odpov{"\u011B"}di na nej{"\u010D"}ast{"\u011B"}j{"\u0161\u00ED"}{" "}
                ot{"\u00E1"}zky o v{"\u00FD"}kupu nemovitost{"\u00ED"}.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[var(--theme-800)] to-[var(--theme-900)] py-16 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold">
            Chcete vid{"\u011B"}t konkr{"\u00E9"}tn{"\u00ED"} nab{"\u00ED"}dku
            pro va{"\u0161"}i nemovitost?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-[var(--theme-100)]">
            Vypl{"\u0148"}te nez{"\u00E1"}vazn{"\u00FD"} formul{"\u00E1\u0159"}{" "}
            a do 24 hodin v{"\u00E1"}m p{"\u0159"}iprav{"\u00ED"}me individu
            {"\u00E1"}ln{"\u00ED"} nab{"\u00ED"}dku s konkr{"\u00E9"}tn
            {"\u00ED"} cenou a n{"\u00E1"}vrhem smlouvy.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/#kontakt"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-amber-500/25 transition hover:bg-amber-600"
            >
              Chci nez{"\u00E1"}vaznou nab{"\u00ED"}dku
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--theme-200)] transition hover:text-white"
            >
              {"\u2190"} Zp{"\u011B"}t na hlavn{"\u00ED"} str{"\u00E1"}nku
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
