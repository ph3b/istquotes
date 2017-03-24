// @flow
import React from "react";
import { Row, Col, Card } from "react-materialize";
import QuoteListCard from "./QuoteCard";
import type { Quote } from "../types";
import FlipMove from "react-flip-move";

type Props = {
  quotes: Array<Quote>,
  currentUserId: string,
  removeQuote: (key: string) => void,
  didClickVote: (key: string) => void
};

const QuoteList = (
  {
    quotes,
    currentUserId,
    removeQuote,
    didClickVote
  }: Props
) => {
  const didClickRemove = (key: string) => {
    const didConfirm = window.confirm("Are you sure you want to remove the quote?");
    if (didConfirm) removeQuote(key);
  };
  const reverseQuotes = quotes.slice().reverse();
  return (
    <Row>
      <FlipMove duration={500} easing="ease-out">
        {reverseQuotes.map(quote => {
          const isVotedByUser = quote.votes && quote.votes[currentUserId] ? true : false;
          return (
            <QuoteListCard
              key={quote.key}
              didClickRemoveQuote={didClickRemove}
              quote={quote}
              didClickVote={didClickVote}
              isVotedByUser={isVotedByUser}
              postedByCurrentUser={currentUserId === quote.posted_by}
            />
          );
        })}
      </FlipMove>
    </Row>
  );
};

export default QuoteList;
