/* @flow */
import React from "react";
import QuoteForm from "./QuoteForm";
import { Modal, Button } from "react-materialize";

type Props = {
  addQuote: (body: string, author: string) => void
};

type State = {
  author: string,
  body: string
};

class QuoteFormContainer extends React.Component {
  props: Props;
  onSubmit: () => void;
  formDidUpdate: (e: Event) => void;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      author: "",
      body: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.formDidUpdate = this.formDidUpdate.bind(this);
  }

  onSubmit() {
    const { body, author } = this.state;
    this.props.addQuote(body, author);
    this.setState({ body: "", author: "" });
  }

  formDidUpdate(e: Event) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  }

  render() {
    const { author, body } = this.state;
    const formIsValid = author && body;
    const submitButton = (
      <Button
        disabled={!formIsValid}
        modal="close"
        style={{ marginLeft: "8px", marginRight: "20px", backgroundColor: "#108ee9" }}
        onClick={this.onSubmit}
      >
        Add quote
      </Button>
    );
    const cancelButton = <Button className="light" modal="close" flat>Close</Button>;
    return (
      <Modal
        header="Add a quote"
        actions={[submitButton, cancelButton]}
        trigger={<Button style={{ backgroundColor: "#108ee9" }} waves="light">Add a quote</Button>}
      >
        <QuoteForm body={body} author={author} formDidUpdate={this.formDidUpdate} />
      </Modal>
    );
  }
}

export default QuoteFormContainer;
