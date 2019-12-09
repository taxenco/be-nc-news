const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an empty array of objects when an empty array of the object is passed", () => {
    const input = [];
    const actual = formatDates(input);
    const expected = [];
    expect(actual).to.be.eql(expected);
  });
  it("function formatDates does not mutate the original data when it is invoked", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const checkedInput = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    formatDates(input);
    expect(input).to.be.eql(checkedInput);
  });
  it("returns an array of an object with the converted Unix timeStamp when an array of an object Unix with Unix timeStamp is passed", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100
      }
    ];
    expect(actual).to.be.eql(expected);
  });
  it("returns an array of objects with the converted Unix timeStamp when an array of objects with Unix timeStamps are passed", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: new Date(1416140514171)
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: new Date(1289996514171)
      }
    ];
    expect(actual).to.be.eql(expected);
  });
});

describe("makeRefObj", () => {
  it("returns an empty array of objects when an empty array of the object is passed", () => {
    const input = [];
    const actual = makeRefObj(input);
    const expected = {};
    expect(actual).to.be.eql(expected);
  });
  it("function formatDates does not mutate the original data when it is invoked", () => {
    const input = [{ article_id: 1, title: "A" }];
    const checkedInput = [{ article_id: 1, title: "A" }];
    makeRefObj(input);
    expect(input).to.be.eql(checkedInput);
  });
  it("returns an array of objects with the key of the item's title when an array of objects is passed", () => {
    const input = [{ article_id: 1, title: "A" }];
    const actual = makeRefObj(input);
    const expected = { A: 1 };
    expect(actual).to.be.eql(expected);
  });
  it("returns an array of objects with the key of the item's title when an array of several objects is passed", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" }
    ];
    const actual = makeRefObj(input);
    const expected = { A: 1, B: 2, C: 3 };
    expect(actual).to.be.eql(expected);
  });
});

describe.only("formatComments", () => {
  it("returns an empty array of objects when an empty array of the object is passed", () => {
    const input = [];
    const actual = formatComments(input);
    const expected = [];
    expect(actual).to.be.eql(expected);
  });
  it("function formatComments does not mutate the original data when it is invoked", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const articleRef = [{ "They're not exactly dogs, are they?": 1 }];
    const checkedInput = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    formatComments(input, articleRef);
    expect(input).to.be.eql(checkedInput);
  });
  it("returns an array of objects with the key of the items title when an array of objects is passed", () => {
    const commentInput = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932
      }
    ];
    const articleRef = [
      { "The People Tracking Every Touch, Pass And Tackle in the World Cup": 1 }
    ];
    const actual = formatComments(commentInput, articleRef);
    const expected = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        article_id: 1,
        author: "tickle122",
        votes: -1,
        created_at: new Date(1468087638932)
      }
    ];
    expect(actual).to.be.eql(expected);
  });
  it("returns an array of objects with the key of the items title when an array of objects is passed", () => {
    const commentInput = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932
      },
      {
        body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
        belongs_to: "Making sense of Redux",
        created_by: "grumpy19",
        votes: 7,
        created_at: 1478813209256
      }
    ];
    const articleRef = [
      {
        "The People Tracking Every Touch, Pass And Tackle in the World Cup": 1
      },
      { "Making sense of Redux": 2 }
    ];
    const actual = formatComments(commentInput, articleRef);
    const expected = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        article_id: 1,
        author: "tickle122",
        votes: -1,
        created_at: new Date(1468087638932)
      },
      {
        body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
        article_id: 2,
        author: "grumpy19",
        votes: 7,
        created_at: new Date(1478813209256)
      }
    ];
    expect(actual).to.be.eql(expected);
  });
});
