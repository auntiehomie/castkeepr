// Key changes needed in your SavedCasts.jsx:

// 1. Update the API URL logic - NEVER fetch without FID
const apiUrl = userFid 
  ? `https://castkeepr-backend.onrender.com/api/saved-casts?fid=${userFid}`
  : null; // Don't make any API call without userFid

// 2. Update the SWR configuration
const { data, error, isLoading, mutate } = useSWR(
  apiUrl, // Will be null until userFid is set
  fetcher,
  { 
    refreshInterval: 30000,
    revalidateOnFocus: true,
    // Don't fetch on mount unless we have an apiUrl
    revalidateOnMount: !!apiUrl,
    onError: (error) => {
      console.error('❌ SWR fetch error:', error);
      setDebugInfo(`API Error: ${error.message}`);
    },
    onSuccess: (data) => {
      console.log('✅ Data fetched successfully:', data?.length, 'casts');
      setDebugInfo(`Loaded ${data?.length || 0} casts`);
    }
  }
);

// 3. Update the rendering logic to handle no user state
if (!isReady) {
  return (
    <div style={styles.container}>
      {/* Your loading screen */}
    </div>
  );
}

// 4. Add a specific state for when no user is detected
if (isReady && !userFid) {
  return (
    <div style={styles.container}>
      <div style={styles.centerContent}>
        <div style={{textAlign: 'center', padding: '3rem 0'}}>
          <h1 style={styles.title}>🏰 CastKeepr</h1>
          <p style={styles.subtitle}>Your personal Farcaster cast vault</p>
          
          <div style={styles.card}>
            <p style={{...styles.text, marginBottom: '1rem'}}>
              Please open CastKeepr from within a Farcaster client to see your saved casts.
            </p>
            <p style={{...styles.text, fontSize: '0.875rem', opacity: 0.8}}>
              Your saved casts are private and only visible to you.
            </p>
          </div>
          
          {/* Optional: Manual FID input for testing */}
          <div style={{marginTop: '2rem'}}>
            <details>
              <summary style={{color: 'rgba(255,255,255,0.7)', cursor: 'pointer'}}>
                Developer Testing
              </summary>
              <div style={{marginTop: '1rem'}}>
                <input
                  type="number"
                  placeholder="Enter FID for testing"
                  value={manualFid}
                  onChange={(e) => setManualFid(e.target.value)}
                  style={{...styles.input, width: '200px', marginRight: '0.5rem'}}
                />
                <button
                  onClick={() => {
                    const fid = parseInt(manualFid);
                    if (fid && fid > 0) {
                      setUserFid(fid);
                      setDebugInfo(`Manual FID: ${fid}`);
                    }
                  }}
                  style={styles.button}
                >
                  Test with FID
                </button>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Update the no casts message to be more user-specific
if (isReady && userFid && (!data || data.length === 0)) {
  return (
    <div style={styles.container}>
      <div style={styles.centerContent}>
        <div style={{textAlign: 'center', padding: '3rem 0'}}>
          <div style={{fontSize: '4rem', marginBottom: '1rem'}}>📭</div>
          <h2 style={{fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1rem'}}>
            No saved casts yet
          </h2>
          <div style={styles.card}>
            <p style={{...styles.text, marginBottom: '1rem'}}>
              To save a cast, reply to any Farcaster cast with:
            </p>
            <code style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)', 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              color: 'white', 
              display: 'block',
              fontFamily: 'monospace',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              @infinitehomie save this
            </code>
            <p style={{...styles.text, marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8}}>
              Your saved casts are private and only visible to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}