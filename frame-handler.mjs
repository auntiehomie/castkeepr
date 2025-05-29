// frame-handler.mjs
import { FrameRequest, getFrameHtmlResponse } from '@farcaster/frame-sdk';

export function handleFrame(req, res) {
  const frameRequest = FrameRequest.parse(req.body);

  const html = getFrameHtmlResponse({
    image: 'http://localhost:3000/preview-saved-casts.png',
    postUrl: 'http://localhost:3000/api/frame-saved-casts',
    buttons: [
      {
        label: 'Open Saved Casts',
        action: 'link',
        target: 'https://yourdomain.com',
      },
    ],
  });

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
