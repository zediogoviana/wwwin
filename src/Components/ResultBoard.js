import React from 'react';
import {
  Button, Dropdown, Grid, Header, Icon, Input, Label, Segment,
} from 'semantic-ui-react';

class ResultBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editHome: false,
      editAway: false,
    };

    this.handleEditTeamName = this.handleEditTeamName.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddEnterKey = this.handleAddEnterKey.bind(this);
  }

  handleChange(e, rating) {
    this.setState({ [rating]: e.target.value });
  }

  handleAddEnterKey(e, team) {
    if (e.keyCode === 13) {
      this.handleEditTeamName(team, false);
    }
  }

  handleEditTeamName(team, value) {
    this.setState({ [team]: value });
  }

  render() {
    const {
      editHome, editAway,
    } = this.state;
    const {
      referee, teams, handleTeamNameChange, handleRatingChange,
    } = this.props;
    const options = [
      { content: '11v11', value: '11v11', text: '11v11' },
      { content: '7v7', value: '7v7', text: '7v7' },
      { content: '5v5', value: '5v5', text: '5v5' },
    ];

    return (
      <Segment tertiary>
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
                />
              </Header.Content>
            </Header>
            <Button content='Simulate' icon='play' labelPosition='left' color='black' fluid />
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
                      onKeyDown={(e) => this.handleAddEnterKey(e, 'editHome')}
                      style={{ paddingBottom: '12px', width: '100%' }}
                    />
                  )
                  : (
                    <h1>
                      {teams.home.name}
                      <Icon fitted name='pencil alternate' size='mini' inverted color='grey' circular link onClick={() => this.handleEditTeamName('editHome', true)} />
                    </h1>
                  )}
                <Label color='red' content='0' />
                <Label color='yellow' content='0' />
              </Grid.Column>
              <Grid.Column>
                <h1>0 - 0</h1>
                <Button content='Game Log' color='black' fluid />
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
                      onKeyDown={(e) => this.handleAddEnterKey(e, 'editAway')}
                      style={{ paddingBottom: '12px', width: '100%' }}
                    />
                  )
                  : (
                    <h1>
                      {teams.away.name}
                      <Icon fitted name='pencil alternate' size='mini' inverted color='grey' circular link onClick={() => this.handleEditTeamName('editAway', true)} />
                    </h1>
                  )}
                <Label color='red' content='0' />
                <Label color='yellow' content='0' />
              </Grid.Column>
            </Grid>
          </Grid.Column>

          <Grid.Column width={4} textAlign='left'>
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
}

export default ResultBoard;
