import { useState, useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const SavedCasts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFid, setUserFid] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [renderError, setRenderError] = useState(null);

  // Error boundary
  useEffect(() => {
    const handleError = (event) => {
      console.error('❌ Global error caught:', event.error);
      setRenderError(event.error?.message || 'Unknown error');
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Simplified initialization - no external SDKs
  useEffect(() => {
    const initializeApp = () => {
      console.log('🚀 Initializing CastKeepr Mini App...');
      
      try {
        // Check if we're in a Farcaster Mini App context
        if (window.parent !== window) {
          console.log('📱 Running in Mini App context');
          initializeFarcasterSDK();
        } else {
          console.log('🌐 Running in browser context - using fallback');
          setIsConnected(true);
          signalReady();
        }
      } catch (initError) {
        console.error('Error in initializeApp:', initError);
        setIsConnected(true);
        signalReady();
      }
    };

    initializeApp();
    
    // Emergency fallback - force ready after 3 seconds no matter what
    const emergencyTimeout = setTimeout(() => {
      console.log('🚨 Emergency timeout - forcing app to be ready');
      setIsConnected(true);
      setIsReady(true);
    }, 3000);
    
    // Cleanup function
    return () => {
      clearTimeout(emergencyTimeout);
    };
  }, []);

  const signalReady = () => {
    console.log('✅ Signaling app is ready');
    console.log('Current state - isConnected:', isConnected, 'isReady:', isReady);
    setIsReady(true);
    
    // Signal to Farcaster that the app is ready
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'fc_ready'
      }, '*');
    }
    
    // Force re-render after a brief delay
    setTimeout(() => {
      console.log('🔄 Force checking state after signalReady');
      console.log('State check - isConnected:', isConnected, 'isReady:', isReady);
    }, 100);
  };

  const initializeFarcasterSDK = () => {
    try {
      console.log('🔗 Connecting to Farcaster...');
      
      const messageHandler = (event) => {
        console.log('📨 Received message:', event.data);
        
        try {
          // Look for user FID in any common format
          const fid = event.data?.user?.fid || 
                      event.data?.untrustedData?.fid || 
                      event.data?.context?.user?.fid ||
                      event.data?.result?.fid;
          
          if (fid && !userFid) {
            console.log('👤 Found FID:', fid);
            setUserFid(fid);
            setIsConnected(true);
            signalReady();
          }
        } catch (msgError) {
          console.error('Error processing message:', msgError);
        }
      };
      
      window.addEventListener('message', messageHandler);
      
      // Single context request
      setTimeout(() => {
        try {
          console.log('📤 Requesting Farcaster context...');
          window.parent.postMessage({ type: 'fc_request', method: 'fc_context' }, '*');
        } catch (postError) {
          console.error('Error posting messages:', postError);
        }
      }, 100);
      
      // Fallback timeout
      setTimeout(() => {
        if (!isConnected) {
          console.log('⏱️ Timeout - forcing connection...');
          setIsConnected(true);
          signalReady();
        }
      }, 2000);
      
    } catch (error) {
      console.error('❌ Failed to initialize Farcaster SDK:', error);
      setIsConnected(true);
      signalReady();
    }
  };

  // API URL - only fetch with valid FID
  const apiUrl = userFid 
    ? `https://castkeepr-backend.onrender.com/api/saved-casts?fid=${userFid}`
    : null;

  const { data, error, isLoading, mutate } = useSWR(
    apiUrl,
    fetcher,
    { 
      refreshInterval: 30000,
      revalidateOnFocus: true,
      revalidateOnMount: !!apiUrl,
      onError: (error) => {
        console.error('❌ SWR fetch error:', error);
      },
      onSuccess: (data) => {
        console.log('✅ Data fetched successfully:', data?.length, 'casts');
      },
      // Add error boundaries
      shouldRetryOnError: false,
      errorRetryCount: 0
    }
  );

  // Filter casts with robust error handling
  const filteredCasts = (() => {
    try {
      if (!data || !Array.isArray(data)) {
        console.log('📊 No data or data is not array:', data);
        return [];
      }

      return data.filter(cast => {
        try {
          if (!cast || typeof cast !== 'object') {
            console.warn('⚠️ Invalid cast object:', cast);
            return false;
          }
          
          // Safe string checking
          const text = cast.text || '';
          const username = cast.author_username || '';
          const searchLower = (searchTerm || '').toLowerCase();
          
          if (!searchTerm) return true;
          
          const matchesSearch = 
            (typeof text === 'string' && text.toLowerCase().includes(searchLower)) ||
            (typeof username === 'string' && username.toLowerCase().includes(searchLower));
          
          return matchesSearch;
        } catch (filterError) {
          console.error('❌ Error filtering cast:', filterError, cast);
          return false;
        }
      });
    } catch (mainError) {
      console.error('❌ Error in filteredCasts:', mainError);
      return [];
    }
  })();

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
    }
  };

  // Handle cast actions
  const handleCastAction = async (cast, action) => {
    try {
      if (action === 'share' && window.parent !== window) {
        // Share cast using Farcaster Mini App API
        window.parent.postMessage({
          type: 'fc_request',
          method: 'fc_cast',
          params: {
            text: `Check out this saved cast from @${cast.author_username}: "${cast.text.slice(0, 100)}..."`,
            embeds: [{
              url: `https://warpcast.com/${cast.author_username}/${cast.hash.slice(0, 10)}`
            }]
          }
        }, '*');
      } else if (action === 'view_original') {
        // Open original cast
        window.open(`https://warpcast.com/${cast.author_username}/${cast.hash.slice(0, 10)}`, '_blank');
      }
    } catch (error) {
      console.error('Cast action failed:', error);
    }
  };

  // Show error boundary if there's a render error
  if (renderError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-purple-600 to-blue-500 p-4 flex items-center justify-center">
        <div className="text-center bg-black/20 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-white mb-4">❌ App Error</h1>
          <p className="text-white/80 mb-4">{renderError}</p>
          <button 
            onClick={() => {
              setRenderError(null);
              window.location.reload();
            }}
            className="bg-white text-red-600 px-4 py-2 rounded font-semibold"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }

  // Show loading screen until app is ready
  console.log('🖼️ Render check - isReady:', isReady, 'isConnected:', isConnected, 'userFid:', userFid);
  
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">🏰 CastKeepr</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Initializing Mini App...</p>
          
          {/* Debug info - more prominent */}
          <div className="mt-6 bg-black/20 p-4 rounded-lg text-white text-sm">
            <p><strong>Debug Info:</strong></p>
            <p>Connected: <span className={isConnected ? 'text-green-300' : 'text-red-300'}>{isConnected ? 'Yes' : 'No'}</span></p>
            <p>Ready: <span className={isReady ? 'text-green-300' : 'text-red-300'}>{isReady ? 'Yes' : 'No'}</span></p>
            <p>Context: <span className="text-blue-300">{window.parent !== window ? 'Mini App' : 'Browser'}</span></p>
            <p>User FID: <span className="text-yellow-300">{userFid || 'None'}</span></p>
          </div>
          
          {/* Emergency skip button after 5 seconds */}
          <button 
            onClick={() => {
              console.log('🚨 Manual skip button clicked');
              setIsConnected(true);
              setIsReady(true);
            }}
            className="mt-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Skip to App
          </button>
        </div>
      </div>
    );
  }

  // Show message when connected but no user detected
  if (isConnected && !userFid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-white mb-4">🏰 CastKeepr</h1>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-white/90 mb-4">
                Please open CastKeepr from within a Farcaster client to see your saved casts.
              </p>
              <p className="text-white/70 text-sm mb-4">
                Your saved casts are private and only visible to you.
              </p>
              
              {/* Manual FID input for testing */}
              {!showManualInput ? (
                <button
                  onClick={() => setShowManualInput(true)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Enter FID for Testing
                </button>
              ) : (
                <form onSubmit={handleManualFidSubmit} className="flex items-center justify-center space-x-2">
                  <input
                    type="number"
                    placeholder="Your FID"
                    value={manualFid}
                    onChange={(e) => setManualFid(e.target.value)}
                    className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white placeholder-white/60 text-sm w-24"
                  />
                  <button
                    type="submit"
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Connect
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-xl">⏳ Loading your saved casts...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="text-red-200 text-xl mb-4">❌ Failed to load saved casts</div>
            <p className="text-white mb-4">{error.message}</p>
            {error.message.includes('FID required') && (
              <p className="text-white/80 text-sm mb-4">
                Please open this Mini App from within Farcaster to access your saved casts.
              </p>
            )}
            <button 
              onClick={() => mutate()} 
              className="mt-4 bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-2">🏰 CastKeepr</h1>
          <p className="text-white/80 text-lg">Your personal saved casts</p>
          <p className="text-white/60 text-sm">Connected as FID: {userFid}</p>
        </div>

        {/* Search Bar */}
        {data && data.length > 0 && (
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search casts or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <div className="absolute left-3 top-3.5 text-white/60">
                🔍
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {data && data.length > 0 && (
          <div className="mb-6 text-center">
            <p className="text-white/80">
              {filteredCasts.length} saved cast{filteredCasts.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* No casts message */}
        {filteredCasts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {searchTerm ? 'No matching casts found' : 'No saved casts yet'}
            </h2>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-white/90 mb-4">
                To save a cast, reply to any Farcaster cast with:
              </p>
              <code className="bg-black/20 px-3 py-2 rounded text-white block mb-4">
                @infinitehomie save this
              </code>
              <p className="text-white/70 text-sm">
                Your saved casts are private and only visible to you.
              </p>
            </div>
          </div>
        ) : (
          /* Casts Grid */
          <div className="grid gap-6">
            {filteredCasts.map((cast) => (
              <div
                key={cast.hash}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-all duration-200"
              >
                {/* Cast Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {cast.author_username?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-white font-semibold">@{cast.author_username}</p>
                      <p className="text-white/60 text-sm">FID: {cast.author_fid}</p>
                    </div>
                  </div>
                  <div className="text-white/60 text-sm">
                    {formatDate(cast.timestamp)}
                  </div>
                </div>

                {/* Cast Content */}
                <div className="mb-4">
                  <p className="text-white leading-relaxed whitespace-pre-wrap">
                    {cast.text}
                  </p>
                </div>

                {/* Cast Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleCastAction(cast, 'view_original')}
                      className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors text-sm"
                    >
                      <span>View Original</span>
                      <span>↗</span>
                    </button>
                    
                    {window.parent !== window && (
                      <button
                        onClick={() => handleCastAction(cast, 'share')}
                        className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors text-sm"
                      >
                        <span>Share</span>
                        <span>🔗</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="text-white/50 text-xs font-mono">
                    {cast.hash.slice(0, 8)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center py-8 mt-12">
          <button
            onClick={() => mutate()}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors mb-4"
          >
            🔄 Refresh Casts
          </button>
          <p className="text-white/60 text-sm">
            Built with 💜 for the Farcaster community
          </p>
        </div>
      </div>
    </div>
  );
};

export default SavedCasts;