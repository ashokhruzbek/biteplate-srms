export function normalizePopularItem(popularItem) {
  const source = Array.isArray(popularItem)
    ? popularItem[0]
    : popularItem?.popularItem || popularItem

  if (!source || typeof source !== 'object') {
    return null
  }

  return {
    menuItemId:
      source.menuItemId ||
      source.itemId ||
      source.id ||
      source.menu_item_id ||
      source.menuItem?.id,
    name:
      source.name ||
      source.menuItemName ||
      source.menuItem?.name ||
      source.popularItem?.name,
    totalQuantity:
      source.totalQuantity ||
      source.quantity ||
      source.totalOrdered ||
      source.count ||
      source._sum?.quantity ||
      0,
  }
}
