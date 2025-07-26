'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  FaUserTie, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaStar
} from 'react-icons/fa';

interface Expert {
  id: number;
  name: string;
  specialty: string;
  workDays: string[];
}

export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    workDays: [] as string[]
  });

  const workDayOptions = [
    'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'
  ];

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/experts`);
      setExperts(response.data);
    } catch (error) {
      console.error('Error fetching experts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkDayChange = (day: string) => {
    setFormData(prev => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter(d => d !== day)
        : [...prev.workDays, day]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingExpert) {
        await axios.put(`http://localhost:4000/api/experts/${editingExpert.id}`, formData);
        toast.success('Uzman başarıyla güncellendi!');
      } else {
        await axios.post('http://localhost:4000/api/experts', formData);
        toast.success('Uzman başarıyla eklendi!');
      }
      
      setFormData({ name: '', specialty: '', workDays: [] });
      setEditingExpert(null);
      fetchExperts();
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Bu uzmana ait randevular bulunduğu için silinemez.');
      } else {
        toast.error('Bir hata oluştu!');
      }
    }
  };

  const handleEdit = (expert: Expert) => {
    setEditingExpert(expert);
    setFormData({
      name: expert.name,
      specialty: expert.specialty,
      workDays: expert.workDays || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu uzmanı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:4000/api/experts/${id}`);
      toast.success('Uzman başarıyla silindi!');
      fetchExperts();
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Bu uzmana ait randevular bulunduğu için silinemez.');
      } else {
        toast.error('Uzman silinirken bir hata oluştu!');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', specialty: '', workDays: [] });
    setShowForm(false);
    setEditingExpert(null);
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
                  <FaUserTie className="mr-3 text-green-600" />
                  Uzman Yönetimi
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Güzellik merkezi uzmanlarını yönetin
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <FaPlus className="mr-2" />
              Yeni Uzman
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaUserTie className="mr-2 text-green-600" />
              {editingExpert ? 'Uzman Düzenle' : 'Yeni Uzman Ekle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaStar className="inline mr-1" />
                    Uzmanlık Alanı
                  </label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaCalendarAlt className="mr-1" />
                  Çalışma Günleri
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.workDays.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, workDays: [...formData.workDays, day]});
                          } else {
                            setFormData({...formData, workDays: formData.workDays.filter(d => d !== day)});
                          }
                        }}
                        className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                >
                  <FaSave className="mr-2" />
                  {editingExpert ? 'Güncelle' : 'Uzman Ekle'}
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

        {/* Experts Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaUserTie className="mr-2 text-green-600" />
              Uzman Listesi ({experts.length})
            </h3>
          </div>
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uzman
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uzmanlık
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Çalışma Günleri
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {experts.map((expert) => (
                    <tr key={expert.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUserTie className="h-5 w-5 text-green-600 mr-3" />
                          <div className="text-sm font-medium text-gray-900">
                            {expert.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FaStar className="mr-1 text-yellow-500" />
                          {expert.specialty}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {expert.workDays.map((day) => (
                            <span
                              key={day}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(expert)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
                            title="Düzenle"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(expert.id)}
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