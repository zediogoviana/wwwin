import React from 'react';
import {
  Grid, Label, Segment,
} from 'semantic-ui-react';
import SelectPlayerModal from './SelectPlayerModal';

class FieldBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // loading: true,
    };

    this.handlePlayerClick = this.handlePlayerClick.bind(this);
  }

  handlePlayerClick(e, rating) {
    this.setState({ [rating]: e.target.value });
  }

  render() {
    const {
      tactics, teams, loading, selectPlayer, handleSelectPlayerModal,
      handlePlayerSelection,
    } = this.props;
    return (
      <div className='field-image'>
        {!loading
          ? (
            <Segment basic>
              <SelectPlayerModal
                info={selectPlayer}
                handleSelectPlayerModal={handleSelectPlayerModal}
                teams={teams}
                handlePlayerSelection={handlePlayerSelection}
              />
              <Grid verticalAlign='middle'>

                <Grid.Row columns='equal' className='field-row'>
                  <Grid.Column>
                    <Label
                      as='a'
                      detail={teams.home.starting11[0][0].name}
                      content={teams.home.starting11[0][0].position}
                      onClick={() => handleSelectPlayerModal(true, 'home', 0, 0)}
                      size='large'
                      color='blue'
                    />
                  </Grid.Column>
                </Grid.Row>

                {tactics.home.slice(1, tactics.home.length).map((position, i) => (
                // eslint-disable-next-line react/no-array-index-key
                  <Grid.Row columns='equal' key={i} className='field-row'>
                    {[...Array(position)].map((player, j) => (
                    // eslint-disable-next-line react/no-array-index-key
                      <Grid.Column key={j}>
                        <Label
                          as='a'
                          detail={teams.home.starting11[i + 1][j].name}
                          content={teams.home.starting11[i + 1][j].position}
                          onClick={() => handleSelectPlayerModal(true, 'home', i + 1, j)}
                          size='large'
                          color='black'
                          //style={{ backgroundColor: '#3399ff' }}
                        />
                      </Grid.Column>
                    ))}
                  </Grid.Row>
                ))}
              </Grid>

              <Grid verticalAlign='middle'>
                {tactics.away.slice(1, tactics.away.length).map((position, i) => (
                // eslint-disable-next-line react/no-array-index-key
                  <Grid.Row key={i} columns='equal' className='field-row'>
                    {[...Array(position)].map((player, j) => (
                    // eslint-disable-next-line react/no-array-index-key
                      <Grid.Column key={j}>
                        <Label
                          as='a'
                          detail={teams.away.starting11[i + 1][j].name}
                          content={teams.away.starting11[i + 1][j].position}
                          onClick={() => handleSelectPlayerModal(true, 'away', i + 1, j)}
                          size='large'
                          basic
                          color='black'
                        />
                      </Grid.Column>
                    ))}
                  </Grid.Row>
                ))}

                <Grid.Row columns='equal' className='field-row'>
                  <Grid.Column>
                    <Label
                      as='a'
                      detail={teams.away.starting11[0][0].name}
                      content={teams.away.starting11[0][0].position}
                      onClick={() => handleSelectPlayerModal(true, 'away', 0, 0)}
                      size='large'
                      color='red'
                    />
                  </Grid.Column>
                </Grid.Row>

              </Grid>
            </Segment>
          )
          : <Segment loading basic style={{ height: '80vh' }} />}

      </div>

    );
  }
}

export default FieldBoard;
