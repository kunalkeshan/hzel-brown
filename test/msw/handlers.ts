import { http, HttpResponse } from 'msw'

// Mock data for testing
const mockMenuItems = [
  {
    _id: 'item-1',
    _type: 'menuItem',
    name: 'Chocolate Cake',
    slug: { current: 'chocolate-cake' },
    price: 500,
    description: 'Delicious chocolate cake',
    category: {
      _ref: 'category-1',
      name: 'Cakes',
      slug: { current: 'cakes' },
    },
    featured: true,
    available: true,
  },
  {
    _id: 'item-2',
    _type: 'menuItem',
    name: 'Vanilla Cupcake',
    slug: { current: 'vanilla-cupcake' },
    price: 150,
    description: 'Classic vanilla cupcake',
    category: {
      _ref: 'category-2',
      name: 'Cupcakes',
      slug: { current: 'cupcakes' },
    },
    featured: false,
    available: true,
  },
]

const mockCategories = [
  {
    _id: 'category-1',
    _type: 'menuCategory',
    name: 'Cakes',
    slug: { current: 'cakes' },
    description: 'Delicious cakes for all occasions',
  },
  {
    _id: 'category-2',
    _type: 'menuCategory',
    name: 'Cupcakes',
    slug: { current: 'cupcakes' },
    description: 'Individual sized treats',
  },
]

const mockSiteConfig = {
  _id: 'site-config',
  _type: 'siteConfig',
  title: 'Hzel Brown',
  description: 'Artisan bakery and cafe',
  contactEmail: 'hello@hzelbrown.com',
  contactPhone: '+91 1234567890',
}

// MSW Request Handlers
export const handlers = [
  // Mock Sanity CMS API - Query endpoint
  http.post('https://*.api.sanity.io/v*/data/query/*', async ({ request }) => {
    const body = await request.json()
    const query = (body as any).query

    // Match different GROQ queries
    if (query.includes('menuItem')) {
      return HttpResponse.json({
        ms: 50,
        query: query,
        result: mockMenuItems,
      })
    }

    if (query.includes('menuCategory')) {
      return HttpResponse.json({
        ms: 50,
        query: query,
        result: mockCategories,
      })
    }

    if (query.includes('siteConfig')) {
      return HttpResponse.json({
        ms: 50,
        query: query,
        result: mockSiteConfig,
      })
    }

    // Default empty response
    return HttpResponse.json({
      ms: 50,
      query: query,
      result: [],
    })
  }),

  // Mock Sanity CDN API - For cached queries
  http.get('https://*.apicdn.sanity.io/v*/data/query/*', () => {
    return HttpResponse.json({
      ms: 50,
      result: mockMenuItems,
    })
  }),

  // TODO: Add Firebase Auth mocking when implementing authentication
  // http.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword', () => {
  //   return HttpResponse.json({
  //     idToken: 'mock-id-token',
  //     email: 'test@example.com',
  //     refreshToken: 'mock-refresh-token',
  //     expiresIn: '3600',
  //     localId: 'mock-user-id',
  //   })
  // }),

  // TODO: Add payment provider mocking (Stripe/Razorpay) when implementing payments
  // http.post('https://api.stripe.com/v1/payment_intents', () => {
  //   return HttpResponse.json({
  //     id: 'pi_mock',
  //     client_secret: 'pi_mock_secret',
  //     status: 'succeeded',
  //   })
  // }),
]

// Export mock data for use in tests
export { mockMenuItems, mockCategories, mockSiteConfig }
