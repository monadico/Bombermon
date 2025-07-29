// Environment Variable Loader for Browser
// This script makes environment variables available to the browser

(function() {
    'use strict';
    
    // Environment variables storage
    window.process = window.process || {};
    window.process.env = window.process.env || {};
    
    // Function to get environment variable with fallback
    function getEnvVar(key, fallback) {
        // In browser context, we'll use the fallback values
        // In Vercel, these will be replaced at build time
        return fallback;
    }
    
    // Set up environment variables
    window.process.env.MULTISYNQ_API_KEY = getEnvVar('MULTISYNQ_API_KEY', '2ggnQt2MuoVu2xcPjaevCeZUyyrX68wFDTDjL2dCOn');
    window.process.env.MULTISYNQ_APP_ID = getEnvVar('MULTISYNQ_APP_ID', 'io.multisynq.bomberman-game');
    window.process.env.MULTISYNQ_LOBBY_APP_ID = getEnvVar('MULTISYNQ_LOBBY_APP_ID', 'io.multisynq.bomberman-lobby');
    
    console.log('Environment variables loaded:', window.process.env);
})(); 