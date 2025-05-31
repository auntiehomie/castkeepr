import { FrameRequest, getFrameHtmlResponse } from '@farcaster/frame-sdk';

export function handleFrame(req, res) {
  try {
    const frameRequest = FrameRequest.parse(req.body);
    console.log('📋 Frame request received:', frameRequest);

    const html = getFrameHtmlResponse({
      image: 'https://castkeepr-backend.onrender.com/frame_image.png',
      postUrl: 'https://castkeepr-backend.onrender.com/api/frame-saved-casts',
      buttons: [
        {
          label: 'Open Saved Casts',
          action: 'link',
          target: 'https://castkeepr.vercel.app', // or castkeepr.xyz when ready
        },
      ],
      // Add additional frame metadata for better validation
      aspectRatio: '1.91:1'
    });

    console.log('🖼️ Generated frame HTML');
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('❌ Frame handler error:', error);
    
    // Return a basic frame on error
    const fallbackHtml = getFrameHtmlResponse({
      image: 'https://castkeepr-backend.onrender.com/frame_image.png',
      postUrl: 'https://castkeepr-backend.onrender.com/api/frame-saved-casts',
      buttons: [
        {
          label: 'Open Saved Casts',
          action: 'link',
          target: 'https://castkeepr.vercel.app',
        },
      ],
    });
    
    res.setHeader('Content-Type', 'text/html');
    res.send(fallbackHtml);
  }
}