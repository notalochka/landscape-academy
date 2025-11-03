// Small Telegram helper with MarkdownV2 escaping and fallback to plain text

function escapeMarkdownV2(text) {
  if (!text) return '';
  return String(text).replace(/[\\_\*\[\]\(\)~`>#+\-=\|\{\}\.\!]/g, match => `\\${match}`);
}

export async function sendTelegramMessage({ botToken, chatId, text }) {
  if (!botToken || !chatId) {
    return { ok: false, error: 'Missing Telegram credentials' };
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  // Attempt MarkdownV2 first
  const escaped = escapeMarkdownV2(text);
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: escaped, parse_mode: 'MarkdownV2' }),
    });
    const data = await resp.json();
    if (data?.ok) return { ok: true, data };
    // Fallback without parse_mode
    const plainResp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    const plainData = await plainResp.json();
    if (plainData?.ok) return { ok: true, data: plainData };
    return { ok: false, error: plainData, firstError: data };
  } catch (e) {
    // Last-chance fallback to plain text
    try {
      const plainResp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
      const plainData = await plainResp.json();
      if (plainData?.ok) return { ok: true, data: plainData };
      return { ok: false, error: plainData, firstError: e?.message };
    } catch (e2) {
      return { ok: false, error: e2?.message, firstError: e?.message };
    }
  }
}


