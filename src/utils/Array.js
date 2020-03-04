function unique(ary = [], key = "0") {
  ary.sort(sortObj(key, "asc"));
  for (var i = 0; i < ary.length; i++) {
    if (!ary[i + 1]) {
      break;
    }
    if (ary[i][key] === ary[i + 1][key]) {
      ary.splice(i, 1);
      i -= 1;
    }
  }
  return ary;
}

function uniqueAdd(ary = [], key = "0", add = "") {
  ary.sort(sortObj(key, "asc"));
  for (var i = 0; i < ary.length; i++) {
    if (!ary[i + 1]) {
      break;
    }
    if (ary[i][key] === ary[i + 1][key]) {
      ary[i + 1][add] += ary[i][add];
      ary.splice(i, 1);
      i -= 1;
    }
  }
  return ary;
}

function sortObj(key = "0", order = "asc") {
  return function (a, b) {
    if (order === "asc") {
      return a[key] < b[key] ? -1 : 1;
    }
    else {
      return a[key] < b[key] ? 1 : -1
    }
  }
}

module.exports = {
  sortObj,
  unique,
  uniqueAdd
}