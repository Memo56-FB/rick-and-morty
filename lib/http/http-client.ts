type QueryParamValue = string | number | boolean | null | undefined

type QueryParams = Record<string, QueryParamValue>

type HttpRequestConfig = Omit<RequestInit, 'method'> & {
  params?: QueryParams
}

type HttpRequestContext = {
  url: string
  init: RequestInit
}

type HttpInterceptor = {
  onRequest?: (
    context: HttpRequestContext
  ) => HttpRequestContext | Promise<HttpRequestContext>
  onResponse?: (
    response: Response,
    context: HttpRequestContext
  ) => Response | Promise<Response>
}

type CreateHttpClientOptions = {
  baseUrl: string
  defaultConfig?: HttpRequestConfig
  interceptors?: HttpInterceptor[]
}

type HttpClient = {
  get: <TResponse>(
    path: string,
    config?: HttpRequestConfig
  ) => Promise<TResponse>
}

const buildUrl = (baseUrl: string, path: string, params?: QueryParams) => {
  const url = new URL(path, baseUrl)

  if (!params) {
    return url.toString()
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return
    }

    url.searchParams.set(key, String(value))
  })

  return url.toString()
}

const mergeHeaders = (
  firstHeaders?: HeadersInit,
  secondHeaders?: HeadersInit
) => {
  const headers = new Headers(firstHeaders)
  const nextHeaders = new Headers(secondHeaders)

  nextHeaders.forEach((value, key) => {
    headers.set(key, value)
  })

  return headers
}

const executeRequest = async <TResponse>(
  path: string,
  config: HttpRequestConfig,
  options: CreateHttpClientOptions
) => {
  const { params, headers, ...requestInit } = config

  let context: HttpRequestContext = {
    url: buildUrl(options.baseUrl, path, params),
    init: {
      ...requestInit,
      method: 'GET',
      headers: mergeHeaders(options.defaultConfig?.headers, headers),
    },
  }

  for (const interceptor of options.interceptors ?? []) {
    if (!interceptor.onRequest) {
      continue
    }

    context = await interceptor.onRequest(context)
  }

  let response = await fetch(context.url, context.init)

  for (const interceptor of options.interceptors ?? []) {
    if (!interceptor.onResponse) {
      continue
    }

    response = await interceptor.onResponse(response, context)
  }

  return response.json() as Promise<TResponse>
}

export const createHttpClient = (
  options: CreateHttpClientOptions
): HttpClient => {
  return {
    get: <TResponse>(path: string, config: HttpRequestConfig = {}) => {
      const mergedConfig: HttpRequestConfig = {
        ...options.defaultConfig,
        ...config,
        headers: mergeHeaders(options.defaultConfig?.headers, config.headers),
      }

      return executeRequest<TResponse>(path, mergedConfig, options)
    },
  }
}

export type { HttpInterceptor, HttpRequestConfig, HttpRequestContext }
