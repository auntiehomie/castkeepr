const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const path = require('path');

const app = express();

// ✅ Serve static files from public directory
app.use(express.static('public'));

// ✅ Updated CORS for Mini App compatibility
app.use(cors({
  origin: [
    'https://castkeepr.vercel.app',
    'https://warpcast.com',
    'https://client.warpcast.com',
    /\.farcaster\.xyz$/,
    /\.warpcast\.com$/,
    'http://localhost:3000' // For local development
  ],
  credentials: true
}));

app.use(bodyParser.json());

// ✅ Remove ngrok warning and log requests
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// ✅ Environment variables
const { SUPABASE_URL, SUPABASE_ANON_KEY, NEYNAR_API_KEY, SIGNER_UUID, BASE_URL } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('❌ Missing Supabase environment variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ✅ Simple embed frame route for validation
app.get('/embed', (req, res) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- Farcaster Frame metadata -->
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="https://castkeepr.vercel.app/icon.png" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:button:1" content="Open CastKeepr" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="https://castkeepr.vercel.app" />
    
    <!-- Open Graph metadata -->
    <meta property="og:title" content="CastKeepr - Your Farcaster Cast Vault" />
    <meta property="og:description" content="Save and organize your favorite Farcaster casts with @infinitehomie" />
    <meta property="og:image" content="https://castkeepr.vercel.app/icon.png" />
    <meta property="og:url" content="https://castkeepr.vercel.app" />
    <meta property="og:type" content="website" />
    
    <!-- Twitter Card metadata -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="CastKeepr - Your Farcaster Cast Vault" />
    <meta name="twitter:description" content="Save and organize your favorite Farcaster casts with @infinitehomie" />
    <meta name="twitter:image" content="https://castkeepr.vercel.app/icon.png" />
    
    <title>CastKeepr - Your Farcaster Cast Vault</title>
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            color: white;
            text-align: center;
            padding: 2rem;
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            max-width: 600px;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .button {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            text-decoration: none;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 600;
            border: 1px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
        }
        .button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏰 CastKeepr</h1>
        <p class="subtitle">Your personal Farcaster cast vault</p>
        <p>Save and organize your favorite Farcaster casts with @infinitehomie</p>
        <br>
        <a href="https://castkeepr.vercel.app" class="button">Open CastKeepr Mini App</a>
    </div>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// ✅ Frame route - handle both GET and POST (keep existing)
app.get('/frame', async (req, res) => {
  try {
    const { handleFrame } = await import('./frame-handler.mjs');
    handleFrame(req, res);
  } catch (error) {
    console.error('❌ Frame handler error:', error);
    // Fallback if frame-handler.mjs doesn't exist
    res.redirect('/embed');
  }
});

app.post('/frame', async (req, res) => {
  try {
    const { handleFrame } = await import('./frame-handler.mjs');
    handleFrame(req, res);
  } catch (error) {
    console.error('❌ Frame handler error:', error);
    res.status(500).json({ error: 'Frame handler not available' });
  }
});

// ✅ Webhook to save casts
app.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;
    const text = data.text?.toLowerCase() || '';

    if (type !== 'cast.created' || !text.includes('@infinitehomie') || !text.includes('save this')) {
      return res.status(200).send('Ignored');
    }

    const parentHash = data.parent_hash;
    if (!parentHash) return res.status(200).send('No parent to save.');

    const parentRes = await axios.get(
      `https://api.neynar.com/v2/farcaster/cast?identifier=${parentHash}&type=hash`,
      {
        headers: { Accept: 'application/json', api_key: NEYNAR_API_KEY },
      }
    );

    const parent = parentRes.data.cast;
    if (!parent) return res.status(500).send('Parent cast fetch failed');

    const cast = {
      hash: parent.hash,
      text: parent.text,
      author_fid: parent.author.fid,
      author_username: parent.author.username,
      timestamp: parent.timestamp,
    };

    const { error } = await supabase.from('saved_casts').insert([cast]);
    if (error) return res.status(500).send('Insert failed');

    await axios.post(
      'https://api.neynar.com/v2/farcaster/cast',
      {
        signer_uuid: SIGNER_UUID,
        text: '💾 Cast saved!',
        parent: parent.hash,
        parent_author_fid: parent.author.fid,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          api_key: NEYNAR_API_KEY,
        },
      }
    );

    res.status(200).send('ok');
  } catch (err) {
    console.error('❌ Webhook error:', err.message || err);
    res.status(500).send('Webhook error');
  }
});

// ✅ API route to get saved casts (updated for Mini App)
app.get('/api/saved-casts', async (req, res) => {
  try {
    const { fid } = req.query;
    console.log('🔍 API request for saved casts, FID:', fid);
    
    let query = supabase
      .from('saved_casts')
      .select('*')
      .order('timestamp', { ascending: false });
    
    // Filter by FID if provided (for personal saved casts)
    if (fid) {
      query = query.eq('author_fid', parseInt(fid));
      console.log('🎯 Filtering by FID:', fid);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch saved casts' });
    }
    
    console.log(`📊 Returning ${data?.length || 0} saved casts`);
    res.json(data || []);
  } catch (err) {
    console.error('❌ API error:', err);
    res.status(500).json({ error: 'Unexpected error' });
  }
});

// ✅ NEW: API route for Mini App user info
app.get('/api/user-info', async (req, res) => {
  try {
    const { fid } = req.query;
    
    if (!fid) {
      return res.status(400).json({ error: 'FID required' });
    }
    
    // Get count of saved casts for this user
    const { count, error } = await supabase
      .from('saved_casts')
      .select('*', { count: 'exact', head: true })
      .eq('author_fid', parseInt(fid));
    
    if (error) {
      console.error('❌ User info error:', error);
      return res.status(500).json({ error: 'Failed to fetch user info' });
    }
    
    res.json({
      fid: parseInt(fid),
      savedCastsCount: count || 0
    });
  } catch (err) {
    console.error('❌ User info error:', err);
    res.status(500).json({ error: 'Unexpected error' });
  }
});

// ✅ Frame-specific API route (matches the postUrl in your frame)
app.post('/api/frame-saved-casts', async (req, res) => {
  try {
    // This handles frame button interactions
    const { data, error } = await supabase
      .from('saved_casts')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) return res.status(500).json({ error: 'Failed to fetch saved casts' });
    
    // For frame responses, you might want to return a new frame or redirect
    // For now, just return the data
    res.json(data);
  } catch (err) {
    console.error('❌ Frame API error:', err);
    res.status(500).json({ error: 'Unexpected error' });
  }
});

// ✅ Debug route to test image accessibility
app.get('/debug/image', (req, res) => {
  const imagePath = path.join(__dirname, 'public', 'frame_image.png');
  console.log('🖼️ Checking image at:', imagePath);
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error('❌ Image not found:', err);
      res.status(404).send('Image not found');
    }
  });
});

// 🔚 Catch-all route
app.use((req, res) => {
  res.status(404).send('Not found');
});

// ✅ Dynamic port + base URL logging
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Listening on port ${PORT}`);
  console.log(`🖼️ Image should be accessible at: http://localhost:${PORT}/frame_image.png`);
  console.log(`🏰 Mini App ready at: https://castkeepr-backend.onrender.com`);
  console.log(`🔗 Embed frame available at: https://castkeepr-backend.onrender.com/embed`);
});