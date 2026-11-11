/**
 * TryHackMe public-profile proxy for KyrillosKamal GitHub Pages portfolio.
 * Deploy as a Cloudflare Worker. No secrets or user credentials are required.
 */
const ALLOWED_ORIGIN = 'https://kyriloskamal.github.io';
const UPSTREAM_URL = 'https://tryhackme.com/api/v2/public-profile?username=Hackth3Path';

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin');
    if (origin !== ALLOWED_ORIGIN) {
      return new Response('Forbidden origin', { status: 403 });
    }

    const headers = corsHeaders(origin);
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== 'GET') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { ...headers, 'Allow': 'GET, OPTIONS' }
      });
    }

    try {
      const upstream = await fetch(UPSTREAM_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cf: { cacheTtl: 300, cacheEverything: true }
      });
      if (!upstream.ok) {
        return new Response('TryHackMe upstream returned an error', {
          status: 502,
          headers: { ...headers, 'Cache-Control': 'no-store' }
        });
      }

      const payload = await upstream.json();
      const profile = payload && payload.data;
      if (payload.status !== 'success' || !profile || profile.username !== 'Hackth3Path' ||
          !Number.isFinite(profile.rank) || profile.rank < 1) {
        return new Response('Unexpected TryHackMe profile response', {
          status: 502,
          headers: { ...headers, 'Cache-Control': 'no-store' }
        });
      }

      // Return only the public fields used by the portfolio.
      const safePayload = {
        status: 'success',
        data: {
          username: profile.username,
          rank: profile.rank,
          topPercentage: Number.isFinite(profile.topPercentage) ? profile.topPercentage : null,
          level: Number.isFinite(profile.level) ? profile.level : null,
          completedRoomsNumber: Number.isFinite(profile.completedRoomsNumber) ? profile.completedRoomsNumber : null
        }
      };
      return new Response(JSON.stringify(safePayload), {
        status: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=300, s-maxage=300',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    } catch (_error) {
      return new Response('Unable to retrieve TryHackMe profile', {
        status: 502,
        headers: { ...headers, 'Cache-Control': 'no-store' }
      });
    }
  }
};
