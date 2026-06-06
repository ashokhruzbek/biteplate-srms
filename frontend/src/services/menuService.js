import apiClient from '../api/client'
import { getApiErrorMessage } from '../utils/apiError'

export async function getAllMenuItems() {
  try {
    const response = await apiClient.get('/api/menu-items')
    return response.data?.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Menyu maʼlumotini yuklab bo‘lmadi'), {
      cause: error,
    })
  }
}

export async function createMenuItem(menuItemData) {
  try {
    const response = await apiClient.post('/api/menu-items', menuItemData)
    return response.data?.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Menyu mahsulotini yaratib bo‘lmadi'), {
      cause: error,
    })
  }
}

export async function customizeMenuItem(customizationData) {
  try {
    const response = await apiClient.post(
      '/api/menu-items/customize',
      customizationData,
    )
    return response.data?.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Taomni moslashtirib bo‘lmadi'), {
      cause: error,
    })
  }
}

export const getMenuItems = getAllMenuItems
