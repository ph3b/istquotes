/* @flow */
import React from "react";
import { Row, Col, Input, Card, Button } from "react-materialize";

class QuoteForm extends React.Component {
  state: {
    author: string,
    body: string
  };

  formUpdated: (e: Event) => void;
  didSubmit: () => void;

  constructor(props: {}) {
    super(props);
    this.state = {
      author: "",
      body: ""
    };
    this.formUpdated = this.formUpdated.bind(this);
    this.didSubmit = this.didSubmit.bind(this);
  }

  formUpdated(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      this.setState({ [event.target.name]: event.target.value });
    }
  }

  didSubmit() {
    if (!this.state.author || !this.state.body) return;
    this.props.addQuote(this.state);
    this.setState({ body: "", author: "" });
  }

  render() {
    const { author, body } = this.state;
    return (
      <div>
        <Card>
          <Row>
            <Col m={6} s={12}>
              {" "}<Input value={body} onChange={this.formUpdated} name="body" s={12} placeholder="Quote" />
            </Col>
            <Col m={4} s={12}><Input value={author} s={12} placeholder="Author" onChange={this.formUpdated} name="author" /></Col>
            <Col m={2} s={12} style={{ marginTop: "20px" }}><Button onClick={this.didSubmit}>Submit</Button></Col>
          </Row>
        </Card>
      </div>
    );
  }
}

QuoteForm.propTypes = {
  addQuote: React.PropTypes.func.isRequired
};

export default QuoteForm;
