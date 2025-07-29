export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Return environment variables as JSON
  res.status(200).json({
    MULTISYNQ_API_KEY: process.env.MULTISYNQ_API_KEY || '2ggnQt2MuoVu2xcPjaevCeZUyyrX68wFDTDjL2dCOn',
    MULTISYNQ_APP_ID: process.env.MULTISYNQ_APP_ID || 'io.multisynq.bomberman-game',
    MULTISYNQ_LOBBY_APP_ID: process.env.MULTISYNQ_LOBBY_APP_ID || 'io.multisynq.bomberman-lobby'
  });
} 