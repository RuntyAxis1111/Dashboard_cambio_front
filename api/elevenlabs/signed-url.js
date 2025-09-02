export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🚀 API endpoint called');
    console.log('📋 Request body:', req.body);
    
    const { agentId } = req.body;
    
    if (!agentId) {
      console.log('❌ No agent ID provided');
      return res.status(400).json({ error: 'Agent ID is required' });
    }

    const apiKey = process.env.VITE_ELEVENLABS_API_KEY;
    console.log('🔑 API Key exists:', !!apiKey);
    console.log('🤖 Agent ID:', agentId);
    
    if (!apiKey) {
      console.log('❌ No API key in environment');
      return res.status(500).json({ error: 'ElevenLabs API key not configured' });
    }

    // Create signed URL for ElevenLabs conversation
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`;
    console.log('📡 Calling ElevenLabs URL:', elevenLabsUrl);
    
    const response = await fetch(elevenLabsUrl, {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 ElevenLabs response status:', response.status);
    console.log('📋 ElevenLabs response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ElevenLabs API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'Failed to get signed URL from ElevenLabs',
        details: errorText,
        status: response.status
      });
    }

    const responseText = await response.text();
    console.log('📄 ElevenLabs raw response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Parsed ElevenLabs response:', data);
    } catch (parseError) {
      console.error('❌ Failed to parse ElevenLabs response:', parseError);
      return res.status(500).json({ 
        error: 'Invalid JSON response from ElevenLabs',
        details: responseText 
      });
    }
    
    if (!data.signed_url) {
      console.error('❌ No signed_url in response:', data);
      return res.status(500).json({ 
        error: 'No signed URL in ElevenLabs response',
        response: data 
      });
    }
    
    console.log('✅ Returning signed URL successfully');
    return res.status(200).json({
      signedUrl: data.signed_url
    });

  } catch (error) {
    console.error('💥 Signed URL error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}