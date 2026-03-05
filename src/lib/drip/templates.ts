import type { DripEmail } from "./types";

const SITE_URL = "https://vykoupim-nemovitost.cz";
const PHONE = "+420 725 877 076";

function layout(body: string, day: number, unsubscribeUrl: string): string {
  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e2e8f0">
    ${body}
  </div>
  <div style="text-align:center;margin-top:24px;font-size:12px;color:#94a3b8">
    <p>Vykoupím Nemovitost s.r.o. | ${PHONE}</p>
    <p><a href="${unsubscribeUrl}" style="color:#94a3b8;text-decoration:underline">Odhlásit se z odběru</a></p>
  </div>
  <img src="${SITE_URL}/api/drip/pixel?utm_source=email&utm_medium=drip&utm_campaign=day${day}" width="1" height="1" alt="" style="display:none" />
</body>
</html>`;
}

function cta(text: string, day: number): string {
  return `<div style="text-align:center;margin:28px 0">
  <a href="${SITE_URL}/?utm_source=email&utm_medium=drip&utm_campaign=day${day}#kontakt" style="display:inline-block;background:#1a56db;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px">${text}</a>
</div>`;
}

export const dripEmails: DripEmail[] = [
  {
    day: 0,
    subject: "Děkujeme za poptávku – ozveme se do 24 hodin",
    html: ({ name, unsubscribeUrl }) =>
      layout(
        `
      <h2 style="color:#1a56db;margin-top:0">Děkujeme za vaši poptávku!</h2>
      <p>Dobrý den, <strong>${name}</strong>,</p>
      <p>obdrželi jsme vaši poptávku na výkup nemovitosti a děkujeme za důvěru. Náš tým ji právě zpracovává.</p>
      <p style="font-size:18px;color:#1a56db;font-weight:bold">📞 Ozveme se vám do 24 hodin!</p>
      <p>Pokud máte mezitím jakékoli dotazy, neváhejte nás kontaktovat na telefonu <strong>${PHONE}</strong>.</p>
      ${cta("Zjistit více o výkupu", 0)}
    `,
        0,
        unsubscribeUrl,
      ),
  },
  {
    day: 1,
    subject: "Jak funguje výkup nemovitosti? 4 jednoduché kroky",
    html: ({ name, unsubscribeUrl }) =>
      layout(
        `
      <h2 style="color:#1a56db;margin-top:0">Jak to funguje?</h2>
      <p>Dobrý den, <strong>${name}</strong>,</p>
      <p>celý proces výkupu je jednoduchý a transparentní. Zvládneme to ve 4 krocích:</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        <tr>
          <td style="padding:16px;background:#eff6ff;border-radius:8px 8px 0 0;border-bottom:2px solid #fff">
            <strong style="color:#1a56db;font-size:20px">1.</strong> <strong>Poptávka</strong><br>
            <span style="color:#64748b">Vyplníte formulář nebo zavoláte. Trvá to 2 minuty.</span>
          </td>
        </tr>
        <tr>
          <td style="padding:16px;background:#eff6ff;border-bottom:2px solid #fff">
            <strong style="color:#1a56db;font-size:20px">2.</strong> <strong>Nabídka do 24h</strong><br>
            <span style="color:#64748b">Zanalyzujeme nemovitost a pošleme nezávaznou nabídku.</span>
          </td>
        </tr>
        <tr>
          <td style="padding:16px;background:#eff6ff;border-bottom:2px solid #fff">
            <strong style="color:#1a56db;font-size:20px">3.</strong> <strong>Prohlídka a smlouva</strong><br>
            <span style="color:#64748b">Domluvíme prohlídku, připravíme smlouvu. Právní servis zdarma.</span>
          </td>
        </tr>
        <tr>
          <td style="padding:16px;background:#eff6ff;border-radius:0 0 8px 8px">
            <strong style="color:#1a56db;font-size:20px">4.</strong> <strong>Výplata peněz</strong><br>
            <span style="color:#64748b">Zálohu obdržíte ihned, zbytek po zápisu do katastru.</span>
          </td>
        </tr>
      </table>
      ${cta("Začít s výkupem", 1)}
    `,
        1,
        unsubscribeUrl,
      ),
  },
  {
    day: 3,
    subject: "Příběh klienta: Exekuce v Praze vyřešena za 5 dní",
    html: ({ name, unsubscribeUrl }) =>
      layout(
        `
      <h2 style="color:#1a56db;margin-top:0">Příběh z praxe: Exekuce v Praze</h2>
      <p>Dobrý den, <strong>${name}</strong>,</p>
      <p>chtěli bychom se s vámi podělit o příběh jednoho z našich klientů:</p>
      <div style="background:#eff6ff;border-left:4px solid #1a56db;padding:20px;border-radius:0 8px 8px 0;margin:20px 0">
        <p style="margin-top:0"><strong>Pan Martin z Prahy</strong> se dostal do exekuce a hrozila mu dražba bytu. Obrátil se na nás jako na poslední možnost.</p>
        <p><strong>Co jsme udělali:</strong></p>
        <ul style="color:#334155">
          <li>Do 24 hodin jsme připravili nabídku</li>
          <li>Za 3 dny byla podepsána smlouva</li>
          <li>Za 5 dní měl pan Martin peníze na účtu</li>
          <li>Exekuce byla splacena, zbytek peněz si ponechal</li>
        </ul>
        <p style="margin-bottom:0;font-style:italic;color:#475569">"Myslel jsem, že je pozdě. Díky rychlému výkupu jsem zachránil většinu hodnoty bytu." — Martin, Praha</p>
      </div>
      <p>I vaše situace má řešení. Neváhejte se ozvat.</p>
      ${cta("Chci nezávaznou nabídku", 3)}
    `,
        3,
        unsubscribeUrl,
      ),
  },
  {
    day: 5,
    subject: "Příběh klienta: Zděděná nemovitost v Brně prodána bez starostí",
    html: ({ name, unsubscribeUrl }) =>
      layout(
        `
      <h2 style="color:#1a56db;margin-top:0">Příběh z praxe: Dědictví v Brně</h2>
      <p>Dobrý den, <strong>${name}</strong>,</p>
      <p>dědictví nemovitosti může být komplikované — zvláště když se dědici neshodnou. Podívejte se, jak jsme pomohli:</p>
      <div style="background:#eff6ff;border-left:4px solid #1a56db;padding:20px;border-radius:0 8px 8px 0;margin:20px 0">
        <p style="margin-top:0"><strong>Paní Jana z Brna</strong> zdědila podíl na rodinném domě spolu se dvěma sourozenci. Jeden z nich odmítal prodej přes realitku.</p>
        <p><strong>Naše řešení:</strong></p>
        <ul style="color:#334155">
          <li>Vykoupili jsme podíl paní Jany za férovou cenu</li>
          <li>Právní servis a veškerou administrativu jsme zajistili zdarma</li>
          <li>Celý proces trval 10 dní od první schůzky</li>
          <li>Paní Jana dostala peníze bez čekání na souhlas sourozenců</li>
        </ul>
        <p style="margin-bottom:0;font-style:italic;color:#475569">"Konečně jsem měla klid. Nemusela jsem řešit hádky s rodinou." — Jana, Brno</p>
      </div>
      ${cta("Řešte svou situaci ještě dnes", 5)}
    `,
        5,
        unsubscribeUrl,
      ),
  },
  {
    day: 7,
    subject: "5 nejčastějších otázek o výkupu nemovitosti",
    html: ({ name, unsubscribeUrl }) =>
      layout(
        `
      <h2 style="color:#1a56db;margin-top:0">5 nejčastějších otázek</h2>
      <p>Dobrý den, <strong>${name}</strong>,</p>
      <p>přinášíme odpovědi na otázky, které nám klienti pokládají nejčastěji:</p>
      ${[
        {
          q: "Kolik za nemovitost dostanu?",
          a: "Nabízíme 80–90 % tržní hodnoty. Výhodou je rychlost, žádné provize a právní servis zdarma.",
        },
        {
          q: "Jak rychle to celé proběhne?",
          a: "Od první schůzky po výplatu peněz to zvládneme do 7 dní. V urgentních případech i rychleji.",
        },
        {
          q: "Musím platit nějaké poplatky?",
          a: "Ne. Žádné provize, žádné skryté poplatky. Právní servis, odhad i administrativa jsou zdarma.",
        },
        {
          q: "Mohu v nemovitosti dál bydlet?",
          a: "Ano, nabízíme možnost zpětného nájmu. Prodáte, ale zůstáváte bydlet.",
        },
        {
          q: "Co když mám na nemovitosti hypotéku nebo exekuci?",
          a: "Není problém. Vyřešíme splacení hypotéky i exekuce v rámci procesu výkupu.",
        },
      ]
        .map(
          (item, i) => `
        <div style="margin:16px 0;padding:16px;background:${i % 2 === 0 ? "#f8fafc" : "#fff"};border-radius:8px;border:1px solid #e2e8f0">
          <p style="margin:0 0 8px;font-weight:bold;color:#1e293b">❓ ${item.q}</p>
          <p style="margin:0;color:#475569">${item.a}</p>
        </div>
      `,
        )
        .join("")}
      ${cta("Máte další otázky? Kontaktujte nás", 7)}
    `,
        7,
        unsubscribeUrl,
      ),
  },
  {
    day: 10,
    subject: "Výkup vs realitka: Srovnání, které vás překvapí",
    html: ({ name, unsubscribeUrl }) =>
      layout(
        `
      <h2 style="color:#1a56db;margin-top:0">Výkup vs realitka — srovnání</h2>
      <p>Dobrý den, <strong>${name}</strong>,</p>
      <p>přemýšlíte, jestli je výkup lepší volba než prodej přes realitku? Podívejte se na srovnání:</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px">
        <tr style="background:#1a56db;color:#fff">
          <th style="padding:12px;text-align:left;border:1px solid #1a56db">Kritérium</th>
          <th style="padding:12px;text-align:center;border:1px solid #1a56db">Výkup (my)</th>
          <th style="padding:12px;text-align:center;border:1px solid #1a56db">Realitka</th>
        </tr>
        ${[
          ["Rychlost prodeje", "Do 7 dnů", "3–12 měsíců"],
          ["Záloha", "Až 500 000 Kč ihned", "Žádná"],
          ["Provize", "0 %", "3–5 %"],
          ["Právní servis", "Zdarma", "Na vaše náklady"],
          ["Diskrétnost", "Plná", "Veřejná inzerce"],
          ["Jistota prodeje", "Garantovaná", "Nejistá"],
        ]
          .map(
            (row, i) => `
          <tr style="background:${i % 2 === 0 ? "#f8fafc" : "#fff"}">
            <td style="padding:10px;border:1px solid #e2e8f0;font-weight:bold">${row[0]}</td>
            <td style="padding:10px;border:1px solid #e2e8f0;text-align:center;color:#16a34a;font-weight:bold">${row[1]}</td>
            <td style="padding:10px;border:1px solid #e2e8f0;text-align:center;color:#94a3b8">${row[2]}</td>
          </tr>
        `,
          )
          .join("")}
      </table>
      <p>Výkup nemovitosti je ideální pro ty, kdo potřebují rychlost, jistotu a nulové náklady.</p>
      ${cta("Získat nezávaznou nabídku", 10)}
    `,
        10,
        unsubscribeUrl,
      ),
  },
  {
    day: 14,
    subject: "Kapacita se plní — zbývá jen několik míst tento měsíc",
    html: ({ name, region, unsubscribeUrl }) =>
      layout(
        `
      <h2 style="color:#1a56db;margin-top:0">Kapacita se plní</h2>
      <p>Dobrý den, <strong>${name}</strong>,</p>
      <p>chtěli jsme vás informovat, že naše kapacita pro výkup nemovitostí v regionu <strong>${region}</strong> se tento měsíc rychle plní.</p>
      <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:20px;margin:20px 0;text-align:center">
        <p style="margin:0;font-size:20px;font-weight:bold;color:#92400e">⚠️ Zbývá jen několik volných termínů</p>
        <p style="margin:8px 0 0;color:#92400e">Pro tento měsíc přijímáme už jen omezený počet nových poptávek.</p>
      </div>
      <p>Pokud stále zvažujete prodej nemovitosti, doporučujeme neodkládat rozhodnutí. Nabídku připravíme do 24 hodin a je <strong>zcela nezávazná</strong>.</p>
      <p><strong>Co získáte:</strong></p>
      <ul style="color:#334155">
        <li>✅ Nabídku do 24 hodin</li>
        <li>✅ Zálohu až 500 000 Kč ihned</li>
        <li>✅ Právní servis zdarma</li>
        <li>✅ Žádné provize ani poplatky</li>
      </ul>
      ${cta("Chci nabídku ještě tento měsíc", 14)}
    `,
        14,
        unsubscribeUrl,
      ),
  },
];
