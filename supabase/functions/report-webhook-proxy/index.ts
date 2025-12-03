import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload = await req.json();
    
    const testWebhook = 'https://runtyaxis.app.n8n.cloud/webhook-test/1461e877-1770-4fd8-a9f0-0321161c51a1';
    const prodWebhook = 'https://runtyaxis.app.n8n.cloud/webhook/1461e877-1770-4fd8-a9f0-0321161c51a1';

    const results = await Promise.allSettled([
      fetch(testWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
      fetch(prodWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
    ]);

    const [testResult, prodResult] = results;
    
    const response = {
      success: true,
      test_webhook: {
        status: testResult.status === 'fulfilled' ? 'success' : 'failed',
        status_code: testResult.status === 'fulfilled' ? testResult.value.status : null,
        error: testResult.status === 'rejected' ? testResult.reason.message : null,
      },
      prod_webhook: {
        status: prodResult.status === 'fulfilled' ? 'success' : 'failed',
        status_code: prodResult.status === 'fulfilled' ? prodResult.value.status : null,
        error: prodResult.status === 'rejected' ? prodResult.reason.message : null,
      },
      timestamp: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing webhook request:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});