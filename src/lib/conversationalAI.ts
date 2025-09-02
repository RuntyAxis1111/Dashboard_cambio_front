import { ElevenLabsClient } from '@11labs/client';

interface ConversationConfig {
  agentId?: string;
  voice?: string;
  model?: string;
}

class ConversationalAI {
  private client: ElevenLabsClient;
  private conversation: any = null;
  private isConnected = false;
  private audioContext: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;

  constructor() {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ElevenLabs API key not found');
    }
    
    this.client = new ElevenLabsClient({
      apiKey: apiKey
    });
  }

  async startConversation(config: ConversationConfig = {}) {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // Initialize audio context
      this.audioContext = new AudioContext();

      // Create conversation session
      this.conversation = await this.client.conversationalAI.createConversation({
        agent_id: config.agentId || 'default',
        voice: {
          voice_id: config.voice || 'pNInz6obpgDQGcFmaJgB', // Adam voice
          model_id: 'eleven_turbo_v2_5'
        },
        conversation_config: {
          agent: {
            prompt: {
              prompt: `Eres un asistente de IA especializado en datos y análisis para HYBE LATAM. 
              Puedes ayudar con:
              - Análisis de datos de redes sociales
              - Métricas de rendimiento de artistas
              - Insights de marketing
              - Interpretación de dashboards
              
              Responde de manera conversacional, amigable y profesional. 
              Mantén las respuestas concisas pero informativas.`
            },
            language: 'es', // Spanish
            max_duration: 300, // 5 minutes max
            think_out_loud: false
          }
        }
      });

      // Set up media recorder for audio streaming
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      // Handle audio data
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && this.conversation) {
          // Send audio chunk to ElevenLabs
          this.sendAudioChunk(event.data);
        }
      };

      // Handle conversation responses
      this.conversation.on('response', (response: any) => {
        this.playAudioResponse(response.audio);
      });

      this.conversation.on('error', (error: any) => {
        console.error('Conversation error:', error);
      });

      this.isConnected = true;
      return true;

    } catch (error) {
      console.error('Failed to start conversation:', error);
      throw error;
    }
  }

  private async sendAudioChunk(audioData: Blob) {
    if (!this.conversation) return;

    try {
      const arrayBuffer = await audioData.arrayBuffer();
      await this.conversation.sendAudio(arrayBuffer);
    } catch (error) {
      console.error('Error sending audio:', error);
    }
  }

  private async playAudioResponse(audioData: ArrayBuffer) {
    if (!this.audioContext) return;

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(audioData);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  startListening() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'inactive') {
      this.mediaRecorder.start(100); // Send chunks every 100ms
    }
  }

  stopListening() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }
  }

  async endConversation() {
    try {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.mediaRecorder = null;
      }

      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }

      if (this.audioContext) {
        await this.audioContext.close();
        this.audioContext = null;
      }

      if (this.conversation) {
        await this.conversation.end();
        this.conversation = null;
      }

      this.isConnected = false;
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

export default ConversationalAI;