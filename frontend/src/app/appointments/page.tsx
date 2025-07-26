'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  FaCalendarAlt, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaClock,
  FaUser,
  FaConciergeBell,
  FaUserTie,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaEye
} from 'react-icons/fa';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
  description?: string;
}

interface Expert {
  id: number;
  name: string;
  specialty: string;
  workDays?: string[];
}

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: string;
  customerId: number;
  serviceId: number;
  expertId: number;
  customer: Customer;
  service: Service;
  expert: Expert;
}

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    customerId: '',
    serviceId: '',
    expertId: '',
    status: 'pending',
  });

  const API_URL = 'https://api.guzellikmerkezi.xyz';

  const fetchData = useCallback(async () => {
    try {
      const [appointmentsRes, customersRes, servicesRes, expertsRes] = await Promise.all([
        axios.get(`${API_URL}/api/appointments`),
        axios.get(`${API_URL}/api/customers`),
        axios.get(`${API_URL}/api/services`),
        axios.get(`${API_URL}/api/experts`)
      ]);

      let filteredAppointments = appointmentsRes.data;

      // Filtreleme
      if (filter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filteredAppointments = appointmentsRes.data.filter((apt: Appointment) => {
          const appointmentDate = new Date(apt.date).toISOString().split('T')[0];
          return appointmentDate === today;
        });
      } else if (filter === 'confirmed') {
        filteredAppointments = appointmentsRes.data.filter((apt: Appointment) => apt.status === 'confirmed');
      } else if (filter === 'pending') {
        filteredAppointments = appointmentsRes.data.filter((apt: Appointment) => apt.status === 'pending');
      }

      setAppointments(filteredAppointments);
      setCustomers(customersRes.data);
      setServices(servicesRes.data);
      setExperts(expertsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAppointment) {
        await axios.put(`${API_URL}/api/appointments/${editingAppointment.id}`, formData);
        toast.success('Randevu başarıyla güncellendi!');
      } else {
        await axios.post(`${API_URL}/api/appointments`, formData);
        toast.success('Randevu başarıyla oluşturuldu!');
      }
      
      setFormData({ date: '', time: '', customerId: '', serviceId: '', expertId: '', status: 'pending' });
      setEditingAppointment(null);
      fetchData();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error('Çakışma var! Bu tarih ve saatte uzman müsait değil.');
      } else {
        toast.error('Bir hata oluştu!');
      }
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      date: appointment.date,
      time: appointment.time,
      customerId: appointment.customerId.toString(),
      serviceId: appointment.serviceId.toString(),
      expertId: appointment.expertId.toString(),
      status: appointment.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/appointments/${id}`);
      toast.success('Randevu başarıyla silindi!');
      fetchData();
    } catch {
      toast.error('Randevu silinirken bir hata oluştu!');
    }
  };

  const handleCancel = () => {
    setFormData({ date: '', time: '', customerId: '', serviceId: '', expertId: '', status: 'pending' });
    setShowForm(false);
    setEditingAppointment(null);
  };

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (!appointment) return;

      await axios.put(`${API_URL}/api/appointments/${appointmentId}`, {
        date: appointment.date,
        time: appointment.time,
        customerId: appointment.customerId,
        serviceId: appointment.serviceId,
        expertId: appointment.expertId,
        status: newStatus
      });

      toast.success(`Randevu durumu ${getStatusText(newStatus)} olarak güncellendi!`);
      fetchData();
    } catch {
      toast.error('Durum güncellenirken bir hata oluştu!');
    }
  };

  const getStatusChangeButtons = (appointment: Appointment) => {
    if (appointment.status === 'pending') {
      return (
        <div className="flex space-x-1">
          <button
            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
            title="Onayla"
          >
            <FaCheckCircle className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
            title="İptal Et"
          >
            <FaTimesCircle className="h-4 w-4" />
          </button>
        </div>
      );
    }
    if (appointment.status === 'confirmed') {
      return (
        <div className="flex space-x-1">
          <button
            onClick={() => handleStatusChange(appointment.id, 'completed')}
            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
            title="Tamamlandı olarak işaretle"
          >
            <FaCheckCircle className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
            title="İptal edildi olarak işaretle"
          >
            <FaTimesCircle className="h-4 w-4" />
          </button>
        </div>
      );
    }
    return null;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <FaCheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <FaExclamationTriangle className="h-4 w-4 text-yellow-600" />;
      case 'completed':
        return <FaCheckCircle className="h-4 w-4 text-blue-600" />;
      case 'cancelled':
        return <FaTimesCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FaClock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Onaylandı';
      case 'pending':
        return 'Bekliyor';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPageTitle = () => {
    switch (filter) {
      case 'today':
        return 'Bugünkü Randevular';
      case 'confirmed':
        return 'Onaylanmış Randevular';
      case 'pending':
        return 'Bekleyen Randevular';
      default:
        return 'Randevu Yönetimi';
    }
  };

  const getPageDescription = () => {
    switch (filter) {
      case 'today':
        return 'Bugün için planlanan randevular';
      case 'confirmed':
        return 'Onaylanmış randevular';
      case 'pending':
        return 'Onay bekleyen randevular';
      default:
        return 'Güzellik merkezi randevularını yönetin';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="mr-4 text-gray-400 hover:text-gray-600">
                <FaArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaCalendarAlt className="mr-3 text-orange-600" />
                  {getPageTitle()}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {getPageDescription()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {filter && (
                <Link
                  href="/appointments"
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
                >
                  <FaEye className="mr-2" />
                  Tüm Randevular
                </Link>
              )}
              <button
                onClick={() => setShowForm(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
              >
                <FaPlus className="mr-2" />
                Yeni Randevu
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl text-black font-semibold mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-orange-600" />
              {editingAppointment ? 'Randevu Düzenle' : 'Yeni Randevu Oluştur'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaCalendarAlt className="inline mr-1" />
                    Tarih
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaClock className="inline mr-1" />
                    Saat
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durum
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="confirmed">Onaylandı</option>
                    <option value="pending">Bekliyor</option>
                    <option value="completed">Tamamlandı</option>
                    <option value="cancelled">İptal Edildi</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaUser className="inline mr-1" />
                    Müşteri
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Müşteri Seçin</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaConciergeBell className="inline mr-1" />
                    Hizmet
                  </label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Hizmet Seçin</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {service.price} TL
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaUserTie className="inline mr-1" />
                    Uzman
                  </label>
                  <select
                    value={formData.expertId}
                    onChange={(e) => setFormData({...formData, expertId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Uzman Seçin</option>
                    {experts.map((expert) => (
                      <option key={expert.id} value={expert.id}>
                        {expert.name} - {expert.specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 flex items-center"
                >
                  <FaSave className="mr-2" />
                  {editingAppointment ? 'Güncelle' : 'Randevu Oluştur'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center"
                >
                  <FaTimes className="mr-2" />
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Appointments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaCalendarAlt className="mr-2 text-orange-600" />
              Randevu Listesi ({appointments.length})
            </h3>
          </div>
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih & Saat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Müşteri
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hizmet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uzman
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <FaCalendarAlt className="h-4 w-4 text-orange-600 mr-2" />
                            {new Date(appointment.date).toLocaleDateString('tr-TR')}
                          </div>
                          <div className="flex items-center mt-1">
                            <FaClock className="h-4 w-4 text-gray-500 mr-2" />
                            {appointment.time}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <FaUser className="h-4 w-4 text-purple-600 mr-2" />
                            {appointment.customer.name}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {appointment.customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <FaConciergeBell className="h-4 w-4 text-blue-600 mr-2" />
                            {appointment.service.name}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {appointment.service.price} TL
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <FaUserTie className="h-4 w-4 text-green-600 mr-2" />
                            {appointment.expert.name}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {appointment.expert.specialty}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1">{getStatusText(appointment.status)}</span>
                          </span>
                          {getStatusChangeButtons(appointment)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(appointment)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
                            title="Düzenle"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(appointment.id)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50"
                            title="Sil"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    }>
      <AppointmentsContent />
    </Suspense>
  );
} 