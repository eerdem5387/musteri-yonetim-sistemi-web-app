'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { 
  FaArrowLeft,
  FaChartBar,
  FaCalendarAlt,
  FaConciergeBell,
  FaUserTie,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaTrophy,
  FaStar
} from 'react-icons/fa';

interface DashboardStats {
  overview: {
    totalServices: number;
    totalExperts: number;
    totalCustomers: number;
    totalAppointments: number;
    todayAppointments: number;
  };
  statusStats: {
    confirmed: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  monthlyStats: Array<{
    month: string;
    total: number;
    completed: number;
    cancelled: number;
  }>;
  popularServices: Array<{
    serviceName: string;
    count: number;
  }>;
  activeExperts: Array<{
    expertName: string;
    count: number;
  }>;
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">İstatistikler yüklenemedi</p>
        </div>
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
                  <FaChartBar className="mr-3 text-blue-600" />
                  Detaylı İstatistikler
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Güzellik merkezi performans analizi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Genel Bakış */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <FaConciergeBell className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Toplam Hizmet</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.overview.totalServices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <FaUserTie className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Toplam Uzman</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.overview.totalExperts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <FaUsers className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Toplam Müşteri</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.overview.totalCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <FaCalendarAlt className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Toplam Randevu</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.overview.totalAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
            <div className="flex items-center">
              <FaClock className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Bugünkü Randevu</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.overview.todayAppointments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Randevu Durumları */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <FaExclamationTriangle className="h-6 w-6 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Bekleyen</p>
                <p className="text-xl font-semibold text-gray-900">{stats.statusStats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <FaClock className="h-6 w-6 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Onaylanmış</p>
                <p className="text-xl font-semibold text-gray-900">{stats.statusStats.confirmed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <FaCheckCircle className="h-6 w-6 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tamamlanan</p>
                <p className="text-xl font-semibold text-gray-900">{stats.statusStats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <FaTimesCircle className="h-6 w-6 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">İptal Edilen</p>
                <p className="text-xl font-semibold text-gray-900">{stats.statusStats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* En Popüler Hizmetler */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaTrophy className="mr-2 text-yellow-600" />
              En Popüler Hizmetler
            </h3>
            <div className="space-y-3">
              {stats.popularServices.map((service, index) => (
                <div key={service.serviceName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">
                      {index + 1}.
                    </span>
                    <span className="text-sm text-gray-700">{service.serviceName}</span>
                  </div>
                  <div className="flex items-center">
                    <FaConciergeBell className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-sm font-semibold text-gray-900">{service.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* En Aktif Uzmanlar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaStar className="mr-2 text-yellow-600" />
              En Aktif Uzmanlar
            </h3>
            <div className="space-y-3">
              {stats.activeExperts.map((expert, index) => (
                <div key={expert.expertName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">
                      {index + 1}.
                    </span>
                    <span className="text-sm text-gray-700">{expert.expertName}</span>
                  </div>
                  <div className="flex items-center">
                    <FaUserTie className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm font-semibold text-gray-900">{expert.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Aylık İstatistikler */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FaChartBar className="mr-2 text-blue-600" />
            Aylık Randevu İstatistikleri (Son 6 Ay)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ay
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Toplam Randevu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamamlanan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İptal Edilen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başarı Oranı
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.monthlyStats.map((month) => {
                  const successRate = month.total > 0 ? ((month.completed / month.total) * 100).toFixed(1) : '0';
                  return (
                    <tr key={month.month} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {month.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {month.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaCheckCircle className="h-4 w-4 text-green-600 mr-1" />
                          {month.completed}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaTimesCircle className="h-4 w-4 text-red-600 mr-1" />
                          {month.cancelled}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          parseFloat(successRate) >= 80 ? 'bg-green-100 text-green-800' :
                          parseFloat(successRate) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          %{successRate}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 