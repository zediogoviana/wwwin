import React, { useState } from 'react';
import {
  Button, Dropdown, Grid, Input, Label, Modal,
} from 'semantic-ui-react';

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => (
    { value: start + idx, text: start + idx, key: idx }
  ));
}

const positionOptions = [
  { key: 'G', value: 'G', text: 'Goalkeeper' },
  { key: 'D', value: 'D', text: 'Defender' },
  { key: 'M', value: 'M', text: 'Midfielder' },
  { key: 'A', value: 'A', text: 'Attacker' },
];

function CreatePlayerModal(props) {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [birthYear, setBirthYear] = useState(new Date().getFullYear());
  const [attack, setAttack] = useState(0);
  const [defense, setDefense] = useState(0);
  const {
    info, handleCreatePlayerModal,
  } = props;
  const birthYearOptions = range(new Date().getFullYear() - 50, new Date().getFullYear());

  function clearState() {
    setName('');
    setPosition('');
    setBirthYear(new Date().getFullYear());
    setDefense(0);
    setAttack(0);
  }

  function handleCreatePlayer() {
    const { handlePlayerCreation } = props;
    handlePlayerCreation({
      name, position, birthYear, attack, defense,
    });
    clearState();
    handleCreatePlayerModal(false, '');
  }

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
          onChange={(e) => setName(e.target.value)}
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
          onChange={(e, item) => setBirthYear(item.value)}
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
          onChange={(e, item) => setPosition(item.value)}
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
                onChange={(e) => setDefense(e.target.value)}
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
                onChange={(e) => setAttack(e.target.value)}
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
        <Button onClick={handleCreatePlayer} positive content='Confirm' />
      </Modal.Actions>
    </Modal>
  );
}

export default CreatePlayerModal;
