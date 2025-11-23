import { describe, it, expect } from 'vitest'
import { cn, assertValue, sortMenuItemsByFeatured, sortMenuItemsByCategoryFeatured } from './utils'

describe('cn (className merger)', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('should handle Tailwind class conflicts', () => {
    // tailwind-merge should keep the last conflicting class
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('should handle array of classes', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('should handle object with boolean values', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })

  it('should return empty string for no inputs', () => {
    expect(cn()).toBe('')
  })
})

describe('assertValue', () => {
  it('should return value if defined', () => {
    expect(assertValue('test', 'Error message')).toBe('test')
    expect(assertValue(123, 'Error message')).toBe(123)
    expect(assertValue(false, 'Error message')).toBe(false)
    expect(assertValue(null, 'Error message')).toBe(null)
  })

  it('should throw error if value is undefined', () => {
    expect(() => assertValue(undefined, 'Value is required'))
      .toThrowError('Value is required')
  })

  it('should preserve type of value', () => {
    const value: string = assertValue('test', 'Error')
    expect(typeof value).toBe('string')

    const numberValue: number = assertValue(42, 'Error')
    expect(typeof numberValue).toBe('number')
  })
})

describe('sortMenuItemsByFeatured', () => {
  const mockItems = [
    { _id: '1', name: 'Zebra Cake' },
    { _id: '2', name: 'Apple Pie' },
    { _id: '3', name: 'Chocolate Cake' },
    { _id: '4', name: 'Banana Bread' },
    { _id: '5', name: 'Donut' },
  ]

  it('should sort featured items first in specified order', () => {
    const featuredIds = ['3', '1', '5']
    const result = sortMenuItemsByFeatured(mockItems, featuredIds)

    expect(result[0]._id).toBe('3') // Chocolate Cake
    expect(result[1]._id).toBe('1') // Zebra Cake
    expect(result[2]._id).toBe('5') // Donut
  })

  it('should sort non-featured items alphabetically after featured', () => {
    const featuredIds = ['3', '1']
    const result = sortMenuItemsByFeatured(mockItems, featuredIds)

    // Featured items first
    expect(result[0]._id).toBe('3') // Chocolate Cake
    expect(result[1]._id).toBe('1') // Zebra Cake

    // Non-featured alphabetically
    expect(result[2].name).toBe('Apple Pie')
    expect(result[3].name).toBe('Banana Bread')
    expect(result[4].name).toBe('Donut')
  })

  it('should handle empty featured items list', () => {
    const result = sortMenuItemsByFeatured(mockItems, [])

    // All items should be sorted alphabetically
    expect(result[0].name).toBe('Apple Pie')
    expect(result[1].name).toBe('Banana Bread')
    expect(result[2].name).toBe('Chocolate Cake')
    expect(result[3].name).toBe('Donut')
    expect(result[4].name).toBe('Zebra Cake')
  })

  it('should handle items without names', () => {
    const itemsWithoutNames = [
      { _id: '1', name: null },
      { _id: '2', name: 'Zebra' },
      { _id: '3', name: undefined },
      { _id: '4', name: 'Apple' },
    ]

    const result = sortMenuItemsByFeatured(itemsWithoutNames, [])

    // Items without names should come first when sorted alphabetically (empty string)
    expect(result[0]._id).toBe('1') // null name
    expect(result[1]._id).toBe('3') // undefined name
    expect(result[2].name).toBe('Apple')
    expect(result[3].name).toBe('Zebra')
  })

  it('should handle empty items array', () => {
    const result = sortMenuItemsByFeatured([], ['1', '2'])
    expect(result).toEqual([])
  })

  it('should handle featured IDs not in items list', () => {
    const featuredIds = ['99', '100', '3']
    const result = sortMenuItemsByFeatured(mockItems, featuredIds)

    // Only '3' exists, should be featured first
    expect(result[0]._id).toBe('3')
    // Rest should be alphabetical
    expect(result[1].name).toBe('Apple Pie')
  })

  it('should be case-insensitive when sorting alphabetically', () => {
    const items = [
      { _id: '1', name: 'zebra' },
      { _id: '2', name: 'Apple' },
      { _id: '3', name: 'Banana' },
    ]

    const result = sortMenuItemsByFeatured(items, [])

    expect(result[0].name).toBe('Apple')
    expect(result[1].name).toBe('Banana')
    expect(result[2].name).toBe('zebra')
  })
})

describe('sortMenuItemsByCategoryFeatured', () => {
  const mockItems = [
    { _id: '1', name: 'Zebra Cake' },
    { _id: '2', name: 'Apple Pie' },
    { _id: '3', name: 'Chocolate Cake' },
    { _id: '4', name: 'Banana Bread' },
    { _id: '5', name: 'Donut' },
    { _id: '6', name: 'Eclair' },
  ]

  it('should prioritize global featured, then category featured, then alphabetical', () => {
    const globalFeatured = ['3', '1'] // Chocolate Cake, Zebra Cake
    const categoryFeatured = ['5', '4'] // Donut, Banana Bread

    const result = sortMenuItemsByCategoryFeatured(
      mockItems,
      globalFeatured,
      categoryFeatured
    )

    // Global featured first
    expect(result[0]._id).toBe('3') // Chocolate Cake
    expect(result[1]._id).toBe('1') // Zebra Cake

    // Category featured second
    expect(result[2]._id).toBe('5') // Donut
    expect(result[3]._id).toBe('4') // Banana Bread

    // Alphabetical last
    expect(result[4].name).toBe('Apple Pie')
    expect(result[5].name).toBe('Eclair')
  })

  it('should handle overlapping global and category featured (global wins)', () => {
    const globalFeatured = ['3', '1']
    const categoryFeatured = ['3', '5'] // '3' is also in global

    const result = sortMenuItemsByCategoryFeatured(
      mockItems,
      globalFeatured,
      categoryFeatured
    )

    // '3' should appear in global featured position, not category
    expect(result[0]._id).toBe('3') // In global position
    expect(result[1]._id).toBe('1')
    expect(result[2]._id).toBe('5') // Only category featured item
  })

  it('should handle empty global featured list', () => {
    const globalFeatured: string[] = []
    const categoryFeatured = ['3', '1']

    const result = sortMenuItemsByCategoryFeatured(
      mockItems,
      globalFeatured,
      categoryFeatured
    )

    // Category featured first
    expect(result[0]._id).toBe('3')
    expect(result[1]._id).toBe('1')

    // Alphabetical after
    expect(result[2].name).toBe('Apple Pie')
  })

  it('should handle empty category featured list', () => {
    const globalFeatured = ['3', '1']
    const categoryFeatured: string[] = []

    const result = sortMenuItemsByCategoryFeatured(
      mockItems,
      globalFeatured,
      categoryFeatured
    )

    // Global featured first
    expect(result[0]._id).toBe('3')
    expect(result[1]._id).toBe('1')

    // Alphabetical after (no category featured)
    expect(result[2].name).toBe('Apple Pie')
  })

  it('should handle both empty featured lists', () => {
    const result = sortMenuItemsByCategoryFeatured(mockItems, [], [])

    // All alphabetical
    expect(result[0].name).toBe('Apple Pie')
    expect(result[1].name).toBe('Banana Bread')
    expect(result[2].name).toBe('Chocolate Cake')
  })

  it('should maintain order within each priority level', () => {
    const globalFeatured = ['5', '3', '1']
    const categoryFeatured = ['6', '4']

    const result = sortMenuItemsByCategoryFeatured(
      mockItems,
      globalFeatured,
      categoryFeatured
    )

    // Global featured in specified order
    expect(result[0]._id).toBe('5')
    expect(result[1]._id).toBe('3')
    expect(result[2]._id).toBe('1')

    // Category featured in specified order
    expect(result[3]._id).toBe('6')
    expect(result[4]._id).toBe('4')
  })

  it('should handle empty items array', () => {
    const result = sortMenuItemsByCategoryFeatured([], ['1'], ['2'])
    expect(result).toEqual([])
  })
})
