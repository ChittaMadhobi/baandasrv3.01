
msort = (data, property, AscDsc) => {
    let yy = data.sort(sortOn(property, AscDsc));
    return yy;
}

sortOn = (property, AscDsc)  => {
    if (AscDsc === "asc") {
      return function(a, b) {
        if (a[property] > b[property]) {
          return -1;
        } else if (a[property] < b[property]) {
          return 1;
        } else {
          return 0;
        }
      };
    } else {
      return function(a, b) {
        if (a[property] < b[property]) {
          return -1;
        } else if (a[property] > b[property]) {
          return 1;
        } else {
          return 0;
        }
      };
    }
  }


module.exports = msort;