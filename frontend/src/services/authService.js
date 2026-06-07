import apiClient from '../api/client'
import { getApiErrorMessage } from '../utils/apiError'

export async function login(phoneNumber, password) {
  try {
    const response = await apiClient.post('/api/auth/login', {
      phoneNumber,
      password,
    })
    return response.data?.data
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, 'Telefon raqam yoki parol noto‘g‘ri'),
      { cause: error },
    )
  }
}
