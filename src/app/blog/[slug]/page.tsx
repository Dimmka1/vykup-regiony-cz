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
  body: React.ReactElement;
}

const ARTICLES: Record<string, ArticleContent> = {
  "prodej-zdenene-nemovitosti": {
    title: "Prodej zděděné nemovitosti — kompletní průvodce",
    date: "2026-03-06",
    body: (
      <>
        <p>
          Zdědili jste nemovitost a přemýšlíte, co s ní? Prodej zděděné
          nemovitosti je jednou z nejčastějších situací, se kterou se na nás
          klienti obracejí. Ať už jde o byt po prarodičích, rodinný dům nebo
          pozemek, celý proces má svá specifika — od dědického řízení přes
          daňové povinnosti až po samotný prodej. V tomto článku vám přinášíme
          kompletní průvodce, který vás provede každým krokem a pomůže vám
          udělat správné rozhodnutí.
        </p>

        <h2>Dědické řízení — první krok k prodeji</h2>
        <p>
          Než můžete zděděnou nemovitost prodat, musíte projít dědickým řízením.
          Dědické řízení zahajuje notář pověřený příslušným okresním soudem, a
          to na základě úmrtního listu zůstavitele. Notář zjistí okruh dědiců,
          rozsah pozůstalosti a případné dluhy zůstavitele. Celý proces trvá
          obvykle 3 až 6 měsíců, v komplikovanějších případech i déle.
        </p>
        <p>
          Klíčovým dokumentem je usnesení o dědictví, které vydá soud po
          skončení dědického řízení. Tímto usnesením se stáváte právoplatným
          vlastníkem nemovitosti a můžete s ní volně nakládat — tedy i ji
          prodat. Bez pravomocného usnesení o dědictví prodej nemovitosti není
          možný, protože v katastru nemovitostí budete zapsáni jako vlastník až
          po jeho právní moci.
        </p>
        <p>
          Pokud dědí více dědiců, musí se všichni dohodnout na způsobu
          vypořádání. Nemovitost lze rozdělit, jeden z dědiců může ostatní
          vyplatit, nebo se všichni dohodnou na společném prodeji. Právě
          společný prodej bývá nejčastějším a nejpraktičtějším řešením, zejména
          když žádný z dědiců nechce nemovitost užívat. Více o dědických
          situacích najdete na stránce{" "}
          <Link
            href="/vykup-pri-dedictvi"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Výkup nemovitosti při dědictví
          </Link>
          .
        </p>

        <h2>Spoluvlastnictví dědiců — jak se dohodnout</h2>
        <p>
          Jedním z nejčastějších problémů při dědění nemovitosti je
          spoluvlastnictví více dědiců. Pokud například tři sourozenci zdědí
          rodinný dům, stávají se podílovými spoluvlastníky. Každý z nich má
          právo se svým podílem nakládat, ale prodej celé nemovitosti vyžaduje
          souhlas všech spoluvlastníků. To může být zdrojem konfliktů, zejména
          pokud mají dědicové rozdílné představy o tom, co s nemovitostí dělat.
        </p>
        <p>
          V praxi se setkáváme s několika scénáři. Někteří dědicové chtějí
          nemovitost prodat co nejrychleji, zatímco jiní by ji chtěli ponechat v
          rodině. Dalším častým problémem je neshoda ohledně ceny — jeden dědic
          může mít nerealistická očekávání. V těchto situacích může být výkupní
          firma ideálním řešením, protože nabízí transparentní ocenění a rychlý
          proces, na kterém se mohou všichni shodnout. Informace o prodeji
          spoluvlastnického podílu najdete na stránce{" "}
          <Link
            href="/vykup-spoluvlastnickeho-podilu"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Výkup spoluvlastnického podílu
          </Link>
          .
        </p>

        <h2>Daňové aspekty prodeje zděděné nemovitosti</h2>
        <p>
          Důležitou otázkou při prodeji zděděné nemovitosti jsou daně. V České
          republice platí několik pravidel, která byste měli znát. Dědická daň
          byla v roce 2014 zrušena, takže samotné nabytí nemovitosti dědictvím
          je od daně osvobozeno. Pozor ale na daň z příjmů při následném
          prodeji. Příjem z prodeje nemovitosti je osvobozen od daně z příjmů,
          pokud splníte jednu z následujících podmínek: nemovitost jste
          vlastnili alespoň 5 let (u nemovitostí nabytých do roku 2020) nebo
          alespoň 10 let (u nemovitostí nabytých od roku 2021).
        </p>
        <p>
          U zděděných nemovitostí se do doby vlastnictví započítává i doba, po
          kterou nemovitost vlastnil zůstavitel. To je velmi důležité pravidlo.
          Pokud tedy vaši rodiče vlastnili byt 20 let a vy jej zdědíte a ihned
          prodáte, příjem z prodeje bude osvobozen od daně z příjmů, protože
          celková doba vlastnictví (včetně doby vlastnictví zůstavitele)
          přesáhla zákonný limit. Doporučujeme nicméně vždy konzultovat
          konkrétní situaci s daňovým poradcem, protože pravidla mají řadu
          výjimek a specifických podmínek.
        </p>
        <p>
          Dalším daňovým aspektem je daň z nemovitých věcí, kterou jako nový
          vlastník musíte platit od roku následujícího po nabytí nemovitosti.
          Přiznání k dani z nemovitých věcí je třeba podat do 31. ledna
          příslušného roku. Pokud nemovitost plánujete prodat, je důležité mít
          tuto povinnost splněnou, aby nedošlo ke komplikacím při převodu.
        </p>

        <h2>Jaké dokumenty potřebujete k prodeji</h2>
        <p>
          K prodeji zděděné nemovitosti budete potřebovat několik klíčových
          dokumentů. Především pravomocné usnesení o dědictví, které prokazuje
          vaše vlastnické právo. Dále aktuální list vlastnictví z katastru
          nemovitostí, kde byste již měli být zapsáni jako vlastník. Potřebujete
          také platný občanský průkaz a energetický průkaz budovy (PENB).
        </p>
        <p>
          V případě, že nemovitost prodávají všichni spoluvlastníci společně,
          musí každý z nich poskytnout svůj doklad totožnosti a podepsat kupní
          smlouvu (nebo udělit plnou moc jinému spoluvlastníkovi či třetí
          osobě). Kompletní přehled potřebných dokumentů najdete v článku{" "}
          <Link
            href="/blog/jake-dokumenty-potrebuji"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Jaké dokumenty potřebuji k výkupu nemovitosti
          </Link>
          .
        </p>

        <h2>Stav zděděné nemovitosti — rekonstrukce, nebo prodej?</h2>
        <p>
          Zděděné nemovitosti bývají často ve stavu, který vyžaduje
          rekonstrukci. Starší domy mohou mít zastaralé rozvody, střechu v
          havarijním stavu nebo vlhkost. Byty v panelových domech mohou
          potřebovat nová okna, koupelnu nebo kuchyň. Otázka zní: vyplatí se
          investovat do rekonstrukce před prodejem, nebo prodat v aktuálním
          stavu?
        </p>
        <p>
          Odpověď závisí na několika faktorech. Pokud máte čas a finanční
          prostředky na rekonstrukci, může se investice vrátit ve vyšší prodejní
          ceně. Nicméně rekonstrukce trvá měsíce, stojí statisíce až miliony
          korun a nese riziko neočekávaných nákladů. Pro mnoho dědiců je proto
          výhodnější prodat nemovitost v aktuálním stavu výkupní firmě, která
          nemovitost koupí bez ohledu na její stav a o rekonstrukci se postará
          sama. Podrobnosti o tom, jak celý výkup probíhá, najdete na stránce{" "}
          <Link
            href="/jak-to-funguje"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Jak to funguje
          </Link>
          .
        </p>

        <h2>Proč dědici volí výkup nemovitosti</h2>
        <p>
          Z naší zkušenosti volí dědici výkup nemovitosti z několika důvodů.
          Prvním je rychlost — peníze z dědictví často potřebují k řešení jiných
          záležitostí a nechtějí čekat měsíce na klasický prodej. Druhým důvodem
          je jednoduchost — výkupní firma zajistí vše od ocenění přes právní
          servis až po úhradu, takže se dědici nemusí stresovat s byrokratickými
          záležitostmi.
        </p>
        <p>
          Třetím důvodem je řešení sporů mezi dědici. Když se sourozenci nemohou
          dohodnout na ceně, nezávislé ocenění výkupní firmy může posloužit jako
          objektivní základ pro dohodu. Čtvrtým důvodem je stav nemovitosti —
          mnozí dědici nechtějí investovat do oprav nemovitosti, kterou
          nehodlají užívat.
        </p>

        <h2>Emocionální stránka prodeje zděděné nemovitosti</h2>
        <p>
          Prodej zděděné nemovitosti není jen finanční rozhodnutí — má i silnou
          emocionální stránku. Rodinný dům, kde jste vyrůstali, byt prarodičů
          plný vzpomínek. Je přirozené cítit nostalgii a váhání. Důležité je ale
          rozhodovat se racionálně. Nemovitost, která leží ladem, postupně
          chátrá a generuje náklady (daň z nemovitosti, energie, pojištění,
          údržba). Pokud ji žádný z dědiců nechce nebo nemůže využívat, prodej
          je ekonomicky rozumné rozhodnutí.
        </p>
        <p>
          Před prodejem si vezměte čas na roztřídění osobních věcí a vzpomínek.
          Pořiďte fotografie prostor, uložte si rodinné památky. Prodej
          nemovitosti neznamená ztrátu vzpomínek — ty zůstávají s vámi bez
          ohledu na to, kdo nemovitost vlastní.
        </p>

        <h2>Jak postupovat — praktický návod pro dědice</h2>
        <p>
          Pokud jste zdědili nemovitost a chcete ji prodat, doporučujeme
          následující postup. Nejprve vyčkejte na pravomocné usnesení o dědictví
          a zápis do katastru nemovitostí. Poté se dohodněte se všemi
          spoluvlastníky na prodeji. Následně nás kontaktujte prostřednictvím
          formuláře na stránkách — do 24 hodin vám připravíme nezávaznou cenovou
          nabídku.
        </p>
        <p>
          Po prohlídce nemovitosti vám předložíme finální nabídku. Pokud ji
          přijmete, náš právní tým připraví veškerou dokumentaci a celý převod
          dokončíme obvykle za 7 až 14 dní. Peníze obdržíte přes bezpečnou
          advokátní úschovu. Celý proces je navržen tak, aby byl pro vás co
          nejjednodušší — a to i v emocionálně náročném období po ztrátě
          blízkého člověka.
        </p>

        <h2>Máte otázky? Kontaktujte nás</h2>
        <p>
          Zdědili jste nemovitost a nevíte, jak postupovat? Rádi vám poradíme
          zdarma a nezávazně. Naše konzultace jsou diskrétní a bez jakýchkoliv
          závazků. Pomohli jsme stovkám dědiců po celé České republice vyřešit
          jejich situaci rychle a bezpečně.{" "}
          <Link href="/" className="text-emerald-600 hover:text-emerald-500">
            Vyplňte formulář
          </Link>{" "}
          a ozveme se vám do 24 hodin s nabídkou.
        </p>
      </>
    ),
  },
  "jak-zjistit-trzni-cenu-nemovitosti": {
    title: "Jak zjistit tržní cenu nemovitosti — 4 spolehlivé metody",
    date: "2026-03-06",
    body: (
      <>
        <p>
          Znát reálnou tržní cenu nemovitosti je klíčové, ať už ji chcete
          prodat, koupit, pojistit nebo řešit dědictví. Bohužel mnoho majitelů
          nemovitostí má o hodnotě svého majetku nerealistické představy — ať už
          příliš vysoké, nebo naopak příliš nízké. V tomto článku vám
          představíme čtyři spolehlivé metody, jak zjistit skutečnou tržní cenu
          nemovitosti, a porovnáme jejich výhody a nevýhody.
        </p>

        <h2>Co je tržní cena a proč je důležitá</h2>
        <p>
          Tržní cena nemovitosti je částka, za kterou by se nemovitost prodala
          na volném trhu za standardních podmínek — tedy mezi ochotným kupujícím
          a ochotným prodávajícím, kteří jednají bez nátlaku a s dostatečnými
          informacemi. Tržní cena se liší od ceny účetní, pojistné nebo úřední —
          každá z nich slouží jinému účelu a stanovuje se jinou metodikou.
        </p>
        <p>
          Znalost tržní ceny je zásadní v několika situacích. Při prodeji
          nemovitosti vám pomůže nastavit správnou cenu a vyhnout se jak
          předražení (které odradí kupce), tak podhodnocení (které znamená
          finanční ztrátu). Při koupi vám umožní posoudit, zda je požadovaná
          cena přiměřená. Při dědickém řízení je ocenění nutné pro spravedlivé
          vypořádání mezi dědici. A při žádosti o hypotéku banka vyžaduje odhad
          nemovitosti jako zajištění úvěru.
        </p>

        <h2>Metoda 1: Znalecký posudek od soudního znalce</h2>
        <p>
          Znalecký posudek je nejpřesnější a právně nejsilnější způsob ocenění
          nemovitosti. Zpracovává jej soudní znalec zapsaný v seznamu znalců
          Ministerstva spravedlnosti. Znalec provede důkladnou prohlídku
          nemovitosti, posoudí její technický stav, lokalitu, dispozice a další
          faktory ovlivňující hodnotu. Výsledkem je podrobný dokument s
          odůvodněním stanovené ceny.
        </p>
        <p>
          Znalecký posudek je vyžadován v některých právních situacích —
          například při dědickém řízení, soudních sporech nebo pro daňové účely.
          Jeho nevýhodou je cena, která se pohybuje od 5 000 do 15 000 Kč v
          závislosti na typu a složitosti nemovitosti. Zpracování trvá obvykle 1
          až 3 týdny. Výhodou je vysoká přesnost a právní relevance — znalecký
          posudek je akceptován soudy, bankami i úřady.
        </p>

        <h2>Metoda 2: Cenové mapy a srovnávací analýza</h2>
        <p>
          Cenové mapy jsou dostupné online a umožňují rychlou orientaci v cenách
          nemovitostí v konkrétní lokalitě. Nejznámější české cenové mapy
          provozují servery jako Sreality, Bezrealitky nebo Český statistický
          úřad. Cenové mapy zobrazují průměrné ceny za metr čtvereční v dané
          oblasti, členěné podle typu nemovitosti (byt, dům, pozemek) a dalších
          parametrů.
        </p>
        <p>
          Srovnávací analýza (komparativní metoda) spočívá v porovnání vaší
          nemovitosti s podobnými nemovitostmi, které se nedávno prodaly v
          okolí. Tato metoda je intuitivní a poměrně přesná, pokud máte dostatek
          srovnatelných transakcí. Výhodou cenových map je, že jsou zdarma nebo
          za minimální poplatek a poskytují okamžitý výsledek. Nevýhodou je
          omezená přesnost — cenové mapy pracují s průměry a nezohledňují
          individuální vlastnosti nemovitosti, jako je stav, patro, výhled nebo
          vybavení.
        </p>
        <p>
          Pro získání přesnějšího odhadu doporučujeme kombinovat cenové mapy s
          prohlížením aktuálních inzerátů na realitních portálech. Pozor ale na
          to, že inzertní ceny jsou často vyšší než skutečné prodejní ceny — k
          prodeji obvykle dochází za cenu o 5 až 15 procent nižší, než je cena v
          inzerátu.
        </p>

        <h2>Metoda 3: Online odhad nemovitosti</h2>
        <p>
          V posledních letech se stále více rozšiřují online nástroje pro odhad
          ceny nemovitosti. Tyto nástroje využívají algoritmy a strojové učení k
          analýze velkého množství dat z realitního trhu. Stačí zadat základní
          parametry nemovitosti — typ, lokalitu, velikost, stav — a během
          několika sekund obdržíte odhad tržní ceny.
        </p>
        <p>
          Mezi nejznámější české online nástroje patří odhady na portálech
          Sreality, Bezrealitky nebo specializované služby jako
          OceňováníNemovitostí.cz. Výhodou je rychlost a nulová nebo minimální
          cena. Nevýhodou je nižší přesnost ve srovnání se znaleckým posudkem —
          online nástroje nemohou posoudit individuální faktory jako specifický
          technický stav, kvalitu rekonstrukce nebo sousedské vztahy. Odchylka
          od skutečné tržní ceny se může pohybovat v rozmezí 10 až 20 procent.
        </p>
        <p>
          Online odhad je vhodný jako první orientační krok, který vám napoví, v
          jakém cenovém rozmezí se vaše nemovitost pohybuje. Pro přesnější
          ocenění doporučujeme kombinovat online odhad s dalšími metodami.
        </p>

        <h2>Metoda 4: Výkupní nabídka od specializované firmy</h2>
        <p>
          Čtvrtou a často opomíjenou metodou, jak zjistit hodnotu nemovitosti,
          je nechat si vypracovat nezávaznou nabídku od výkupní firmy. Tento
          způsob je zcela zdarma a přináší konkrétní, reálnou cenu, za kterou je
          někdo ochoten vaši nemovitost skutečně koupit. To je zásadní rozdíl
          oproti ostatním metodám, které poskytují pouze odhad.
        </p>
        <p>
          Výkupní firma provede vlastní analýzu nemovitosti — ověří údaje v
          katastru, posoudí lokalitu, stav a tržní podmínky. Do 24 hodin vám
          předloží konkrétní cenovou nabídku. Tato nabídka je nezávazná — pokud
          se rozhodnete nemovitost neprodat, nic se neděje. Ale získáte cennou
          informaci o reálné hodnotě vaší nemovitosti, kterou můžete využít i
          při jednání s realitní kanceláří nebo při rozhodování o dalším
          postupu.
        </p>
        <p>
          Je důležité vědět, že výkupní cena bývá obvykle 80 až 90 procent plné
          tržní hodnoty. To je dáno obchodním modelem výkupní firmy, která nese
          náklady na právní servis, případnou rekonstrukci a riziko. Pokud tedy
          od výkupní firmy dostanete nabídku například 3 400 000 Kč, můžete
          odhadnout, že plná tržní hodnota nemovitosti se pohybuje kolem 3 800
          000 až 4 250 000 Kč. Více o cenách výkupu najdete v článku{" "}
          <Link
            href="/blog/kolik-stoji-vykup"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Kolik stojí výkup nemovitosti
          </Link>
          .
        </p>

        <h2>Faktory ovlivňující cenu nemovitosti</h2>
        <p>
          Bez ohledu na zvolenou metodu ocenění existují klíčové faktory, které
          nejvíce ovlivňují cenu nemovitosti. Lokalita je tradičně
          nejdůležitějším faktorem — stejný byt v Praze a v malém městě bude mít
          zcela odlišnou hodnotu. V rámci jednoho města záleží na čtvrti,
          dostupnosti MHD, občanské vybavenosti a bezpečnosti.
        </p>
        <p>
          Technický stav nemovitosti je druhým nejdůležitějším faktorem.
          Nemovitost po kompletní rekonstrukci má výrazně vyšší hodnotu než
          stejná nemovitost v původním stavu. Mezi další faktory patří velikost
          a dispozice (počet pokojů, patro, balkon), energetická náročnost,
          parkování, úložné prostory a celkový stav domu nebo bytového komplexu.
        </p>
        <p>
          Právní stav nemovitosti může cenu výrazně ovlivnit — nemovitost
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
            nesplacenou hypotékou
          </Link>{" "}
          má nižší hodnotu než právně čistá nemovitost. Na druhou stranu,
          výkupní firmy se na tyto případy specializují a dokáží nabídnout
          férovou cenu i za komplikované nemovitosti.
        </p>

        <h2>Kterou metodu zvolit</h2>
        <p>
          Optimální přístup závisí na vaší situaci. Pokud potřebujete právně
          závazné ocenění (dědictví, soud, daně), zvolte znalecký posudek. Pokud
          chcete rychlou orientaci zdarma, začněte s cenovými mapami a online
          odhady. Pokud zvažujete prodej a chcete znát reálnou cenu, nechte si
          vypracovat nezávaznou výkupní nabídku.
        </p>
        <p>
          Nejpřesnějšího výsledku dosáhnete kombinací více metod. Porovnejte
          online odhad s cenovými mapami a výkupní nabídkou — pokud se všechny
          tři zdroje shodnou na podobném cenovém rozmezí, můžete si být jisti,
          že znáte reálnou hodnotu své nemovitosti. Pokud se výrazně liší,
          doporučujeme investovat do znaleckého posudku.
        </p>

        <h2>Máte otázky? Kontaktujte nás</h2>
        <p>
          Chcete zjistit, kolik vaše nemovitost stojí? Nabízíme bezplatné a
          nezávazné ocenění do 24 hodin. Stačí vyplnit krátký formulář s
          informacemi o nemovitosti a náš tým vám připraví konkrétní cenovou
          nabídku. Žádné závazky, žádné poplatky — jen férová cena od
          profesionálů s dlouholetou zkušeností na českém realitním trhu.{" "}
          <Link href="/" className="text-emerald-600 hover:text-emerald-500">
            Vyplňte formulář
          </Link>{" "}
          a do 24 hodin se vám ozveme.
        </p>
      </>
    ),
  },
  "prodej-bytu-s-najemniky": {
    title: "Prodej bytu s nájemníky — práva, cena a výkup",
    date: "2026-03-06",
    body: (
      <>
        <p>
          Prodej nemovitosti obsazené nájemníky je specifická situace, která
          přináší řadu právních, finančních i praktických otázek. Mnoho majitelů
          bytů se ocitá v situaci, kdy potřebují nemovitost prodat, ale mají v
          ní nájemníky s platnou nájemní smlouvou. Jak postupovat? Jaká jsou
          práva nájemníků? Jak přítomnost nájemníků ovlivňuje cenu? A proč může
          být výkup nejlepším řešením? Na tyto otázky odpovídáme v tomto
          komplexním průvodci.
        </p>

        <h2>Právní rámec — práva nájemníků při prodeji</h2>
        <p>
          Prodej nemovitosti s nájemníky je v České republice zcela legální a
          nájemníci jej nemohou blokovat. Klíčovým principem českého občanského
          zákoníku (zákon č. 89/2012 Sb.) je, že změna vlastníka nemovitosti
          nemá vliv na existující nájemní vztah. To znamená, že nový vlastník
          automaticky vstupuje do práv a povinností pronajímatele. Nájemní
          smlouva zůstává v platnosti za stejných podmínek — včetně výše
          nájemného, doby trvání a dalších ujednání.
        </p>
        <p>
          Nájemníci mají ze zákona několik důležitých práv. Především právo na
          zachování nájemní smlouvy v nezměněné podobě. Nový vlastník nemůže
          jednostranně změnit podmínky nájmu, zvýšit nájemné nad zákonem
          stanovený limit nebo nájemníka bezdůvodně vystěhovat. Výpověď z nájmu
          je možná pouze ze zákonem stanovených důvodů — například hrubé
          porušení povinností nájemcem, neplacení nájemného nebo potřeba bytu
          pro vlastní bydlení nového vlastníka. I v těchto případech platí
          zákonná výpovědní lhůta, která činí minimálně 3 měsíce.
        </p>
        <p>
          Důležité je také předkupní právo nájemníka. Podle českého práva má
          nájemník při prvním prodeji bytové jednotky předkupní právo, pokud byl
          nájemcem v době, kdy došlo k vymezení bytových jednotek v domě. V
          ostatních případech předkupní právo neplatí, pokud není sjednáno ve
          smlouvě. Doporučujeme vždy zkontrolovat konkrétní nájemní smlouvu a
          případně konzultovat situaci s právníkem.
        </p>

        <h2>Jak přítomnost nájemníků ovlivňuje cenu</h2>
        <p>
          Přítomnost nájemníků v nemovitosti má zásadní vliv na její prodejní
          cenu. Nemovitost obsazená nájemníky se na trhu prodává obvykle za 10
          až 30 procent méně než srovnatelná volná nemovitost. Důvodem je
          několik faktorů. Kupující z řad investorů ocení stabilní příjem z
          nájmu, ale budou požadovat odpovídající výnos. Kupující, kteří chtějí
          nemovitost užívat sami, musí počítat s tím, že nebudou moci nemovitost
          ihned využívat — musí vyčkat na skončení nájemní smlouvy nebo projít
          výpovědním procesem.
        </p>
        <p>
          Výše slevy závisí na několika faktorech. Pokud je nájemní smlouva na
          dobu určitou a končí v blízké době (do několika měsíců), sleva bude
          menší. Pokud je smlouva na dobu neurčitou s řádně platícím nájemníkem,
          kupující musí počítat s delším obdobím, než bude moci nemovitost
          využít, a sleva bude vyšší. Výše nájemného je dalším faktorem — nízké
          nájemné pod tržní úrovní snižuje atraktivitu nemovitosti pro
          investory.
        </p>
        <p>
          Pro klasický prodej přes realitní kancelář je přítomnost nájemníků
          výraznou komplikací. Prohlídky nemovitosti jsou obtížnější (nájemník
          musí souhlasit a být přítomen), marketing je omezený a okruh
          potenciálních kupců se zúží. To vše prodlužuje dobu prodeje a tlačí
          cenu dolů.
        </p>

        <h2>Výkup nemovitosti s nájemníky — nejrychlejší řešení</h2>
        <p>
          Výkupní firma je v případě prodeje nemovitosti s nájemníky často
          ideálním řešením. Na rozdíl od běžných kupujících se výkupní firmy na
          tyto situace specializují a nemovitost s nájemníky pro ně
          nepředstavuje problém. Firma kupuje nemovitost v aktuálním právním
          stavu — včetně existujících nájemních vztahů — a o vše se postará
          sama.
        </p>
        <p>
          Výhodou výkupu je, že nemusíte řešit nájemníky před prodejem. Nemusíte
          jim dávat výpověď, nemusíte čekat na uplynutí výpovědní lhůty a
          nemusíte řešit případné spory. Výkupní firma přebírá veškerá práva a
          povinnosti pronajímatele a nájemníci pokračují v bydlení za stejných
          podmínek. Celý proces prodeje trvá obvykle 7 až 14 dní. Více o procesu
          výkupu najdete na stránce{" "}
          <Link
            href="/jak-to-funguje"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Jak to funguje
          </Link>
          .
        </p>

        <h2>Praktické tipy pro prodej s nájemníky</h2>
        <p>
          Pokud se rozhodnete prodat nemovitost s nájemníky, doporučujeme
          několik praktických kroků. Především informujte nájemníky o svém
          záměru. Ze zákona sice nemáte povinnost nájemníky o prodeji informovat
          předem (stačí oznámit změnu pronajímatele po prodeji), ale otevřená
          komunikace předejde nedorozuměním a konfliktům. Nájemníci se mohou
          cítit nejistě a otevřený rozhovor je uklidní.
        </p>
        <p>
          Zkontrolujte stav nájemní smlouvy. Je platná? Jsou v ní všechna
          zákonem vyžadovaná ujednání? Existují nějaké nedoplatky na nájemném
          nebo službách? Mají nájemníci složenou kauci? Všechny tyto informace
          bude nový vlastník potřebovat a ovlivní i cenu nemovitosti.
        </p>
        <p>
          Připravte přehled příjmů z nájmu za poslední rok. Pro investorské
          kupce je výnosnost klíčovým faktorem rozhodování. Čím vyšší a
          stabilnější příjem z nájmu, tím atraktivnější je nemovitost pro
          investora. Pokud je nájemné výrazně pod tržní úrovní, zvažte vyjednání
          s nájemníkem o zvýšení — to může zvýšit prodejní cenu nemovitosti.
        </p>

        <h2>Situace, kdy je prodej s nájemníky výhodný</h2>
        <p>
          Existují situace, kdy přítomnost nájemníků může být dokonce výhodou.
          Pro investorské kupce je nemovitost s kvalitním, dlouhodobým
          nájemníkem atraktivní — mají okamžitý příjem z nájmu bez nutnosti
          hledat nového nájemce. Pokud je nájemné na tržní úrovni a nájemník má
          dobrou platební historii, nemovitost se může prodat za cenu blízkou
          volné nemovitosti.
        </p>
        <p>
          Dalším případem je prodej celého bytového domu nebo většího portfolia
          bytů. Investoři kupující celé domy očekávají obsazenost a stabilní
          cash flow z nájmů. V tomto segmentu je nemovitost s nájemníky
          standardem, nikoliv komplikací.
        </p>

        <h2>Čemu se vyhnout</h2>
        <p>
          Při prodeji nemovitosti s nájemníky se vyvarujte několika častých
          chyb. Nikdy nenátlakově nevystěhovávejte nájemníky — je to nezákonné a
          hrozí vám žaloba a náhrada škody. Nezatajujte kupujícímu existenci
          nájemních vztahů — to je podvod, který může vést k neplatnosti kupní
          smlouvy. Neměňte podmínky nájemní smlouvy těsně před prodejem bez
          souhlasu nájemníka — takové změny by byly neplatné.
        </p>
        <p>
          Nepokoušejte se obejít předkupní právo nájemníka, pokud existuje —
          porušení předkupního práva dává nájemníkovi možnost domáhat se u soudu
          převodu nemovitosti na sebe za stejnou cenu. A nepodceňujte právní
          stránku věci — vždy konzultujte prodej s právníkem nebo svěřte celý
          proces výkupní firmě, která má s těmito situacemi bohaté zkušenosti.
        </p>

        <h2>Porovnání možností prodeje nemovitosti s nájemníky</h2>
        <p>
          Pro lepší orientaci shrnujeme tři hlavní způsoby prodeje. Prodej přes
          realitku: doba 4 až 8 měsíců, cena snížená o 10 až 30 procent oproti
          volné nemovitosti plus provize 3 až 5 procent, komplikované prohlídky
          a omezený okruh kupců. Prodej na vlastní pěst: doba 3 až 12 měsíců,
          úspora na provizi, ale nutnost zvládnout vše sami. Výkup nemovitosti:
          doba 7 až 14 dní, cena 80 až 90 procent tržní hodnoty, žádné náklady
          pro prodávajícího, nulové komplikace s nájemníky.
        </p>

        <h2>Máte otázky? Kontaktujte nás</h2>
        <p>
          Prodáváte nemovitost s nájemníky a hledáte rychlé a bezproblémové
          řešení? Specializujeme se na výkup nemovitostí ve všech situacích —
          včetně bytů a domů s nájemníky. Nabídku vám připravíme do 24 hodin,
          zdarma a nezávazně. O nájemníky a veškeré právní záležitosti se
          postaráme za vás.{" "}
          <Link href="/" className="text-emerald-600 hover:text-emerald-500">
            Vyplňte formulář
          </Link>{" "}
          nebo nám zavolejte — jsme tu pro vás.
        </p>
      </>
    ),
  },
  "prodej-nemovitosti-ze-zahranici": {
    title: "Prodej nemovitosti z ČR ze zahraničí — jak na to",
    date: "2026-03-06",
    body: (
      <>
        <p>
          Žijete v zahraničí a vlastníte nemovitost v České republice, kterou
          chcete prodat? Nejste sami — tisíce Čechů žijících v zahraničí řeší
          každý rok prodej nemovitosti na dálku. Ať už jste se přestěhovali za
          prací, za rodinou nebo jste zdědili nemovitost po příbuzných, prodej
          ze zahraničí přináší specifické výzvy. V tomto průvodci vám
          vysvětlíme, jak celý proces zvládnout hladce, jaké dokumenty
          potřebujete a proč je výkup na dálku nejjednodušší řešení.
        </p>

        <h2>Hlavní výzvy prodeje ze zahraničí</h2>
        <p>
          Prodej nemovitosti z ČR ze zahraničí přináší několik praktických
          komplikací. Předně nemůžete být osobně přítomni na prohlídkách s
          potenciálními kupci, na jednáních s realitní kanceláří ani na podpisu
          smlouvy u notáře. Komunikace na dálku je časově náročnější a
          komplikovanější — zvláště pokud žijete v jiném časovém pásmu. Dále
          může být obtížné získat potřebné dokumenty, jako je výpis z katastru
          nebo energetický průkaz.
        </p>
        <p>
          Dalším problémem je omezená kontrola nad stavem nemovitosti. Pokud
          nemovitost leží ladem nebo je pronajímána, nemusíte mít aktuální
          přehled o jejím technickém stavu. To komplikuje ocenění i samotný
          prodej. A konečně, daňové a právní záležitosti mohou být složitější,
          pokud máte daňové rezidentství v jiné zemi.
        </p>

        <h2>Plná moc — klíčový dokument pro prodej na dálku</h2>
        <p>
          Plná moc je absolutně nezbytný dokument pro prodej nemovitosti ze
          zahraničí. Umožňuje zmocněné osobě — ať už příbuznému, právníkovi nebo
          zástupci výkupní firmy — jednat vaším jménem při všech úkonech
          spojených s prodejem. Plná moc musí být udělena v písemné formě s
          úředně ověřeným podpisem a musí jasně specifikovat nemovitost a rozsah
          oprávnění.
        </p>
        <p>
          Úřední ověření podpisu v zahraničí provádí český zastupitelský úřad
          (konzulát nebo velvyslanectví) v zemi vašeho pobytu. Alternativně lze
          podpis ověřit u místního notáře s následnou superlegalizací nebo
          apostilou — podle toho, zda je země účastníkem Haagské úmluvy o
          apostile. U zemí EU, USA, Kanady nebo Austrálie postačí apostila,
          kterou vydá příslušný orgán dané země.
        </p>
        <p>
          Plná moc by měla obsahovat přesnou identifikaci zmocnitele (vás) i
          zmocněnce, jednoznačné určení nemovitosti (katastrální území, číslo
          parcely, číslo popisné), rozsah oprávnění (prodej za stanovenou
          minimální cenu, podpis kupní smlouvy, zastupování na katastru) a datum
          platnosti. Doporučujeme nechat plnou moc připravit českým advokátem,
          který zajistí, že bude obsahovat vše potřebné. Více o dokumentech
          potřebných k prodeji najdete v článku{" "}
          <Link
            href="/blog/jake-dokumenty-potrebuji"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Jaké dokumenty potřebuji k výkupu nemovitosti
          </Link>
          .
        </p>

        <h2>Daňové povinnosti při prodeji ze zahraničí</h2>
        <p>
          Daňová situace při prodeji nemovitosti v ČR ze zahraničí závisí na
          vašem daňovém rezidentství a na smlouvě o zamezení dvojího zdanění
          mezi Českou republikou a zemí vašeho pobytu. Obecně platí, že příjem z
          prodeje nemovitosti na území ČR podléhá české dani z příjmů — a to bez
          ohledu na to, kde má prodávající bydliště.
        </p>
        <p>
          Osvobození od daně z příjmů platí stejně jako pro rezidenty: pokud v
          nemovitosti máte bydliště alespoň 2 roky nebo ji vlastníte alespoň 5
          let (resp. 10 let u nemovitostí nabytých od roku 2021), je příjem z
          prodeje osvobozen. U zděděných nemovitostí se do doby vlastnictví
          započítává i doba vlastnictví zůstavitele. Pokud podmínky pro
          osvobození nesplňujete, musíte podat daňové přiznání v České republice
          a zaplatit daň z příjmů ve výši 15 procent ze zisku (rozdíl mezi
          prodejní a pořizovací cenou).
        </p>
        <p>
          Česká republika má uzavřeny smlouvy o zamezení dvojího zdanění s
          většinou zemí. To znamená, že daň zaplacená v ČR se vám obvykle
          započítá proti dani ve vaší zemi rezidence. Nicméně daňové povinnosti
          v zemi vašeho pobytu se liší stát od státu a doporučujeme konzultovat
          situaci s daňovým poradcem, který se specializuje na mezinárodní
          zdanění.
        </p>

        <h2>Klasický prodej přes realitku vs. výkup na dálku</h2>
        <p>
          Prodej přes realitní kancelář ze zahraničí je možný, ale komplikovaný.
          Musíte najít důvěryhodnou realitku, komunikovat na dálku, řešit
          prohlídky a udržovat nemovitost v prezentovatelném stavu. Celý proces
          trvá standardně 3 až 6 měsíců a vyžaduje vaši aktivní účast — byť na
          dálku. Navíc platíte provizi 3 až 5 procent z prodejní ceny.
        </p>
        <p>
          Výkup nemovitosti na dálku je výrazně jednodušší. Celý proces lze
          zvládnout bez jediné návštěvy České republiky. Kontaktujete výkupní
          firmu online, poskytnete základní informace o nemovitosti a firma
          provede ocenění na základě vlastní prohlídky a analýzy. Nabídku
          obdržíte do 24 hodin. Pokud ji přijmete, stačí udělit plnou moc a vše
          ostatní zařídí firma — od přípravy smlouvy přes podpis u notáře až po
          zápis do katastru. Peníze obdržíte na svůj účet prostřednictvím
          advokátní úschovy, a to i na zahraniční bankovní účet.
        </p>

        <h2>Jak probíhá výkup na dálku krok za krokem</h2>
        <p>
          Celý proces výkupu na dálku se skládá z několika kroků. Prvním krokem
          je kontaktování výkupní firmy — stačí vyplnit online formulář nebo
          zavolat. Sdělíte základní informace o nemovitosti a vaší situaci.
          Druhým krokem je ocenění — firma provede prohlídku nemovitosti (bez
          vaší přítomnosti) a do 24 hodin vám předloží cenovou nabídku. Pokud
          nemovitost pronajímáte, prohlídku koordinujeme s nájemníkem.
        </p>
        <p>
          Třetím krokem je udělení plné moci. Na základě instrukcí od firmy
          navštívíte český konzulát nebo místního notáře a necháte ověřit podpis
          na plné moci. Plnou moc poté zašlete poštou nebo kurýrem do České
          republiky. Čtvrtým krokem je podpis kupní smlouvy — zmocněnec podepíše
          smlouvu vaším jménem a kupní cena je složena do advokátní úschovy.
        </p>
        <p>
          Pátým krokem je zápis do katastru a vyplacení peněz. Po provedení
          vkladu vlastnického práva do katastru nemovitostí advokát uvolní kupní
          cenu z úschovy na váš bankovní účet. Celý proces od prvního kontaktu
          po přijetí peněz trvá obvykle 2 až 4 týdny. Podrobnosti o výkupním
          procesu najdete na stránce{" "}
          <Link
            href="/jak-to-funguje"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Jak to funguje
          </Link>
          .
        </p>

        <h2>Převod peněz do zahraničí</h2>
        <p>
          Příjem z prodeje nemovitosti lze převést na zahraniční bankovní účet.
          Převod probíhá standardním bankovním převodem (SWIFT/SEPA). U převodů
          v rámci EU/EEA v eurech je proces jednoduchý a rychlý díky systému
          SEPA. U převodů mimo EU nebo v jiných měnách mohou být vyšší poplatky
          za konverzi měn a mezinárodní převod.
        </p>
        <p>
          Doporučujeme zvážit i specializované služby pro převod peněz, jako je
          Wise (dříve TransferWise), které nabízejí výhodnější směnné kurzy a
          nižší poplatky než tradiční banky. Při velkých částkách může rozdíl v
          kurzu činit desítky tisíc korun. Důležité je také zkontrolovat
          povinnost hlášení devizových operací ve vaší zemi pobytu — některé
          státy vyžadují hlášení příchozích plateb nad určitý limit.
        </p>

        <h2>Specifické situace</h2>
        <p>
          Prodej zděděné nemovitosti ze zahraničí je častým scénářem. Pokud jste
          zdědili nemovitost v ČR, ale žijete v zahraničí, celý dědický proces
          probíhá v České republice u notáře pověřeného soudem. I v tomto
          případě můžete jednat prostřednictvím plné moci. Po nabytí dědictví
          můžete nemovitost ihned prodat. Podrobnosti o prodeji zděděné
          nemovitosti najdete v článku{" "}
          <Link
            href="/blog/prodej-zdenene-nemovitosti"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Prodej zděděné nemovitosti
          </Link>{" "}
          a na stránce{" "}
          <Link
            href="/vykup-pri-dedictvi"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Výkup nemovitosti při dědictví
          </Link>
          .
        </p>
        <p>
          Prodej nemovitosti s nájemníky ze zahraničí je další častá situace.
          Pokud nemovitost pronajímáte, výkupní firma ji koupí i s existujícími
          nájemníky — nemusíte řešit výpovědi ani stěhování. Více o tomto tématu
          najdete v článku{" "}
          <Link
            href="/blog/prodej-bytu-s-najemniky"
            className="text-emerald-600 hover:text-emerald-500"
          >
            Prodej bytu s nájemníky
          </Link>
          .
        </p>

        <h2>Proč Češi v zahraničí volí výkup</h2>
        <p>
          Z naší zkušenosti volí Češi žijící v zahraničí výkup nemovitosti z
          několika klíčových důvodů. Především je to pohodlí — celý proces lze
          zvládnout na dálku bez nutnosti cestovat do České republiky. Dále je
          to rychlost — zatímco klasický prodej přes realitku vyžaduje měsíce
          aktivní účasti, výkup zvládneme za 2 až 4 týdny. Důležitá je i jistota
          — závazná nabídka a advokátní úschova garantují bezpečnost celé
          transakce.
        </p>
        <p>
          Dalším důvodem je úspora na cestovních nákladech. Letenky, ubytování a
          volno z práce pro jednání v ČR představují nezanedbatelné náklady,
          které při výkupu na dálku zcela odpadají. A konečně, výkupní firma se
          postará o veškerý právní a administrativní servis — od přípravy
          smlouvy přes jednání s katastrem až po daňové povinnosti.
        </p>

        <h2>Máte otázky? Kontaktujte nás</h2>
        <p>
          Žijete v zahraničí a chcete prodat nemovitost v České republice?
          Specializujeme se na výkup na dálku a celý proces přizpůsobíme vaší
          situaci. Komunikujeme e-mailem, telefonicky i přes videohovory — v
          češtině i angličtině. Nabídku vám připravíme do 24 hodin, zdarma a
          nezávazně.{" "}
          <Link href="/" className="text-emerald-600 hover:text-emerald-500">
            Vyplňte formulář
          </Link>{" "}
          a ozveme se vám — bez ohledu na to, kde na světě se nacházíte.
        </p>
      </>
    ),
  },
  "jake-dokumenty-potrebuji": {
    title: "Jaké dokumenty potřebuji k výkupu nemovitosti?",
    date: "2026-03-02",
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
    dateModified: article.date,
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
