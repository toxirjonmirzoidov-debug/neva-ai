# NEVA AI — o'z saytingizda ishga tushirish qo'llanmasi

## 1-qadam: Bepul API kalit olish (Google Gemini)
1. https://aistudio.google.com ga Google hisobingiz bilan kiring
2. "Get API key" tugmasini bosing va yangi kalit yarating
3. Pul kartasi kerak emas — bepul tarifda kuniga cheklangan so'rov soni bor (shaxsiy/kichik loyiha uchun yetarli)

## 2-qadam: Loyihani sinab ko'rish (kompyuteringizda)
```bash
npm install
export GEMINI_API_KEY=sizning_gemini_kalitingiz
npm start
```
Brauzerda `http://localhost:3000` ni oching — NEVA AI ishlayotganini ko'rasiz.

## 3-qadam: Internetga chiqarish (hosting)
Eng oson variantlar — bepul tarifi bor, sozlash 5-10 daqiqa:

**Render.com orqali:**
1. Bu loyihani GitHub'ga yuklang (repository yarating)
2. render.com da "New Web Service" tanlang, GitHub repongizni ulang
3. Build command: `npm install`, Start command: `npm start`
4. "Environment" bo'limida `GEMINI_API_KEY` degan nom bilan kalitingizni qo'shing
5. Deploy tugmasini bosing — bir necha daqiqadan so'ng sizga link beriladi (masalan `https://neva-ai.onrender.com`)

**Railway.app orqali ham xuddi shunday** — GitHub'ni ulaysiz, environment variable qo'shasiz, deploy qilasiz.

## Fayllar tuzilishi
```
neva-ai-app/
├── server.js       ← backend (API kalitni yashirib turadi)
├── package.json
└── public/
    └── index.html  ← chat interfeysi (NEVA AI)
```

## Muhim eslatmalar
- **Hech qachon** API kalitingizni `public/index.html` ichiga yozmang — u hammaga ko'rinadi va kalitingiz o'g'irlanishi mumkin. Kalit faqat `server.js` orqali, environment variable sifatida ishlatiladi.
- Bepul tarifning **kunlik/daqiqalik so'rov chegarasi** bor (Google vaqti-vaqti bilan bu limitlarni o'zgartiradi — aniq raqamlarni https://ai.google.dev/pricing sahifasidan tekshiring). Ko'p odam bir vaqtda ishlatsa, limitga tez yetib borishingiz mumkin.
- Limitga yetganda foydalanuvchilarga xato xabari chiqadi — bu pulli emas, shunchaki so'rov to'xtaydi, keyingi davrda (masalan ertasi kuni) yana ishlaydi.
- Saytingizda buni ishlatuvchilarga halol bo'lish uchun, "Google Gemini asosida ishlaydi" degan izohni qo'shib qo'yish tavsiya etiladi.
