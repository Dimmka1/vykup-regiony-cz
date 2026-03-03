const BRAND_COLOR = "#1a56db";
const MUTED_COLOR = "#94a3b8";
const BORDER_COLOR = "#e2e8f0";
const BG_LIGHT = "#f8fafc";

export function wrapDripEmail(opts: {
  subject: string;
  bodyHtml: string;
  unsubscribeUrl: string;
}): string {
  return `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${opts.subject}</title>
</head>
<body style="margin:0;padding:0;background-color:${BG_LIGHT};font-family:Arial,Helvetica,sans-serif;color:#333333;-webkit-text-size-adjust:100%">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_LIGHT}">
    <tr>
      <td align="center" style="padding:20px 10px">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid ${BORDER_COLOR}">
          <tr>
            <td style="background-color:${BRAND_COLOR};padding:24px 30px">
              <h1 style="margin:0;font-size:20px;color:#ffffff;font-weight:700">Výkup Nemovitostí</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px">
              ${opts.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 30px;border-top:1px solid ${BORDER_COLOR};background-color:${BG_LIGHT}">
              <p style="margin:0 0 8px;font-size:12px;color:${MUTED_COLOR}">
                Tento e-mail byl odeslán automaticky z webu vykoupím-nemovitost.cz
              </p>
              <p style="margin:0;font-size:12px;color:${MUTED_COLOR}">
                <a href="${opts.unsubscribeUrl}" style="color:${MUTED_COLOR};text-decoration:underline">Odhlásit se z odběru</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export { BRAND_COLOR, MUTED_COLOR, BORDER_COLOR, BG_LIGHT };
