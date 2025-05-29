const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const path = require('path');

const app = express();

// Serve preview image
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());

// Bypass ngrok browser warning
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});

app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// Supabase setup
const supabase = createClient(
  'https://hkzloipgfhkfqjguyjaj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhremxvaXBnZmhrZnFqZ3V5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMTcyMDQsImV4cCI6MjA2MzU5MzIwNH0.O95qJ1IOA3YWNPARPAmx0ijjivMOPTC7ksYZ1m1lhyU'
);

const NEYNAR_API_KEY = '26DCB507-A81F-4432-A77F-48542573C188';
const SIGNER_UUID = '59dddf0f-6484-4310-a33f-d471309b7d0f';

app.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;
    const text = data.text?.toLowerCase() || '';

    if (
      type !== 'cast.created' ||
      !text.includes('@infinitehomie') ||
      !text.includes('save this')
    ) {
      return res.status(200).send('Ignored');
    }

    const parentHash = data.parent_hash;
    if (!parentHash) return res.status(200).send('No parent to save.');

    const parentResponse = await axios.get(
      `https://api.neynar.com/v2/farcaster/cast?identifier=${parentHash}&type=hash`,
      { headers: { Accept: 'application/json', api_key: NEYNAR_API_KEY } }
    );

    const parent = parentResponse.data.cast;
    if (!parent) return res.status(500).send('Parent cast fetch failed.');

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

app.get('/api/saved-casts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('saved_casts')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) return res.status(500).json({ error: 'Failed to fetch saved casts' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Unexpected error' });
  }
});

// ✅ Frame route using ESM module dynamically
app.post('/api/frame-saved-casts', async (req, res) => {
  const { handleFrame } = await import('./frame-handler.mjs');
  handleFrame(req, res);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Listening on http://localhost:${PORT}`);
});
