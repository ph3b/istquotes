/* @flow */
import React from "react";
import { Row, Col, Card } from "react-materialize";
import QuoteListCard from "./QuoteListCard";

type props = {
  quotes: Array<Quote>,
  currentUserId: string,
  removeQuote: (key: string) => void,
  didUpvote: (key: string) => void,
  didDownvote: (key: string) => void
};

export type Quote = {
  key: string,
  quote: {
    body: string,
    author: string,
    posted_by: string
  },
  votes: {
    count: number,
    voters: { [key: string]: "Upvote" | "Downvote" }
  }
};

const QuoteList = (
  {
    quotes,
    currentUserId,
    removeQuote,
    didUpvote,
    didDownvote
  }: props
) => {
  const didClickRemove = (key: string) => {
    const didConfirm = window.confirm("Are you sure you want to remove the quote?");
    if (didConfirm) removeQuote(key);
  };
  return (
    <Row>
      {quotes.map(quote => (
        <QuoteListCard
          key={quote.key}
          didClickRemoveQuote={didClickRemove}
          quote={quote}
          didDownvote={didDownvote}
          didUpvote={didUpvote}
          postedByCurrentUser={currentUserId === quote.quote.posted_by}
        />
      ))}
    </Row>
  );
};

export default QuoteList;
