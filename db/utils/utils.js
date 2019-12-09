exports.formatDates = list => {
  if (list.length > 0) {
    let newArray = [];
    list.forEach((element, index) => {
      const newObject = { ...element };
      newObject.created_at = new Date(element.created_at);
      newArray.push(newObject);
    });
    return newArray;
  } else {
    return [];
  }
};

exports.makeRefObj = list => {
  const newObject = {};
  list.forEach(element => {
    newObject[element.title] = element.article_id;
  });
  return newObject;
};

exports.formatComments = (comments, articleRef) => {
  const newArray = [];
  comments.forEach((element, index) => {
    const newObject = { ...element };
    newObject.author = newObject.created_by;
    newObject.created_at = new Date(element.created_at);
    newObject.article_id = articleRef[index][newObject.belongs_to];
    delete newObject.belongs_to;
    delete newObject.created_by;
    newArray.push(newObject);
  });
  return newArray;
};
