import apiClient from '../api/apiClient'
import { getApiErrorMessage } from '../utils/apiError'

export async function getOrderHistory(filters = {}) {
  try {
    const response = await apiClient.get('/api/order-history', {
      params: {
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      },
    })

    return response.data?.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Buyurtmalar tarixini yuklab bo‘lmadi'), {
      cause: error,
    })
  }
}

export async function getOrderHistoryByTable(tableId) {
  try {
    const response = await apiClient.get(`/api/order-history/table/${tableId}`)
    return response.data?.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Stol bo‘yicha tarixni yuklab bo‘lmadi'), {
      cause: error,
    })
  }
}

export async function getPopularHistoryItem() {
  try {
    const response = await apiClient.get('/api/order-history/popular-item')
    return response.data?.data || null
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Mashhur taomni yuklab bo‘lmadi'), {
      cause: error,
    })
  }
}

export async function getIteratorHistoryRecords() {
  try {
    const response = await apiClient.get('/api/order-history/iterate')
    return response.data?.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Iterator natijalarini yuklab bo‘lmadi'), {
      cause: error,
    })
  }
}
