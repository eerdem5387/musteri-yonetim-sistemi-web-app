'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
  FaConciergeBell,
  FaPlus,
  FaChartBar,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

interface DashboardStats {
  services: number;
  experts: number;
  customers: number;
  appointments: number;
  todayAppointments: number;
  confirmedAppointments: number;
  pendingAppointments: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats>({
    services: 0,
    experts: 0,
    customers: 0,
    appointments: 0,
    todayAppointments: 0,
    confirmedAppointments: 0,
    pendingAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://beauty-backend-nsbwbgcbgq-ew.a.run.app';

  const fetchStats = useCallback(async () => {
    try {
      const [servicesRes, expertsRes, customersRes, appointmentsRes] = await Promise.all([
        axios.get(`${API_URL}/api/services`),
        axios.get(`${API_URL}/api/experts`),
        axios.get(`${API_URL}/api/customers`),
        axios.get(`${API_URL}/api/appointments`)
      ]);

      const appointments = appointmentsRes.data;
      const today = new Date().toISOString().split('T')[0];

      // Bugünkü randevuları doğru şekilde filtrele
      const todayAppointments = appointments.filter((apt: { date: string }) => {
        const appointmentDate = new Date(apt.date).toISOString().split('T')[0];
        return appointmentDate === today;
      });

      const confirmedAppointments = appointments.filter((apt: { status: string }) =>
        apt.status === 'confirmed'
      ).length;

      const pendingAppointments = appointments.filter((apt: { status: string }) =>
        apt.status === 'pending'
      ).length;

      setStats({
        services: servicesRes.data.length,
        experts: expertsRes.data.length,
        customers: customersRes.data.length,
        appointments: appointments.length,
        todayAppointments: todayAppointments.length,
        confirmedAppointments,
        pendingAppointments
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Sayfa odaklandığında istatistikleri yenile
  useEffect(() => {
    const handleFocus = () => {
      fetchStats();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchStats]);

  // Her 30 saniyede bir otomatik güncelle
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Güzellik Merkezi Yönetim Sistemi
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Müşteri, hizmet, uzman ve randevu yönetimi
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/statistics" className="text-blue-600 hover:text-blue-800 transition-colors">
                <FaChartBar className="text-2xl" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/services" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaConciergeBell className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Toplam Hizmet</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.services}</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/experts" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaUserTie className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Toplam Uzman</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.experts}</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/customers" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaUsers className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Toplam Müşteri</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.customers}</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/appointments" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaCalendarAlt className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Toplam Randevu</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.appointments}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Appointment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/appointments?filter=today" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaClock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Bugünkü Randevular</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.todayAppointments}</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/appointments?filter=confirmed" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaCheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Onaylanmış</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.confirmedAppointments}</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/appointments?filter=pending" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaExclamationTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Bekleyen</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.pendingAppointments}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <FaPlus className="mr-2 text-blue-600" />
            Hızlı İşlemler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/services"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FaConciergeBell className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Hizmet Yönetimi</p>
                <p className="text-sm text-gray-500">Hizmet ekle, düzenle, sil</p>
              </div>
            </Link>

            <Link
              href="/experts"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FaUserTie className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Uzman Yönetimi</p>
                <p className="text-sm text-gray-500">Uzman ekle, düzenle, sil</p>
              </div>
            </Link>

            <Link
              href="/customers"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <FaUsers className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Müşteri Yönetimi</p>
                <p className="text-sm text-gray-500">Müşteri ekle, düzenle, sil</p>
              </div>
            </Link>

            <Link
              href="/appointments"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <FaCalendarAlt className="h-6 w-6 text-orange-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Randevu Yönetimi</p>
                <p className="text-sm text-gray-500">Randevu oluştur, düzenle</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
