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
    // Get the page number from the frame button (default to page 1)
    const buttonIndex = parseInt(req.body?.untrustedData?.buttonIndex) || 1;
    let page = 1;
    
    // Button 1 = "View Saved Casts" (go to page 1)
    // For navigation, we'd need a different approach - for now just show page 1
    if (buttonIndex === 1) {
      page = 1;
    }
    
    const castsPerPage = 3;
    const offset = (page - 1) * castsPerPage;

    // Fetch saved casts from database
    const { data: casts, error } = await supabase
      .from('saved_casts')
      .select('*')
      .order('timestamp', { ascending: false })
      .range(offset, offset + castsPerPage - 1);

    if (error) {
      console.error('❌ Database error:', error);
      throw new Error('Failed to fetch saved casts');
    }

    // Generate image URL based on casts
    const imageUrl = generateCastsImage(casts, page);
    
    // Calculate total pages
    const { count } = await supabase
      .from('saved_casts')
      .select('*', { count: 'exact', head: true });
    
    const totalPages = Math.ceil((count || 0) / castsPerPage);

    // Create frame buttons based on available pages
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
      
      // If more than 3 casts, add "Load More" functionality could be added here
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
  
  <meta property="og:title" content="CastKeepr - Saved Casts (Page ${page})" />
  <meta property="og:description" content="View your saved Farcaster casts" />
  <meta property="og:image" content="${imageUrl}" />
  
  <title>CastKeepr Frame - Saved Casts</title>
</head>
<body>
  <h1>🏰 CastKeepr - Saved Casts</h1>
  <p>Showing ${casts?.length || 0} saved casts</p>
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

function generateCastsImage(casts, page) {
  // For now, return a dynamic URL that will generate an image
  const baseUrl = 'https://castkeepr.vercel.app';
  
  if (!casts || casts.length === 0) {
    return `${baseUrl}/api/frame-image?type=empty`;
  }
  
  // Encode cast data for image generation
  const castsData = encodeURIComponent(JSON.stringify(casts.map(cast => ({
    text: cast.text?.slice(0, 100) + (cast.text?.length > 100 ? '...' : ''),
    author: cast.author_username,
    timestamp: cast.timestamp
  }))));
  
  return `${baseUrl}/api/frame-image?casts=${castsData}&page=${page}`;
}