import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import {
  Button, Dropdown, Grid, Header, Label, List, Segment,
} from 'semantic-ui-react';
import CreatePlayerModal from './CreatePlayerModal';

const faker = require('faker');

function calcPosition(value) {
  switch (value) {
    case 0: return 'G';
    case 1: return 'D';
    case 2: return 'M';
    case 3: return 'A';
    default: return 'M';
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.floor(min)) + Math.floor(min));
}

function TeamBoard(props) {
  const refFileUploader = useRef(null);
  const [editPlayer, setEditPlayer] = useState({
    name: '', position: '', birthYear: 0, attack: 0, defense: 0,
  });
  const [playerIndex, setPlayerIndex] = useState(-1);
  const {
    type, color, team, handleTactics, handleRatingChange,
    handleDeletePlayer, handleCreatePlayerModal, createPlayer,
    handlePlayerCreation, tacticsOptions, disabled, handlePlayerEdit,
  } = props;

  function handleEditPlayer(player, index) {
    setEditPlayer(player);
    setPlayerIndex(index);
    handleCreatePlayerModal(true, type);
  }

  function rosterFaker() {
    const { handleRandomPlayers } = props;
    const newS11 = team.starting11.map((position, i) => position.map(() => ({
      name: faker.fake('{{name.lastName}}'),
      position: calcPosition(i),
      defense: getRandomInt(50 / (i + 1), 100),
      attack: getRandomInt(20 + (i * 5), 100),
      birthYear: getRandomInt(new Date().getFullYear() - 50, new Date().getFullYear() - 15),
    })));

    handleRandomPlayers(newS11, type);
  }

  function handleFileRead(content) {
    try {
      const { handleLoadPlayers } = props;
      // const content = fileReader.result;
      Papa.parse(content, {
        header: true,
        dynamicTyping: true,
        complete(results) {
          handleLoadPlayers(results.data, type);
        },
      });
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  function handleOnChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    if (event.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => handleFileRead(fileReader.result);
      fileReader.readAsText(event.target.files[0]);
    }
  }

  return (
    <Segment tertiary className='team-board'>
      { createPlayer.open && createPlayer.team === type
        ? (
          <CreatePlayerModal
            index={playerIndex}
            player={editPlayer}
            handleCreatePlayerModal={handleCreatePlayerModal}
            handlePlayerCreation={handlePlayerCreation}
            handlePlayerEdit={handlePlayerEdit}
          />
        )
        : ''}
      <Button color={color} fluid content={type.toUpperCase()} />
      <Segment raised>
        <Grid textAlign='left'>
          <Grid.Column width={10}>
            <h3 style={{ color: '#000000' }}>Player List</h3>
          </Grid.Column>
          <Grid.Column width={6}>
            <Button.Group size='mini' floated='right'>
              <Button
                color={color}
                basic
                icon='random'
                onClick={() => rosterFaker()}
              />
              <Button
                color={color}
                basic
                icon='add'
                onClick={() => handleCreatePlayerModal(true, type)}
              />
              <input
                type='file'
                id='file'
                accept='.csv'
                ref={refFileUploader}
                style={{ display: 'none' }}
                onChange={(e) => handleOnChangeFile(e)}
              />
              <Button color={color} basic icon='upload' onClick={() => refFileUploader.current.click()} />
            </Button.Group>
          </Grid.Column>
        </Grid>

        <List relaxed selection divided className='player-list'>
          {team.roster.map((player, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <List.Item key={i} onClick={() => handleEditPlayer(player, i)}>
              <Grid textAlign='left'>
                <Grid.Column width={6}>
                  {player.position}
                  |
                  {' '}
                  {player.name}
                  {' '}
                  (
                  {new Date().getFullYear() - player.birthYear}
                  )
                </Grid.Column>
                <Grid.Column width={6}>
                  Def:
                  {' '}
                  {player.defense}
                  <br />
                  Att:
                  {' '}
                  {player.attack}
                </Grid.Column>
                <Grid.Column width={4}>
                  <Button size='mini' icon='trash alternate' onClick={() => handleDeletePlayer(i, type)} />
                </Grid.Column>
              </Grid>
            </List.Item>
          ))}
        </List>
      </Segment>

      <Segment disabled={disabled} raised textAlign='left'>
        <Header as='h3'>
          <Header.Content>
            Tactics:
            {' '}
            <Dropdown
              inline
              options={tacticsOptions}
              defaultValue={tacticsOptions[0].value}
              name={type}
              onChange={handleTactics}
            />
          </Header.Content>
        </Header>
      </Segment>

      <Segment disabled={disabled} raised textAlign='left'>
        <h3 style={{ color: '#000000' }}>Team Form</h3>
        <Grid verticalAlign='middle' textAlign='center'>
          <Grid.Column width={11}>
            <input
              style={{ width: '100%' }}
              type='range'
              min={0}
              max={100}
              value={team.form}
              onChange={(e) => handleRatingChange(e, 'form', type)}
            />
          </Grid.Column>
          <Grid.Column width={5}>
            <Label style={{ width: 40 }} color={color} content={team.form} />
          </Grid.Column>
        </Grid>
      </Segment>

      <Segment disabled={disabled} raised textAlign='left'>
        <h3 style={{ color: '#000000' }}>Supporters</h3>
        <Grid verticalAlign='middle' textAlign='center'>
          <Grid.Column width={11}>
            <input
              style={{ width: '100%' }}
              type='range'
              min={0}
              max={100}
              value={team.supporters}
              onChange={(e) => handleRatingChange(e, 'supporters', type)}
            />
          </Grid.Column>
          <Grid.Column width={5}>
            <Label style={{ width: 40 }} color={color} content={team.supporters} />
          </Grid.Column>
        </Grid>
      </Segment>

      <Segment disabled={disabled} raised textAlign='left'>
        <h3 style={{ color: '#000000' }}>Playing Style</h3>
        <Grid verticalAlign='middle' textAlign='center'>
          <Grid.Column width={11}>
            <input
              style={{ width: '100%' }}
              type='range'
              min={0}
              max={100}
              value={team.playingStyle}
              onChange={(e) => handleRatingChange(e, 'playingStyle', type)}
            />
          </Grid.Column>
          <Grid.Column width={5}>
            <Label style={{ width: 40 }} color={color} content={team.playingStyle} />
          </Grid.Column>
        </Grid>
      </Segment>
    </Segment>
  );
}

export default TeamBoard;
