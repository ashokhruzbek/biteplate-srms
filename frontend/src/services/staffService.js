import apiClient from '../api/client'
import { getApiErrorMessage } from '../utils/apiError'

export async function getAllStaff() {
  try {
    const response = await apiClient.get('/api/staff')
    return response.data?.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Xodimlar maʼlumotini yuklab bo‘lmadi'), {
      cause: error,
    })
  }
}

export async function createStaff(staffData) {
  try {
    const response = await apiClient.post('/api/staff', staffData)
    return response.data?.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Xodim yaratib bo‘lmadi'), {
      cause: error,
    })
  }
}

export const getStaff = getAllStaff
