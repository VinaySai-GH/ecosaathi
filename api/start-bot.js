const { spawn } = require('child_process');
const localtunnel = require('localtunnel');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const WEBHOOK_TOKEN = process.env.WHATSAPP_WEBHOOK_TOKEN || 'ecosaathi_bot_secret_2024';

console.log('🚀 Starting EcoSaathi Backend & WhatsApp Bot Tunnel...');

// 1. Start the Node.js server
const server = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
});

// 2. Start the localtunnel
(async () => {
  try {
    // wait a few seconds for the server to bind the port
    await new Promise(r => setTimeout(r, 2000));
    
    // Add timeout to localtunnel since their servers are often down
    const tunnelPromise = localtunnel({ port: PORT });
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Localtunnel timed out (their servers might be down).')), 8000)
    );
    
    const tunnel = await Promise.race([tunnelPromise, timeoutPromise]);
    
    console.log('\n======================================================');
    console.log('✅ WhatsApp Bot Webhook Tunnel is LIVE!');
    console.log('======================================================');
    console.log('To connect your Meta WhatsApp Cloud API:');
    console.log('1. Go to your Meta Developer App -> WhatsApp -> Configuration');
    console.log('2. Click "Edit" under Webhook');
    console.log(`3. Callback URL:   ${tunnel.url}/api/bot/webhook`);
    console.log(`4. Verify Token:   ${WEBHOOK_TOKEN}`);
    console.log('======================================================\n');
    
    tunnel.on('close', () => {
      console.log('Tunnel closed.');
    });
  } catch (err) {
    console.log('\n⚠️ Could not start localtunnel. (Error: ' + err.message + ')');
    console.log('Please use ngrok instead. Run this in a new terminal:');
    console.log('👉  npx ngrok http 5000');
    console.log('\nThen use the ngrok URL (e.g. https://xxxx.ngrok-free.app/api/bot/webhook)');
  }
})();

process.on('SIGINT', () => {
  server.kill('SIGINT');
  process.exit();
});
