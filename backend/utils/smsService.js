const axios = require('axios');
const xml2js = require('xml2js');

const usercode = process.env.NETGSM_USERCODE;
const password = process.env.NETGSM_PASSWORD;
const msgheader = process.env.NETGSM_HEADER;

async function sendSMS(to, message) {
    // Numara başında +90 veya 0 olmadan 5xxxxxxxxx formatında olmalı!
    const gsm = to.replace(/^\+90|^0/, ''); // +905xxxxxxxxx veya 05xxxxxxxxx -> 5xxxxxxxxx

    const xml = `
    <mainbody>
      <header>
        <company>Netgsm</company>
        <usercode>${usercode}</usercode>
        <password>${password}</password>
        <type>1:n</type>
        <msgheader>${msgheader}</msgheader>
      </header>
      <body>
        <msg><![CDATA[${message}]]></msg>
        <no>${gsm}</no>
      </body>
    </mainbody>
  `;

    try {
        const { data } = await axios.post(
            'https://api.netgsm.com.tr/sms/send/xml',
            xml,
            { headers: { 'Content-Type': 'text/xml' } }
        );
        // Başarılıysa <code>20</code> ile başlar
        const parsed = await xml2js.parseStringPromise(data);
        const code = parsed.mainbody?.code?.[0];
        if (code && code.startsWith('20')) {
            console.log('SMS gönderildi:', code);
            return true;
        } else {
            console.error('SMS gönderim hatası:', data);
            return false;
        }
    } catch (err) {
        console.error('SMS gönderim hatası:', err);
        return false;
    }
}

module.exports = { sendSMS }; 