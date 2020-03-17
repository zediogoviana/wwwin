import React from 'react';
import './App.css';
import { Grid, Segment } from 'semantic-ui-react';
import TeamBoard from './TeamBoard';
import FieldBoard from './FieldBoard';
import ResultBoard from './ResultBoard';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: {
        home: {
          name: 'Team 1',
          starting11: [],
          roster: [],
        },
        away: {
          name: 'Team 2',
          starting11: [],
          roster: [],
        },
      },
      tactics: {
        home: [1, 4, 3, 3],
        away: [1, 3, 3, 4], // reversed for lineup
      },
      loading: true,
    };

    this.handleTactics = this.handleTactics.bind(this);
    this.handleLoadPlayers = this.handleLoadPlayers.bind(this);
  }

  componentDidMount() {
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

  render() {
    const { tactics, teams, loading } = this.state;

    return (
      <div className='App'>
        <Segment basic>
          <Grid stackable>
            <Grid.Row columns='equal' style={{ height: '16vh' }}>
              <Grid.Column>
                <ResultBoard />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={4}>
                <TeamBoard
                  type='home'
                  color='blue'
                  team={teams.home}
                  handleTactics={this.handleTactics}
                  handleLoadPlayers={this.handleLoadPlayers}
                />
              </Grid.Column>
              <Grid.Column width={8}>
                <FieldBoard
                  tactics={tactics}
                  teams={teams}
                  loading={loading}
                />
              </Grid.Column>
              <Grid.Column width={4}>
                <TeamBoard
                  type='away'
                  color='red'
                  team={teams.away}
                  handleTactics={this.handleTactics}
                  handleLoadPlayers={this.handleLoadPlayers}
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
