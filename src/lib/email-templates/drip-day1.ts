import { wrapDripEmail } from "./drip-layout";

export const DRIP_DAY1_SUBJECT = "Máte dotazy? Rádi vám odpovíme";

export function renderDripDay1(opts: {
  siteUrl: string;
  unsubscribeUrl: string;
}): string {
  const bodyHtml = `
    <p style="font-size:16px;line-height:1.6;margin:0 0 16px">Dobrý den,</p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 16px">
      včera jste nám zaslali poptávku na výkup nemovitosti. Děkujeme za váš zájem!
    </p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 16px">
      Chápeme, že prodej nemovitosti je důležité rozhodnutí. Pokud máte jakékoli
      dotazy ohledně celého procesu, neváhejte se nám ozvat —
      <strong>rádi vám vše vysvětlíme</strong>.
    </p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 24px">
      Podívejte se, jak celý výkup probíhá krok za krokem:
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px">
      <tr>
        <td style="background-color:#1a56db;border-radius:6px;padding:14px 28px">
          <a href="${opts.siteUrl}/jak-to-funguje" style="color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;display:inline-block">
            Jak to funguje →
          </a>
        </td>
      </tr>
    </table>
    <p style="font-size:16px;line-height:1.6;margin:0 0 8px">
      Nebo nám rovnou zavolejte: <strong>+420 725 877 076</strong>
    </p>
    <p style="font-size:14px;color:#64748b;margin:0">
      Odpovídáme v pracovní dny do 30 minut.
    </p>
  `;
  return wrapDripEmail({
    subject: DRIP_DAY1_SUBJECT,
    bodyHtml,
    unsubscribeUrl: opts.unsubscribeUrl,
  });
}
