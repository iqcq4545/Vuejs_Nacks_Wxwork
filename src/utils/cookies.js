function cookiesToObj() {
  let cookieAry = document.cookie.replace(/\s+/g, "").split(";"),
    obj = {};
  cookieAry.forEach((i) => {
    let ary = i.split("=");
    obj[ary[0]] = ary[1];
  });
  return obj;
}

function cookiesValue(key) {
  return cookiesToObj()[key];
}

export {
  cookiesToObj,
  cookiesValue
}