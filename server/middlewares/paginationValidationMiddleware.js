export const paginationMiddleware = (req, res, next) => {
  let page = parseInt(req.query.page || req.query.pageNumber || 10);
  let pageSize = parseInt(req.query.pageSize, 10);

  // defaults
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(pageSize) || pageSize < 1) pageSize = 10;

  // max limit
  if (pageSize > 50) pageSize = 50;

  req.pagination = {
    page,
    pageSize,
    offset: (page - 1) * pageSize
  };
  next();
};
