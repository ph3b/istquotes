const targaryen = require("targaryen");
const rules = require("../rules.js")();

it("Should add quote", () => {
  const data = {
    quote: {
      body: "All the things",
      author: "Maria",
      posted_by: "someuid"
    },
    votes: {
      count: 0
    }
  };

  const auth = { uid: "someuid" };
  const database = targaryen.database(rules).as(auth).with({ debug: true });
  const { allowed, newDatabase, info } = database.write("/quotes/12345", data);
  expect(allowed).toBeTruthy();
});

it("Should not add quote when missing count", () => {
  const data = {
    quote: {
      body: "All the things",
      author: "Maria",
      posted_by: "lkjlkjlkj"
    }
  };

  const auth = { uid: "someuid" };
  const database = targaryen.database(rules).as(auth).with({ debug: true });
  const { allowed, newDatabase, info } = database.write("/quotes/12345", data);
  expect(allowed).toBeFalsy();
});

it("Should increment count by one, on an existing quote", () => {
  const existingData = {
    quotes: {
      quote1: {
        quote: {
          body: "All the things",
          author: "Maria",
          posted_by: "someuid"
        },
        votes: {
          count: 0
        }
      }
    }
  };

  const payload = {
    votes: {
      count: 1,
      voters: {
        someuid: true
      }
    }
  };
  const auth = { uid: "someuid" };
  const database = targaryen.database(rules, existingData).as(auth).with({ debug: true });
  const { allowed, newDatabase, info } = database.write("/quotes/quote1", payload);
  expect(allowed).toBeTruthy();
  expect(newDatabase.root.quotes.quote1.votes.count.$value()).toBe(1);
});

it("Should deny increment count by more than one, on an existing quote", () => {
  const existingData = {
    quotes: {
      quote1: {
        quote: {
          body: "All the things",
          author: "Maria",
          posted_by: "someuid"
        },
        votes: {
          count: 0
        }
      }
    }
  };

  const auth = { uid: "someuid" };
  const payload = {
    votes: {
      count: 1,
      voters: {
        someuid: true
      }
    }
  };
  const database = targaryen.database(rules, existingData).as(auth).with({ debug: true });
  const { allowed, newDatabase, info } = database.write("/quotes/quote1/votes/count", payload);
  expect(allowed).toBeFalsy();
});

it("Should deny user when try to upvote twice", () => {
  const existingData = {
    quotes: {
      quote1: {
        quote: {
          body: "All the things",
          author: "Maria",
          posted_by: "someuid"
        },
        votes: {
          count: 0
        }
      }
    }
  };

  const auth = { uid: "someuid" };
  const database = targaryen.database(rules, existingData).as(auth).with({ debug: true });
  database.write("/quotes/quote1/votes/count", 1);
  const { allowed, newDatabase, info } = database.write("/quotes/quote1/votes/count", 2);
  expect(allowed).toBeFalsy();
});
