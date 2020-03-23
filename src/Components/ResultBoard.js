import React, { useState } from 'react';
import {
  Button, Dropdown, Grid, Header, Icon, Input, Label, Segment,
} from 'semantic-ui-react';
import GameLogModal from './GameLogModal';

function ResultBoard(props) {
  const [editHome, setEditHome] = useState(false);
  const [editAway, setEditAway] = useState(false);

  const {
    referee, teams, handleTeamNameChange, handleRatingChange,
    handleStartSimulation, game, handleGameType, disabled,
    gameLog, handleGameLogModal, log,
  } = props;
  const options = [
    { content: '11v11', value: '11v11', text: '11v11' },
    { content: '7v7', value: '7v7', text: '7v7' },
    { content: '5v5', value: '5v5', text: '5v5' },
  ];

  return (
    <Segment loading={disabled} tertiary>
      <GameLogModal open={gameLog} handleGameLogModal={handleGameLogModal} log={log} />
      <Grid stackable divided verticalAlign='middle'>
        <Grid.Column width={4} textAlign='left'>
          <Header as='h3'>
            <Header.Content>
              Number of Players:
              {' '}
              <Dropdown
                inline
                options={options}
                defaultValue={options[0].value}
                onChange={handleGameType}
              />
            </Header.Content>
          </Header>
          <Button
            content='Simulate'
            icon='play'
            labelPosition='left'
            color='black'
            fluid
            onClick={handleStartSimulation}
          />
        </Grid.Column>

        <Grid.Column width={8} textAlign='center'>
          <Grid columns='equal'>
            <Grid.Column>
              {editHome
                ? (
                  <Input
                    name='home'
                    value={teams.home.name}
                    onChange={handleTeamNameChange}
                    onKeyDown={(e) => setEditHome(!(e.keyCode === 13))}
                    style={{ paddingBottom: '12px', width: '100%' }}
                  />
                )
                : (
                  <h1>
                    {teams.home.name}
                    <Icon fitted name='pencil alternate' size='mini' inverted color='grey' circular link onClick={() => setEditHome(true)} />
                  </h1>
                )}
              <Label color='red' content={game.home.redCards} />
              <Label color='yellow' content='0' />
            </Grid.Column>
            <Grid.Column>
              <h1>
                {game.home.goals}
                {' '}
                -
                {' '}
                {game.away.goals}
              </h1>
              <Button
                content='Game Log'
                color='black'
                fluid
                onClick={() => handleGameLogModal(true)}
              />
            </Grid.Column>
            <Grid.Column>
              {editAway
                ? (
                  <Input
                    required
                    maxLength='10'
                    name='away'
                    value={teams.away.name}
                    onChange={handleTeamNameChange}
                    onKeyDown={(e) => setEditAway(!(e.keyCode === 13))}
                    style={{ paddingBottom: '12px', width: '100%' }}
                  />
                )
                : (
                  <h1>
                    {teams.away.name}
                    <Icon fitted name='pencil alternate' size='mini' inverted color='grey' circular link onClick={() => setEditAway(true)} />
                  </h1>
                )}
              <Label color='red' content={game.away.redCards} />
              <Label color='yellow' content='0' />
            </Grid.Column>
          </Grid>
        </Grid.Column>

        <Grid.Column width={4} textAlign='left'>
          <Label
            color='black'
            attached='top right'
            content='Github'
            icon='github'
            as='a'
            href='https://github.com/zediogoviana/wwwin'
          />
          <h3 style={{ color: '#000000' }}>Referee Personality</h3>
          <Grid verticalAlign='middle' textAlign='center'>
            <Grid.Column width={12}>
              <input
                style={{ width: '100%' }}
                type='range'
                min={0}
                max={100}
                value={referee}
                onChange={(e) => handleRatingChange(e, '', 'referee')}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Label style={{ width: 40 }} color='black' content={referee} />
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}

export default ResultBoard;
