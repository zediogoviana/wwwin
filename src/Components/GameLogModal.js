import React from 'react';
import {
  Button, Icon, List, Modal,
} from 'semantic-ui-react';

// eslint-disable-next-line react/prefer-stateless-function
class GameLogModal extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  icon(logType) {
    if (logType === 'game') return { name: 'stopwatch', color: 'black' };
    if (logType === 'red') return { name: 'stop', color: 'red' };
    // if (logType === 'yellow') return { name: '', color: 'black' };
    // if (logType === 'injury') return { name: 'medkit', color: 'black' };
    // if (logType === 'sub') return { name: '', color: 'black' };
    if (logType === 'goal') return { name: 'futbol outline', color: 'black' };
    if (logType === 'failed') return { name: 'ban', color: 'red' };
    return '';
  }

  render() {
    const {
      log, handleGameLogModal, open,
    } = this.props;
    return (
      <Modal open={open}>
        <Modal.Header>Game Log</Modal.Header>
        <Modal.Content>
          <List relaxed divided size='big' style={{ maxHeight: '50vh', overflowY: 'auto', overflowX: 'hidden' }}>
            {log.map((info, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <List.Item key={i}>
                <Icon name={this.icon(info.type).name} color={this.icon(info.type).color} />
                {info.value}
              </List.Item>
            ))}
          </List>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => handleGameLogModal(false)} content='Close' />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default GameLogModal;
