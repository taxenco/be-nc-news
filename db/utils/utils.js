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
  return (formatComments = comments.map(Comment => {
    const copyComment = { ...Comment };
    copyComment.belongs_to = articleRef[copyComment.belongs_to];
    copyComment["article_id"] = copyComment["belongs_to"];
    delete copyComment["belongs_to"];
    copyComment["author"] = copyComment["created_by"];
    delete copyComment["created_by"];
    copyComment["created_at"] = new Date(Comment.created_at);
    return copyComment;
  }));
};
