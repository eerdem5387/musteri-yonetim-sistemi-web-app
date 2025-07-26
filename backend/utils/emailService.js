const nodemailer = require('nodemailer');

// E-posta transporter'ı oluştur
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Gmail App Password kullanılmalı
    }
  });
};

// Randevu onay e-postası gönder
const sendAppointmentConfirmation = async (appointment) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: appointment.customer.email,
      subject: 'Randevu Onayı - Güzellik Merkezi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Randevu Onayı</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #28a745; margin-top: 0;">Randevunuz Başarıyla Oluşturuldu!</h3>
            
            <div style="margin: 15px 0;">
              <strong>Müşteri:</strong> ${appointment.customer.name}<br>
              <strong>Telefon:</strong> ${appointment.customer.phone}<br>
              <strong>Hizmet:</strong> ${appointment.service.name}<br>
              <strong>Uzman:</strong> ${appointment.expert.name}<br>
              <strong>Tarih:</strong> ${new Date(appointment.date).toLocaleDateString('tr-TR')}<br>
              <strong>Saat:</strong> ${appointment.time}<br>
              <strong>Fiyat:</strong> ${appointment.service.price} TL
            </div>
            
            <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="margin: 0; color: #495057;">
                <strong>Önemli Notlar:</strong><br>
                • Randevunuzdan 15 dakika önce gelmenizi rica ederiz.<br>
                • Herhangi bir değişiklik için lütfen bizimle iletişime geçin.<br>
                • Randevunuzu iptal etmek isterseniz en az 24 saat önceden haber verin.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #6c757d;">
            <p>Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.</p>
            <p>Güzellik Merkezi - Müşteri Yönetim Sistemi</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('E-posta gönderildi:', info.messageId);
    return true;
  } catch (error) {
    console.error('E-posta gönderimi hatası:', error);
    return false;
  }
};

// Randevu güncelleme e-postası gönder
const sendAppointmentUpdate = async (appointment) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: appointment.customer.email,
      subject: 'Randevu Güncellendi - Güzellik Merkezi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Randevu Güncellendi</h2>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">Randevunuz Güncellendi!</h3>
            
            <div style="margin: 15px 0;">
              <strong>Müşteri:</strong> ${appointment.customer.name}<br>
              <strong>Telefon:</strong> ${appointment.customer.phone}<br>
              <strong>Hizmet:</strong> ${appointment.service.name}<br>
              <strong>Uzman:</strong> ${appointment.expert.name}<br>
              <strong>Tarih:</strong> ${new Date(appointment.date).toLocaleDateString('tr-TR')}<br>
              <strong>Saat:</strong> ${appointment.time}<br>
              <strong>Durum:</strong> ${appointment.status === 'confirmed' ? 'Onaylandı' :
          appointment.status === 'cancelled' ? 'İptal Edildi' : 'Tamamlandı'}
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #6c757d;">
            <p>Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.</p>
            <p>Güzellik Merkezi - Müşteri Yönetim Sistemi</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Güncelleme e-postası gönderildi:', info.messageId);
    return true;
  } catch (error) {
    console.error('E-posta gönderimi hatası:', error);
    return false;
  }
};

module.exports = {
  sendAppointmentConfirmation,
  sendAppointmentUpdate
}; 