import { ApiClient } from '@growthos/api-client'

export const apiClient = new ApiClient( import.meta.env['VITE_API_URL'] );
