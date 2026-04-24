fetch('http://localhost:5000/api/bot/webhook?hub.challenge=CHALLENGE_ACCEPTED&hub.verify_token=ecosaathi_bot_secret_2024')
  .then(res => res.text())
  .then(text => console.log('GET /webhook response:', text))
  .catch(console.error);

fetch('http://localhost:5000/api/bot/webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    entry: [{
      changes: [{
        value: {
          messages: [{
            from: '919876543210',
            text: { body: 'Y N H' }
          }]
        }
      }]
    }]
  })
})
  .then(res => res.json())
  .then(json => console.log('POST /webhook response:', json))
  .catch(console.error);
