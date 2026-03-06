import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { BLOG_POSTS } from "../data";
import { AllRegionsSection } from "@/components/all-regions-section";
import { getRequestHost } from "@/lib/request-host";

interface ArticleContent {
  title: string;
  date: string;
  dateModified: string;
  body: React.ReactElement;
}

const ARTICLES: Record<string, ArticleContent> = {
  "jake-dokumenty-potrebuji": {
    title: "Jaké dokumenty potřebuji k výkupu nemovitosti?",
    date: "2026-03-02",
    dateModified: "2026-03-06",
    body: (
      <>
        <p>
          Prodej nemovitosti přes výkupní firmu je rychlý a pohodlný způsob, jak
          získat peníze za svůj byt, dům či pozemek. Jednou z nejčastějších
          otázek, které dostáváme od klientů, je: &bdquo;Jaké dokumenty budu
          potřebovat?&rdquo; V tomto článku vám přinášíme kompletní přehled
          všech potřebných dokumentů — a rovnou vás uklidníme: nemusíte mít vše
          připravené hned. Pomůžeme vám s jejich zajištěním.
        </p>

        <h2>Proč jsou dokumenty důležité při výkupu nemovitosti</h2>
        <p>
          Každý převod nemovitosti v České republice podléhá zápisu do katastru
          nemovitostí. Aby celý proces proběhl hladce a bez komplikací, je třeba
          doložit vlastnictví, identitu prodávajícího a případné právní vztahy
          vázané k nemovitosti. Čím lépe budete připraveni, tím rychleji celou
          transakci dokončíme. Nicméně i v případě, že některé dokumenty nemáte
          po ruce, dokážeme vám poradit, kde je získat, a v mnoha případech je
          zajistíme za vás.
        </p>
        <p>
          Na rozdíl od prodeje přes realitní kancelář, kde veškerou dokumentaci
          řešíte sami nebo za příplatek, u výkupní firmy je právní servis
          součástí služby. Veškeré náklady na přípravu smluv, ověření dokumentů
          a zápis do katastru hradíme za vás. Více o tom, jak celý proces
          funguje, najdete na stránce{" "}
          <Link
            href="/jak-to-funguje"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Jak to funguje
          </Link>
          .
        </p>

        <h2>Základní dokumenty pro výkup nemovitosti</h2>
        <p>
          Následující dokumenty tvoří základ každé transakce. Bez nich nelze
          převod nemovitosti provést, ale nebojte se — většinu z nich lze snadno
          získat online nebo na příslušných úřadech.
        </p>
        <p>
          <strong>1. List vlastnictví (LV)</strong> — Nejdůležitější dokument,
          který prokazuje, kdo je vlastníkem nemovitosti. List vlastnictví
          získáte na katastrálním úřadě nebo online přes portál Českého úřadu
          zeměměřického a katastrálního (ČÚZK) na adrese nahlizenidokn.cuzk.cz.
          Výpis stojí několik set korun a je k dispozici okamžitě. Z listu
          vlastnictví zjistíme nejen vlastníka, ale také případná břemena,
          zástavní práva nebo exekuční příkazy.
        </p>
        <p>
          <strong>2. Občanský průkaz nebo pas</strong> — Pro ověření totožnosti
          prodávajícího. Platný doklad totožnosti je vyžadován při podpisu kupní
          smlouvy u notáře. Pokud prodáváte nemovitost v zastoupení (například
          za rodiče nebo partnera), bude potřeba také úředně ověřená plná moc.
        </p>
        <p>
          <strong>3. Nabývací titul</strong> — Dokument, na jehož základě jste
          nemovitost získali. Může to být kupní smlouva, darovací smlouva,
          dědické usnesení, rozsudek soudu nebo jiný právní dokument. Nabývací
          titul pomáhá ověřit nepřerušený řetězec vlastnictví a případné
          podmínky spojené s nabytím nemovitosti.
        </p>
        <p>
          <strong>4. Energetický průkaz budovy (PENB)</strong> — Od roku 2013 je
          energetický průkaz povinný při prodeji nemovitosti. Pokud ho nemáte,
          můžeme vám doporučit certifikovaného energetického specialistu, který
          jej vypracuje. Cena se pohybuje od 3 000 do 8 000 Kč v závislosti na
          typu nemovitosti.
        </p>

        <h2>Doplňující dokumenty podle situace</h2>
        <p>
          V závislosti na konkrétní situaci mohou být potřeba další dokumenty.
          Zde je přehled nejčastějších případů:
        </p>
        <p>
          <strong>Plná moc</strong> — Pokud nemovitost neprodáváte osobně, ale
          pověřujete jinou osobu. Plná moc musí být úředně ověřená (s ověřeným
          podpisem na Czech POINTu, u notáře nebo na matrice). V plné moci musí
          být jasně specifikována nemovitost a rozsah oprávnění zmocněnce.
        </p>
        <p>
          <strong>Souhlas manžela/manželky</strong> — Pokud je nemovitost
          součástí společného jmění manželů (SJM), musí s prodejem souhlasit oba
          manželé. V případě{" "}
          <Link
            href="/vykup-pri-rozvodu"
            className="text-emerald-600 hover:text-emerald-500"
          >
            rozvodu
          </Link>{" "}
          je třeba doložit dohodu o vypořádání SJM nebo pravomocný rozsudek
          soudu.
        </p>
        <p>
          <strong>Potvrzení o bezdlužnosti vůči SVJ</strong> — Při prodeji bytu
          v bytovém domě je standardně vyžadováno potvrzení, že nemáte
          nedoplatky na příspěvcích do fondu oprav a na službách spojených s
          užíváním bytu. Toto potvrzení vydává správce domu nebo výbor SVJ.
        </p>
        <p>
          <strong>Dokumenty k exekuci</strong> — Pokud je na nemovitosti vedena
          exekuce, budeme potřebovat přehled exekučních řízení a kontakty na
          exekutory. Specializujeme se na{" "}
          <Link
            href="/vykup-pri-exekuci"
            className="text-emerald-600 hover:text-emerald-500"
          >
            výkup nemovitostí v exekuci
          </Link>{" "}
          a s celým procesem vám pomůžeme.
        </p>
        <p>
          <strong>Stavební dokumentace</strong> — U domů a větších nemovitostí
          může být vyžadována projektová dokumentace, kolaudační rozhodnutí nebo
          povolení k užívání stavby. Tyto dokumenty jsou uloženy na příslušném
          stavebním úřadě.
        </p>

        <h2>Nemusíte mít všechny dokumenty hned</h2>
        <p>
          Jeden z největších mýtů o prodeji nemovitosti je, že musíte mít
          veškerou dokumentaci připravenou předem. U výkupní firmy to tak není.
          Stačí nás kontaktovat a my vám pomůžeme zjistit, které dokumenty
          potřebujete a kde je získat. V mnoha případech dokážeme potřebné
          výpisy zajistit za vás — ať už jde o list vlastnictví, výpis z
          katastru nebo prověření exekucí.
        </p>
        <p>
          Náš právní tým se specializuje na všechny typy nemovitostních
          transakcí. Ať už prodáváte{" "}
          <Link
            href="/vykup-bytu"
            className="text-emerald-600 hover:text-emerald-500"
          >
            byt
          </Link>
          ,{" "}
          <Link
            href="/vykup-domu"
            className="text-emerald-600 hover:text-emerald-500"
          >
            dům
          </Link>{" "}
          nebo{" "}
          <Link
            href="/vykup-pozemku"
            className="text-emerald-600 hover:text-emerald-500"
          >
            pozemek
          </Link>
          , postaráme se o vše od A do Z. Celý proces je navržen tak, abyste se
          nemuseli stresovat s byrokratickými záležitostmi.
        </p>

        <h2>Jak postupovat — praktický návod</h2>
        <p>
          Pokud zvažujete prodej nemovitosti přes výkupní firmu, doporučujeme
          následující postup: Nejprve nás kontaktujte prostřednictvím formuláře
          na našich stránkách nebo telefonicky. Sdělte nám základní informace o
          nemovitosti — typ, lokalitu a přibližný stav. My provedeme předběžné
          ocenění a informujeme vás, které dokumenty budeme potřebovat.
        </p>
        <p>
          Poté si připravte základní dokumenty — občanský průkaz a pokud možno
          list vlastnictví. Ostatní dokumenty můžeme zajistit společně. Po
          prohlídce nemovitosti vám předložíme finální nabídku a náš právník
          připraví veškerou smluvní dokumentaci. Vy se nemusíte o nic starat.
        </p>
        <p>
          Celý proces od prvního kontaktu po vyplacení peněz trvá obvykle 7 až
          14 dní. Podrobný popis jednotlivých kroků najdete v článku{" "}
          <Link
            href="/blog/vykup-krok-za-krokem"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Výkup nemovitosti krok za krokem
          </Link>
          .
        </p>

        <h2>Máte otázky? Kontaktujte nás</h2>
        <p>
          Pokud si nejste jistí, jaké dokumenty potřebujete, nebo máte jakýkoliv
          dotaz ohledně prodeje nemovitosti, neváhejte se na nás obrátit.
          Nabízíme bezplatnou a nezávaznou konzultaci, při které vám vše
          vysvětlíme a poradíme s dalším postupem. Pomohli jsme stovkám klientů
          po celé České republice a rádi pomůžeme i vám.{" "}
          <Link href="/" className="text-emerald-600 hover:text-emerald-500">
            Vyplňte formulář
          </Link>{" "}
          a ozveme se vám do 24 hodin.
        </p>
      </>
    ),
  },
  "vykup-krok-za-krokem": {
    title: "Výkup nemovitosti krok za krokem — jak to funguje",
    date: "2026-03-02",
    dateModified: "2026-03-06",
    body: (
      <>
        <p>
          Přemýšlíte o prodeji nemovitosti a zajímá vás, jak celý proces výkupu
          vlastně probíhá? V tomto podrobném průvodci vám krok za krokem
          vysvětlíme celý proces od prvního kontaktu až po vyplacení peněz na
          váš účet. Celý výkup nemovitosti zvládneme obvykle za 7 až 14 dní —
          rychle, bezpečně a bez zbytečných komplikací.
        </p>

        <h2>Krok 1: První kontakt a nezávazná poptávka</h2>
        <p>
          Vše začíná jednoduchým krokem — kontaktujete nás prostřednictvím
          online formuláře na našich stránkách, telefonicky nebo e-mailem. Stačí
          uvést základní informace o nemovitosti: typ (byt, dům, pozemek),
          lokalitu, přibližnou velikost a aktuální stav. Formulář zabere
          maximálně dvě minuty a je zcela nezávazný. Nepotřebujete žádné
          dokumenty ani podrobné informace — ty zjistíme sami.
        </p>
        <p>
          Po obdržení vaší poptávky náš tým zahájí předběžnou analýzu. Ověříme
          údaje v katastru nemovitostí, posoudíme lokalitu a aktuální tržní
          podmínky. Celou tuto fázi zvládneme během několika hodin. Více o tom,
          jak celý systém funguje, najdete na stránce{" "}
          <Link
            href="/jak-to-funguje"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Jak to funguje
          </Link>
          .
        </p>

        <h2>Krok 2: Předběžná cenová nabídka do 24 hodin</h2>
        <p>
          Na základě předběžné analýzy vám do 24 hodin představíme cenovou
          nabídku. Tato nabídka vychází z aktuálních tržních cen v dané
          lokalitě, stavu nemovitosti a případných právních komplikací. Nabídka
          je nezávazná — pokud vás nezaujme, nic se neděje a nemáte žádné
          závazky.
        </p>
        <p>
          Naše nabídky se pohybují obvykle na úrovni 80–90 % tržní hodnoty
          nemovitosti. Může se to zdát méně než u klasického prodeje, ale
          zvažte: neplatíte žádnou provizi (u realitky 3–5 %), ušetříte měsíce
          čekání a máte jistotu prodeje. Když tyto faktory zohledníte, rozdíl v
          čistém výnosu je minimální. Podrobné srovnání nákladů najdete v článku{" "}
          <Link
            href="/blog/kolik-stoji-vykup"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Kolik stojí výkup nemovitosti
          </Link>
          .
        </p>

        <h2>Krok 3: Osobní prohlídka nemovitosti</h2>
        <p>
          Pokud vás předběžná nabídka zaujme, domluvíme osobní prohlídku
          nemovitosti v termínu, který vám vyhovuje. Prohlídku provádí náš
          zkušený odhadce, který posoudí skutečný technický stav nemovitosti,
          její dispozici a okolí. Prohlídka trvá obvykle 30 až 60 minut a je
          samozřejmě zcela zdarma.
        </p>
        <p>
          Během prohlídky si také promluvíme o vaší situaci a případných
          specifických požadavcích. Ať už jde o potřebu rychlého vyplacení,
          delší lhůtu pro vystěhování nebo řešení právních komplikací — vždy
          hledáme individuální řešení, které vyhovuje oběma stranám.
        </p>

        <h2>Krok 4: Finální nabídka a dohoda</h2>
        <p>
          Po prohlídce vám do 48 hodin předložíme finální cenovou nabídku. Tato
          nabídka je závazná z naší strany — pokud ji přijmete, garantujeme
          uvedenou cenu. Nejsou žádné skryté poplatky, žádné dodatečné srážky.
          Cena, na které se dohodneme, je cena, kterou obdržíte.
        </p>
        <p>
          V této fázi máte dostatek času na rozmyšlenou. Netlačíme na okamžité
          rozhodnutí. Doporučujeme konzultovat nabídku s rodinou nebo právníkem.
          Transparentnost a férový přístup jsou pro nás klíčové — chceme, abyste
          se rozhodli informovaně a bez tlaku.
        </p>

        <h2>Krok 5: Příprava kupní smlouvy</h2>
        <p>
          Po odsouhlasení nabídky se celý proces přesouvá k našemu právnímu
          týmu. Zkušení advokáti připraví kupní smlouvu, která chrání zájmy obou
          stran. Smlouva obsahuje všechny náležitosti vyžadované českým právem:
          přesnou identifikaci nemovitosti, kupní cenu, podmínky úhrady, termín
          předání a další ujednání.
        </p>
        <p>
          Veškeré náklady na právní služby hradíme za vás. Smlouvu si můžete
          nechat zkontrolovat vlastním právníkem — na transparentnosti nám
          záleží. Jaké dokumenty budete k podpisu potřebovat, se dozvíte v
          článku{" "}
          <Link
            href="/blog/jake-dokumenty-potrebuji"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Jaké dokumenty potřebuji k výkupu nemovitosti
          </Link>
          .
        </p>

        <h2>Krok 6: Podpis smlouvy a úschova</h2>
        <p>
          Podpis kupní smlouvy probíhá u notáře, kde se ověří totožnost obou
          stran a pravost podpisů. Kupní cena je složena do advokátní úschovy —
          to je nejbezpečnější způsob, jak zajistit, že peníze budou vyplaceny
          až po splnění všech podmínek smlouvy, zejména po zápisu nového
          vlastníka do katastru nemovitostí.
        </p>
        <p>
          Advokátní úschova chrání obě strany: prodávající má jistotu, že peníze
          existují a budou vyplaceny, kupující má jistotu, že peníze budou
          uvolněny až po řádném převodu vlastnictví. Celý tento krok zvládneme
          během jednoho dne.
        </p>

        <h2>Krok 7: Vyplacení peněz</h2>
        <p>
          Po podpisu smlouvy podáme návrh na vklad vlastnického práva do
          katastru nemovitostí. Katastrální úřad provede zápis obvykle do 20
          pracovních dnů. Po provedení vkladu advokát uvolní kupní cenu z
          úschovy a peníze jsou převedeny na váš účet — obvykle do 3 až 5
          pracovních dnů.
        </p>
        <p>
          V případě, že potřebujete peníze dříve, nabízíme možnost zálohy při
          podpisu smlouvy. Výše zálohy závisí na konkrétní dohodě, ale obvykle
          se pohybuje kolem 10–30 % kupní ceny. Tím získáte část peněz okamžitě
          a zbytek po dokončení katastrálního řízení.
        </p>

        <h2>Celková časová osa: 7–14 dní</h2>
        <p>
          Pojďme si shrnout celý proces z hlediska času. Den 1: kontaktujete nás
          a vyplníte poptávku. Den 1–2: obdržíte předběžnou nabídku. Den 3–5:
          prohlídka nemovitosti a finální nabídka. Den 5–7: příprava a podpis
          kupní smlouvy, složení do úschovy. Den 7–14: zápis do katastru a
          vyplacení peněz. Celý proces od prvního kontaktu po peníze na účtu
          trvá typicky 7 až 14 dní — to je zlomek času oproti průměrným 3–6
          měsícům u klasického prodeje přes realitní kancelář.
        </p>

        <h2>Máte otázky? Kontaktujte nás</h2>
        <p>
          Pokud máte jakékoliv dotazy ohledně procesu výkupu nebo chcete získat
          nezávaznou nabídku na svou nemovitost, neváhejte nás kontaktovat.
          Konzultace je zdarma a bez jakýchkoliv závazků. Pomáháme klientům po
          celé České republice — ať už prodáváte v Praze, Brně, Ostravě nebo
          kdekoliv jinde. Celý proces je navržen tak, aby byl pro vás co
          nejjednodušší a nejpohodlnější.{" "}
          <Link href="/" className="text-emerald-600 hover:text-emerald-500">
            Vyplňte formulář
          </Link>{" "}
          a do 24 hodin se vám ozveme s nabídkou.
        </p>
      </>
    ),
  },
  "vykup-vs-drazba": {
    title: "Výkup nemovitosti vs. dražba — co je výhodnější?",
    date: "2026-03-02",
    dateModified: "2026-03-06",
    body: (
      <>
        <p>
          Pokud se nacházíte v situaci, kdy musíte prodat nemovitost — ať už
          kvůli dluhům, exekuci nebo jinému důvodu — pravděpodobně zvažujete dvě
          hlavní možnosti: dobrovolný výkup nemovitosti nebo dražbu. Obě
          varianty mají své výhody a nevýhody a správná volba může znamenat
          rozdíl v řádu stovek tisíc korun. V tomto článku obě možnosti podrobně
          porovnáme, abyste se mohli rozhodnout informovaně.
        </p>

        <h2>Jak funguje výkup nemovitosti</h2>
        <p>
          Výkup nemovitosti je dobrovolný prodej vaší nemovitosti specializované
          firmě. Celý proces je jednoduchý a rychlý: kontaktujete výkupní firmu,
          ta provede ocenění a předloží nabídku. Pokud nabídku přijmete,
          právníci připraví kupní smlouvu a celá transakce se dokončí obvykle za
          7 až 14 dní. Peníze obdržíte přes bezpečnou advokátní úschovu.
        </p>
        <p>
          Klíčovou výhodou výkupu je, že máte plnou kontrolu nad procesem.
          Rozhodujete o tom, zda nabídku přijmete, můžete vyjednávat podmínky a
          máte přehled o každém kroku transakce. Podrobný popis celého procesu
          najdete v článku{" "}
          <Link
            href="/blog/vykup-krok-za-krokem"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Výkup nemovitosti krok za krokem
          </Link>
          . Více informací o fungování výkupu najdete na stránce{" "}
          <Link
            href="/jak-to-funguje"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Jak to funguje
          </Link>
          .
        </p>

        <h2>Jak funguje dražba nemovitosti</h2>
        <p>
          Dražba nemovitosti může být dobrovolná nebo nucená. Dobrovolnou dražbu
          iniciuje vlastník sám — je to alternativa ke klasickému prodeji.
          Nucená dražba je nařízena exekutorem nebo insolvenčním správcem jako
          způsob zpeněžení majetku dlužníka k úhradě pohledávek věřitelů.
        </p>
        <p>
          V dražbě se nemovitost nabízí veřejně a kupující soutěží o nejvyšší
          nabídku. Teoreticky může dražba přinést vyšší cenu než přímý výkup,
          protože soutěž mezi dražiteli může cenu vyšroubovat nahoru. V praxi
          ale nucená dražba často končí prodejem výrazně pod tržní cenou — a to
          z několika důvodů, které si vysvětlíme níže.
        </p>

        <h2>Srovnání: čas</h2>
        <p>
          Výkup nemovitosti zvládneme za 7 až 14 dní od prvního kontaktu. Celý
          proces je v rukou prodávajícího a výkupní firmy, takže nedochází ke
          zbytečným průtahům. U nucené dražby je situace zcela jiná. Od zahájení
          exekučního řízení po samotnou dražbu může uplynout 6 až 12 měsíců —
          někdy i déle. Exekutor musí nemovitost ocenit znaleckým posudkem,
          vydat usnesení o ceně, nařídit dražbu a dodržet zákonné lhůty pro
          oznámení. V dobrovolné dražbě je proces kratší, ale stále počítejte s
          minimálně 2 až 3 měsíci.
        </p>

        <h2>Srovnání: dosažená cena</h2>
        <p>
          Při výkupu nemovitosti získáte obvykle 80 až 90 procent tržní hodnoty.
          Cena je známá předem a je garantovaná — žádná překvapení. V nucené
          dražbě se nemovitost draží od dvou třetin odhadní ceny v prvním kole.
          Pokud se v prvním kole neprodá, ve druhém kole klesá minimální podání
          na polovinu odhadu. V praxi se nemovitosti v nucené dražbě prodávají
          za 50 až 75 procent tržní hodnoty. Dobrovolná dražba může teoreticky
          přinést i plnou tržní cenu, ale závisí na počtu dražitelů a jejich
          zájmu.
        </p>

        <h2>Srovnání: náklady</h2>
        <p>
          U výkupu nemovitosti neplatíte jako prodávající žádné poplatky.
          Veškeré náklady — právní služby, odhad, poplatky za katastr — hradí
          výkupní firma. U nucené dražby se z výtěžku přednostně hradí náklady
          exekuce: odměna exekutora (obvykle 15 procent z výtěžku, minimálně
          však 3 000 Kč), znalecký posudek (5 000 až 15 000 Kč), náklady na
          inzerci dražby a další administrativní výdaje. Celkové náklady exekuce
          mohou dosáhnout 20 až 25 procent z výtěžku dražby. U dobrovolné dražby
          platí prodávající dražebníkovi odměnu obvykle 2 až 5 procent z
          dosažené ceny.
        </p>

        <h2>Srovnání: jistota a kontrola</h2>
        <p>
          Výkup nabízí maximální jistotu. Máte závaznou nabídku, garantovanou
          cenu a předem známý termín vyplacení. Celý proces kontrolujete vy —
          pokud se vám nabídka nelíbí, jednoduše ji odmítnete. U dražby nemáte
          žádnou kontrolu nad výsledkem. Nevíte, zda se přihlásí dostatek
          dražitelů, jaká bude výsledná cena ani kdy přesně dražba proběhne. U
          nucené dražby navíc nemáte možnost dražbu zrušit, jakmile je nařízena.
        </p>

        <h2>Srovnání: stres a komfort</h2>
        <p>
          Prodej přes výkupní firmu je navržen tak, aby byl pro prodávajícího co
          nejpohodlnější. Stačí vyplnit formulář, domluvit prohlídku a podepsat
          smlouvu. O vše ostatní se postaráme. Dražba je naopak stresující
          záležitost. Nucená dražba je spojena se stigmatem exekuce, veřejným
          oznámením a nejistotou výsledku. I dobrovolná dražba přináší stres —
          musíte čekat na den dražby, doufat v dostatečný zájem dražitelů a
          smířit se s tím, že výsledek není ve vašich rukou.
        </p>

        <h2>Přehledná srovnávací tabulka</h2>
        <p>
          Pro lepší orientaci uvádíme shrnutí klíčových parametrů. Čas: výkup 7
          až 14 dní, dražba 2 až 12 měsíců. Cena: výkup 80 až 90 procent tržní
          hodnoty, nucená dražba 50 až 75 procent, dobrovolná dražba 85 až 100
          procent. Náklady pro prodávajícího: výkup 0 Kč, nucená dražba 20 až 25
          procent z výtěžku, dobrovolná dražba 2 až 5 procent. Jistota prodeje:
          výkup vysoká (garantovaná nabídka), dražba nízká až střední (závisí na
          zájmu). Stres: výkup minimální, dražba vysoký. Kontrola: výkup plná,
          nucená dražba žádná, dobrovolná dražba omezená.
        </p>

        <h2>Kdy zvolit výkup a kdy dražbu</h2>
        <p>
          Výkup je jasná volba, pokud potřebujete prodat rychle, chcete jistotu
          a garantovanou cenu, nechcete se stresovat a chcete mít kontrolu nad
          procesem. Je ideální při{" "}
          <Link
            href="/vykup-pri-rozvodu"
            className="text-emerald-600 hover:text-emerald-500"
          >
            rozvodu
          </Link>
          ,{" "}
          <Link
            href="/vykup-pri-dedictvi"
            className="text-emerald-600 hover:text-emerald-500"
          >
            dědictví
          </Link>
          ,{" "}
          <Link
            href="/vykup-pri-exekuci"
            className="text-emerald-600 hover:text-emerald-500"
          >
            exekuci
          </Link>{" "}
          nebo jakékoliv jiné situaci vyžadující rychlé řešení.
        </p>
        <p>
          Dobrovolná dražba může být zajímavá, pokud máte čas a věříte, že
          konkurence mezi dražiteli vyžene cenu nahoru. Je vhodná u atraktivních
          nemovitostí v žádaných lokalitách, kde lze očekávat velký zájem.
          Nucené dražby bychom naopak doporučili vyhnout se za každou cenu —
          dobrovolný prodej přes výkup přinese téměř vždy lepší výsledek.
        </p>

        <h2>Máte otázky? Kontaktujte nás</h2>
        <p>
          Pokud zvažujete prodej nemovitosti a nejste si jistí, která varianta
          je pro vás nejvýhodnější, rádi vám zdarma poradíme. Nabízíme
          nezávaznou konzultaci a cenovou nabídku do 24 hodin. Pomohli jsme
          stovkám klientů po celé České republice vyřešit jejich situaci rychle
          a bezpečně.{" "}
          <Link href="/" className="text-emerald-600 hover:text-emerald-500">
            Vyplňte formulář
          </Link>{" "}
          nebo nám zavolejte — jsme tu pro vás.
        </p>
      </>
    ),
  },
  "kolik-stoji-vykup": {
    title: "Kolik stojí výkup nemovitosti? Kompletní přehled nákladů",
    date: "2026-03-02",
    dateModified: "2026-03-05",
    body: (
      <>
        <p>
          Jednou z prvních otázek, kterou si lidé při prodeji nemovitosti
          kladou, je: &bdquo;Kolik mě to bude stát?&rdquo; U tradičního prodeje
          přes realitní kancelář je odpověď jasná — provize 3 až 5 procent z
          prodejní ceny plus další skryté náklady. Ale co výkup nemovitosti? V
          tomto článku vám přineseme kompletní a transparentní přehled všech
          nákladů spojených s výkupem a porovnáme je s alternativami.
        </p>

        <h2>Kolik zaplatíte při výkupu nemovitosti: 0 Kč</h2>
        <p>
          Ano, čtete správně. Při prodeji nemovitosti přes výkupní firmu
          neplatíte jako prodávající žádné poplatky. Nulová provize, žádné
          skryté poplatky, žádné náklady na právní služby. Veškeré výdaje
          spojené s transakcí hradí výkupní firma — od ocenění nemovitosti přes
          přípravu kupní smlouvy až po poplatky za katastr nemovitostí.
        </p>
        <p>
          Jak je to možné? Obchodní model výkupní firmy je jednoduchý: firma
          kupuje nemovitosti za cenu nižší, než je plná tržní hodnota (obvykle
          80 až 90 procent), a následně je prodává nebo pronajímá. Marže firmy
          je již zahrnuta v nabídkové ceně, takže pro vás nejsou žádné dodatečné
          náklady. Cena, na které se dohodnete, je přesně ta částka, kterou
          obdržíte na svůj účet. Více o celém procesu se dozvíte na stránce{" "}
          <Link
            href="/jak-to-funguje"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Jak to funguje
          </Link>
          .
        </p>

        <h2>Kolik zaplatíte přes realitní kancelář</h2>
        <p>
          Prodej přes realitní kancelář je tradičnější cesta, ale rozhodně ne
          levnější. Hlavním nákladem je provize makléře, která se v České
          republice pohybuje od 3 do 5 procent z prodejní ceny. U nemovitosti za
          3 miliony korun to představuje 90 000 až 150 000 Kč. U dražších
          nemovitostí za 5 milionů už mluvíme o 150 000 až 250 000 Kč.
        </p>
        <p>
          Ale provize není jediný náklad. K tomu připočítejte: profesionální
          fotografie a video (5 000 až 15 000 Kč), home staging pro
          zatraktivnění nemovitosti (10 000 až 30 000 Kč), energetický průkaz
          PENB (3 000 až 8 000 Kč), právní služby pokud nejsou součástí provize
          (10 000 až 20 000 Kč) a případné drobné opravy před prodejem
          (individuální). Celkové náklady při prodeji přes realitku mohou snadno
          dosáhnout 5 až 7 procent z prodejní ceny.
        </p>

        <h2>Kolik zaplatíte při dražbě</h2>
        <p>
          U nucené dražby se náklady hradí z výtěžku dražby, ale jsou překvapivě
          vysoké. Odměna exekutora činí obvykle 15 procent z výtěžku, minimálně
          však 3 000 Kč. Dále se z výtěžku hradí znalecký posudek (5 000 až 15
          000 Kč), náklady na inzerci a organizaci dražby a případné další
          administrativní výdaje. Celkové náklady nucené dražby mohou pohltit 20
          až 25 procent z výtěžku.
        </p>
        <p>
          U dobrovolné dražby platí prodávající dražebníkovi odměnu 2 až 5
          procent z dosažené ceny plus náklady na organizaci dražby. Podrobné
          srovnání výkupu a dražby najdete v článku{" "}
          <Link
            href="/blog/vykup-vs-drazba"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Výkup nemovitosti vs. dražba
          </Link>
          .
        </p>

        <h2>Srovnání čistého výnosu — konkrétní příklad</h2>
        <p>
          Podívejme se na konkrétní příklad. Představte si byt v Praze s tržní
          hodnotou 4 000 000 Kč. Při prodeji přes realitní kancelář dosáhnete
          prodejní ceny 4 000 000 Kč. Od toho odečtěte provizi 4 procenta (160
          000 Kč), právní služby (15 000 Kč), fotografie a staging (20 000 Kč) a
          PENB (5 000 Kč). Čistý výnos: přibližně 3 800 000 Kč. Čas: 3 až 6
          měsíců.
        </p>
        <p>
          Při výkupu nemovitosti vám firma nabídne 85 procent tržní hodnoty,
          tedy 3 400 000 Kč. Vaše náklady: 0 Kč. Čistý výnos: 3 400 000 Kč. Čas:
          7 až 14 dní. Rozdíl v čistém výnosu je přibližně 400 000 Kč, ale
          peníze máte o 3 až 5 měsíců dříve. Pokud tyto peníze investujete nebo
          jimi vyřešíte akutní finanční situaci, může být výkup ve výsledku
          výhodnější.
        </p>
        <p>
          Při nucené dražbě se byt prodá například za 65 procent tržní hodnoty,
          tedy za 2 600 000 Kč. Z toho se odečte odměna exekutora a další
          náklady — řekněme 500 000 Kč. Čistý výnos: přibližně 2 100 000 Kč. To
          je o 1 300 000 Kč méně než u výkupu. Rozdíl je dramatický.
        </p>

        <h2>Skryté náklady, na které se zapomíná</h2>
        <p>
          Při klasickém prodeji existují náklady, které nejsou na první pohled
          vidět. Čas strávený prohlídkami — pokud pracujete a musíte si brát
          volno na prohlídky, přicházíte o příjem. Stres a nejistota — měsíce
          čekání na kupce mají svou psychologickou cenu. Alternativní náklady —
          peníze, které byste mohli investovat nebo použít k řešení jiné
          situace, leží měsíce v nemovitosti. Riziko krachu obchodu — kupec může
          na poslední chvíli odstoupit, banka nemusí schválit hypotéku a celý
          proces začíná znovu.
        </p>
        <p>
          U výkupu tyto skryté náklady prakticky neexistují. Celý proces je
          rychlý, předvídatelný a garantovaný. Nabídka výkupní firmy je závazná
          — jakmile ji přijmete, transakce proběhne.
        </p>

        <h2>Kdy se výkup vyplatí nejvíce</h2>
        <p>
          Z čistě finančního hlediska se výkup nejvíce vyplatí v těchto
          situacích: nemovitost vyžaduje rekonstrukci — výkupní firma kupuje v
          jakémkoliv stavu, ušetříte za opravy. Právní komplikace — nemovitost
          zatížená{" "}
          <Link
            href="/vykup-pri-exekuci"
            className="text-emerald-600 hover:text-emerald-500"
          >
            exekucí
          </Link>
          ,{" "}
          <Link
            href="/vykup-nemovitosti-s-vecnym-bremenem"
            className="text-emerald-600 hover:text-emerald-500"
          >
            věcným břemenem
          </Link>{" "}
          nebo{" "}
          <Link
            href="/vykup-nemovitosti-s-hypotekou"
            className="text-emerald-600 hover:text-emerald-500"
          >
            hypotékou
          </Link>{" "}
          je pro běžné kupce riziková, výkupní firma tyto situace řeší rutinně.
          Urgentní prodej — při{" "}
          <Link
            href="/vykup-pri-rozvodu"
            className="text-emerald-600 hover:text-emerald-500"
          >
            rozvodu
          </Link>
          ,{" "}
          <Link
            href="/vykup-pri-dedictvi"
            className="text-emerald-600 hover:text-emerald-500"
          >
            dědictví
          </Link>{" "}
          nebo finančních potížích je rychlost klíčová. Méně atraktivní
          nemovitost — u nemovitostí v okrajových lokalitách nebo ve špatném
          stavu by klasický prodej trval příliš dlouho.
        </p>

        <h2>Daňové aspekty prodeje nemovitosti</h2>
        <p>
          Nezávisle na způsobu prodeje je důležité znát daňové dopady. V České
          republice je příjem z prodeje nemovitosti osvobozen od daně z příjmů,
          pokud v nemovitosti máte bydliště alespoň 2 roky nebo ji vlastníte
          alespoň 5 let (u nemovitostí nabytých od roku 2021 alespoň 10 let).
          Pokud tyto podmínky nesplňujete, příjem z prodeje podléhá dani z
          příjmů fyzických osob ve výši 15 procent. Toto platí stejně pro výkup,
          prodej přes realitku i dražbu. Doporučujeme konzultovat daňové dopady
          s daňovým poradcem.
        </p>

        <h2>Máte otázky? Kontaktujte nás</h2>
        <p>
          Pokud chcete vědět přesně, kolik za svou nemovitost získáte, stačí nás
          kontaktovat. Nabídku vám připravíme do 24 hodin — zdarma a nezávazně.
          Žádné skryté poplatky, žádné podmínky. Naší prioritou je
          transparentnost a férový přístup ke každému klientovi. Pomáháme
          prodávajícím po celé České republice — od Prahy přes Brno až po menší
          města a vesnice.{" "}
          <Link href="/" className="text-emerald-600 hover:text-emerald-500">
            Vyplňte formulář
          </Link>{" "}
          nebo nám zavolejte a přesvědčte se sami.
        </p>
      </>
    ),
  },
  "jak-rychle-prodat-nemovitost": {
    title: "Jak rychle prodat nemovitost v roce 2026",
    date: "2026-03-01",
    dateModified: "2026-03-04",
    body: (
      <>
        <p>
          Prodej nemovitosti je jedním z nejdůležitějších finančních rozhodnutí
          v životě. Ať už prodáváte byt, dům nebo pozemek, chcete to zvládnout
          rychle, bezpečně a za co nejlepší cenu. V roce 2026 se český realitní
          trh stabilizoval po turbulentních letech a nabízí řadu možností, jak
          nemovitost prodat efektivně. V tomto článku vám přineseme kompletní
          průvodce rychlým prodejem nemovitosti - od přípravy až po předání
          klíčů.
        </p>

        <h2>Současný stav realitního trhu v České republice</h2>
        <p>
          Rok 2026 přináší na český realitní trh relativní stabilitu. Po období
          rychlého růstu cen a následné korekce se trh ustálil. Úrokové sazby
          hypoték se pohybují kolem 4–5 %, což je příznivější než v předchozích
          dvou letech. Poptávka po nemovitostech zůstává silná zejména ve
          velkých městech - Praha, Brno, Ostrava a Plzeň vedou statistiky.
          Průměrná doba prodeje nemovitosti přes realitní kancelář je stále 3–6
          měsíců, ale existují způsoby, jak tento proces výrazně zkrátit.
        </p>

        <h2>Příprava nemovitosti k prodeji</h2>
        <p>
          Prvním krokem k rychlému prodeji je důkladná příprava. Nemovitost by
          měla být čistá, uklizená a pokud možno zbavená osobních věcí. Drobné
          opravy - kapající kohoutek, prasklá dlaždice, nefunkční zásuvka -
          mohou odradit potenciální kupce víc, než byste čekali. Investice
          několika tisíc korun do drobných oprav se vám může vrátit v desítkách
          tisíc na prodejní ceně.
        </p>
        <p>
          Zvažte také home staging - profesionální aranžování interiéru pro
          účely prodeje. Statistiky ukazují, že nemovitosti s profesionálním
          stagingem se prodávají až o 30 % rychleji. Kvalitní fotografie jsou
          naprostý základ. V roce 2026 jsou standardem také 3D prohlídky a video
          prezentace, které přitahují více zájemců.
        </p>

        <h2>Stanovení správné ceny</h2>
        <p>
          Cena je klíčový faktor ovlivňující rychlost prodeje. Příliš vysoká
          cena odradí zájemce, příliš nízká znamená finanční ztrátu. Pro správné
          ocenění doporučujeme kombinovat několik přístupů: prostudujte ceny
          obdobných nemovitostí v okolí (portály jako Sreality, Bezrealitky),
          objednejte si znalecký posudek a konzultujte s odborníky na výkup
          nemovitostí.
        </p>
        <p>
          Pokud chcete prodat opravdu rychle, nastavte cenu mírně pod tržní
          hodnotou - o 5–10 %. To vyvolá vyšší zájem a může vést dokonce k
          převisu poptávky, což paradoxně zvýší konečnou prodejní cenu.
          Alternativou je oslovit firmu specializující se na{" "}
          <Link
            href="/vykup-bytu"
            className="text-emerald-600 hover:text-emerald-500"
          >
            výkup bytů
          </Link>{" "}
          nebo{" "}
          <Link
            href="/vykup-domu"
            className="text-emerald-600 hover:text-emerald-500"
          >
            výkup domů
          </Link>
          , která vám předloží nabídku do 24 hodin.
        </p>

        <h2>Způsoby rychlého prodeje</h2>
        <p>V zásadě máte tři hlavní možnosti, jak nemovitost prodat rychle:</p>
        <p>
          <strong>1. Prodej přes realitní kancelář</strong> - klasická cesta,
          která však typicky trvá 3–6 měsíců. Realitka se postará o inzerci,
          prohlídky a právní servis, ale účtuje si provizi 3–5 % z prodejní
          ceny. Více o srovnání s výkupem najdete v našem článku{" "}
          <Link
            href="/blog/vykup-nemovitosti-vs-realitni-kancelar"
            className="text-emerald-600 hover:text-emerald-500"
          >
            výkup vs realitní kancelář
          </Link>
          .
        </p>
        <p>
          <strong>2. Přímý výkup nemovitosti</strong> - nejrychlejší varianta.
          Specializovaná firma odkoupí vaši nemovitost přímo, bez
          zprostředkovatele. Celý proces trvá 2–4 týdny. Cena bývá o 10–20 %
          nižší než tržní, ale ušetříte na provizi, času a nejistotě.
        </p>
        <p>
          <strong>3. Prodej na vlastní pěst</strong> - bez provize, ale vyžaduje
          značné úsilí. Musíte zvládnout inzerci, komunikaci se zájemci,
          organizaci prohlídek a právní stránku věci. Vhodné pro ty, kdo mají
          čas a zkušenosti.
        </p>

        <h2>Právní aspekty prodeje v roce 2026</h2>
        <p>
          Při prodeji nemovitosti je třeba mít v pořádku veškerou dokumentaci:
          list vlastnictví z katastru nemovitostí, energetický průkaz budovy
          (PENB), potvrzení o bezdlužnosti vůči SVJ a případné stavební
          dokumenty. Od roku 2025 platí přísnější požadavky na energetickou
          náročnost budov, proto je aktuální PENB důležitější než kdy dřív.
        </p>
        <p>
          Kupní smlouvu doporučujeme nechat připravit zkušeným advokátem.
          Úschova kupní ceny - ať už advokátní, notářská nebo bankovní - je
          standardem, který chrání obě strany transakce. Vklad do katastru
          nemovitostí aktuálně trvá přibližně 20 dní.
        </p>

        <h2>Speciální situace vyžadující rychlý prodej</h2>
        <p>
          Někdy okolnosti vyžadují prodej nemovitosti v co nejkratším čase. Mezi
          nejčastější důvody patří{" "}
          <Link
            href="/vykup-pri-rozvodu"
            className="text-emerald-600 hover:text-emerald-500"
          >
            rozvod a vypořádání společného jmění manželů
          </Link>
          ,{" "}
          <Link
            href="/vykup-pri-dedictvi"
            className="text-emerald-600 hover:text-emerald-500"
          >
            dědické řízení
          </Link>{" "}
          s více dědici, kteří se nemohou dohodnout, finanční potíže a hrozící{" "}
          <Link
            href="/vykup-pri-exekuci"
            className="text-emerald-600 hover:text-emerald-500"
          >
            exekuce
          </Link>
          , stěhování do zahraničí nebo potřeba rychlého kapitálu pro jinou
          investici.
        </p>
        <p>
          V těchto situacích je přímý výkup často nejlepším řešením. Nemusíte
          čekat měsíce na kupce a máte jistotu, že transakce proběhne. Pokud
          řešíte nemovitost zatíženou{" "}
          <Link
            href="/blog/nemovitost-v-exekuci-pruvodce"
            className="text-emerald-600 hover:text-emerald-500"
          >
            exekucí
          </Link>
          , přečtěte si náš podrobný průvodce.
        </p>

        <h2>5 tipů pro urychlení prodeje</h2>
        <p>
          <strong>Tip 1:</strong> Mějte připravené všechny dokumenty ještě před
          zahájením prodeje. Chybějící papíry jsou nejčastější příčinou zdržení.
        </p>
        <p>
          <strong>Tip 2:</strong> Investujte do profesionálních fotografií a
          virtuální prohlídky. První dojem rozhoduje - 90 % kupujících začíná
          hledání online.
        </p>
        <p>
          <strong>Tip 3:</strong> Buďte flexibilní s termíny prohlídek. Čím více
          zájemců nemovitost uvidí, tím rychleji ji prodáte.
        </p>
        <p>
          <strong>Tip 4:</strong> Zvažte kombinaci více prodejních kanálů -
          inzerát online, sociální sítě a současně oslovení výkupní firmy pro
          porovnání nabídek.
        </p>
        <p>
          <strong>Tip 5:</strong> Nechte si zpracovat odhad tržní hodnoty od
          nezávislého odhadce. Objektivní ocenění vám pomůže nastavit správnou
          cenu a vyhnout se zdlouhavému vyjednávání.
        </p>

        <h2>Závěr</h2>
        <p>
          Rychlý prodej nemovitosti v roce 2026 je reálný, pokud postupujete
          systematicky. Klíčem je dobrá příprava, správné ocenění a volba
          vhodného prodejního kanálu. Pokud potřebujete prodat co nejrychleji a
          bez starostí, zvažte{" "}
          <Link href="/" className="text-emerald-600 hover:text-emerald-500">
            nezávaznou konzultaci s naším týmem
          </Link>
          . Nabídku vám připravíme do 24 hodin a celý proces můžeme dokončit za
          2–4 týdny.
        </p>
      </>
    ),
  },
  "vykup-nemovitosti-vs-realitni-kancelar": {
    title: "Výkup nemovitosti vs realitní kancelář - co se vyplatí",
    date: "2026-02-25",
    dateModified: "2026-03-03",
    body: (
      <>
        <p>
          Když se rozhodnete prodat nemovitost, stojíte před zásadní otázkou:
          prodat přes realitní kancelář, nebo využít služby výkupní firmy? Obě
          varianty mají své výhody i nevýhody a správná volba závisí na vaší
          konkrétní situaci. V tomto článku obě možnosti objektivně porovnáme,
          abyste se mohli informovaně rozhodnout.
        </p>

        <h2>Jak funguje prodej přes realitní kancelář</h2>
        <p>
          Realitní kancelář zastupuje prodávajícího (nebo kupujícího) při
          prodeji nemovitosti. Makléř se postará o ocenění, přípravu inzerce,
          organizaci prohlídek, vyjednávání s kupci a často i o právní servis.
          Za tyto služby si kancelář účtuje provizi, která se v České republice
          pohybuje od 3 do 5 % z kupní ceny. U nemovitosti za 4 miliony korun to
          představuje 120 000 až 200 000 Kč.
        </p>
        <p>
          Výhodou je, že makléř má zkušenosti s trhem, databázi potenciálních
          kupců a dokáže nemovitost prezentovat profesionálně. Nevýhodou je
          časová náročnost - průměrný prodej přes realitku trvá 3–6 měsíců, u
          méně atraktivních nemovitostí i déle. Navíc neexistuje žádná záruka,
          že se nemovitost prodá za požadovanou cenu.
        </p>

        <h2>Jak funguje přímý výkup nemovitosti</h2>
        <p>
          Výkupní firma odkoupí vaši nemovitost přímo, bez zprostředkovatele.
          Proces je jednoduchý: kontaktujete firmu, ta provede ocenění a
          předloží nabídku - obvykle do 24–48 hodin. Pokud nabídku přijmete,
          právníci připraví kupní smlouvu a celá transakce se dokončí za 2–4
          týdny.
        </p>
        <p>
          Hlavní výhodou je rychlost a jistota. Neplatíte žádnou provizi -
          veškeré náklady na právní služby a převod hradí výkupní firma.
          Nevýhodou je, že nabídková cena bývá nižší než maximální tržní cena -
          obvykle 80–90 % tržní hodnoty. Firma kupuje s kalkulací na případnou
          rekonstrukci a další prodej.
        </p>

        <h2>Srovnání: čas</h2>
        <p>
          Toto je nejzásadnější rozdíl. Realitní kancelář potřebuje v průměru
          3–6 měsíců na prodej standardní nemovitosti. U komplikovaných případů
          (nemovitost s právním břemenem, nevzhledná lokalita, špatný stav) to
          může být i rok. Výkupní firma dokáže celý proces zvládnout za 2–4
          týdny. Pokud potřebujete peníze rychle, je volba jasná.
        </p>

        <h2>Srovnání: cena</h2>
        <p>
          Na první pohled vyhrává realitní kancelář - snaží se prodat za plnou
          tržní cenu. Ale pozor na skryté náklady: provize 3–5 %, náklady na
          home staging a profesionální fotografie, poplatky za právní služby
          (pokud nejsou v ceně provize) a čas, který strávíte prohlídkami a
          vyjednáváním.
        </p>
        <p>
          Když tyto náklady sečtete, reálný rozdíl mezi čistým výnosem z prodeje
          přes realitku a přes výkupní firmu se často zmenší na 5–10 %. A to
          nepočítáme alternativní náklady - peníze, které byste mohli investovat
          jinde, kdybyste je měli o měsíce dříve.
        </p>

        <h2>Srovnání: pohodlí a stres</h2>
        <p>
          Prodej přes realitku vyžaduje vaši aktivní účast. Musíte nemovitost
          připravit k prezentaci, být dostupní pro prohlídky (často i o
          víkendech), reagovat na dotazy zájemců a čelit nejistotě - kupec může
          na poslední chvíli odstoupit, banka nemusí schválit hypotéku.
        </p>
        <p>
          U výkupu je to výrazně jednodušší. Po úvodním kontaktu a prohlídce
          nemovitosti se o vše postará výkupní firma. Vy jen podepíšete smlouvu
          a přijmete peníze. Minimální stres, minimální časová investice.
        </p>

        <h2>Kdy zvolit realitní kancelář</h2>
        <p>
          Prodej přes realitku se vyplatí, pokud: nemáte na spěch a můžete čekat
          na správného kupce, nemovitost je v dobrém stavu a atraktivní
          lokalitě, chcete dosáhnout maximální tržní ceny, jste ochotni
          investovat čas do prohlídek a vyjednávání. V těchto případech může
          makléř dosáhnout ceny, která převýší náklady na provizi.
        </p>

        <h2>Kdy zvolit výkup nemovitosti</h2>
        <p>
          Přímý výkup je ideální volba, pokud: potřebujete prodat rychle
          (rozvod, dědictví, finanční potíže), nemovitost vyžaduje rekonstrukci
          nebo je ve špatném stavu, na nemovitosti váznou právní komplikace ({" "}
          <Link
            href="/vykup-pri-exekuci"
            className="text-emerald-600 hover:text-emerald-500"
          >
            exekuce
          </Link>
          ,{" "}
          <Link
            href="/vykup-nemovitosti-s-vecnym-bremenem"
            className="text-emerald-600 hover:text-emerald-500"
          >
            věcné břemeno
          </Link>
          ,{" "}
          <Link
            href="/vykup-nemovitosti-s-hypotekou"
            className="text-emerald-600 hover:text-emerald-500"
          >
            nesplacená hypotéka
          </Link>
          ), nechcete řešit prohlídky a vyjednávání, potřebujete jistotu a
          bezpečnost transakce.
        </p>

        <h2>Kombinovaný přístup</h2>
        <p>
          Nemusíte se nutně rozhodovat jen pro jednu cestu. Stále více
          prodávajících volí kombinovaný přístup: nechají si vypracovat nabídku
          od výkupní firmy jako záchrannou síť a současně zkusí prodej přes
          realitku. Pokud se nemovitost neprodá za tržní cenu během 2–3 měsíců,
          využijí výkup. Tím získáte to nejlepší z obou světů - šanci na vyšší
          cenu i jistotu rychlého prodeje.
        </p>

        <h2>Jak poznat seriózní výkupní firmu</h2>
        <p>
          Na trhu působí desítky výkupních firem a ne všechny jsou stejně
          důvěryhodné. Seriózní firma nabízí bezplatnou a nezávaznou konzultaci,
          transparentně vysvětlí způsob ocenění, používá advokátní úschovu pro
          bezpečnost platby, neúčtuje žádné poplatky předem, má pozitivní
          reference a prokazatelnou historii, poskytne dostatek času na
          rozhodnutí - netlačí na okamžitý podpis.
        </p>

        <h2>Závěr: co se vyplatí právě vám?</h2>
        <p>
          Neexistuje univerzálně správná odpověď. Záleží na vaší situaci,
          prioritách a časových možnostech. Pokud je pro vás klíčová rychlost a
          jistota, výkup je jasná volba. Pokud máte čas a chcete maximalizovat
          cenu, zkuste realitku. A pokud si nejste jistí, neváhejte nás{" "}
          <Link href="/" className="text-emerald-600 hover:text-emerald-500">
            kontaktovat pro nezávaznou konzultaci
          </Link>
          . Rádi vám poradíme, jaký postup je ve vaší situaci nejvýhodnější - a
          to zcela zdarma a bez závazků.
        </p>
      </>
    ),
  },
  "nemovitost-v-exekuci-pruvodce": {
    title: "Nemovitost v exekuci - kompletní průvodce",
    date: "2026-02-20",
    dateModified: "2026-03-02",
    body: (
      <>
        <p>
          Exekuce na nemovitost patří mezi nejstresovější životní situace.
          Hrozba nucené dražby, ztráta domova a finanční nejistota mohou být
          zdrcující. Dobrou zprávou je, že máte více možností, než si myslíte. V
          tomto kompletním průvodci vám vysvětlíme vše o exekuci na nemovitost -
          od právních základů až po konkrétní kroky, jak situaci řešit co
          nejlépe.
        </p>

        <h2>Co je exekuce a jak vzniká</h2>
        <p>
          Exekuce je nucený výkon rozhodnutí, kterým se věřitel domáhá splnění
          povinnosti dlužníka - nejčastěji zaplacení peněžité pohledávky.
          Exekuci nařizuje soud na návrh věřitele a provádí ji soudní exekutor.
          K exekuci na nemovitost dochází typicky tehdy, když dlužník nemá
          dostatek jiného majetku nebo příjmů k pokrytí dluhů.
        </p>
        <p>
          Proces začíná zápisem exekučního příkazu do katastru nemovitostí. Od
          tohoto okamžiku nesmíte s nemovitostí volně nakládat - nemůžete ji
          prodat, darovat ani zatížit zástavním právem bez souhlasu exekutora.
          To ale neznamená, že nemáte žádné možnosti.
        </p>

        <h2>Fáze exekučního řízení</h2>
        <p>
          Exekuční řízení má několik fází a v každé z nich máte jiné možnosti. V
          první fázi exekutor doručí exekuční příkaz a vyzve dlužníka k
          dobrovolnému plnění - obvykle ve lhůtě 30 dnů. Toto je nejlepší moment
          jednat, protože máte nejvíce prostoru pro vyjednávání.
        </p>
        <p>
          Ve druhé fázi, pokud dluh není uhrazen, exekutor přistoupí k ocenění
          nemovitosti znaleckým posudkem. Následuje usnesení o ceně, proti
          kterému se můžete odvolat, pokud s oceněním nesouhlasíte. Ve třetí
          fázi exekutor nařídí dražbu. To je poslední moment, kdy ještě můžete
          situaci změnit dobrovolným prodejem.
        </p>

        <h2>Nucená dražba - proč se jí vyhnout</h2>
        <p>
          V nucené dražbě se nemovitost často prodá výrazně pod tržní cenou.
          Nejnižší podání v prvním dražebním kole činí dvě třetiny odhadní ceny.
          Pokud se nemovitost v prvním kole neprodá, ve druhém kole klesá
          minimální podání na polovinu odhadu. To znamená, že můžete přijít o
          značnou část hodnoty svého majetku.
        </p>
        <p>
          Navíc z výtěžku dražby se přednostně hradí náklady exekuce, které
          mohou být značné - odměna exekutora, znalecký posudek, inzerce dražby
          a další výdaje. Dlužníkovi tak zůstane výrazně méně, než kdyby
          nemovitost prodal dobrovolně.
        </p>

        <h2>Dobrovolný prodej nemovitosti v exekuci</h2>
        <p>
          Dobrovolný prodej je nejefektivnější způsob, jak minimalizovat
          finanční ztrátu při exekuci. Podle § 44a odst. 4 exekučního řádu může
          exekutor udělit souhlas s prodejem nemovitosti mimo dražbu, pokud je
          to výhodné pro věřitele. V praxi to znamená, že musíte najít kupce
          ochotného zaplatit cenu, která pokryje alespoň pohledávky věřitelů a
          náklady exekuce.
        </p>
        <p>
          Zde přichází na řadu{" "}
          <Link
            href="/vykup-pri-exekuci"
            className="text-emerald-600 hover:text-emerald-500"
          >
            specializované výkupní firmy
          </Link>
          . Zkušená firma zajistí: analýzu vašich dluhů a exekučních řízení,
          ocenění nemovitosti, jednání s exekutorem o udělení souhlasu, přípravu
          kupní smlouvy, přímou úhradu dluhů věřitelům z kupní ceny. Celý proces
          trvá typicky 3–6 týdnů, tedy výrazně kratší dobu než dražba.
        </p>

        <h2>Kolik můžete získat</h2>
        <p>
          Při dobrovolném prodeji přes výkupní firmu získáte obvykle 80–90 %
          tržní hodnoty nemovitosti. Srovnejte to s nucenou dražbou, kde se
          nemovitost často prodá za 50–65 % hodnoty. Rozdíl může činit stovky
          tisíc až miliony korun. Navíc z kupní ceny firma přímo uhradí vaše
          dluhy, takže po prodeji můžete začít s čistým štítem.
        </p>

        <h2>Co potřebujete k zahájení</h2>
        <p>
          Pro rychlé posouzení vaší situace připravte tyto dokumenty: aktuální
          list vlastnictví (výpis z katastru nemovitostí), přehled exekučních
          řízení - zjistíte na Centrální evidenci exekucí (ceeonline.cz),
          kontakty na exekutory vedoucí řízení proti vám, přehled všech dluhů
          včetně jistiny, úroků a příslušenství, případně kopie exekučních
          příkazů.
        </p>
        <p>
          Pokud tyto dokumenty nemáte nebo nevíte, kde je získat, nezoufejte.
          Seriózní výkupní firma vám pomůže vše dohledat a zajistit.
        </p>

        <h2>Časté obavy a mýty</h2>
        <p>
          <strong>Mýtus: Nemovitost v exekuci nelze prodat.</strong> Realita:
          Dobrovolný prodej je možný se souhlasem exekutora. Exekutoři s tím v
          praxi souhlasí, pokud je to výhodné pro věřitele - a dobrovolný prodej
          za vyšší cenu než v dražbě rozhodně výhodný je.
        </p>
        <p>
          <strong>Mýtus: Po prodeji mi zůstanou všechny dluhy.</strong> Realita:
          Z kupní ceny se uhradí pohledávky věřitelů. Pokud kupní cena pokryje
          vše, jste zcela oddluženi. Pokud ne, zbývající dluh je výrazně nižší a
          lze dojednat splátkový kalendář.
        </p>
        <p>
          <strong>Mýtus: Exekutor mi nedovolí prodej.</strong> Realita: Exekutor
          je ze zákona povinen postupovat tak, aby bylo dosaženo co nejvyššího
          výtěžku. Dobrovolný prodej za vyšší cenu než v dražbě je v zájmu všech
          stran.
        </p>
        <p>
          <strong>Mýtus: Musím počkat na dražbu.</strong> Realita: Čím dříve
          začnete jednat, tím lepší pozici máte. Po nařízení dražby se vaše
          možnosti výrazně zúží.
        </p>

        <h2>Jak ochránit rodinu</h2>
        <p>
          Exekuce na nemovitost zasahuje celou rodinu. Pokud v nemovitosti
          bydlíte s rodinou, dobrovolný prodej vám dává možnost dojednat
          podmínky - například delší lhůtu pro vystěhování nebo pomoc s hledáním
          náhradního bydlení. V nucené dražbě tyto možnosti nemáte.
        </p>
        <p>
          Důležité je také vědět, že společné jmění manželů (SJM) může být
          exekucí postiženo i kvůli dluhům jen jednoho z manželů, pokud dluhy
          vznikly za trvání manželství. V takovém případě je klíčové jednat
          rychle a prokonzultovat situaci s právníkem.
        </p>

        <h2>Prevence - jak se exekuci vyhnout</h2>
        <p>
          Nejlepší strategií je samozřejmě prevence. Pokud máte dluhy,
          neignorujte upomínky a platební příkazy. Komunikujte s věřiteli -
          většina z nich je ochotna dojednat splátkový kalendář. Pokud víte, že
          nezvládáte splácet{" "}
          <Link
            href="/vykup-nemovitosti-s-hypotekou"
            className="text-emerald-600 hover:text-emerald-500"
          >
            hypotéku
          </Link>
          , kontaktujte banku co nejdříve. Včasná komunikace může zabránit
          exekučnímu řízení.
        </p>

        <h2>Kdy jednat</h2>
        <p>
          Odpověď je jednoduchá: hned. Čím dříve situaci začnete řešit, tím více
          možností máte a tím lepšího výsledku dosáhnete. Neváhejte nás{" "}
          <Link href="/" className="text-emerald-600 hover:text-emerald-500">
            kontaktovat pro bezplatnou konzultaci
          </Link>
          . Poradíme vám diskrétně a bez závazků. Pomohli jsme stovkám lidí v
          podobné situaci a můžeme pomoci i vám.
        </p>
        <p>
          Přečtěte si také{" "}
          <Link
            href="/blog/jak-rychle-prodat-nemovitost"
            className="text-emerald-600 hover:text-emerald-500"
          >
            jak rychle prodat nemovitost v roce 2026
          </Link>{" "}
          nebo se podívejte na{" "}
          <Link
            href="/caste-dotazy"
            className="text-emerald-600 hover:text-emerald-500"
          >
            nejčastější dotazy
          </Link>{" "}
          o výkupu nemovitostí.
        </p>
      </>
    ),
  },
  "jak-probiha-rychly-vykup": {
    title: "Jak probíhá rychlý výkup nemovitosti",
    date: "2026-02-15",
    dateModified: "2026-03-01",
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
          telefonickým kontaktem. Potřebujeme základní informace o nemovitosti -
          typ, lokalitu, velikost a aktuální stav. Formulář zabere maximálně 2
          minuty a je zcela nezávazný.
        </p>

        <h2>2. Ocenění nemovitosti</h2>
        <p>
          Na základě poskytnutých údajů provedeme předběžné ocenění.
          Zohledňujeme aktuální tržní ceny v dané lokalitě, stav nemovitosti a
          případná právní břemena. Do 24 hodin vám představíme cenovou nabídku.
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
          zkontrolovat vlastním právníkem - na transparentnosti nám záleží.
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
    dateModified: "2026-02-28",
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
          rychle získat finanční prostředky - například při rozvodu, dědictví
          nebo finančních potížích.
        </p>

        <h2>2. Žádné provize a skryté poplatky</h2>
        <p>
          Realitní kanceláře si účtují provizi obvykle 3–5 % z prodejní ceny. U
          nemovitosti za 3 miliony korun to znamená 90 000–150 000 Kč. Při
          výkupu neplatíte žádnou provizi. Veškeré náklady na právní služby,
          odhad a převod hradíme za vás.
        </p>

        <h2>3. Prodej v jakémkoliv stavu</h2>
        <p>
          Nemovitost nemusíte před prodejem opravovat, malovat ani uklízet.
          Výkupní firma kupuje nemovitosti ve stávajícím stavu - ať už jde o
          zanedbaný byt, starší dům vyžadující rekonstrukci nebo pozemek s
          ekologickou zátěží. Ušetříte čas i peníze za případné úpravy.
        </p>

        <h2>4. Řešení právně komplikovaných nemovitostí</h2>
        <p>
          Máte na nemovitosti exekuci, zástavní právo nebo věcné břemeno?
          Klasický kupec se takové nemovitosti většinou bojí. Výkupní firmy se
          na tyto případy specializují a dokáží celou situaci vyřešit - včetně
          jednání s věřiteli a exekutory. Více o tomto tématu najdete v našem
          článku o{" "}
          <Link
            href="/blog/nemovitost-v-exekuci-pruvodce"
            className="text-emerald-600 hover:text-emerald-500"
          >
            nemovitostech v exekuci
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
    title: "Výkup nemovitosti v exekuci - co potřebujete vědět",
    date: "2026-02-05",
    dateModified: "2026-02-27",
    body: (
      <>
        <p>
          Exekuce na nemovitosti je stresující situace, která může skončit
          nuceným prodejem v dražbě - často hluboko pod tržní cenou. Existuje
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
          - obvykle 80–90 % tržní hodnoty. Navíc máte kontrolu nad celým
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
          exekutora. To není pravda - dobrovolný prodej je možný, ale vyžaduje
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
  const host = await getRequestHost();
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
      modifiedTime: post?.dateModified ?? article.date,
      images: ["/blog/" + slug + "/opengraph-image"],
    },
    alternates: { canonical: `https://vykoupim-nemovitost.cz/blog/${slug}` },
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
  const host = await getRequestHost();
  const article = ARTICLES[slug];
  if (!article) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.date,
    dateModified: article.dateModified,
    author: {
      "@type": "Organization",
      name: "Vykoupím Nemovitost",
    },
    publisher: {
      "@type": "Organization",
      name: "Vykoupím Nemovitost",
    },
  };

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== slug);
  const relatedArticles = getRelatedArticles(`blog/${slug}`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />

      <article className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-8">
            <Breadcrumbs
              items={[
                { label: "Blog", href: "/blog" },
                { label: article.title, href: `/blog/${slug}` },
              ]}
            />
          </div>

          <header>
            <time dateTime={article.date} className="text-sm text-slate-500">
              {new Date(article.date).toLocaleDateString("cs-CZ", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span className="ml-3 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              Aktualizováno{" "}
              {new Date(article.dateModified).toLocaleDateString("cs-CZ", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
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

          <RelatedArticles articles={relatedArticles} />

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

      <AllRegionsSection currentHost={host} />
    </>
  );
}
