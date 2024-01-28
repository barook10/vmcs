import React, { Component } from 'react';
import withVendingMachine from '../Context/VendingMachineWrapper';
import styles from './CoinStorage.module.css';

class CoinStorage extends Component {
   
  render(){

    const { state } = this.props.vendingMachineContext

  
  return (
    <div className={styles['coin-storage-container']}>
      <h2>Coin Storage</h2>
      <table className={styles['coin-table']}>
        <thead>
          <tr>
            <th>Coin Value</th>
            <th>Coin Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(state.coinStorage.coins).map(([coinValue, coinCount]) => (
            <tr key={coinValue}>
              <td>{`${coinValue} cent`}</td>
              <td>{coinCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
}

export default withVendingMachine (CoinStorage);
