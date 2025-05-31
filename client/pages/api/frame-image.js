// Save this as: client/pages/api/frame-image.js

export default function handler(req, res) {
  const { casts, page, type } = req.query;

  // Set headers for HTML response that renders as image
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes

  let parsedCasts = [];
  if (casts && type !== 'empty') {
    try {
      parsedCasts = JSON.parse(decodeURIComponent(casts));
    } catch (error) {
      console.error('Error parsing casts:', error);
    }
  }

  // Generate HTML page that displays as image
  const html = generateCastsHTML(parsedCasts, page || 1, type === 'empty');

  res.send(html);
}

function generateCastsHTML(casts, page, isEmpty) {
  const width = 955;
  const height = 500;

  if (isEmpty) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            width: ${width}px; 
            height: ${height}px; 
            background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #14b8a6 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: white;
          }
          .title { font-size: 48px; font-weight: bold; margin-bottom: 20px; }
          .subtitle { font-size: 24px; margin-bottom: 15px; opacity: 0.9; }
          .instruction { font-size: 18px; margin-bottom: 10px; opacity: 0.8; }
          .detail { font-size: 16px; opacity: 0.7; }
        </style>
      </head>
      <body>
        <div class="title">🏰 CastKeepr</div>
        <div class="subtitle">📭 No saved casts yet</div>
        <div class="instruction">Reply "@infinitehomie save this" to any cast</div>
        <div class="detail">to start building your collection</div>
      </body>
      </html>
    `;
  }

  const castElements = casts.slice(0, 3).map((cast, index) => {
    const maxTextLength = 80;
    const truncatedText = cast.text && cast.text.length > maxTextLength 
      ? cast.text.slice(0, maxTextLength) + '...' 
      : cast.text || '';

    return `
      <div class="cast">
        <div class="cast-header">
          <div class="author-avatar">${cast.author?.charAt(0)?.toUpperCase() || '?'}</div>
          <div class="author-info">
            <div class="author-name">@${cast.author || 'unknown'}</div>
          </div>
          <div class="timestamp">${formatTimestamp(cast.timestamp)}</div>
        </div>
        <div class="cast-text">${escapeHtml(truncatedText)}</div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { 
          margin: 0; 
          padding: 20px; 
          width: ${width - 40}px; 
          height: ${height - 40}px; 
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #14b8a6 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: white;
          box-sizing: border-box;
        }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
        .subtitle { font-size: 18px; opacity: 0.8; }
        .cast { 
          background: rgba(255,255,255,0.1); 
          border: 1px solid rgba(255,255,255,0.2); 
          border-radius: 12px; 
          padding: 20px; 
          margin-bottom: 15px;
        }
        .cast-header { 
          display: flex; 
          align-items: center; 
          margin-bottom: 10px; 
        }
        .author-avatar { 
          width: 32px; 
          height: 32px; 
          border-radius: 50%; 
          background: rgba(167,139,250,0.8); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: bold; 
          margin-right: 15px; 
        }
        .author-name { font-weight: 600; }
        .timestamp { margin-left: auto; font-size: 12px; opacity: 0.6; }
        .cast-text { font-size: 14px; line-height: 1.4; opacity: 0.9; }
        .footer { text-align: center; margin-top: 20px; font-size: 14px; opacity: 0.6; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">🏰 CastKeepr - Page ${page}</div>
        <div class="subtitle">Your saved Farcaster casts</div>
      </div>
      ${castElements}
      <div class="footer">Showing ${casts.length} saved casts</div>
    </body>
    </html>
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}