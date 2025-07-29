// Environment Variable Loader for Browser
// This script makes environment variables available to the browser

(function() {
    'use strict';
    
    // Environment variables storage
    window.process = window.process || {};
    window.process.env = window.process.env || {};
    
    // Default fallback values
    window.process.env.MULTISYNQ_API_KEY = '2ggnQt2MuoVu2xcPjaevCeZUyyrX68wFDTDjL2dCOn';
    window.process.env.MULTISYNQ_APP_ID = 'io.multisynq.bomberman-game';
    window.process.env.MULTISYNQ_LOBBY_APP_ID = 'io.multisynq.bomberman-lobby';
    
    // Try to fetch environment variables from API
    fetch('/api/config')
        .then(response => response.json())
        .then(data => {
            window.process.env.MULTISYNQ_API_KEY = data.MULTISYNQ_API_KEY;
            window.process.env.MULTISYNQ_APP_ID = data.MULTISYNQ_APP_ID;
            window.process.env.MULTISYNQ_LOBBY_APP_ID = data.MULTISYNQ_LOBBY_APP_ID;
            console.log('Environment variables loaded from API:', window.process.env);
        })
        .catch(error => {
            console.log('Could not load environment variables from API, using fallback values:', error);
            console.log('Environment variables loaded (fallback):', window.process.env);
        });
})(); 