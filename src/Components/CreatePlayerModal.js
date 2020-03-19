import React from 'react';
import {
  Button, Dropdown, Grid, Input, Label, Modal,
} from 'semantic-ui-react';

class CreatePlayerModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      position: '',
      birthYear: new Date().getFullYear(),
      attack: 0,
      defense: 0,
      // loading: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.handleCreatePlayer = this.handleCreatePlayer.bind(this);
  }

  handleCreatePlayer() {
    const { handlePlayerCreation, handleCreatePlayerModal } = this.props;
    const {
      name, position, birthYear, attack, defense,
    } = this.state;
    handlePlayerCreation({
      name, position, birthYear, attack, defense,
    });
    this.setState({
      name: '', position: '', birthYear: new Date().getFullYear(), attack: 0, defense: 0,
    });
    handleCreatePlayerModal(false, '');
  }

  handleChange(e) {
    const el = (e.target ? e.target : e);
    this.setState({ [el.name]: el.value });
  }

  handleRatingChange(e, rating) {
    this.setState({ [rating]: e.target.value });
  }

  // eslint-disable-next-line class-methods-use-this
  range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => (
      { value: start + idx, text: start + idx, key: idx }
    ));
  }

  render() {
    const {
      name, position, birthYear, attack, defense,
    } = this.state;
    const {
      info, handleCreatePlayerModal,
    } = this.props;
    const positionOptions = [
      { key: 'G', value: 'G', text: 'Goalkeeper' },
      { key: 'D', value: 'D', text: 'Defender' },
      { key: 'M', value: 'M', text: 'Midfielder' },
      { key: 'A', value: 'A', text: 'Attacker' },
    ];
    const birthYearOptions = this.range(new Date().getFullYear() - 50, new Date().getFullYear());
    return (
      <Modal open={info.open} size='mini'>
        <Modal.Header>Select a Player</Modal.Header>
        <Modal.Content>
          <p>Name</p>
          <Input
            fluid
            required
            name='name'
            value={name}
            onChange={this.handleChange}
          />
          <p />
          <Dropdown
            fluid
            required
            selection
            label='Birth Year'
            options={birthYearOptions}
            value={birthYear}
            name='birthYear'
            onChange={(e, item) => this.handleChange(item)}
          />
          <p />
          <Dropdown
            fluid
            required
            selection
            label='Position'
            options={positionOptions}
            value={position}
            name='position'
            onChange={(e, item) => this.handleChange(item)}
          />
          <p />
          <Grid>
            <Grid.Row>
              <Grid.Column width={11}>
                <p>Defense</p>
                <input
                  style={{ width: '100%' }}
                  type='range'
                  min={0}
                  max={100}
                  value={defense}
                  onChange={(e) => this.handleRatingChange(e, 'defense')}
                />
              </Grid.Column>
              <Grid.Column verticalAlign='bottom' textAlign='center' width={5}>
                <Label style={{ width: 40 }} color='black' content={defense} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={11}>
                <p>Attack</p>
                <input
                  style={{ width: '100%' }}
                  type='range'
                  min={0}
                  max={100}
                  value={attack}
                  onChange={(e) => this.handleRatingChange(e, 'attack')}
                />
              </Grid.Column>
              <Grid.Column verticalAlign='bottom' textAlign='center' width={5}>
                <Label style={{ width: 40 }} color='black' content={attack} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => handleCreatePlayerModal(false, '')} negative content='Cancel' />
          <Button onClick={this.handleCreatePlayer} positive content='Confirm' />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default CreatePlayerModal;
