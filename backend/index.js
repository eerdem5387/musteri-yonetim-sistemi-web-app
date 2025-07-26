const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const { sendAppointmentConfirmation, sendAppointmentUpdate } = require('./utils/emailService');
const { sendSMS } = require('./utils/smsService');

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

// Services endpoints
app.get('/api/services', async (req, res) => {
    try {
        const services = await prisma.service.findMany();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/services', async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const service = await prisma.service.create({
            data: {
                name,
                price: parseFloat(price),
                description
            }
        });
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Yeni: Hizmet güncelle
app.put('/api/services/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;
        const updated = await prisma.service.update({
            where: { id: parseInt(id) },
            data: {
                name,
                price: parseFloat(price),
                description
            }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Yeni: Hizmet sil
app.delete('/api/services/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Önce hizmetin randevuları var mı kontrol et
        const appointments = await prisma.appointment.findMany({
            where: { serviceId: parseInt(id) }
        });

        if (appointments.length > 0) {
            return res.status(400).json({
                error: 'Silmek istediğiniz hizmete ait oluşturulmuş bir randevu vardır.'
            });
        }

        await prisma.service.delete({ where: { id: parseInt(id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Experts endpoints
app.get('/api/experts', async (req, res) => {
    try {
        const experts = await prisma.expert.findMany();
        res.json(experts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/experts', async (req, res) => {
    try {
        const { name, specialty, workDays } = req.body;
        const expert = await prisma.expert.create({
            data: { name, specialty, workDays }
        });
        res.status(201).json(expert);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Yeni: Uzman güncelle
app.put('/api/experts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, specialty, workDays } = req.body;
        const updated = await prisma.expert.update({
            where: { id: parseInt(id) },
            data: { name, specialty, workDays }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Yeni: Uzman sil
app.delete('/api/experts/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Önce uzmanın randevuları var mı kontrol et
        const appointments = await prisma.appointment.findMany({
            where: { expertId: parseInt(id) }
        });

        if (appointments.length > 0) {
            return res.status(400).json({
                error: 'Silmek istediğiniz uzmana ait oluşturulmuş bir randevu vardır.'
            });
        }

        await prisma.expert.delete({ where: { id: parseInt(id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Customers endpoints
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/customers', async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        const customer = await prisma.customer.create({
            data: { name, phone, email }
        });
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Yeni: Müşteri güncelle
app.put('/api/customers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, email } = req.body;
        const updated = await prisma.customer.update({
            where: { id: parseInt(id) },
            data: { name, phone, email }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Yeni: Müşteri sil
app.delete('/api/customers/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Önce müşterinin randevuları var mı kontrol et
        const appointments = await prisma.appointment.findMany({
            where: { customerId: parseInt(id) }
        });

        if (appointments.length > 0) {
            return res.status(400).json({
                error: 'Silmek istediğiniz müşteriye ait oluşturulmuş bir randevu vardır.'
            });
        }

        await prisma.customer.delete({ where: { id: parseInt(id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Appointments endpoints
app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                customer: true,
                service: true,
                expert: true
            }
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Randevu oluşturma
app.post('/api/appointments', async (req, res) => {
    try {
        const { date, time, customerId, serviceId, expertId, status } = req.body;

        // Check for conflicts
        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                date: new Date(date),
                time,
                expertId: parseInt(expertId),
                status: 'confirmed'
            }
        });

        if (existingAppointment) {
            return res.status(409).json({
                error: 'Çakışma var! Bu tarih ve saatte uzman müsait değil.'
            });
        }

        const created = await prisma.appointment.create({
            data: {
                date: new Date(date),
                time,
                customerId: parseInt(customerId),
                serviceId: parseInt(serviceId),
                expertId: parseInt(expertId),
                status
            },
            include: { customer: true, service: true, expert: true }
        });

        // E-posta gönder
        if (created.customer.email) {
            await sendAppointmentConfirmation(created);
        }
        // SMS gönder
        if (created.customer.phone) {
            await sendSMS(
                created.customer.phone,
                `Sayın ${created.customer.name}, randevunuz ${new Date(created.date).toLocaleDateString('tr-TR')} ${created.time} tarihinde onaylandı. Güzellik Merkezi.`
            );
        }

        res.status(201).json(created);
    } catch (error) {
        console.error('Randevu oluşturma hatası:', error);
        res.status(500).json({ error: error.message });
    }
});

// Randevu güncelleme
app.put('/api/appointments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time, customerId, serviceId, expertId, status } = req.body;

        // Çakışma kontrolü (sadece confirmed durumundaki randevular için)
        if (status === 'confirmed') {
            const existingAppointment = await prisma.appointment.findFirst({
                where: {
                    id: { not: parseInt(id) },
                    date: new Date(date),
                    time,
                    expertId: parseInt(expertId),
                    status: 'confirmed'
                }
            });
            if (existingAppointment) {
                return res.status(409).json({ error: 'Çakışma var! Bu tarih ve saatte uzman müsait değil.' });
            }
        }

        const updated = await prisma.appointment.update({
            where: { id: parseInt(id) },
            data: {
                date: new Date(date),
                time,
                customerId: parseInt(customerId),
                serviceId: parseInt(serviceId),
                expertId: parseInt(expertId),
                status
            },
            include: { customer: true, service: true, expert: true }
        });

        // E-posta gönder
        if (updated.customer.email) {
            await sendAppointmentUpdate(updated);
        }
        // SMS gönder
        if (updated.customer.phone) {
            await sendSMS(
                updated.customer.phone,
                `Sayın ${updated.customer.name}, randevunuz güncellendi: ${new Date(updated.date).toLocaleDateString('tr-TR')} ${updated.time} (${status === 'completed' ? 'Tamamlandı' : status === 'cancelled' ? 'İptal Edildi' : 'Güncellendi'}). Güzellik Merkezi.`
            );
        }

        res.json(updated);
    } catch (error) {
        console.error('Randevu güncelleme hatası:', error);
        res.status(500).json({ error: error.message });
    }
});

// Yeni: Randevu sil
app.delete('/api/appointments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.appointment.delete({ where: { id: parseInt(id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dashboard istatistikleri endpoint'i
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const [services, experts, customers, appointments] = await Promise.all([
            prisma.service.findMany(),
            prisma.expert.findMany(),
            prisma.customer.findMany(),
            prisma.appointment.findMany({
                include: {
                    customer: true,
                    service: true,
                    expert: true
                }
            })
        ]);

        const today = new Date().toISOString().split('T')[0];

        // Bugünkü randevular
        const todayAppointments = appointments.filter(apt => {
            const appointmentDate = new Date(apt.date).toISOString().split('T')[0];
            return appointmentDate === today;
        });

        // Durum bazlı istatistikler
        const statusStats = {
            confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
            pending: appointments.filter(apt => apt.status === 'pending').length,
            completed: appointments.filter(apt => apt.status === 'completed').length,
            cancelled: appointments.filter(apt => apt.status === 'cancelled').length
        };

        // Aylık istatistikler (son 6 ay)
        const monthlyStats = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            const monthAppointments = appointments.filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate.getFullYear() === year && aptDate.getMonth() + 1 === month;
            });

            monthlyStats.push({
                month: `${year}-${month.toString().padStart(2, '0')}`,
                total: monthAppointments.length,
                completed: monthAppointments.filter(apt => apt.status === 'completed').length,
                cancelled: monthAppointments.filter(apt => apt.status === 'cancelled').length
            });
        }

        // En popüler hizmetler
        const serviceStats = await prisma.appointment.groupBy({
            by: ['serviceId'],
            _count: {
                id: true
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            },
            take: 5
        });

        const popularServices = await Promise.all(
            serviceStats.map(async (stat) => {
                const service = await prisma.service.findUnique({
                    where: { id: stat.serviceId }
                });
                return {
                    serviceName: service.name,
                    count: stat._count.id
                };
            })
        );

        // En aktif uzmanlar
        const expertStats = await prisma.appointment.groupBy({
            by: ['expertId'],
            _count: {
                id: true
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            },
            take: 5
        });

        const activeExperts = await Promise.all(
            expertStats.map(async (stat) => {
                const expert = await prisma.expert.findUnique({
                    where: { id: stat.expertId }
                });
                return {
                    expertName: expert.name,
                    count: stat._count.id
                };
            })
        );

        res.json({
            overview: {
                totalServices: services.length,
                totalExperts: experts.length,
                totalCustomers: customers.length,
                totalAppointments: appointments.length,
                todayAppointments: todayAppointments.length
            },
            statusStats,
            monthlyStats,
            popularServices,
            activeExperts
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 