/**
 * Middleware to sort and filter categories.
 * Sets default sort order and filter values.
 * Overrides defaults with query string values if provided.
 */
module.exports = {
  sortAndFilterCategories: (req, res, next) => {
    // Set default values
    const defaultSort = { sortOrder: 1 }
    const defaultFilter = { isActive: true, parent: null }

    // Use requested values if provided, else use defaults
    req.sort = {
      sortOrder: req.query.sortOrder
        ? parseInt(req.query.sortOrder)
        : defaultSort.sortOrder,
    }

    req.filter = {
      isActive: req.query.isActive
        ? req.query.isActive === 'true'
        : defaultFilter.isActive,
      parent: req.query.parent ? req.query.parent : defaultFilter.parent,
    }

    next()
  },
}
