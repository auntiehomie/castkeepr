// Save this as: client/pages/api/frame-image.js

export default function handler(req, res) {
  const { casts, page, type } = req.query;

  // Set headers for SVG image response
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes

  let parsedCasts = [];
  if (casts && type !== 'empty') {
    try {
      parsedCasts = JSON.parse(decodeURIComponent(casts));
    } catch (error) {
      console.error('Error parsing casts:', error);
    }
  }

  // Generate SVG image
  const svg = generateCastsSVG(parsedCasts, page || 1, type === 'empty');

  res.send(svg);
}

function generateCastsSVG(casts, page, isEmpty) {
  const width = 955;
  const height = 500;

  if (isEmpty) {
    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#14b8a6;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
        
        <text x="50%" y="35%" text-anchor="middle" fill="white" font-size="48" font-weight="bold" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
          🏰 CastKeepr
        </text>
        
        <text x="50%" y="50%" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
          📭 No saved casts yet
        </text>
        
        <text x="50%" y="65%" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
          Reply "@infinitehomie save this" to any cast
        </text>
        
        <text x="50%" y="80%" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
          to start building your collection
        </text>
      </svg>
    `;
  }

  const castElements = casts.slice(0, 3).map((cast, index) => {
    const y = 120 + (index * 120);
    const maxTextLength = 80;
    const truncatedText = cast.text && cast.text.length > maxTextLength 
      ? cast.text.slice(0, maxTextLength) + '...' 
      : cast.text || '';

    return `
      <g>
        <!-- Cast background -->
        <rect x="40" y="${y}" width="875" height="100" rx="12" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
        
        <!-- Author circle -->
        <circle cx="80" cy="${y + 30}" r="16" fill="rgba(167,139,250,0.8)"/>
        <text x="80" y="${y + 36}" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
          ${cast.author?.charAt(0)?.toUpperCase() || '?'}
        </text>
        
        <!-- Author name -->
        <text x="110" y="${y + 25}" fill="white" font-size="16" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
          @${cast.author || 'unknown'}
        </text>
        
        <!-- Cast text -->
        <text x="110" y="${y + 50}" fill="rgba(255,255,255,0.9)" font-size="14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
          ${escapeXml(truncatedText)}
        </text>
        
        <!-- Timestamp -->
        <text x="880" y="${y + 25}" text-anchor="end" fill="rgba(255,255,255,0.6)" font-size="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
          ${formatTimestamp(cast.timestamp)}
        </text>
      </g>
    `;
  }).join('');

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#14b8a6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      
      <!-- Header -->
      <text x="50%" y="50" text-anchor="middle" fill="white" font-size="32" font-weight="bold" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
        🏰 CastKeepr - Page ${page}
      </text>
      
      <text x="50%" y="80" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
        Your saved Farcaster casts
      </text>
      
      <!-- Casts -->
      ${castElements}
      
      <!-- Footer -->
      <text x="50%" y="480" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
        Showing ${casts.length} saved casts
      </text>
    </svg>
  `;
}

function escapeXml(text) {
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