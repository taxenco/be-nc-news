exports.formatDates = list => {
  let newArray = [];
  list.forEach((element, index) => {
    const newObject = { ...element };
    newArray.push(newObject);
    newArray[index].created_at = new Date(newArray[index].created_at);
  });
  return newArray;
};

exports.makeRefObj = list => {
  if (list.length > 0) {
    const newObject = {};
    list.forEach(element => {
      newObject[element.title] = element.article_id;
    });
    return newObject;
  } else {
    return [];
  }
};

exports.formatComments = (comments, articleRef) => {};
