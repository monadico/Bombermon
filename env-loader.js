// Environment Variable Loader for Browser
// This script makes environment variables available to the browser

(function() {
    'use strict';
    
    // Environment variables storage
    window.process = window.process || {};
    window.process.env = window.process.env || {};
    
    // Set up environment variables with placeholders
    // These will be replaced during build by build.js
    window.process.env.MULTISYNQ_API_KEY = 'ENV_MULTISYNQ_API_KEY';
    window.process.env.MULTISYNQ_APP_ID = 'ENV_MULTISYNQ_APP_ID';
    window.process.env.MULTISYNQ_LOBBY_APP_ID = 'ENV_MULTISYNQ_LOBBY_APP_ID';
    
    console.log('Environment variables loaded:', window.process.env);
})(); 