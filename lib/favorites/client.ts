import {
  createHttpClient,
  type HttpInterceptor,
} from '@/lib/http/http-client'

const requestHeadersInterceptor: HttpInterceptor = {
  onRequest: (context) => {
    const headers = new Headers(context.init.headers)
    headers.set('Accept', 'application/json')

    if (!headers.has('Content-Type') && context.init.body) {
      headers.set('Content-Type', 'application/json')
    }

    return {
      ...context,
      init: {
        ...context.init,
        headers,
      },
    }
  },
}

const errorResponseInterceptor: HttpInterceptor = {
  onResponse: async (response, context) => {
    if (response.ok) {
      return response
    }

    let errorMessage = `Request failed with status ${response.status}`

    try {
      const errorPayload = await response.clone().json() as { message?: string }

      if (errorPayload.message) {
        errorMessage = errorPayload.message
      }
    } catch {
      const errorText = await response.clone().text()

      if (errorText) {
        errorMessage = errorText
      }
    }

    throw new Error(`${errorMessage} (${context.url})`)
  },
}

const jsonServerBaseUrl =
  process.env.NEXT_PUBLIC_JSON_SERVER_URL ?? 'http://localhost:3001/'

export const favoritesHttpClient = createHttpClient({
  baseUrl: jsonServerBaseUrl,
  defaultConfig: {
    cache: 'no-store',
  },
  interceptors: [requestHeadersInterceptor, errorResponseInterceptor],
})
