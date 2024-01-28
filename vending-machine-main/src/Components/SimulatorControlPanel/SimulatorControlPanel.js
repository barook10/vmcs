import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './SimulatorControlPanel.module.css';

class SimulatorControlPanel extends Component {
  

  render(){
  
  return (
    <div className={styles['simulator-control-panel']}>
      <h2>SIMULATOR CONTROL PANEL</h2>
      <div className={styles.simulation}>
        <Link>BEGIN SIMULATION</Link>
        <Link to="/customer">ACTIVATE CUSTOMER PANEL</Link>
        <Link to="/MachineryControl">ACTIVATE MACHINERY CONTROL</Link>
        <Link to="/Maintainer">ACTIVATE MAINTAINER CONTROL</Link>
      </div>
    </div>
  );
};
}

export default SimulatorControlPanel;
