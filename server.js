const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';

if (!GEMINI_API_KEY) {
  console.warn('OGOHLANTIRISH: GEMINI_API_KEY o\'rnatilmagan. Environment variable sifatida qo\'shing.');
}

function toGeminiContents(messages) {
  return messages.map(m => {
    const role = m.role === 'assistant' ? 'model' : 'user';
    let parts = [];
    if (typeof m.content === 'string') {
      parts.push({ text: m.content });
    } else if (Array.isArray(m.content)) {
      m.content.forEach(block => {
        if (block.type === 'text') {
          parts.push({ text: block.text });
        } else if (block.type === 'image' && block.source && block.source.data) {
          parts.push({ inline_data: { mime_type: block.source.media_type, data: block.source.data } });
        } else if (block.type === 'document' && block.source && block.source.data) {
          parts.push({ inline_data: { mime_type: block.source.media_type || 'application/pdf', data: block.source.data } });
        }
      });
    }
    return { role, parts };
  });
}

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages massivi kerak' });
    }

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent?key=' + GEMINI_API_KEY;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: "Sizning ismingiz NEVA AI. Foydalanuvchi qaysi tilda yozsa, o'sha tilda javob bering. Do'stona, aniq va foydali bo'ling." }]
        },
        contents: toGeminiContents(messages),
        generationConfig: { maxOutputTokens: 1000 }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API xatosi:', data);
      return res.status(response.status).json({ error: (data.error && data.error.message) || 'API xatosi' });
    }

    const text = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts)
      ? data.candidates[0].content.parts.map(p => p.text).join('\n')
      : '';
    res.json({ content: [{ type: 'text', text }] });
  } catch (err) {
    console.error('Server xatosi:', err);
    res.status(500).json({ error: 'Server xatosi yuz berdi' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('NEVA AI (Gemini) server ' + PORT + '-portda ishga tushdi');
});
