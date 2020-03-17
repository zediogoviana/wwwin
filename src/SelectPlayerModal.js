import React from 'react';
import {
  Button, Dropdown, Grid, Header, Label, Modal, Segment,
} from 'semantic-ui-react';

class SelectPlayerModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      referee: 50,
      // loading: true,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, rating) {
    this.setState({ [rating]: e.target.value });
  }

  render() {
    const {
      referee,
    } = this.state;
    const { open, handleClose } = this.props;

    return (
      <Modal open={open}>
        <Modal.Header>Select a Photo</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>Default Profile Image</Header>
            <p>
              We've found the following gravatar image associated with your e-mail
              address.
            </p>
            <p>Is it okay to use this photo?</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => handleClose('select')} negative content='Cancel' />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default SelectPlayerModal;
