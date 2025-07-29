const fs = require('fs');
const path = require('path');

// Read environment variables
const apiKey = process.env.MULTISYNQ_API_KEY || '2ggnQt2MuoVu2xcPjaevCeZUyyrX68wFDTDjL2dCOn';
const appId = process.env.MULTISYNQ_APP_ID || 'io.multisynq.bomberman-game';
const lobbyAppId = process.env.MULTISYNQ_LOBBY_APP_ID || 'io.multisynq.bomberman-lobby';

// Update env-loader.js with actual values
const envLoaderPath = path.join(__dirname, 'env-loader.js');
let envLoaderContent = fs.readFileSync(envLoaderPath, 'utf8');

// Replace placeholders with actual environment variables
envLoaderContent = envLoaderContent.replace(
  /'ENV_MULTISYNQ_API_KEY'/,
  `'${apiKey}'`
);

envLoaderContent = envLoaderContent.replace(
  /'ENV_MULTISYNQ_APP_ID'/,
  `'${appId}'`
);

envLoaderContent = envLoaderContent.replace(
  /'ENV_MULTISYNQ_LOBBY_APP_ID'/,
  `'${lobbyAppId}'`
);

fs.writeFileSync(envLoaderPath, envLoaderContent);

console.log('Environment variables injected into env-loader.js');
console.log('API Key:', apiKey.substring(0, 10) + '...');
console.log('App ID:', appId);
console.log('Lobby App ID:', lobbyAppId); 