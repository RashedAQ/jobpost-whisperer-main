export default function handler(req, res) {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'mywhatsapptoken123';
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  try {
    if (req.method === 'GET') {
      // Webhook verification
      const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
      
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('✅ Webhook verified successfully');
        return res.status(200).send(challenge);
      } else {
        console.log('❌ Webhook verification failed:', { mode, token: token ? '***' : 'missing' });
        return res.status(403).json({ error: 'Forbidden' });
      }
    } 
    else if (req.method === 'POST') {
      // Handle incoming webhooks
      console.log('📨 Webhook received:', JSON.stringify(req.body, null, 2));
      
      const { object, entry } = req.body;
      
      if (object === 'whatsapp_business_account') {
        entry?.forEach(entryItem => {
          entryItem.changes?.forEach(change => {
            
            switch (change.field) {
              case 'messages':
                handleMessages(change.value);
                break;
                
              case 'message_echoes':
                handleMessageEchoes(change.value);
                break;
                
              case 'account_alerts':
                handleAccountAlerts(change.value);
                break;
                
              case 'phone_number_quality_update':
                handlePhoneQualityUpdate(change.value);
                break;
                
              case 'business_status_update':
                handleBusinessStatusUpdate(change.value);
                break;
                
              case 'message_template_status_update':
                handleTemplateStatusUpdate(change.value);
                break;
                
              case 'message_template_quality_update':
                handleTemplateQualityUpdate(change.value);
                break;
                
              case 'calls':
                handleCalls(change.value);
                break;
                
              default:
                console.log('🔔 Unhandled webhook field:', change.field);
            }
          });
        });
      }
      
      return res.status(200).json({ status: 'success' });
    } 
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Handler functions for different webhook types
function handleMessages(value) {
  const { messages, statuses, contacts } = value;
  
  // Handle incoming messages
  messages?.forEach(message => {
    console.log('📩 New message:', {
      from: message.from,
      id: message.id,
      timestamp: message.timestamp,
      type: message.type,
      text: message.text?.body,
      // Add other message types as needed
    });
    
    // Here you could trigger your UiPath process or store in database
    // Example: Call your RPA trigger API
    // triggerUiPathProcess(message);
  });
  
  // Handle message statuses (sent, delivered, read, failed)
  statuses?.forEach(status => {
    console.log('📋 Status update:', {
      id: status.id,
      status: status.status,
      timestamp: status.timestamp,
      recipient_id: status.recipient_id
    });
  });
}

function handleMessageEchoes(value) {
  const { messages } = value;
  messages?.forEach(message => {
    console.log('📤 Message echo (sent by you):', {
      id: message.id,
      to: message.to,
      type: message.type,
      text: message.text?.body
    });
  });
}

function handleAccountAlerts(value) {
  console.log('🚨 Account Alert:', value);
  // Handle account alerts - important notifications about your account
}

function handlePhoneQualityUpdate(value) {
  console.log('📞 Phone Quality Update:', value);
  // Handle phone number quality updates - rate limits, restrictions
}

function handleBusinessStatusUpdate(value) {
  console.log('🏢 Business Status Update:', value);
  // Handle business account status changes
}

function handleTemplateStatusUpdate(value) {
  console.log('📄 Template Status Update:', value);
  // Handle message template approval/rejection
}

function handleTemplateQualityUpdate(value) {
  console.log('⭐ Template Quality Update:', value);
  // Handle template performance metrics
}

function handleCalls(value) {
  const { calls } = value;
  calls?.forEach(call => {
    console.log('📞 WhatsApp Call:', {
      id: call.id,
      from: call.from,
      timestamp: call.timestamp,
      status: call.status
    });
  });
}

// Example function to trigger UiPath process
function triggerUiPathProcess(message) {
  // This is where you'd call your UiPath Orchestrator API
  // or trigger your RPA process based on incoming messages
  console.log('🤖 Triggering UiPath process for message:', message.id);
}
