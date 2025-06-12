import { useState, useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const SavedCasts = () => {
  console.log('🎯 SavedCasts component mounting...');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [userFid, setUserFid] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState('Initializing...');

  // Inline styles as fallback for missing Tailwind
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #9333ea, #2563eb, #14b8a6)',
      padding: '1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    centerContent: {
      maxWidth: '56rem',
      margin: '0 auto'
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: '5rem'
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '1rem'
    },
    spinner: {
      width: '3rem',
      height: '3rem',
      border: '2px solid transparent',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 1rem auto'
    },
    text: {
      color: 'rgba(255, 255, 255, 0.8)'
    },
    button: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1.5rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: '1rem'
    },
    input: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '0.5rem',
      color: 'white',
      padding: '0.75rem',
      width: '100%',
      marginBottom: '1rem'
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      backdropFilter: 'blur(4px)'
    },
    debugPanel: {
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      maxWidth: '20rem',
      zIndex: 1000
    }
  };

  // Add CSS animation for spinner
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Initialize Farcaster SDK
  useEffect(() => {
    console.log('✅ SavedCasts useEffect running');
    
    const initializeApp = async () => {
      console.log('🚀 Initializing CastKeepr Mini App...');
      setDebugInfo('Checking context...');
      
      try {
        // Try to import and use the official Farcaster SDK
        const { sdk } = await import('@farcaster/frame-sdk');
        console.log('📦 Farcaster SDK imported successfully');
        setDebugInfo('SDK imported, initializing...');
        
        // Initialize the SDK
        await sdk.actions.ready();
        console.log('✅ Farcaster SDK initialized');
        setDebugInfo('SDK ready, getting context...');
        
        // Get context
        const context = await sdk.context;
        console.log('📱 SDK Context:', context);
        
        if (context?.user?.fid) {
          console.log('👤 User FID from SDK:', context.user.fid);
          setUserFid(context.user.fid);
          setDebugInfo(`Connected as FID: ${context.user.fid}`);
          setIsConnected(true);
        } else {
          console.log('❓ No user in SDK context');
          setDebugInfo('No user context from SDK');
          setIsConnected(true);
        }
        
        setIsReady(true);
        
      } catch (sdkError) {
        console.error('❌ SDK failed, falling back to manual detection:', sdkError);
        setDebugInfo('SDK failed, trying manual detection...');
        
        // Fallback to manual detection
        await initializeFarcasterSDK();
      }
    };

    initializeApp();
  }, []);

  const signalReady = () => {
    console.log('✅ Signaling app is ready');
    setIsReady(true);
    
    // Signal to Farcaster that the app is ready
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'fc_ready'
      }, '*');
    }
  };

  const initializeFarcasterSDK = async () => {
    try {
      console.log('🔗 Manual Farcaster connection...');
      setDebugInfo('Manual connection attempt...');
      
      // Check if we're in a Farcaster Mini App context
      if (window.parent !== window) {
        console.log('📱 Running in Mini App context');
        setDebugInfo('In Mini App context');
        
        // Listen for ALL Farcaster messages
        const messageHandler = (event) => {
          console.log('📨 Received message from parent:', event.data);
          setDebugInfo(`Message: ${event.data.type}`);
          
          // Handle different message types
          if (event.data.type === 'fc_frame' || event.data.type === 'frameContext') {
            console.log('🖼️ Frame context received:', event.data);
            if (event.data.user || event.data.untrustedData) {
              const fid = event.data.user?.fid || event.data.untrustedData?.fid;
              if (fid) {
                console.log('👤 User FID from frame context:', fid);
                setUserFid(fid);
                setIsConnected(true);
                setDebugInfo(`Frame FID: ${fid}`);
                signalReady();
                return;
              }
            }
          }
          
          if (event.data.type === 'fc_response') {
            console.log('✅ Farcaster API response:', event.data);
            if (event.data.method === 'fc_user' && event.data.result) {
              console.log('👤 Farcaster user detected:', event.data.result);
              setUserFid(event.data.result.fid);
              setIsConnected(true);
              setDebugInfo(`Response FID: ${event.data.result.fid}`);
              signalReady();
              return;
            }
          }
          
          // Handle Mini App specific context
          if (event.data.type === 'miniapp_context' || event.data.context) {
            console.log('🏠 Mini App context:', event.data);
            const fid = event.data.context?.user?.fid || event.data.user?.fid;
            if (fid) {
              console.log('👤 User FID from Mini App context:', fid);
              setUserFid(fid);
              setIsConnected(true);
              setDebugInfo(`Mini App FID: ${fid}`);
              signalReady();
              return;
            }
          }
        };
        
        window.addEventListener('message', messageHandler);
        
        // Try multiple methods to get user info
        setTimeout(() => {
          console.log('📤 Method 1: Requesting fc_user...');
          window.parent.postMessage({
            type: 'fc_request',
            method: 'fc_user'
          }, '*');
        }, 100);
        
        setTimeout(() => {
          console.log('📤 Method 2: Requesting fc_context...');
          window.parent.postMessage({
            type: 'fc_request',
            method: 'fc_context'
          }, '*');
        }, 200);
        
        setTimeout(() => {
          console.log('📤 Method 3: Requesting miniapp_ready...');
          window.parent.postMessage({
            type: 'miniapp_ready'
          }, '*');
        }, 300);
        
        // Extended timeout fallback
        setTimeout(() => {
          if (!isConnected) {
            console.log('⏱️ Extended timeout - checking URL parameters...');
            setDebugInfo('Timeout, checking URL...');
            
            // Try to get FID from URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const fidFromUrl = urlParams.get('fid') || urlParams.get('user_fid');
            
            if (fidFromUrl) {
              console.log('🔗 Found FID in URL parameters:', fidFromUrl);
              setUserFid(parseInt(fidFromUrl));
              setIsConnected(true);
              setDebugInfo(`URL FID: ${fidFromUrl}`);
              signalReady();
            } else {
              console.log('❓ No user context found - proceeding with demo mode');
              setIsConnected(true);
              setDebugInfo('Demo mode - no user');
              signalReady();
            }
          }
        }, 3000);
        
      } else {
        console.log('🌐 Running in browser context - using fallback');
        setDebugInfo('Browser mode');
        setIsConnected(true);
        signalReady();
      }
      
    } catch (error) {
      console.error('❌ Failed to initialize Farcaster SDK:', error);
      setDebugInfo(`Error: ${error.message}`);
      setIsConnected(true);
      signalReady();
    }
  };

  // Fetch saved casts for the connected user
  const apiUrl = userFid 
    ? `https://castkeepr-backend.onrender.com/api/saved-casts?fid=${userFid}`
    : `https://castkeepr-backend.onrender.com/api/saved-casts`;

  const { data, error, isLoading, mutate } = useSWR(
    isConnected ? apiUrl : null, 
    fetcher,
    { 
      refreshInterval: 30000,
      revalidateOnFocus: true,
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

  // Filter casts based on search term and user
  const filteredCasts = data?.filter(cast => {
    const isUserCast = !userFid || cast.author_fid === userFid;
    const matchesSearch = !searchTerm || (
      cast.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cast.author_username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return isUserCast && matchesSearch;
  }) || [];

  // Format timestamp for display
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Manual FID input for fallback
  const [manualFid, setManualFid] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const handleManualFidSubmit = (e) => {
    e.preventDefault();
    const fid = parseInt(manualFid);
    if (fid && fid > 0) {
      console.log('✅ Manual FID entered:', fid);
      setUserFid(fid);
      setShowManualInput(false);
      setDebugInfo(`Manual FID: ${fid}`);
    }
  };

  // Handle cast actions
  const handleCastAction = async (cast, action) => {
    try {
      if (action === 'share') {
        // Try SDK first, then fallback
        try {
          const { sdk } = await import('@farcaster/frame-sdk');
          const shareText = `Check out this saved cast from @${cast.author_username}: "${cast.text.slice(0, 100)}..."`;
          const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`;
          await sdk.actions.openUrl(shareUrl);
        } catch {
          // Fallback for non-Mini App context
          const shareText = `Check out this saved cast from @${cast.author_username}: "${cast.text.slice(0, 100)}..."`;
          const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`;
          window.open(shareUrl, '_blank');
        }
      } else if (action === 'view_original') {
        const originalUrl = `https://warpcast.com/${cast.author_username}/${cast.hash.slice(0, 10)}`;
        try {
          const { sdk } = await import('@farcaster/frame-sdk');
          await sdk.actions.openUrl(originalUrl);
        } catch {
          window.open(originalUrl, '_blank');
        }
      }
    } catch (error) {
      console.error('Cast action failed:', error);
    }
  };

  // Show loading screen until app is ready
  if (!isReady) {
    return (
      <div style={styles.container}>
        <div style={styles.debugPanel}>
          <div>Status: {debugInfo}</div>
          <div>Ready: {isReady ? '✅' : '❌'}</div>
          <div>Connected: {isConnected ? '✅' : '❌'}</div>
        </div>
        <div style={styles.loadingContainer}>
          <div>
            <h1 style={styles.title}>🏰 CastKeepr</h1>
            <div style={styles.spinner}></div>
            <p style={styles.text}>Initializing Mini App...</p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.debugPanel}>
          <div>Status: {debugInfo}</div>
          <div>Loading API data...</div>
          <div>URL: {apiUrl}</div>
        </div>
        <div style={styles.centerContent}>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={{...styles.text, fontSize: '1.25rem'}}>⏳ Loading your saved casts...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.debugPanel}>
          <div>Status: {debugInfo}</div>
          <div>Error: {error.message}</div>
        </div>
        <div style={styles.centerContent}>
          <div style={styles.loadingContainer}>
            <div style={{color: '#fca5a5', fontSize: '1.25rem', marginBottom: '1rem'}}>
              ❌ Failed to load saved casts
            </div>
            <p style={styles.text}>{error.message}</p>
            <button 
              style={styles.button}
              onClick={() => mutate()}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Debug Panel */}
      <div style={styles.debugPanel}>
        <div>Ready: {isReady ? '✅' : '❌'}</div>
        <div>Connected: {isConnected ? '✅' : '❌'}</div>
        <div>User FID: {userFid || 'None'}</div>
        <div>Data: {data ? `${data.length} casts` : 'No data'}</div>
        <div>Filtered: {filteredCasts.length}</div>
        <div>{debugInfo}</div>
      </div>
      
      <div style={styles.centerContent}>
        {/* Header */}
        <div style={{textAlign: 'center', padding: '2rem 0'}}>
          <h1 style={styles.title}>🏰 CastKeepr</h1>
          <p style={{...styles.text, fontSize: '1.125rem'}}>Your saved Farcaster casts</p>
          {userFid ? (
            <p style={{...styles.text, fontSize: '0.875rem', opacity: 0.8}}>
              Connected as FID: {userFid}
            </p>
          ) : (
            <div style={{marginTop: '1rem'}}>
              <p style={{...styles.text, fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                No user detected
              </p>
              {!showManualInput ? (
                <button
                  style={{...styles.button, fontSize: '0.875rem'}}
                  onClick={() => setShowManualInput(true)}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                >
                  Enter Your FID
                </button>
              ) : (
                <form onSubmit={handleManualFidSubmit} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
                  <input
                    type="number"
                    placeholder="Your FID"
                    value={manualFid}
                    onChange={(e) => setManualFid(e.target.value)}
                    style={{...styles.input, width: '6rem', margin: 0, fontSize: '0.875rem'}}
                  />
                  <button
                    type="submit"
                    style={{...styles.button, fontSize: '0.875rem', marginTop: 0, backgroundColor: 'rgba(255, 255, 255, 0.2)'}}
                  >
                    Connect
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Search Bar */}
        {data && data.length > 0 && (
          <div style={{marginBottom: '2rem'}}>
            <div style={{position: 'relative'}}>
              <input
                type="text"
                placeholder="Search casts or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{...styles.input, paddingLeft: '2.5rem'}}
              />
              <div style={{position: 'absolute', left: '0.75rem', top: '0.875rem', color: 'rgba(255, 255, 255, 0.6)'}}>
                🔍
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {data && data.length > 0 && (
          <div style={{marginBottom: '1.5rem', textAlign: 'center'}}>
            <p style={styles.text}>
              {filteredCasts.length} saved cast{filteredCasts.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
              {userFid && ' for you'}
            </p>
          </div>
        )}

        {/* No casts message */}
        {filteredCasts.length === 0 ? (
          <div style={{textAlign: 'center', padding: '5rem 0'}}>
            <div style={{fontSize: '4rem', marginBottom: '1rem'}}>📭</div>
            <h2 style={{fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1rem'}}>
              {searchTerm ? 'No matching casts found' : userFid ? 'No saved casts yet' : 'No saved casts in database'}
            </h2>
            <div style={{...styles.card, maxWidth: '28rem', margin: '0 auto'}}>
              <p style={{...styles.text, marginBottom: '1rem'}}>
                To save a cast, reply to any Farcaster cast with:
              </p>
              <code style={{backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '0.5rem 0.75rem', borderRadius: '0.25rem', color: 'white', display: 'block'}}>
                @infinitehomie save this
              </code>
            </div>
          </div>
        ) : (
          /* Casts Grid */
          <div>
            {filteredCasts.map((cast) => (
              <div key={cast.hash} style={styles.card}>
                {/* Cast Header */}
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      background: 'linear-gradient(to right, #c084fc, #ec4899)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {cast.author_username?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p style={{color: 'white', fontWeight: '600'}}>@{cast.author_username}</p>
                      <p style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem'}}>FID: {cast.author_fid}</p>
                    </div>
                  </div>
                  <div style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem'}}>
                    {formatDate(cast.timestamp)}
                  </div>
                </div>

                {/* Cast Content */}
                <div style={{marginBottom: '1rem'}}>
                  <p style={{color: 'white', lineHeight: '1.6', whiteSpace: 'pre-wrap'}}>
                    {cast.text}
                  </p>
                </div>

                {/* Cast Actions */}
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)'}}>
                  <div style={{display: 'flex', gap: '1rem'}}>
                    <button
                      onClick={() => handleCastAction(cast, 'view_original')}
                      style={{...styles.button, background: 'none', padding: '0.25rem 0', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem'}}
                      onMouseOver={(e) => e.target.style.color = 'white'}
                      onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
                    >
                      View Original ↗
                    </button>
                    
                    <button
                      onClick={() => handleCastAction(cast, 'share')}
                      style={{...styles.button, background: 'none', padding: '0.25rem 0', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem'}}
                      onMouseOver={(e) => e.target.style.color = 'white'}
                      onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
                    >
                      Share 🔗
                    </button>
                  </div>
                  
                  <div style={{color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', fontFamily: 'monospace'}}>
                    {cast.hash.slice(0, 8)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div style={{textAlign: 'center', padding: '2rem 0', marginTop: '3rem'}}>
          <button
            onClick={() => mutate()}
            style={{...styles.button, marginBottom: '1rem'}}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          >
            🔄 Refresh Casts
          </button>
          <p style={{...styles.text, fontSize: '0.875rem'}}>
            Built with 💜 for the Farcaster community
          </p>
        </div>
      </div>
    </div>
  );
};

export default SavedCasts;