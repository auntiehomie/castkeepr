import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const SavedCasts = () => {
  const { data, error, isLoading } = useSWR('https://castkeepr-backend.onrender.com/api/saved-casts', fetcher);

  if (error) return <div>❌ Failed to load saved casts.</div>;
  if (isLoading) return <div>⏳ Loading...</div>;
  if (!data || data.length === 0) return <div>📭 No saved casts yet.</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>💾 Saved Casts</h2>
      {data.map((cast) => (
        <div key={cast.hash} style={{
          marginBottom: '1rem',
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          background: '#fafafa'
        }}>
          <p>{cast.text}</p>
          <p><strong>@{cast.author_username}</strong></p>
          <a href={`https://warpcast.com/${cast.author_fid}/${cast.hash}`} target="_blank" rel="noreferrer">
            View on Warpcast
          </a>
        </div>
      ))}
    </div>
  );
};

export default SavedCasts;
