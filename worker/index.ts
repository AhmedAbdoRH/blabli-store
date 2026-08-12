export default {
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);
    
    // API endpoint example
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ message: 'Hello from Cloudflare Worker!' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // For static assets, let Cloudflare handle them automatically
    return new Response('Worker is running', { status: 200 });
  },
};
