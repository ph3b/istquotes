// @flow
import React from "react";
import { Row, Col, Input, CardPanel, Button } from "react-materialize";
type Props = {
  formDidUpdate: (e: Event) => void,
  body: string,
  author: string
};

type State = {
  body: string,
  author: string
};

class QuoteForm extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
  }

  render() {
    const { body, author, formDidUpdate } = this.props;
    return (
      <div>
        <Row>
          <Col m={12} s={12}>
            {" "}
            <Input
              value={body}
              height="10"
              maxLength={140}
              type="textarea"
              onChange={formDidUpdate}
              name="body"
              s={12}
              placeholder="Quote"
            />
          </Col>
        </Row>
        <Row>
          <Col m={4} s={12}>
            <Input value={author} s={12} maxLength={20} placeholder="Author" onChange={formDidUpdate} name="author" />
          </Col>
        </Row>
      </div>
    );
  }
}

export default QuoteForm;
