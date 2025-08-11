{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "36fcf7f4-58aa-431e-8c15-fe0eeb80c6b6",
        "responseMode": "responseNode",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        -320,
        0
      ],
      "id": "b3b60510-ef77-4477-9a99-d3f747ebda68",
      "name": "jobparser",
      "webhookId": "36fcf7f4-58aa-431e-8c15-fe0eeb80c6b6",
      "disabled": false
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
      "typeVersion": 1,
      "position": [
        256,
        288
      ],
      "id": "f0250460-b3a6-4b9e-8b3d-cc5312da3a41",
      "name": "Google Gemini Chat Model",
      "credentials": {
        "googlePalmApi": {
          "id": "R9kvPyBRsR65g9ai",
          "name": "Google Gemini(PaLM) Api account"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const text = $input.first().json.body.jobText || \"\";\n\nconst emailRegex = /[\\w\\.-]+@[\\w\\.-]+\\.\\w+/g;\nconst matches = text.match(emailRegex);\n\n// Return the original text and the found email\nreturn [{\n  json: {\n    jobText: text,\n    hrEmail: matches ? matches[0] : \"no-email-found@example.com\"\n  }\n}];"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        -80,
        0
      ],
      "id": "5f078ca1-7265-4ca4-9508-e0f16e4f1787",
      "name": "Extract Email"
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": {
          "__rl": true,
          "value": "1NccSueG5Zir4fYLYG_OUSfFz3CDMP59a",
          "mode": "list",
          "cachedResultName": "RashedBNQ CV.pdf",
          "cachedResultUrl": "https://drive.google.com/file/d/1NccSueG5Zir4fYLYG_OUSfFz3CDMP59a/view?usp=drivesdk"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [
        848,
        -32
      ],
      "id": "80d6cbd7-fd1b-4ae1-88b4-a28bfda4d63b",
      "name": "Download CV",
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "jlhRXLMiIhpfQVNL",
          "name": "Google Drive account"
        }
      }
    },
    {
      "parameters": {
        "sendTo": "=rashed9basim@gmail.com",
        "subject": "={{ $json.subject }}",
        "emailType": "text",
        "message": "={{ $json.body }}",
        "options": {
          "attachmentsUi": {
            "attachmentsBinary": [
              {}
            ]
          }
        }
      },
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [
        1056,
        -32
      ],
      "id": "6e0610c5-1022-4e56-828a-0b344963164c",
      "name": "Send Email",
      "webhookId": "551be2e1-c4eb-4fa2-8b51-c253f7076e58",
      "credentials": {
        "gmailOAuth2": {
          "id": "krmL1JGVbOZsV4Ze",
          "name": "Gmail account 3"
        }
      }
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "Generate a professional job application email. Return ONLY valid JSON with \"subject\" and \"body\" keys.\n\nJob Description: {{ $json.jobText }}\n\nMy Full Profile:\nName: Rashed Basim Nasir Alhaj Qasem\nContact: rashedbnq@gmail.com | +962 7 8133 8069 | +90 552 709 9789\nLinkedIn: www.linkedin.com/in/rashedalhajqasem | Portfolio: https://rashedbnq.vercel.app/ | GitHub: https://github.com/RashedAQ\n\nSUMMARY: Computer Engineer with expertise in RPA (UiPath, n8n), AI, computer vision, and Unity-based game development.\n\nSKILLS & EXPERIENCE:\n- RPA & Automation: UiPath Studio/Orchestrator (Associate & Advanced certified), n8n workflow automation, API integrations, 80% process efficiency improvements\n- Programming: Python, C#, Java, SQL, React Native\n- AI & Computer Vision: OpenCV, deep learning, object detection, Streamlit deployment, custom model training\n- Game Development: Unity, SOLID principles, Game Programming Patterns, full project development\n- Tools: Git, Visual Studio, SourceTree, Google Sheets automation\n\nWORK EXPERIENCE:\n- Xocialive Company (RPA Intern): Completed RPA certifications, built automation workflows, API integrations\n- Chickmania Company (Unity Intern): Created full game project using design patterns and Unity best practices\n\nKEY PROJECTS:\n- Automated Fresh Produce Detection using Streamlit and deep learning\n- Multi-step n8n workflows with AI document parsing and OpenAI integration\n- Rent-Hub mobile app using React Native\n- Multiple RPA solutions improving business processes\n\nInstructions:\n1. Write a 3-4 paragraph professional email (100-120 words)\n2. Identify the job title from the description and use it naturally\n3. Match 2-3 of my most relevant skills/experiences to the specific job\n4. Show enthusiasm and knowledge about the role\n5. Include contact info with | separators at the end\n6. Keep professional but personable tone\n\nGenerate JSON now:",
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 2.1,
      "position": [
        240,
        -16
      ],
      "id": "099dd8d8-dd2d-4472-b7f8-a3b9651b2282",
      "name": "AI Agent1"
    },
    {
      "parameters": {
        "jsCode": "// Get the raw AI output string\nconst rawOutput = $json.output;\n\n// Remove the ```json ... ``` wrapper\nconst cleaned = rawOutput\n  .replace(/^```json\\n/, '')\n  .replace(/\\n```$/, '')\n  .trim();\n\n// Parse the cleaned JSON string\nconst parsed = JSON.parse(cleaned);\n\n// Return as separate fields\nreturn [\n  {\n    json: {\n      subject: parsed.subject,\n      body: parsed.body\n    }\n  }\n];\n"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        592,
        -16
      ],
      "id": "3c4857d0-9501-4f82-9d95-d3435d6d69cf",
      "name": "Format Email2"
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "{ \"status\": \"received\", \"message\": \"Job post received and processing\" }\n",
        "options": {}
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.4,
      "position": [
        1264,
        -32
      ],
      "id": "062654e4-e6b7-4037-9919-06dfc963d36c",
      "name": "Respond to Webhook"
    }
  ],
  "connections": {
    "jobparser": {
      "main": [
        [
          {
            "node": "Extract Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Gemini Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "AI Agent1",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Extract Email": {
      "main": [
        [
          {
            "node": "AI Agent1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Download CV": {
      "main": [
        [
          {
            "node": "Send Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Email": {
      "main": [
        [
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent1": {
      "main": [
        [
          {
            "node": "Format Email2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Email2": {
      "main": [
        [
          {
            "node": "Download CV",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "e6b5c1cab7e18aa736f348740c776eb3e83f5689eba750b252f6c4fd82daa842"
  }
}