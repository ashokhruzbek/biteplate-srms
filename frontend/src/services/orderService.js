import apiClient from '../api/apiClient'
import { getApiErrorMessage } from '../utils/apiError'

export async function getAllOrders() {
  try {
    const response = await apiClient.get('/api/orders')
    return response.data?.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Buyurtmalarni yuklab bo‘lmadi'), {
      cause: error,
    })
  }
}

export async function createOrder(orderData) {
  try {
    const response = await apiClient.post('/api/orders', orderData)
    return response.data?.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Buyurtma yaratib bo‘lmadi'), {
      cause: error,
    })
  }
}

export async function prepareOrder(orderId) {
  try {
    const response = await apiClient.patch(`/api/orders/${orderId}/prepare`)
    return response.data?.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Buyurtmani tayyorlashga o‘tkazib bo‘lmadi'), {
      cause: error,
    })
  }
}

export async function cancelOrder(orderId) {
  try {
    const response = await apiClient.patch(`/api/orders/${orderId}/cancel`)
    return response.data?.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Buyurtmani bekor qilib bo‘lmadi'), {
      cause: error,
    })
  }
}

export async function undoLastKitchenAction() {
  try {
    const response = await apiClient.post('/api/orders/undo-last-action')
    return response.data?.data
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, 'Oxirgi oshxona amalini bekor qilib bo‘lmadi'),
      {
        cause: error,
      },
    )
  }
}

export async function generateOrderBill(orderId, billOptions) {
  try {
    const response = await apiClient.post(`/api/orders/${orderId}/bill`, billOptions)
    return response.data?.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Hisob-kitob yaratib bo‘lmadi'), {
      cause: error,
    })
  }
}

export const getOrders = getAllOrders
