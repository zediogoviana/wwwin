import React from 'react';
import './App.css';
import { Grid, Segment } from 'semantic-ui-react';
import TeamBoard from '../Components/TeamBoard';
import FieldBoard from '../Components/FieldBoard';
import ResultBoard from '../Components/ResultBoard';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      referee: 50,
      teams: {
        home: {
          name: 'Team 1',
          starting11: [],
          roster: [],
          form: 50,
          supporters: 50,
          playingStyle: 50,
        },
        away: {
          name: 'Team 2',
          starting11: [],
          roster: [],
          form: 50,
          supporters: 50,
          playingStyle: 50,
        },
      },
      tactics: {
        home: [1, 4, 3, 3],
        away: [1, 3, 3, 4], // reversed for lineup
      },
      selectPlayer: {
        open: false,
        team: '',
        positionX: -1,
        positionY: -1,
      },
      createPlayer: {
        open: false,
        team: '',
      },
      loading: true,
    };

    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.handleTactics = this.handleTactics.bind(this);
    this.handleLoadPlayers = this.handleLoadPlayers.bind(this);
    this.handleSelectPlayerModal = this.handleSelectPlayerModal.bind(this);
    this.handleCreatePlayerModal = this.handleCreatePlayerModal.bind(this);
    this.handlePlayerSelection = this.handlePlayerSelection.bind(this);
    this.handlePlayerCreation = this.handlePlayerCreation.bind(this);
    this.handleTeamNameChange = this.handleTeamNameChange.bind(this);
    this.handleDeletePlayer = this.handleDeletePlayer.bind(this);
  }

  componentDidMount() {
    document.title = 'WWWin';
    const { tactics } = this.state;
    this.buildTeam(tactics.home, 'home');
    this.buildTeam(tactics.away, 'away');
    this.setState({ loading: false });
  }

  buildTeam(tactics, type) {
    const team = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tactics.length; i++) {
      team.push([]);
      for (let j = 0; j < tactics[i]; j++) {
        team[i].push({
          name: '',
          attack: 0,
          defense: 0,
          position: '',
          birthYear: 0,
        });
      }
    }
    const { teams } = this.state;
    teams[type].starting11 = team;
    this.setState({ teams });
  }

  handleTactics(e, team) {
    this.setState({ loading: true });
    const { tactics } = this.state;
    tactics[team.name] = team.value.split(',').map(Number); // convert '4,3,3' to [4,3,3,1]
    if (team.name === 'away') {
      tactics[team.name].reverse(); // reversed for lineup
    }
    tactics[team.name].unshift(1); // (1 is GK)
    this.buildTeam(tactics[team.name], team.name);
    this.setState({ tactics, loading: false });
  }

  handleLoadPlayers(players, team) {
    this.setState({ loading: true });
    const { teams } = this.state;
    teams[team].roster = players;
    this.setState({ teams, loading: false });
  }

  handleSelectPlayerModal(value, team, positionX, positionY) {
    this.setState({
      selectPlayer: {
        open: value, team, positionX, positionY,
      },
    });
  }

  handleCreatePlayerModal(value, team) {
    this.setState({
      createPlayer: {
        open: value, team,
      },
    });
  }

  handlePlayerSelection(player) {
    const { teams, selectPlayer } = this.state;
    const { team, positionX, positionY } = selectPlayer;
    teams[team].starting11[positionX][positionY] = player;
    selectPlayer.open = false;
    this.setState({ teams, selectPlayer });
  }

  handlePlayerCreation(player) {
    const { teams, createPlayer } = this.state;
    const { team } = createPlayer;
    teams[team].roster.push(player);
    createPlayer.open = false;
    this.setState({ teams, createPlayer });
  }

  handleDeletePlayer(index, team) {
    const { teams } = this.state;
    teams[team].roster.splice(index, 1);
    // TODO remove player also from starting 11
    this.setState({ teams });
  }

  handleTeamNameChange(e) {
    const el = (e.target ? e.target : e);
    const { teams } = this.state;
    teams[el.name].name = el.value;
    this.setState({ teams });
  }

  handleRatingChange(e, rating, team) {
    if (team === 'referee') {
      this.setState({ referee: e.target.value });
    } else {
      const { teams } = this.state;
      teams[team][rating] = e.target.value;
      this.setState({ teams });
    }
  }

  render() {
    const {
      tactics, teams, loading, selectPlayer, referee, createPlayer,
    } = this.state;

    return (
      <div className='App'>
        <Segment basic>
          <Grid stackable>
            <Grid.Row columns='equal' className='result-board'>
              <Grid.Column>
                <ResultBoard
                  referee={referee}
                  handleTeamNameChange={this.handleTeamNameChange}
                  handleRatingChange={this.handleRatingChange}
                  teams={teams}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={4}>
                <TeamBoard
                  type='home'
                  color='blue'
                  team={teams.home}
                  handleRatingChange={this.handleRatingChange}
                  handleTactics={this.handleTactics}
                  handleLoadPlayers={this.handleLoadPlayers}
                  handleDeletePlayer={this.handleDeletePlayer}
                  handleCreatePlayerModal={this.handleCreatePlayerModal}
                  handlePlayerCreation={this.handlePlayerCreation}
                  createPlayer={createPlayer}
                />
              </Grid.Column>
              <Grid.Column width={8}>
                <FieldBoard
                  tactics={tactics}
                  teams={teams}
                  loading={loading}
                  handleSelectPlayerModal={this.handleSelectPlayerModal}
                  handlePlayerSelection={this.handlePlayerSelection}
                  selectPlayer={selectPlayer}
                />
              </Grid.Column>
              <Grid.Column width={4}>
                <TeamBoard
                  type='away'
                  color='red'
                  team={teams.away}
                  handleRatingChange={this.handleRatingChange}
                  handleTactics={this.handleTactics}
                  handleLoadPlayers={this.handleLoadPlayers}
                  handleDeletePlayer={this.handleDeletePlayer}
                  handleCreatePlayerModal={this.handleCreatePlayerModal}
                  handlePlayerCreation={this.handlePlayerCreation}
                  createPlayer={createPlayer}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    );
  }
}

export default App;
