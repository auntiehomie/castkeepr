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
      // Fallback to static frame if we can't identify the user
      return res.redirect('/frame');
    }

    // Determine current page based on button press and state
    let currentPage = 1;
    
    // Parse page from button context (we'll store it in the URL)
    const currentPageFromUrl = parseInt(req.query?.page) || 1;
    
    // Button logic for pagination
    if (buttonIndex === 1 && req.body?.untrustedData?.state?.includes('page:')) {
      // Previous button pressed
      const pageMatch = req.body.untrustedData.state.match(/page:(\d+)/);
      const statePage = pageMatch ? parseInt(pageMatch[1]) : 1;
      currentPage = Math.max(1, statePage - 1);
    } else if (buttonIndex === 2 && req.body?.untrustedData?.state?.includes('page:')) {
      // Next button pressed
      const pageMatch = req.body.untrustedData.state.match(/page:(\d+)/);
      const statePage = pageMatch ? parseInt(pageMatch[1]) : 1;
      currentPage = statePage + 1;
    } else if (buttonIndex === 1) {
      // First time clicking "View Saved Casts"
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
    const totalPages = Math.max(1, totalCasts);

    // Ensure current page doesn't exceed total
    currentPage = Math.min(currentPage, totalPages);

    // Fetch the specific cast for this page (one cast per page)
    const { data: casts, error } = await supabase
      .from('saved_casts')
      .select('*')
      .eq('author_fid', userFid)
      .order('timestamp', { ascending: false })
      .range(currentPage - 1, currentPage - 1); // Get just one cast

    if (error) {
      console.error('❌ Database error:', error);
      throw new Error('Failed to fetch saved casts');
    }

    console.log(`📊 Found ${totalCasts} total saved casts for user ${userFid}, showing page ${currentPage}`);

    const currentCast = casts?.[0];

    // Generate a simple text-based image URL showing the current cast
    let imageUrl;
    if (currentCast) {
      const castText = encodeURIComponent(currentCast.text?.slice(0, 60) || 'No text');
      const author = encodeURIComponent(currentCast.author_username || 'Unknown');
      imageUrl = `https://via.placeholder.com/955x500/8b5cf6/ffffff?text=Cast+${currentPage}+of+${totalCasts}%0A@${author}%0A${castText}`;
    } else {
      imageUrl = 'https://castkeepr.vercel.app/frame_image.png';
    }

    // Create navigation buttons
    const buttons = [];
    
    if (totalCasts > 0) {
      // Previous button (if not on first page)
      if (currentPage > 1) {
        buttons.push({
          label: '← Previous',
          action: 'post',
          target: `https://castkeepr-backend.onrender.com/frame?page=${currentPage}`
        });
      }
      
      // Next button (if not on last page)
      if (currentPage < totalPages) {
        buttons.push({
          label: 'Next →',
          action: 'post',
          target: `https://castkeepr-backend.onrender.com/frame?page=${currentPage}`
        });
      }
      
      // Always include "View All Online" button
      buttons.push({
        label: 'View All Online',
        action: 'link',
        target: 'https://castkeepr.vercel.app'
      });
      
      // Back to main button
      buttons.push({
        label: '← Back to Main',
        action: 'post',
        target: 'https://castkeepr-backend.onrender.com/frame'
      });
    } else {
      // No casts - just navigation buttons
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

    // Truncate buttons to max 4
    const finalButtons = buttons.slice(0, 4);

    const frameState = `page:${currentPage}`;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${imageUrl}" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:post_url" content="https://castkeepr-backend.onrender.com/frame" />
  <meta property="fc:frame:state" content="${frameState}" />
  ${finalButtons.map((button, index) => `
  <meta property="fc:frame:button:${index + 1}" content="${button.label}" />
  <meta property="fc:frame:button:${index + 1}:action" content="${button.action}" />
  ${button.target ? `<meta property="fc:frame:button:${index + 1}:target" content="${button.target}" />` : ''}`).join('')}
  
  <meta property="og:title" content="CastKeepr - Cast ${currentPage} of ${totalCasts}" />
  <meta property="og:description" content="${currentCast ? `@${currentCast.author_username}: ${currentCast.text?.slice(0, 100)}` : 'No saved casts yet'}" />
  <meta property="og:image" content="${imageUrl}" />
  
  <title>CastKeepr - Cast ${currentPage} of ${totalCasts}</title>
</head>
<body>
  <h1>🏰 CastKeepr - Your Saved Casts</h1>
  <p>Cast ${currentPage} of ${totalCasts} for FID ${userFid}</p>
  ${currentCast ? `
    <div>
      <h3>@${currentCast.author_username}</h3>
      <p>${currentCast.text}</p>
      <small>Saved: ${new Date(currentCast.timestamp).toLocaleDateString()}</small>
    </div>
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