import React from 'react';
import {
  Grid, Label, Segment,
} from 'semantic-ui-react';

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
    const { tactics, teams, loading } = this.props;
    return (
      <div className='field-image'>
        {!loading
          ? (
            <Segment basic>
              <Grid verticalAlign='middle'>

                <Grid.Row columns='equal' style={{ height: '10vh' }}>
                  <Grid.Column>
                    <Label
                      as='a'
                      content={teams.home.starting11[0][0].name}
                      detail={teams.home.starting11[0][0].position}
                      basic
                      color='black'
                    />
                  </Grid.Column>
                </Grid.Row>

                {tactics.home.slice(1, tactics.home.length).map((position, i) => (
                // eslint-disable-next-line react/no-array-index-key
                  <Grid.Row columns='equal' key={i} style={{ height: '10vh' }}>
                    {[...Array(position)].map((player, j) => (
                    // eslint-disable-next-line react/no-array-index-key
                      <Grid.Column key={j}>
                        <Label
                          as='a'
                          content={teams.home.starting11[i + 1][j].name}
                          detail={teams.home.starting11[i + 1][j].position}
                          color='blue'
                        />
                      </Grid.Column>
                    ))}
                  </Grid.Row>
                ))}
              </Grid>

              <Grid verticalAlign='middle'>
                {tactics.away.slice(1, tactics.away.length).map((position, i) => (
                // eslint-disable-next-line react/no-array-index-key
                  <Grid.Row key={i} columns='equal' style={{ height: '10vh' }}>
                    {[...Array(position)].map((player, j) => (
                    // eslint-disable-next-line react/no-array-index-key
                      <Grid.Column key={j}>
                        <Label
                          as='a'
                          content={teams.away.starting11[i + 1][j].name}
                          detail={teams.away.starting11[i + 1][j].position}
                          color='red'
                        />
                      </Grid.Column>
                    ))}
                  </Grid.Row>
                ))}

                <Grid.Row columns='equal' style={{ height: '10vh' }}>
                  <Grid.Column>
                    <Label
                      as='a'
                      content={teams.away.starting11[teams.away.starting11.length - 1][0].name}
                      detail={teams.away.starting11[teams.away.starting11.length - 1][0].position}
                      basic
                      color='black'
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
