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
    // Get the user's FID from the frame request
    const userFid = req.body?.untrustedData?.fid;
    const buttonIndex = parseInt(req.body?.untrustedData?.buttonIndex) || 1;
    
    console.log('🔍 User FID from frame request:', userFid);
    console.log('🔘 Button pressed:', buttonIndex);

    if (!userFid) {
      console.log('❌ No user FID found in request');
      return handleStaticFrame(req, res);
    }

    // Parse current page from frame state
    let currentPage = 1;
    try {
      const frameState = req.body?.untrustedData?.state;
      if (frameState && frameState.includes('page:')) {
        const pageMatch = frameState.match(/page:(\d+)/);
        if (pageMatch) {
          const statePage = parseInt(pageMatch[1]);
          
          // Handle button navigation
          if (buttonIndex === 1) { // Previous
            currentPage = Math.max(1, statePage - 1);
          } else if (buttonIndex === 2) { // Next
            currentPage = statePage + 1;
          } else if (buttonIndex === 4) { // Back to Main
            return handleStaticFrame(req, res);
          } else {
            currentPage = statePage;
          }
        }
      }
    } catch (err) {
      console.log('State parsing error:', err);
      currentPage = 1;
    }

    console.log('📄 Current page:', currentPage);

    // Get total count first
    const { count, error: countError } = await supabase
      .from('saved_casts')
      .select('*', { count: 'exact', head: true })
      .eq('author_fid', userFid);

    if (countError) {
      console.error('❌ Count error:', countError);
      throw new Error('Failed to count saved casts');
    }

    const totalCasts = count || 0;

    if (totalCasts === 0) {
      // No casts for this user
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="https://castkeepr.vercel.app/frame_image.png" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:post_url" content="https://castkeepr-backend.onrender.com/frame" />
  <meta property="fc:frame:button:1" content="← Back to Main" />
  <meta property="fc:frame:button:1:action" content="post" />
  <meta property="fc:frame:button:2" content="Learn How to Save" />
  <meta property="fc:frame:button:2:action" content="link" />
  <meta property="fc:frame:button:2:target" content="https://castkeepr.vercel.app" />
  
  <meta property="og:title" content="CastKeepr - No Saved Casts Yet" />
  <meta property="og:description" content="You haven't saved any casts yet. Reply '@infinitehomie save this' to any cast!" />
  <meta property="og:image" content="https://castkeepr.vercel.app/frame_image.png" />
  
  <title>CastKeepr - No Saved Casts</title>
</head>
<body>
  <h1>🏰 CastKeepr</h1>
  <p>No saved casts yet for FID ${userFid}</p>
</body>
</html>`;
      
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    }

    // Ensure current page doesn't exceed total
    currentPage = Math.min(Math.max(1, currentPage), totalCasts);

    // Fetch the specific cast for this page
    const { data: casts, error } = await supabase
      .from('saved_casts')
      .select('*')
      .eq('author_fid', userFid)
      .order('timestamp', { ascending: false })
      .range(currentPage - 1, currentPage - 1);

    if (error) {
      console.error('❌ Database error:', error);
      throw new Error('Failed to fetch saved casts');
    }

    const currentCast = casts?.[0];
    console.log(`📊 Showing cast ${currentPage} of ${totalCasts} for user ${userFid}`);

    // Use reliable static image for now
    const imageUrl = 'https://castkeepr.vercel.app/frame_image.png';

    // Create navigation buttons
    const buttons = [];
    
    // Previous button (if not on first page)
    if (currentPage > 1) {
      buttons.push({
        label: '← Previous',
        action: 'post'
      });
    }
    
    // Next button (if not on last page)
    if (currentPage < totalCasts) {
      buttons.push({
        label: 'Next →',
        action: 'post'
      });
    }
    
    // View All Online button
    buttons.push({
      label: 'View All...',
      action: 'link',
      target: 'https://castkeepr.vercel.app'
    });
    
    // Back to main button
    buttons.push({
      label: '← Back to Main',
      action: 'post'
    });

    const frameState = `page:${currentPage}`;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${imageUrl}" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:post_url" content="https://castkeepr-backend.onrender.com/frame" />
  <meta property="fc:frame:state" content="${frameState}" />
  ${buttons.map((button, index) => `
  <meta property="fc:frame:button:${index + 1}" content="${button.label}" />
  <meta property="fc:frame:button:${index + 1}:action" content="${button.action}" />
  ${button.target ? `<meta property="fc:frame:button:${index + 1}:target" content="${button.target}" />` : ''}`).join('')}
  
  <meta property="og:title" content="CastKeepr - Cast ${currentPage} of ${totalCasts}" />
  <meta property="og:description" content="${currentCast ? `@${currentCast.author_username}: ${currentCast.text?.slice(0, 100)}` : 'Loading cast...'}" />
  <meta property="og:image" content="${imageUrl}" />
  
  <title>CastKeepr - Cast ${currentPage} of ${totalCasts}</title>
</head>
<body>
  <h1>🏰 CastKeepr - Cast ${currentPage} of ${totalCasts}</h1>
  ${currentCast ? `
    <div>
      <h3>@${currentCast.author_username}</h3>
      <p>${currentCast.text}</p>
      <small>Saved: ${new Date(currentCast.timestamp).toLocaleDateString()}</small>
      <br><small>Hash: ${currentCast.hash?.slice(0, 10)}...</small>
    </div>
  ` : '<p>Loading cast...</p>'}
</body>
</html>`;

    console.log('🖼️ Generated paginated frame HTML');
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('❌ Dynamic frame error:', error);
    return handleStaticFrame(req, res);
  }
}

// Helper function to return to static frame
function handleStaticFrame(req, res) {
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
}