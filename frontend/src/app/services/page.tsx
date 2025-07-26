'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  FaConciergeBell, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaLiraSign
} from 'react-icons/fa';

interface Service {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: ''
  });

  const API_URL = 'https://beauty-backend-nsbwbgcbgq-ew.a.run.app';

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingService) {
        await axios.put(`${API_URL}/api/services/${editingService.id}`, formData);
        toast.success('Hizmet başarıyla güncellendi!');
      } else {
        await axios.post(`${API_URL}/api/services`, formData);
        toast.success('Hizmet başarıyla eklendi!');
      }
      
      setFormData({ name: '', price: '', description: '' });
      setEditingService(null);
      fetchServices();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error(error.response.data.message || 'Bu hizmete ait randevular bulunduğu için silinemez.');
      } else {
        toast.error('Bir hata oluştu!');
      }
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      description: service.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/services/${id}`);
      toast.success('Hizmet başarıyla silindi!');
      fetchServices();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error(error.response.data.message || 'Bu hizmete ait randevular bulunduğu için silinemez.');
      } else {
        toast.error('Hizmet silinirken bir hata oluştu!');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', price: '', description: '' });
    setShowForm(false);
    setEditingService(null);
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
                  <FaConciergeBell className="mr-3 text-blue-600" />
                  Hizmet Yönetimi
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Güzellik merkezi hizmetlerini yönetin
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FaPlus className="mr-2" />
              Yeni Hizmet
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl text-black font-semibold mb-4 flex items-center">
              <FaConciergeBell className="mr-2 text-blue-600" />
              {editingService ? 'Hizmet Düzenle' : 'Yeni Hizmet Ekle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hizmet Adı
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaLiraSign className="inline mr-1" />
                    Fiyat (TL)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                >
                  <FaSave className="mr-2" />
                  {editingService ? 'Güncelle' : 'Hizmet Ekle'}
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

        {/* Services Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaConciergeBell className="mr-2 text-blue-600" />
              Hizmet Listesi ({services.length})
            </h3>
          </div>
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hizmet Adı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fiyat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Açıklama
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaConciergeBell className="h-5 w-5 text-blue-600 mr-3" />
                          <div className="text-sm font-medium text-gray-900">
                            {service.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FaLiraSign className="mr-1" />
                          {service.price}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {service.description || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
                            title="Düzenle"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
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