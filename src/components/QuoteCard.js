/* @flow */
import React from "react";
import { Row, Col, Card, Button, Icon } from "react-materialize";
import type { Quote } from "../types";

type Props = {
  postedByCurrentUser: boolean,
  didClickRemoveQuote: (key: string) => void,
  quote: Quote,
  didClickVote: (key: string) => void,
  isVotedByUser: boolean
};

class QuoteCard extends React.Component {
  props: Props;
  render() {
    const { quote, postedByCurrentUser, isVotedByUser, didClickRemoveQuote, didClickVote } = this.props;
    const handleVote = () => this.props.didClickVote(quote.key);
    const handleDelete = () => this.props.didClickRemoveQuote(quote.key);
    const cardButtonRow = (
      <div key={quote.key} style={{ display: "flex", justifyContent: "space-between", alignContent: "center" }}>
        <div style={{ opacity: 0 }}><Icon small>favorite</Icon></div>
        <div>
          <div style={{ position: "relative" }} onClick={handleVote}>
            <div
              style={{
                top: "15px",
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
                width: "100%",
                fontFamily: "Helvetica Neue",
                fontWeight: 200,
                fontSize: 14,
                position: "absolute",
                color: "white",
                cursor: "pointer"
              }}
            >
              {quote.votes && Object.keys(quote.votes).length}
            </div>
            <button style={{ border: "none", backgroundColor: "transparent", margin: 0, padding: 0 }}>
              <div style={{ color: isVotedByUser ? "#ff0040" : "grey", transition: "all 0.3s ease-in" }}>
                <Icon medium>favorite</Icon>
              </div>
            </button>
          </div>
        </div>
        {postedByCurrentUser
          ? <button onClick={handleDelete} style={{ border: "none", backgroundColor: "transparent" }}>
              <Icon>delete</Icon>
            </button>
          : <div style={{ opacity: 0 }}><Icon>delete</Icon></div>}
      </div>
    );
    return (
      <Col key={quote.key} m={6} s={12}>
        <Card style={{ backgroundColor: "white" }} textClassName="black-text" title={quote.author} actions={[cardButtonRow]}>
          "{quote.body}"
        </Card>
      </Col>
    );
  }
}

export default QuoteCard;
