import React, { useEffect, useState } from 'react';
import styles from './CoinStorage.module.css';
import api from '../../utils/api'; 

const CoinStorage = ({ vendingMachineContext }) => {

  const [coinStorageData, setCoinStorageData] = useState(null);

  useEffect(() => {
    const fetchCoinStorageData = async () => {
      try {
        const response = await api.get('/get-coin-storage'); // Updated endpoint for fetching coin storage data
        setCoinStorageData(response.data.coins);
      } catch (error) {
        console.error('Error fetching coin storage data:', error);
        // Handle error as needed
      }
    };

    fetchCoinStorageData();
  }, []); // Empty dependency array means this effect runs once on mount

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
          {/* Iterate through the fetched coin storage data */}
          {coinStorageData &&
            Object.entries(coinStorageData).map(([coinValue, coinCount]) => (
              <tr key={coinValue}>
                <td>{`${coinValue} cent`}</td>
                <td>{coinCount}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoinStorage
