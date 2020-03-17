import React from 'react';
import Papa from 'papaparse';
import {
  Button, Dropdown, Grid, Header, Label, List, Segment,
} from 'semantic-ui-react';

class TeamBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileReader: new FileReader(),
      form: 50,
      supporters: 50,
      playStyle: 50,
      error: false,
      // loading: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    this.handleOnChangeFile = this.handleOnChangeFile.bind(this);
    this.handleFileRead = this.handleFileRead.bind(this);
  }

  handleChange(e, rating) {
    this.setState({ [rating]: e.target.value });
  }

  handleLoad() {
    // opens de upload window
    this.refs.fileUploader.click();
  }

  handleOnChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    const { fileReader } = this.state;

    if (event.target.files[0]) {
      fileReader.onloadend = this.handleFileRead;
      fileReader.readAsText(event.target.files[0]);
      this.setState({ fileReader });
    }
    // eslint-disable-next-line no-param-reassign
    event.target.value = null;
  }

  handleFileRead() {
    try {
      const { fileReader } = this.state;
      const { handleLoadPlayers, type } = this.props;
      // const content = fileReader.result;
      Papa.parse(fileReader.result, {
        header: true,
        dynamicTyping: true,
        complete(results) {
          handleLoadPlayers(results.data, type);
        },
      });
    } catch (e) {
      this.setState({ error: true });
    }
  }

  render() {
    const {
      form, supporters, playStyle,
    } = this.state;
    const {
      type, color, team, handleTactics,
    } = this.props;
    const options = [
      { content: '4,3,3', value: '4,3,3', text: '4,3,3' },
      { content: '3,5,2', value: '3,5,2', text: '3,5,2' },
      { content: '4,4,2', value: '4,4,2', text: '4,4,2' },
    ];

    return (
      <Segment tertiary style={{ height: '80vh' }}>
        <Button color={color} fluid content={type.toUpperCase()} />
        <Segment raised>
          <Grid textAlign='left'>
            <Grid.Column width={10}>
              <h3 style={{ color: '#000000' }}>Player List</h3>
            </Grid.Column>
            <Grid.Column width={6}>
              <Button.Group size='mini' floated='right'>
                <Button color={color} basic icon='add' />
                <input
                  type='file'
                  id='file'
                  accept='.csv'
                  ref='fileUploader'
                  style={{ display: 'none' }}
                  onChange={this.handleOnChangeFile}
                />
                <Button color={color} basic icon='upload' onClick={this.handleLoad} />
              </Button.Group>
            </Grid.Column>
          </Grid>

          <List relaxed divided style={{ height: '15vh', overflowY: 'auto', overflowX: 'hidden' }}>
            {team.roster.map((player, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <List.Item key={i}>
                <Grid>
                  <Grid.Column width={7}>
                    {player.name}
                    {' '}
                    (
                    {new Date().getFullYear() - player.birthYear}
                    )
                  </Grid.Column>
                  <Grid.Column width={7}>
                    {player.position}
                    {' '}
                    {player.defense}
                    {' '}
                    -
                    {' '}
                    {player.attack}
                  </Grid.Column>
                </Grid>
              </List.Item>
            ))}
          </List>
        </Segment>

        <Segment raised textAlign='left'>
          <Header as='h3'>
            <Header.Content>
              Tactics:
              {' '}
              <Dropdown
                inline
                options={options}
                defaultValue={options[0].value}
                name={type}
                onChange={handleTactics}
              />
            </Header.Content>
          </Header>
        </Segment>

        <Segment raised textAlign='left'>
          <h3 style={{ color: '#000000' }}>Team Form</h3>
          <Grid verticalAlign='middle' textAlign='center'>
            <Grid.Column width={11}>
              <input
                style={{ width: '100%' }}
                type='range'
                min={0}
                max={100}
                value={form}
                onChange={(e) => this.handleChange(e, 'form')}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <Label style={{ width: 40 }} color={color} content={form} />
            </Grid.Column>
          </Grid>
        </Segment>

        <Segment raised textAlign='left'>
          <h3 style={{ color: '#000000' }}>Supporters</h3>
          <Grid verticalAlign='middle' textAlign='center'>
            <Grid.Column width={11}>
              <input
                style={{ width: '100%' }}
                type='range'
                min={0}
                max={100}
                value={supporters}
                onChange={(e) => this.handleChange(e, 'supporters')}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <Label style={{ width: 40 }} color={color} content={supporters} />
            </Grid.Column>
          </Grid>
        </Segment>

        <Segment raised textAlign='left'>
          <h3 style={{ color: '#000000' }}>Playing Style</h3>
          <Grid verticalAlign='middle' textAlign='center'>
            <Grid.Column width={11}>
              <input
                style={{ width: '100%' }}
                type='range'
                min={0}
                max={100}
                value={playStyle}
                onChange={(e) => this.handleChange(e, 'playStyle')}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <Label style={{ width: 40 }} color={color} content={playStyle} />
            </Grid.Column>
          </Grid>
        </Segment>
      </Segment>
    );
  }
}

export default TeamBoard;
