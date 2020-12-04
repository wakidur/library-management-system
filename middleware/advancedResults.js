const ErrorResponse = require('../utilities/error-response');
const { isMongoDBObjectID } = require('../service/utilityService');
const Message = require('../utilities/message');
const paginate = require('../utilities/paginate');

const advancedResults = (model, populate, findById) => async (
  req,
  res,
  next
) => {
  let query;
  /**
   * Build Query
   *
   * 1) Filtering
   * 2) Sort / Sorting
   * 3) Select Fields/ Field limiting
   * 4) Pagination
   * 5) populate
   */

  // 1A) Filtering

  // Copy req.query by using spread es6 future.
  const reqQuery = { ...req.query };
  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'fields'];
  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // 1B) Advanced Filtering

  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  // Create operators ($gt, $gte, $lt, $lte, $in, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // Finding resource
  query = model.find(JSON.parse(queryStr));

  // support Find By Id
  if (findById && Object.keys(req.params).length) {
    const isValidID = await isMongoDBObjectID(req.params[findById.paramsName]);
    if (!isValidID) {
      return next(new ErrorResponse('This is not Valid Mongodb Id', 400));
    }
    query = model.find({
      [findById.fieldName]: req.params[findById.paramsName],
    });
  }

  // 2) Sort / Sorting
  if (req.query.sort) {
    const sortedObj = {};
    const regex = /^[a-z:,]+$/;
    const sortBy = req.query.sort.split(',').join(' ');
    console.log(sortBy);
    const splitByComma = req.query.sort.split(',');
    splitByComma.forEach((item) => {
      const splitByColon = item.split(':');
      sortedObj[splitByColon[0]] = splitByColon[1];
    });
    query = query.sort(sortedObj);
  } else {
    query = query.sort('-createdAt');
  }

  // 3) Select Fields/ Field limiting

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // 4) Pagination
  /**
   * page=1&limit=10, 1-10, page 1,
   * 11-20, page 2,
   * 21-30, page 3,
   *
   */
  const currentPage = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (currentPage - 1) * limit;
  // const endIndex = currentPage * limit;
  const totalItems = await model.countDocuments();
  //
  query = query.skip(startIndex).limit(limit);

  // 5) populate
  if (populate && populate.length) {
    if (populate.length === 1) query = query.populate(populate[0]);
    else if (populate.length === 2)
      query = query.populate(populate[0]).populate(populate[1]);
    else if (populate.length === 3)
      query = query
        .populate(populate[0])
        .populate(populate[1])
        .populate(populate[3]);
  }

  // Executing query
  const results = await query;

  /**
   * https://jasonwatmore.com/post/2018/08/07/javascript-pure-pagination-logic-in-vanilla-js-typescript
   * JavaScript Paginate Function Usage
   * totalItems (required) - the total number of items to be paged
   * currentPage (optional) - the current active page, defaults to the first page
   * pageSize (optional) - the number of items per page, defaults to 10
   * maxPages (optional) - the maximum number of page navigation links to display, defaults to 10
   */
  const maxPages = parseInt(req.query.maxPages, 10) || 5; // pages array limit "pages": [ 1, 2, 3, 4, 5]
  const pagination = await paginate(totalItems, currentPage, limit, maxPages);
  // Response

  res.advancedResults = {
    pagination: pagination,
    results,
  };

  next();
};

module.exports = advancedResults;
