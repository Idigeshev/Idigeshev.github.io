require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3002;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/contact', async (req, res) => {
    try {
        const { name, phone, tg, message } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ success: false, message: 'Имя и телефон обязательны.' });
        }

        const telegramMessage = `
🔔 <b>Новая заявка — idigeshev.ru</b>

👤 <b>Имя:</b> ${name}
📱 <b>Телефон:</b> ${phone}
✈️ <b>Telegram:</b> ${tg || '—'}
💬 <b>Сообщение:</b> ${message || '—'}

⏰ ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
        `.trim();

        await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: TELEGRAM_CHAT_ID,
                text: telegramMessage,
                parse_mode: 'HTML'
            }
        );

        res.json({ success: true });

    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error.message);
        res.status(500).json({ success: false, message: 'Ошибка сервера. Попробуйте позже.' });
    }
});

// Статика
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
