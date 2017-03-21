/* @flow */
import React from "react";
import { Row, Col, Card } from "react-materialize";
import type { Quote } from "./QuoteList";

type props = {
  postedByCurrentUser: boolean,
  didUpvote: (key: string) => void,
  didDownvote: (key: string) => void,
  didClickRemoveQuote: (key: string) => void,
  quote: Quote
};

const QuoteListCard = (
  {
    quote,
    postedByCurrentUser,
    didClickRemoveQuote,
    didDownvote,
    didUpvote
  }: props
) => {
  const handleUpvote = () => didUpvote(quote.key);
  const handleDownvote = () => didDownvote(quote.key);
  const handleDelete = () => didClickRemoveQuote(quote.key);
  const cardButtonRow = (
    <div key={quote.key} style={{ display: "flex", justifyContent: "space-between" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 26,
          width: 26,
          paddingTop: 2,
          borderRadius: 13,
          backgroundColor: "#EEE",
          fontFamily: "Helvetica Neue"
        }}
        key={quote.key}
      >
        {quote.votes.count}
      </div>
      <div>
        <span onClick={handleUpvote}>Up</span> - <span onClick={handleDownvote}>Down</span>
      </div>
      {postedByCurrentUser
        ? <button onClick={handleDelete} style={{ border: "none", backgroundColor: "#eee", borderRadius: 3 }}>
            Delete
          </button>
        : <div />}
    </div>
  );
  return (
    <Col key={quote.key} m={6} s={12}>
      <Card style={{ backgroundColor: "white" }} textClassName="black-text" title={quote.quote.author} actions={[cardButtonRow]}>
        {quote.quote.body}
      </Card>
    </Col>
  );
};

export default QuoteListCard;
