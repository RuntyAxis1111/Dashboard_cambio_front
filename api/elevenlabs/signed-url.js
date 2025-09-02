export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('🚀 [API] Signed URL request received');
  console.log('📋 [API] Method:', req.method);
  console.log('📋 [API] Headers:', JSON.stringify(req.headers, null, 2));

  try {
    const agentId = process.env.VITE_ELEVENLABS_AGENT_ID;
    const apiKey = process.env.VITE_ELEVENLABS_API_KEY;

    console.log('🔑 [API] Agent ID:', agentId ? 'Present' : 'Missing');
    console.log('🔑 [API] API Key:', apiKey ? 'Present' : 'Missing');

    if (!agentId || !apiKey) {
      console.error('❌ [API] Missing environment variables');
      return res.status(500).json({ 
        error: 'Missing ElevenLabs configuration',
        details: {
          agentId: !!agentId,
          apiKey: !!apiKey
        }
      });
    }

    // Correct ElevenLabs API call according to documentation
    const url = `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`;
    console.log('🌐 [API] Calling ElevenLabs URL:', url);

    const response = await fetch(url, {
      method: 'GET', // Changed to GET as per documentation
      headers: {
        'xi-api-key': apiKey, // Correct header name
      },
    });

    console.log('📊 [API] ElevenLabs response status:', response.status);
    console.log('📋 [API] ElevenLabs response headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [API] ElevenLabs error response:', errorText);
      
      let errorMessage = `ElevenLabs API error: ${response.status}`;
      
      if (response.status === 401) {
        errorMessage = 'Invalid API key - check xi-api-key header';
      } else if (response.status === 403) {
        errorMessage = 'Origin not allowed - check agent allowlist settings';
      } else if (response.status === 404) {
        errorMessage = 'Agent not found - check agent_id';
      }
      
      return res.status(response.status).json({ 
        error: errorMessage,
        details: errorText,
        status: response.status
      });
    }

    const data = await response.json();
    console.log('✅ [API] ElevenLabs response data:', JSON.stringify(data, null, 2));

    if (!data.signed_url) {
      console.error('❌ [API] No signed_url in response');
      return res.status(500).json({ 
        error: 'No signed_url in ElevenLabs response',
        data: data
      });
    }

    console.log('🔗 [API] Signed URL obtained successfully');
    return res.status(200).json({ signedUrl: data.signed_url });

  } catch (error) {
    console.error('💥 [API] Unexpected error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}