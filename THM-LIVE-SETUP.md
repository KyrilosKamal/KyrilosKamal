# Live TryHackMe statistics setup

The browser error confirmed that TryHackMe does not send an `Access-Control-Allow-Origin` header for direct requests from GitHub Pages. The portfolio therefore calls a small Cloudflare Worker proxy instead.

## 1. Deploy the Worker

1. Sign in to Cloudflare and open **Workers & Pages**.
2. Select **Create application** → **Create Worker**.
3. Give it a name such as `thm-profile-proxy`.
4. Open **Edit code**, replace the starter code with the complete contents of `thm-profile-proxy.js`, and deploy.
5. Copy the Worker URL. It will look like `https://thm-profile-proxy.<your-subdomain>.workers.dev`.

No API token, TryHackMe password, cookie, or secret is needed. The Worker requests only the public profile for the fixed username `Hackth3Path`; it does not accept arbitrary upstream URLs or usernames.

## 2. Connect the portfolio to the Worker

In `index.html`, find:

```js
const profileUrl = 'https://REPLACE-WITH-YOUR-WORKER-SUBDOMAIN.workers.dev';
```

Replace the URL with your actual Worker URL (no trailing slash), then commit and push `index.html` to GitHub. The page's Content Security Policy already permits `*.workers.dev` connections.

## 3. Verify

Open the portfolio, then browser DevTools → Network. Reload and check the request to your Worker URL. A successful response should be JSON containing `data.rank`, `data.topPercentage`, `data.level`, and `data.completedRoomsNumber`.

The Worker caches responses for 5 minutes to avoid repeatedly querying TryHackMe. The displayed values are therefore live with up to approximately 5 minutes of cache delay, not a guaranteed real-time feed. If TryHackMe changes or blocks its undocumented endpoint, the portfolio displays an unavailable state rather than stale fabricated statistics.

## Security notes

- CORS is restricted to `https://kyriloskamal.github.io`.
- Only GET and OPTIONS are accepted.
- The upstream URL and username are fixed in the Worker.
- Only the four public statistics and username are returned to the page.
- No visitor credentials or TryHackMe session data are forwarded.
