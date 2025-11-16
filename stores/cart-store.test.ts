import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCartStore } from './cart-store'
import type { MenuItem } from '@/types/cart'

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
})

// Mock menu items for testing
const mockMenuItem: MenuItem = {
  _id: 'item-1',
  _type: 'menuItem',
  name: 'Chocolate Cake',
  slug: { current: 'chocolate-cake', _type: 'slug' },
  price: 500,
  description: 'Delicious chocolate cake',
  isAvailable: true,
  featured: false,
  isCombo: false,
} as MenuItem

const mockUnavailableItem: MenuItem = {
  _id: 'item-2',
  _type: 'menuItem',
  name: 'Unavailable Item',
  slug: { current: 'unavailable', _type: 'slug' },
  price: 100,
  description: 'This item is not available',
  isAvailable: false,
  featured: false,
  isCombo: false,
} as MenuItem

const mockItemWithoutPrice: MenuItem = {
  _id: 'item-3',
  _type: 'menuItem',
  name: 'No Price Item',
  slug: { current: 'no-price', _type: 'slug' },
  price: 0,
  description: 'Item without valid price',
  isAvailable: true,
  featured: false,
  isCombo: false,
} as MenuItem

describe('useCartStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { clearCart } = useCartStore.getState()
    clearCart()
    sessionStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('addItem', () => {
    it('should add a new item to the cart', () => {
      const { addItem } = useCartStore.getState()
      const result = addItem(mockMenuItem)

      expect(result).toBe(true)
      const items = useCartStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0]).toMatchObject({
        _id: mockMenuItem._id,
        name: mockMenuItem.name,
        quantity: 1,
      })
      expect(items[0].addedAt).toBeDefined()
    })

    it('should increment quantity if item already exists', () => {
      const { addItem } = useCartStore.getState()

      // Add item first time
      addItem(mockMenuItem)
      let items = useCartStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(1)

      // Add same item again
      addItem(mockMenuItem)
      items = useCartStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(2)
    })

    it('should not add unavailable items', () => {
      const { addItem } = useCartStore.getState()
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = addItem(mockUnavailableItem)

      expect(result).toBe(false)
      const items = useCartStore.getState().items
      expect(items).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Cannot add unavailable item')
      )

      consoleSpy.mockRestore()
    })

    it('should not add items without valid price', () => {
      const { addItem } = useCartStore.getState()

      const result = addItem(mockItemWithoutPrice)

      expect(result).toBe(false)
      const items = useCartStore.getState().items
      expect(items).toHaveLength(0)
    })
  })

  describe('incrementQuantity', () => {
    it('should increment item quantity', () => {
      const { addItem, incrementQuantity, items } = useCartStore.getState()

      addItem(mockMenuItem)
      const result = incrementQuantity(mockMenuItem._id)

      expect(result).toBe(true)
      const updatedItems = useCartStore.getState().items
      expect(updatedItems[0].quantity).toBe(2)
    })

    it('should return false if item not found', () => {
      const { incrementQuantity } = useCartStore.getState()
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = incrementQuantity('non-existent-id')

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('not found in cart')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('decrementQuantity', () => {
    it('should decrement item quantity', () => {
      const { addItem, incrementQuantity, decrementQuantity } =
        useCartStore.getState()

      addItem(mockMenuItem)
      incrementQuantity(mockMenuItem._id)
      // Now quantity is 2

      const result = decrementQuantity(mockMenuItem._id)

      expect(result).toBe(true)
      const items = useCartStore.getState().items
      expect(items[0].quantity).toBe(1)
    })

    it('should remove item if quantity would become 0', () => {
      const { addItem, decrementQuantity, items } = useCartStore.getState()

      addItem(mockMenuItem)
      // Quantity is 1

      decrementQuantity(mockMenuItem._id)

      const updatedItems = useCartStore.getState().items
      expect(updatedItems).toHaveLength(0)
    })

    it('should return false if item not found', () => {
      const { decrementQuantity } = useCartStore.getState()
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = decrementQuantity('non-existent-id')

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const { addItem, removeItem } = useCartStore.getState()

      addItem(mockMenuItem)
      expect(useCartStore.getState().items).toHaveLength(1)

      removeItem(mockMenuItem._id)
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it('should not error if removing non-existent item', () => {
      const { removeItem } = useCartStore.getState()

      expect(() => removeItem('non-existent-id')).not.toThrow()
    })
  })

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      const { addItem, clearCart } = useCartStore.getState()

      addItem(mockMenuItem)
      addItem({ ...mockMenuItem, _id: 'item-4' } as MenuItem)

      expect(useCartStore.getState().items).toHaveLength(2)

      clearCart()
      expect(useCartStore.getState().items).toHaveLength(0)
    })
  })

  describe('getItemQuantity', () => {
    it('should return correct quantity for existing item', () => {
      const { addItem, getItemQuantity, incrementQuantity } =
        useCartStore.getState()

      addItem(mockMenuItem)
      incrementQuantity(mockMenuItem._id)

      expect(getItemQuantity(mockMenuItem._id)).toBe(2)
    })

    it('should return 0 for non-existent item', () => {
      const { getItemQuantity } = useCartStore.getState()

      expect(getItemQuantity('non-existent-id')).toBe(0)
    })
  })

  describe('getTotalItems', () => {
    it('should return total quantity of all items', () => {
      const { addItem, getTotalItems } = useCartStore.getState()

      addItem(mockMenuItem)
      addItem({ ...mockMenuItem, _id: 'item-4' } as MenuItem)
      addItem(mockMenuItem) // Increments first item

      expect(getTotalItems()).toBe(3) // 2 + 1
    })

    it('should return 0 for empty cart', () => {
      const { getTotalItems } = useCartStore.getState()

      expect(getTotalItems()).toBe(0)
    })
  })

  describe('getTotalCost', () => {
    it('should calculate total cost correctly', () => {
      const { addItem, getTotalCost } = useCartStore.getState()

      const item1 = { ...mockMenuItem, price: 500 } as MenuItem
      const item2 = { ...mockMenuItem, _id: 'item-5', price: 300 } as MenuItem

      addItem(item1)
      addItem(item1) // Quantity becomes 2
      addItem(item2)

      // (500 * 2) + (300 * 1) = 1300
      expect(getTotalCost()).toBe(1300)
    })

    it('should return 0 for empty cart', () => {
      const { getTotalCost } = useCartStore.getState()

      expect(getTotalCost()).toBe(0)
    })
  })

  describe('isItemAvailable', () => {
    it('should return true for available item with valid price', () => {
      const { isItemAvailable } = useCartStore.getState()

      expect(isItemAvailable(mockMenuItem)).toBe(true)
    })

    it('should return false for unavailable item', () => {
      const { isItemAvailable } = useCartStore.getState()

      expect(isItemAvailable(mockUnavailableItem)).toBe(false)
    })

    it('should return false for item without valid price', () => {
      const { isItemAvailable } = useCartStore.getState()

      expect(isItemAvailable(mockItemWithoutPrice)).toBe(false)
    })

    it('should return false for item with negative price', () => {
      const { isItemAvailable } = useCartStore.getState()
      const itemWithNegativePrice = {
        ...mockMenuItem,
        price: -100,
      } as MenuItem

      expect(isItemAvailable(itemWithNegativePrice)).toBe(false)
    })
  })

  describe('validateAndCheckout', () => {
    it('should validate cart with all available items', () => {
      const { addItem, validateAndCheckout } = useCartStore.getState()
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const item1 = { ...mockMenuItem, price: 500 } as MenuItem
      const item2 = { ...mockMenuItem, _id: 'item-6', price: 300 } as MenuItem

      addItem(item1)
      addItem(item2)

      const result = validateAndCheckout()

      expect(result.isValid).toBe(true)
      expect(result.validItems).toHaveLength(2)
      expect(result.unavailableItems).toHaveLength(0)
      expect(result.totalCost).toBe(800)
      expect(result.totalItems).toBe(2)

      consoleSpy.mockRestore()
    })

    it('should identify unavailable items', () => {
      const { addItem, validateAndCheckout } = useCartStore.getState()
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Manually add unavailable item (bypassing addItem validation)
      useCartStore.setState({
        items: [
          {
            ...mockMenuItem,
            quantity: 1,
            addedAt: new Date().toISOString(),
          },
          {
            ...mockUnavailableItem,
            quantity: 1,
            addedAt: new Date().toISOString(),
          },
        ],
      })

      const result = validateAndCheckout()

      expect(result.isValid).toBe(false)
      expect(result.validItems).toHaveLength(1)
      expect(result.unavailableItems).toHaveLength(1)
      expect(result.unavailableItems[0]._id).toBe(mockUnavailableItem._id)

      consoleSpy.mockRestore()
    })

    it('should return invalid for empty cart', () => {
      const { validateAndCheckout } = useCartStore.getState()
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const result = validateAndCheckout()

      expect(result.isValid).toBe(false)
      expect(result.validItems).toHaveLength(0)
      expect(result.totalCost).toBe(0)
      expect(result.totalItems).toBe(0)

      consoleSpy.mockRestore()
    })
  })

  describe('persistence', () => {
    it('should persist cart to sessionStorage', () => {
      const { addItem } = useCartStore.getState()

      addItem(mockMenuItem)

      const stored = sessionStorageMock.getItem('hzel-brown-cart')
      expect(stored).toBeDefined()

      const parsedStore = JSON.parse(stored!)
      expect(parsedStore.state.items).toHaveLength(1)
      expect(parsedStore.state.items[0]._id).toBe(mockMenuItem._id)
    })
  })
})
