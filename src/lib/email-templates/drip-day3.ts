import { wrapDripEmail } from "./drip-layout";

export const DRIP_DAY3_SUBJECT =
  "Jak jsme pomohli paní Novákové prodat byt za 14 dní";

export function renderDripDay3(opts: {
  siteUrl: string;
  unsubscribeUrl: string;
}): string {
  const bodyHtml = `
    <p style="font-size:16px;line-height:1.6;margin:0 0 16px">Dobrý den,</p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 16px">
      chtěli bychom se s vámi podělit o příběh jednoho z našich klientů.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
      <tr>
        <td style="background-color:#f0f9ff;padding:20px 24px">
          <p style="font-size:15px;line-height:1.6;margin:0 0 12px;font-style:italic;color:#1e40af">
            „Potřebovala jsem rychle prodat byt kvůli dědickému řízení. Jiné firmy
            nabízely zdlouhavé procesy. Tady mi během 3 dnů dali férovou nabídku
            a za 14 dní bylo vše vyřízené."
          </p>
          <p style="font-size:14px;margin:0;color:#64748b">— Paní Nováková, Brno, byt 2+1</p>
        </td>
      </tr>
    </table>
    <p style="font-size:16px;line-height:1.6;margin:0 0 8px"><strong>Proč nám klienti důvěřují:</strong></p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px">
      <tr><td style="padding:4px 0;font-size:16px;line-height:1.6">✅ Nabídku obdržíte do 24 hodin</td></tr>
      <tr><td style="padding:4px 0;font-size:16px;line-height:1.6">✅ Žádné provize ani skryté poplatky</td></tr>
      <tr><td style="padding:4px 0;font-size:16px;line-height:1.6">✅ Vykupujeme i nemovitosti s právními komplikacemi</td></tr>
      <tr><td style="padding:4px 0;font-size:16px;line-height:1.6">✅ Peníze na účtu do 14 dnů</td></tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px">
      <tr>
        <td style="background-color:#1a56db;border-radius:6px;padding:14px 28px">
          <a href="${opts.siteUrl}/#formular" style="color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;display:inline-block">
            Chci nezávaznou nabídku →
          </a>
        </td>
      </tr>
    </table>
    <p style="font-size:14px;color:#64748b;margin:0">
      Máte otázky? Zavolejte nám: <strong>+420 725 877 076</strong>
    </p>
  `;
  return wrapDripEmail({
    subject: DRIP_DAY3_SUBJECT,
    bodyHtml,
    unsubscribeUrl: opts.unsubscribeUrl,
  });
}
