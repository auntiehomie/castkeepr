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

// ✅ Frame route - handle both GET and POST
app.get('/frame', async (req, res) => {
  try {
    const { handleFrame } = await import('./frame-handler.mjs');
    handleFrame(req, res);
  } catch (error) {
    console.error('❌ Frame handler error:', error);
    res.status(500).send('Frame handler not available');
  }
});

app.post('/frame', async (req, res) => {
  try {
    const { handleFrame } = await import('./frame-handler.mjs');
    handleFrame(req, res);
  } catch (error) {
    console.error('❌ Frame handler error:', error);
    res.status(500).send('Frame handler not available');
  }
});

// ✅ Webhook to save casts - BUT track WHO saved them
app.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;
    const text = data.text?.toLowerCase() || '';

    if (type !== 'cast.created' || !text.includes('@infinitehomie') || !text.includes('save this')) {
      return res.status(200).send('Ignored');
    }

    const parentHash = data.parent_hash;
    if (!parentHash) return res.status(200).send('No parent to save.');

    // Get the user who made the "save this" request
    const requesterFid = data.author?.fid;
    if (!requesterFid) {
      console.error('❌ No requester FID found');
      return res.status(400).send('No requester FID');
    }

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
      saved_by_fid: requesterFid, // NEW: Track who saved this cast
    };

    const { error } = await supabase.from('saved_casts').insert([cast]);
    if (error) {
      console.error('❌ Insert error:', error);
      return res.status(500).send('Insert failed');
    }

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

// ✅ UPDATED: Secure API route - only return user's own saved casts
app.get('/api/saved-casts', async (req, res) => {
  try {
    const { fid } = req.query;
    console.log('🔍 API request for saved casts, FID:', fid);
    
    // SECURITY: Require FID - no anonymous access
    if (!fid) {
      console.log('❌ No FID provided, denying access');
      return res.status(400).json({ 
        error: 'FID required. Please open this Mini App from within Farcaster.' 
      });
    }

    // Validate FID is a valid number
    const userFid = parseInt(fid);
    if (isNaN(userFid) || userFid <= 0) {
      console.log('❌ Invalid FID provided:', fid);
      return res.status(400).json({ error: 'Invalid FID format' });
    }
    
    // Get only casts saved by this specific user
    const { data, error } = await supabase
      .from('saved_casts')
      .select('*')
      .eq('saved_by_fid', userFid)  // Only casts saved by this user
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch saved casts' });
    }
    
    console.log(`📊 Returning ${data?.length || 0} saved casts for user FID ${userFid}`);
    res.json(data || []);
  } catch (err) {
    console.error('❌ API error:', err);
    res.status(500).json({ error: 'Unexpected error' });
  }
});

// ✅ UPDATED: User info route with better validation
app.get('/api/user-info', async (req, res) => {
  try {
    const { fid } = req.query;
    
    if (!fid) {
      return res.status(400).json({ error: 'FID required' });
    }

    const userFid = parseInt(fid);
    if (isNaN(userFid) || userFid <= 0) {
      return res.status(400).json({ error: 'Invalid FID format' });
    }
    
    // Get count of casts saved by this user (not authored by them)
    const { count, error } = await supabase
      .from('saved_casts')
      .select('*', { count: 'exact', head: true })
      .eq('saved_by_fid', userFid);
    
    if (error) {
      console.error('❌ User info error:', error);
      return res.status(500).json({ error: 'Failed to fetch user info' });
    }
    
    res.json({
      fid: userFid,
      savedCastsCount: count || 0
    });
  } catch (err) {
    console.error('❌ User info error:', err);
    res.status(500).json({ error: 'Unexpected error' });
  }
});

// ✅ Frame-specific API route (keep as is for frame functionality)
app.post('/api/frame-saved-casts', async (req, res) => {
  try {
    // This handles frame button interactions
    const { data, error } = await supabase
      .from('saved_casts')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) return res.status(500).json({ error: 'Failed to fetch saved casts' });
    
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
  
  // Use environment-aware URLs
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://castkeepr-backend.onrender.com'
    : `http://localhost:${PORT}`;
    
  console.log(`🖼️ Image should be accessible at: ${baseUrl}/frame_image.png`);
  console.log(`🏰 Mini App backend ready at: ${baseUrl}`);
  console.log(`📡 API endpoints available at: ${baseUrl}/api/`);
});