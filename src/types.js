// @flow
export type Quote = {
  key: string,
  body: string,
  author: string,
  posted_by: string,
  votes: ?{ [key: string]: Boolean }
};
