import {
  createHttpClient,
  type HttpInterceptor,
} from '@/lib/http/http-client'

const requestHeadersInterceptor: HttpInterceptor = {
  onRequest: (context) => {
    const headers = new Headers(context.init.headers)
    headers.set('Accept', 'application/json')

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
      const errorPayload = await response.clone().json() as { error?: string }

      if (errorPayload.error) {
        errorMessage = errorPayload.error
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

export const rickAndMortyHttpClient = createHttpClient({
  baseUrl: 'https://rickandmortyapi.com/api/',
  defaultConfig: {
    cache: 'no-store',
  },
  interceptors: [requestHeadersInterceptor, errorResponseInterceptor],
})
