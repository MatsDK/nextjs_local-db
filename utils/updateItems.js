module.exports = updateItems = (items, req) => {
  let skipped = 0,
    changed = 0,
    returnArr = [];

  for (let i = 0; i < items.length; i++) {
    if (changed + 1 > req.limit) break;
    const keys = Object.keys(req.searchQuery).map((x) => [
      x,
      req.searchQuery[x],
    ]);

    let isValid = true;
    keys.forEach((x) => {
      if (items[i][x[0]] !== x[1]) isValid = false;
    });

    if (!isValid) continue;
    if (skipped >= req.skip) {
      changed++;
      const newKeys = Object.keys(req.updateQuery).map((x) => [
        x,
        req.updateQuery[x],
      ]);

      if (!req.replace) {
        newKeys.forEach((x) => {
          items[i][x[0]] = x[1];
        });
      } else {
        items[i] = { _id: items[i]._id, ...req.updateQuery };
      }

      returnArr.push(items[i]);
    }

    skipped++;
  }
  return { returnArr, items };
};
