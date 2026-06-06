import apiClient from '../api/apiClient'
import { getApiErrorMessage } from '../utils/apiError'

async function getDashboardResource(path, fallbackMessage) {
  try {
    const response = await apiClient.get(path)
    return response.data?.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, fallbackMessage), {
      cause: error,
    })
  }
}

export async function getDashboardData() {
  const [orders, staff, tables, menuItems, popularItem] =
    await Promise.allSettled([
      getDashboardResource('/api/orders', 'Buyurtmalarni yuklab bo‘lmadi'),
      getDashboardResource('/api/staff', 'Xodimlar maʼlumotini yuklab bo‘lmadi'),
      getDashboardResource('/api/tables', 'Stollar maʼlumotini yuklab bo‘lmadi'),
      getDashboardResource('/api/menu-items', 'Menyu maʼlumotini yuklab bo‘lmadi'),
      getDashboardResource(
        '/api/order-history/popular-item',
        'Mashhur taom maʼlumotini yuklab bo‘lmadi',
      ),
    ])

  const resources = {
    orders: [],
    staff: [],
    tables: [],
    menuItems: [],
    popularItem: null,
  }

  const errors = {
    orders: '',
    staff: '',
    tables: '',
    menuItems: '',
    popularItem: '',
  }

  const results = [orders, staff, tables, menuItems, popularItem]
  const keys = ['orders', 'staff', 'tables', 'menuItems', 'popularItem']

  results.forEach((result, index) => {
    const key = keys[index]

    if (result.status === 'fulfilled') {
      resources[key] = result.value
      return
    }

    errors[key] = result.reason?.message || 'Maʼlumot yuklanmadi'
  })

  return {
    resources,
    errors,
  }
}
