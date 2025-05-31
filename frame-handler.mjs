import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function handleFrame(req, res) {
  try {
    console.log('📋 Frame request received');

    // Check if this is a button interaction (POST with frame data)
    const isButtonPress = req.method === 'POST' && req.body?.untrustedData?.buttonIndex;
    
    if (isButtonPress) {
      // Handle dynamic frame with saved casts
      return handleDynamicFrame(req, res);
    }

    // Default static frame (for initial load and frame validators)
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="https://castkeepr.vercel.app/frame_image.png" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:post_url" content="https://castkeepr-backend.onrender.com/frame" />
  <meta property="fc:frame:button:1" content="View Saved Casts" />
  <meta property="fc:frame:button:1:action" content="post" />
  <meta property="fc:frame:button:2" content="Open Web App" />
  <meta property="fc:frame:button:2:action" content="link" />
  <meta property="fc:frame:button:2:target" content="https://castkeepr.vercel.app" />
  
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

    console.log('🖼️ Generated static frame HTML');
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('❌ Frame handler error:', error);
    res.status(500).send('Frame error');
  }
}

async function handleDynamicFrame(req, res) {
  try {
    // Fetch saved casts from database
    const { data: casts, error } = await supabase
      .from('saved_casts')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(3);

    if (error) {
      console.error('❌ Database error:', error);
      throw new Error('Failed to fetch saved casts');
    }

    // Use dynamic image based on cast count
    const castCount = casts?.length || 0;
    const imageUrl = casts && casts.length > 0 
      ? `https://via.placeholder.com/955x500/8b5cf6/ffffff?text=🏰+CastKeepr+-+${castCount}+Saved+Casts`
      : 'https://castkeepr.vercel.app/frame_image.png';

    // Create frame buttons based on available casts
    const buttons = [];
    
    if (casts && casts.length > 0) {
      // Always include "Back to Main" button
      buttons.push({
        label: '← Back to Main',
        action: 'post',
        target: 'https://castkeepr-backend.onrender.com/frame'
      });
      
      // "View All Online" button
      buttons.push({
        label: 'View All Online',
        action: 'link',
        target: 'https://castkeepr.vercel.app'
      });
    } else {
      // No casts - just link to web app and back
      buttons.push({
        label: '← Back to Main',
        action: 'post',
        target: 'https://castkeepr-backend.onrender.com/frame'
      });
      
      buttons.push({
        label: 'Learn How to Save',
        action: 'link',
        target: 'https://castkeepr.vercel.app'
      });
    }

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${imageUrl}" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:post_url" content="https://castkeepr-backend.onrender.com/frame" />
  ${buttons.map((button, index) => `
  <meta property="fc:frame:button:${index + 1}" content="${button.label}" />
  <meta property="fc:frame:button:${index + 1}:action" content="${button.action}" />
  ${button.target ? `<meta property="fc:frame:button:${index + 1}:target" content="${button.target}" />` : ''}`).join('')}
  
  <meta property="og:title" content="CastKeepr - ${castCount} Saved Casts" />
  <meta property="og:description" content="You have ${castCount} saved Farcaster casts" />
  <meta property="og:image" content="${imageUrl}" />
  
  <title>CastKeepr Frame - ${castCount} Saved Casts</title>
</head>
<body>
  <h1>🏰 CastKeepr</h1>
  <p>You have ${castCount} saved casts</p>
  ${casts && casts.length > 0 ? `
    <ul>
      ${casts.map(cast => `<li><strong>@${cast.author_username}:</strong> ${cast.text?.slice(0, 100)}${cast.text?.length > 100 ? '...' : ''}</li>`).join('')}
    </ul>
  ` : '<p>No saved casts yet. Reply "@infinitehomie save this" to any cast to get started!</p>'}
</body>
</html>`;

    console.log('🖼️ Generated dynamic frame HTML');
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('❌ Dynamic frame error:', error);
    
    // Fallback to static frame
    const fallbackHtml = `<!DOCTYPE html>
<html>
<head>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="https://castkeepr.vercel.app/frame_image.png" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:post_url" content="https://castkeepr-backend.onrender.com/frame" />
  <meta property="fc:frame:button:1" content="View Online" />
  <meta property="fc:frame:button:1:action" content="link" />
  <meta property="fc:frame:button:1:target" content="https://castkeepr.vercel.app" />
  
  <meta property="og:title" content="CastKeepr - Error" />
  <meta property="og:description" content="Error loading saved casts" />
  <meta property="og:image" content="https://castkeepr.vercel.app/frame_image.png" />
  
  <title>CastKeepr Frame - Error</title>
</head>
<body>
  <h1>🏰 CastKeepr - Error</h1>
  <p>Unable to load saved casts</p>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(fallbackHtml);
  }
}