import apiClient from '../api/client'
import { getApiErrorMessage } from '../utils/apiError'

export async function getAllTables() {
  try {
    const response = await apiClient.get('/api/tables')
    return response.data?.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Stollar maʼlumotini yuklab bo‘lmadi'), {
      cause: error,
    })
  }
}

export async function createTable(tableData) {
  try {
    const response = await apiClient.post('/api/tables', tableData)
    return response.data?.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Stol yaratib bo‘lmadi'), {
      cause: error,
    })
  }
}

export async function updateTableStatus(tableId, status) {
  try {
    const response = await apiClient.patch(`/api/tables/${tableId}/status`, {
      status,
    })
    return response.data?.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Stol holatini o‘zgartirib bo‘lmadi'), {
      cause: error,
    })
  }
}

export const getTables = getAllTables
