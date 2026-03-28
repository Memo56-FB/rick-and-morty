import { createHttpClient } from '@/lib/http/http-client'

describe('createHttpClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('builds a GET request with query params and merged headers', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const client = createHttpClient({
      baseUrl: 'https://example.com/api/',
      defaultConfig: {
        headers: {
          Accept: 'application/json',
        },
      },
    })

    await client.get('characters', {
      params: {
        page: 2,
        name: 'rick',
        empty: '',
      },
      headers: {
        Authorization: 'Bearer token',
      },
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/api/characters?page=2&name=rick',
      expect.objectContaining({
        method: 'GET',
        headers: expect.any(Headers),
      })
    )

    const [, init] = fetchMock.mock.calls[0]
    const headers = init?.headers as Headers

    expect(headers.get('Accept')).toBe('application/json')
    expect(headers.get('Authorization')).toBe('Bearer token')
  })

  it('sends POST requests with stringified body', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: '1' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const client = createHttpClient({
      baseUrl: 'https://example.com/',
    })

    await client.post('favorites', {
      characterId: 1,
      name: 'Rick Sanchez',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/favorites',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          characterId: 1,
          name: 'Rick Sanchez',
        }),
      })
    )
  })

  it('returns undefined for 204 responses', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(null, { status: 204 })
    )

    const client = createHttpClient({
      baseUrl: 'https://example.com/',
    })

    await expect(client.delete('favorites/1')).resolves.toBeUndefined()
  })

  it('runs interceptors in request/response flow', async () => {
    const onRequest = vi.fn((context) => ({
      ...context,
      init: {
        ...context.init,
        headers: new Headers({
          'X-Test': 'true',
        }),
      },
    }))
    const onResponse = vi.fn((response: Response) => response)

    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const client = createHttpClient({
      baseUrl: 'https://example.com/',
      interceptors: [{ onRequest, onResponse }],
    })

    await client.get('favorites')

    expect(onRequest).toHaveBeenCalled()
    expect(onResponse).toHaveBeenCalled()
  })
})
