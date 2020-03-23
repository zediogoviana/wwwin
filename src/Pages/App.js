import React from 'react';
import './App.css';
import { Grid, Segment } from 'semantic-ui-react';
import TeamBoard from '../Components/TeamBoard';
import FieldBoard from '../Components/FieldBoard';
import ResultBoard from '../Components/ResultBoard';
import { startSimulation } from '../Simulation/Engine';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gameType: '11v11',
      referee: 50,
      teams: {
        home: {
          type: 'home',
          name: 'Team 1',
          starting11: [],
          roster: [],
          form: 50,
          supporters: 50,
          playingStyle: 50,
        },
        away: {
          type: 'away',
          name: 'Team 2',
          starting11: [],
          roster: [],
          form: 50,
          supporters: 50,
          playingStyle: 50,
        },
      },
      game: {
        home: {
          goals: 0,
          redCards: 0,
        },
        away: {
          goals: 0,
          redCards: 0,
        },
        minute: 0,
        log: [],
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
      gameLog: false,
      loading: true,
      disabled: false,
    };

    this.tacticsOptions = {
      '11v11': [
        { content: '4,3,3', value: '4,3,3', text: '4,3,3' },
        { content: '3,5,2', value: '3,5,2', text: '3,5,2' },
        { content: '4,4,2', value: '4,4,2', text: '4,4,2' },
      ],
      '7v7': [
        { content: '2,3,1', value: '2,3,1', text: '2,3,1' },
        { content: '3,2,1', value: '3,2,1', text: '3,2,1' },
        { content: '2,2,2', value: '2,2,2', text: '2,2,2' },
      ],
      '5v5': [
        { content: '1,2,1', value: '1,2,1', text: '1,2,1' },
        { content: '2,1,1', value: '2,1,1', text: '2,1,1' },
      ],
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
    this.handleStartSimulation = this.handleStartSimulation.bind(this);
    this.handleGameType = this.handleGameType.bind(this);
    this.handleGameLogModal = this.handleGameLogModal.bind(this);
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
      // eslint-disable-next-line no-plusplus
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

  handleGameType(e, gameType) {
    this.setState({ loading: true });
    this.handleTactics(null, {
      name: 'home',
      value: this.tacticsOptions[gameType.value][0].text,
    });
    this.handleTactics(null, {
      name: 'away',
      value: this.tacticsOptions[gameType.value][0].text,
    });
    this.setState({ gameType: gameType.value, loading: false });
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

  handleGameLogModal(value) {
    this.setState({ gameLog: value });
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

  resetGame() {
    const { game } = this.state;
    game.log = [];
    game.home.goals = 0;
    game.away.goals = 0;
    game.home.redCards = 0;
    game.away.redCards = 0;
    this.setState({ game });
  }

  handleStartSimulation() {
    this.setState({ loading: true, disabled: true });
    const { teams, game, referee } = this.state;
    this.resetGame();
    setTimeout(() => {
      startSimulation(teams, game, referee);
      this.setState({ loading: false, disabled: false });
    }, 1000);
  }

  render() {
    const {
      tactics, teams, loading, selectPlayer, disabled,
      referee, createPlayer, game, gameType, gameLog,
    } = this.state;

    return (
      <div className='App'>
        <Segment basic>
          <Grid stackable>
            <Grid.Row columns='equal' className='result-board'>
              <Grid.Column>
                <ResultBoard
                  disabled={disabled}
                  referee={referee}
                  gameLog={gameLog}
                  handleGameLogModal={this.handleGameLogModal}
                  log={game.log}
                  handleGameType={this.handleGameType}
                  handleTeamNameChange={this.handleTeamNameChange}
                  handleRatingChange={this.handleRatingChange}
                  handleStartSimulation={this.handleStartSimulation}
                  teams={teams}
                  game={game}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={4}>
                <TeamBoard
                  type='home'
                  color='blue'
                  team={teams.home}
                  disabled={disabled}
                  tacticsOptions={this.tacticsOptions[gameType]}
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
                  disabled={disabled}
                  tacticsOptions={this.tacticsOptions[gameType]}
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
