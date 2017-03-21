/* @flow */
import React from "react";
import Rebase from "re-base";
import firebase from "firebase";
import QuoteForm from "../components/QuoteForm";
import QuoteList from "../components/QuoteList";
import type { Quote } from "../components/QuoteList";
import Loader from "../components/Loader";
import LoginModal from "../components/LoginModal";

const base = Rebase.createClass({
  apiKey: "AIzaSyA4Syo3TJBMd2v3hVNcFb84rNiPEet28xs",
  authDomain: "istquotes-6ed3d.firebaseapp.com",
  databaseURL: "https://istquotes-6ed3d.firebaseio.com",
  storageBucket: "istquotes-6ed3d.appspot.com",
  messagingSenderId: "369179037306"
});

type Props = {};
type Vote = "UPVOTE" | "DOWNVOTE";

class AppContainer extends React.Component {
  props: Props;
  state: {
    quotes: Array<Quote>,
    isLoading: boolean
  };

  addQuote: (Quote) => void;
  removeQuote: (quoteId: string) => void;
  didDownvote: (quoteId: string) => void;
  didUpvote: (quoteId: string) => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      quotes: [],
      isLoading: true
    };
    this.addQuote = this.addQuote.bind(this);
    this.removeQuote = this.removeQuote.bind(this);
    this.didDownvote = this.didDownvote.bind(this);
    this.didUpvote = this.didUpvote.bind(this);
  }

  componentDidMount() {
    base.bindToState("quotes", {
      context: this,
      asArray: true,
      state: "quotes",
      then: () => this.setState({ isLoading: false })
    });
  }

  addQuote(quote: Quote) {
    const currentUser = base.auth().currentUser;
    if (!currentUser) {
      const provider = new base.auth.FacebookAuthProvider();
      base.auth().signInWithPopup(provider).then(result => {
        this.addQuote(quote);
      });
    } else {
      const { uid } = currentUser;
      const newQuote = {
        quote: Object.assign({}, quote, {
          posted_by: uid,
          created: firebase.database.ServerValue.TIMESTAMP
        }),
        votes: {
          count: 0
        }
      };
      console.log(newQuote);
      base.push(`quotes`, { data: newQuote });
    }
  }

  removeQuote(quoteId: string) {
    base.remove(`quotes/${quoteId}`);
  }

  countVote(quoteId: string, type: Vote) {
    const quoteRef = base.database().ref(`quotes/${quoteId}/votes`);
    const { uid } = base.auth().currentUser;
    type votes = {
      count: number,
      voters: ?{ [key: string]: "Upvote" | "Downvote" }
    };
    quoteRef.transaction((votes: votes) => {
      if (votes) {
        if (type === "UPVOTE") {
          votes.count += 1;
        } else {
          votes.count -= 1;
        }
        if (!votes.voters) {
          votes.voters = {};
        }
        votes.voters[uid] = type === "UPVOTE" ? "Upvote" : "Downvote";
      }
      return votes;
    });
  }

  didUpvote(quoteId: string) {
    this.countVote(quoteId, "UPVOTE");
  }

  didDownvote(quoteId: string) {
    this.countVote(quoteId, "DOWNVOTE");
  }

  render() {
    const { isLoading, quotes } = this.state;
    const uid = base.auth().currentUser && base.auth().currentUser.uid;

    return (
      <div>
        <div style={{ height: 120, backgroundColor: "#283044", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <span style={{ color: "white", fontFamily: "Helvetica Neue", fontWeight: 100, fontSize: "4vw" }}>IST Quotes</span>
        </div>
        <div style={{ maxWidth: "800px", marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ paddingLeft: "11.25px", paddingRight: "11.25px" }}><QuoteForm addQuote={this.addQuote} /></div>
          {isLoading
            ? <Loader />
            : <QuoteList
                removeQuote={this.removeQuote}
                didDownvote={this.didDownvote}
                didUpvote={this.didUpvote}
                currentUserId={uid}
                quotes={quotes}
              />}
        </div>
      </div>
    );
  }
}

export default AppContainer;
