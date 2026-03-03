import { wrapDripEmail } from "./drip-layout";

export const DRIP_DAY7_SUBJECT = "Stále máte zájem o výkup nemovitosti?";

export function renderDripDay7(opts: {
  siteUrl: string;
  unsubscribeUrl: string;
}): string {
  const bodyHtml = `
    <p style="font-size:16px;line-height:1.6;margin:0 0 16px">Dobrý den,</p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 16px">
      před týdnem jste nám zaslali poptávku na výkup nemovitosti.
      Rádi bychom se zeptali — <strong>stále máte zájem?</strong>
    </p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 16px">
      Rozumíme, že někdy je potřeba více času na rozmyšlení. Ale pokud
      stále zvažujete prodej, rádi bychom vám připomněli:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-left:4px solid #f59e0b;background-color:#fffbeb;border-radius:0 8px 8px 0">
      <tr>
        <td style="padding:16px 20px">
          <p style="font-size:15px;line-height:1.6;margin:0 0 8px;color:#92400e;font-weight:600">
            ⏰ Ceny nemovitostí se neustále mění
          </p>
          <p style="font-size:15px;line-height:1.6;margin:0;color:#92400e">
            Naše nabídka vychází z aktuální tržní hodnoty. Čím dříve se
            ozvete, tím přesnější nabídku vám můžeme dát.
          </p>
        </td>
      </tr>
    </table>
    <p style="font-size:16px;line-height:1.6;margin:0 0 24px">
      Stačí kliknout na tlačítko níže nebo nám zavolat. Celý proces je
      <strong>nezávazný a zdarma</strong>.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px">
      <tr>
        <td style="background-color:#1a56db;border-radius:6px;padding:14px 28px">
          <a href="${opts.siteUrl}/#formular" style="color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;display:inline-block">
            Ano, stále mám zájem →
          </a>
        </td>
      </tr>
    </table>
    <p style="font-size:16px;line-height:1.6;margin:0 0 8px">
      📞 <strong>+420 725 877 076</strong> — volejte v pracovní dny 8–18h
    </p>
    <p style="font-size:14px;color:#64748b;margin:0">
      Pokud jste nemovitost již prodali nebo nemáte zájem, omlouváme se za
      obtěžování. Tento e-mail je poslední z naší řady.
    </p>
  `;
  return wrapDripEmail({
    subject: DRIP_DAY7_SUBJECT,
    bodyHtml,
    unsubscribeUrl: opts.unsubscribeUrl,
  });
}
