const handleErr = require("./handeErrors");

const parseParams = (params) => {
  let searchQuery,
    limit,
    skip,
    cb,
    findAll = false;

  if (params.limit) limit = 1;
  if (typeof params.cb === "function") cb = params.cb;
  else if (typeof params.options === "function" && !cb) cb = params.options;
  else if (typeof params.query === "function" && !params.cb && !params.options)
    cb = params.query;

  if (typeof params.query === "object") {
    if (params.query._limit !== undefined || params.query._skip !== undefined) {
      if (!limit) limit = params.query._limit;
      skip = params.query._skip;
    } else {
      if (params.query === undefined) findAll = true;
      searchQuery = params.query;
    }
  }

  if (typeof params.options === "object") {
    if (limit === undefined || skip === undefined) {
      if (params.options._limit !== undefined && limit !== 1) {
        limit = params.options._limit;
      }

      if (params.options._skip !== undefined) skip = params.options._skip;
      else skip = 0;
    }
  }

  if (
    typeof params.options !== "object" &&
    params.query &&
    (params.query._limit !== undefined ||
      params.query._skip !== undefined ||
      typeof params.query !== "object")
  )
    findAll = true;

  if (limit === undefined) limit = Infinity;
  if (skip === undefined) skip = 0;

  return { cb, searchQuery, limit, skip, findAll };
};

const parseUpdateParams = (params) => {
  let searchQuery,
    updateQuery,
    limit,
    skip,
    replace = false,
    cb;
  if (chechParams(params)) return handleErr(params.cb, 8);

  if (params.limit) limit = 1;
  if (typeof params.cb === "function") cb = params.cb;
  else if (!cb && typeof params.options === "function") cb = params.options;

  const query = params.query,
    options = params.options,
    updated = params.updated;

  if (
    query._limit !== undefined ||
    query._skip !== undefined ||
    query._replace !== undefined
  ) {
    if (!limit) limit = query._limit;
    skip = query._skip;
  } else searchQuery = query;

  if (limit === undefined || skip === undefined) updateQuery = updated;

  if (typeof options === "object") {
    if (options._limit !== undefined && limit !== 1) limit = options._limit;
    if (options._skip !== undefined) skip = options._skip;
    if (options._replace !== undefined) replace = options._replace;
  }
  if (limit === undefined) limit = Infinity;
  if (skip === undefined) skip = 0;

  if (updateQuery.hasOwnProperty("_id")) return handleErr(cb, 9);

  return { searchQuery, updateQuery, limit, skip, replace, cb };
};

const chechParams = (params) => {
  return (
    typeof params.query !== "object" ||
    params.query._limit !== undefined ||
    params.query._skip !== undefined ||
    params.query._replace !== undefined ||
    typeof params.updated !== "object" ||
    params.updated._limit !== undefined ||
    params.updated._skip !== undefined ||
    params.updated._replace !== undefined
  );
};

module.exports = { parseParams, parseUpdateParams };
