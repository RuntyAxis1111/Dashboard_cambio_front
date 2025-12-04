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

    console.log('Received payload:', JSON.stringify(payload, null, 2));
    console.log('Sending to test webhook:', testWebhook);
    console.log('Sending to prod webhook:', prodWebhook);

    const testPromise = fetch(testWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      const text = await res.text();
      console.log(`Test webhook - Status: ${res.status}, Body: ${text}`);
      return { res, text };
    }).catch((err) => {
      console.error('Test webhook error:', err);
      throw err;
    });

    const prodPromise = fetch(prodWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      const text = await res.text();
      console.log(`Prod webhook - Status: ${res.status}, Body: ${text}`);
      return { res, text };
    }).catch((err) => {
      console.error('Prod webhook error:', err);
      throw err;
    });

    const results = await Promise.allSettled([testPromise, prodPromise]);

    const [testResult, prodResult] = results;

    let testResponseBody = null;
    let testStatusCode = null;
    let prodResponseBody = null;
    let prodStatusCode = null;

    if (testResult.status === 'fulfilled') {
      testResponseBody = testResult.value.text;
      testStatusCode = testResult.value.res.status;
    }

    if (prodResult.status === 'fulfilled') {
      prodResponseBody = prodResult.value.text;
      prodStatusCode = prodResult.value.res.status;
    }

    const response = {
      success: true,
      test_webhook: {
        status: testResult.status === 'fulfilled' ? 'success' : 'failed',
        status_code: testStatusCode,
        response: testResponseBody,
        error: testResult.status === 'rejected' ? (testResult.reason?.message || String(testResult.reason)) : null,
      },
      prod_webhook: {
        status: prodResult.status === 'fulfilled' ? 'success' : 'failed',
        status_code: prodStatusCode,
        response: prodResponseBody,
        error: prodResult.status === 'rejected' ? (prodResult.reason?.message || String(prodResult.reason)) : null,
      },
      timestamp: new Date().toISOString(),
    };

    console.log('Final response:', response);

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