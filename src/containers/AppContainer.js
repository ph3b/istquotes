/* @flow */
import React from "react";
import Rebase from "re-base";
import firebase from "firebase";
import QuoteForm from "../components/QuoteForm";
import QuoteList from "../components/QuoteList";
import Loader from "../components/Loader";
import { Card, CardTitle, Modal, Button } from "react-materialize";
import QuoteFormContainer from "../components/QuoteFormContainer";
import type { Quote } from "../types";
const base = Rebase.createClass({
  apiKey: "AIzaSyA4Syo3TJBMd2v3hVNcFb84rNiPEet28xs",
  authDomain: "istquotes-6ed3d.firebaseapp.com",
  databaseURL: "https://istquotes-6ed3d.firebaseio.com",
  storageBucket: "istquotes-6ed3d.appspot.com",
  messagingSenderId: "369179037306"
});

type Vote = "UPVOTE" | "DOWNVOTE";
type State = {
  quotes: Array<Quote>,
  votes: Object,
  isLoading: boolean
};

class AppContainer extends React.Component {
  props: {};
  state: State;

  addQuote: (body: string, author: string) => void;
  removeQuote: (quoteId: string) => void;
  didClickVote: (quoteId: string) => void;

  constructor(props: {}) {
    super(props);
    this.state = {
      quotes: [],
      votes: {},
      isLoading: true
    };
    this.addQuote = this.addQuote.bind(this);
    this.removeQuote = this.removeQuote.bind(this);
    this.didClickVote = this.didClickVote.bind(this);
  }

  componentDidMount() {
    base.bindToState("quotes", {
      context: this,
      asArray: true,
      state: "quotes",
      then: () => this.setState({ isLoading: false })
    });

    base.bindToState("votes", {
      context: this,
      state: "votes",
      then: () => this.setState({ isLoading: false })
    });
  }

  didClickVote(key: string) {
    const { votes } = this.state;
    const currentUser = base.auth().currentUser;
    const { uid } = currentUser;
    const votedForQuote = votes && votes[key] && votes[key][uid] ? true : false;
    if (!currentUser) {
      base.auth().signInAnonymously().then(result => {
        this.didClickVote(key);
      });
    } else {
      if (!votedForQuote) {
        this.countVote(key, "UPVOTE");
      } else {
        this.countVote(key, "DOWNVOTE");
      }
    }
  }

  addQuote(body: string, author: string) {
    const currentUser = base.auth().currentUser;
    if (!currentUser) {
      base.auth().signInAnonymously().then(result => {
        this.addQuote(body, author);
      });
    } else {
      const { uid } = currentUser;
      const newQuote = Object.assign({}, { body, author }, {
        posted_by: uid,
        created: firebase.database.ServerValue.TIMESTAMP
      });
      base.push(`quotes`, { data: newQuote });
    }
  }

  removeQuote(quoteId: string) {
    base.remove(`quotes/${quoteId}`);
  }

  countVote(quoteId: string, type: Vote) {
    const { uid } = base.auth().currentUser;
    const quoteRef = base.database().ref(`votes/${quoteId}/${uid}`);
    if (type === "UPVOTE") {
      quoteRef.set(true);
    } else {
      quoteRef.set(null);
    }
  }

  render() {
    const { isLoading, quotes, votes } = this.state;
    const uid = base.auth().currentUser && base.auth().currentUser.uid;
    const quotesWithVotes = quotes.map(quote => Object.assign({}, quote, { votes: votes[quote.key] || {} }));
    return (
      <div>
        <div style={{ height: 120, backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <span style={{ color: "#108ee9", fontFamily: "Helvetica Neue", fontWeight: 100, fontSize: "4vw" }}>IST Quotes</span>
        </div>
        <div style={{ marginTop: 20, maxWidth: "800px", marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
            <QuoteFormContainer addQuote={this.addQuote} />
          </div>
          {isLoading
            ? <Loader />
            : <QuoteList
                removeQuote={this.removeQuote}
                didClickVote={this.didClickVote}
                currentUserId={uid}
                quotes={quotesWithVotes}
              />}
        </div>
      </div>
    );
  }
}

export default AppContainer;
