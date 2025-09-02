import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get environment variables
    const apiKey = process.env.ELEVEN_API_KEY
    const agentId = process.env.ELEVEN_AGENT_ID

    if (!apiKey || !agentId) {
      console.error('Missing required environment variables')
      return res.status(500).json({ 
        error: 'Server configuration error - missing API credentials' 
      })
    }

    // Call ElevenLabs API to get signed URL
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`ElevenLabs API error: ${response.status} - ${errorText}`)
      
      if (response.status === 401) {
        return res.status(401).json({ error: 'Invalid API key' })
      }
      if (response.status === 403) {
        return res.status(403).json({ error: 'Access forbidden - check agent permissions' })
      }
      if (response.status === 404) {
        return res.status(404).json({ error: 'Agent not found' })
      }
      
      return res.status(response.status).json({ 
        error: `ElevenLabs API error: ${response.status}` 
      })
    }

    const data = await response.json()
    
    if (!data.signed_url) {
      console.error('No signed_url in response:', data)
      return res.status(500).json({ error: 'Invalid response from ElevenLabs API' })
    }

    console.log('Signed URL generated successfully')
    
    // Return the signed URL
    return res.status(200).json({ 
      signed_url: data.signed_url 
    })

  } catch (error) {
    console.error('Signed URL generation error:', error)
    return res.status(500).json({ 
      error: 'Failed to generate signed URL' 
    })
  }
}