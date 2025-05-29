import { FrameRequest, getFrameHtmlResponse } from '@farcaster/frame-sdk';

export function handleFrame(req, res) {
  const frameRequest = FrameRequest.parse(req.body);

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
  });

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
