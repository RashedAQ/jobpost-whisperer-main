export default function handler(req, res) {
  const VERIFY_TOKEN = 'mywhatsapptoken123'; // Choose any token you want
  
  if (req.method === 'GET') {
    // Webhook verification
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified');
      res.status(200).send(challenge);
    } else {
      console.log('Webhook verification failed');
      res.status(403).send('Forbidden');
    }
  } 
  else if (req.method === 'POST') {
    // Handle incoming WhatsApp messages
    const body = req.body;
    
    console.log('Received webhook data:', JSON.stringify(body, null, 2));
    
    // Process the webhook data here
    if (body.object === 'whatsapp_business_account') {
      body.entry?.forEach(entry => {
        entry.changes?.forEach(change => {
          if (change.field === 'messages') {
            const messages = change.value.messages;
            messages?.forEach(message => {
              console.log('New message:', message);
              // Process message here
            });
          }
        });
      });
    }
    
    res.status(200).json({ status: 'ok' });
  } 
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
