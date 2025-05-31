export function handleFrame(req, res) {
  try {
    console.log('📋 Frame request received');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="https://castkeepr.vercel.app/frame_image.png" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:post_url" content="https://castkeepr-backend.onrender.com/api/frame-saved-casts" />
  <meta property="fc:frame:button:1" content="Open Saved Casts" />
  <meta property="fc:frame:button:1:action" content="link" />
  <meta property="fc:frame:button:1:target" content="https://castkeepr.vercel.app" />
  
  <meta property="og:title" content="CastKeepr - Your Saved Casts" />
  <meta property="og:description" content="Save and view your favorite Farcaster casts" />
  <meta property="og:image" content="https://castkeepr.vercel.app/frame_image.png" />
  
  <title>CastKeepr Frame</title>
</head>
<body>
  <h1>🏰 CastKeepr</h1>
  <p>Your saved casts frame</p>
</body>
</html>`;

    console.log('🖼️ Generated frame HTML');
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('❌ Frame handler error:', error);
    res.status(500).send('Frame error');
  }
}