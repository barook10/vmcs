import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Customer.module.css';
import withVendingMachine from '../Context/VendingMachineWrapper';
import api from '../../utils/api';

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBalance: 0,
      drinkMessages: {},
      selectedDrinks: [],
    };
  }

  handleBuy = async () => {
    const { selectedDrinks, currentBalance } = this.state;
    const { state, dispatch, updateSalesInformation } = this.props.vendingMachineContext;
  
    for (const selectedDrink of selectedDrinks) {
      const newDrinkMessages = { [selectedDrink.name]: '' };
      this.setState({ drinkMessages: newDrinkMessages });
  
      if (selectedDrink.quantity === 0) {
        newDrinkMessages[selectedDrink.name] = 'Out of stock.';
        this.setState({ drinkMessages: newDrinkMessages });
      } else {
        const priceInCents = Math.round(selectedDrink.price * 100);
        const balanceInCents = Math.round(currentBalance * 100);
  
        if (balanceInCents >= priceInCents) {
          const changeInCents = balanceInCents - priceInCents;
  
          console.log("Change:", changeInCents / 100);
  
          await dispatch({
            type: 'UPDATE_COIN_STORAGE',
            payload: {
              totalAmount: state.coinStorage.totalAmount,
              change: changeInCents,
            },
          });
  
          this.setState({ currentBalance: 0 });
  
          await dispatch({ type: 'BUY_DRINK', payload: selectedDrink });
  
          // Call the API to decrease the quantity of the selected drink
          await api.patch(`/drinks/${selectedDrink.id}/decrease-quantity`);
  
          updateSalesInformation(priceInCents, 1); // Update sales information for the purchased drink
  
          newDrinkMessages[selectedDrink.name] = `Purchase successful! Change: RM ${(changeInCents / 100).toFixed(2)}`;
          this.setState({ drinkMessages: newDrinkMessages });
        } else {
          newDrinkMessages[selectedDrink.name] = 'Insufficient balance to make the purchase.';
          this.setState({ drinkMessages: newDrinkMessages });
        }
      }
    }
  
    this.setState({ selectedDrinks: [] });
  };
  

  

  addDenomination = (amount) => {
    this.setState((prevState) => ({
      currentBalance: prevState.currentBalance + amount,
    }));
  };

  handleCheckboxChange = (selectedDrink) => {
    this.setState((prevState) => {
      const { selectedDrinks } = prevState;
      if (selectedDrinks.includes(selectedDrink)) {
        return {
          selectedDrinks: selectedDrinks.filter((drink) => drink !== selectedDrink),
        };
      } else {
        return {
          selectedDrinks: [...selectedDrinks, selectedDrink],
        };
      }
    });
  };

  render() {
    const { currentBalance, selectedDrinks, drinkMessages } = this.state;
    const { state } = this.props.vendingMachineContext;

    return (
      <div className={styles['customer-panel']}>
        <h2>Customer Panel</h2>
        <Link to='/' className={styles['button-container']}>
          <button>End Simulation</button>
        </Link>
        <div className={styles['customer-info']}>
          <p className={styles['balance-text']}>Your Balance: RM {currentBalance.toFixed(2)}</p>
          <div className={styles['button-container']}>
            <button onClick={() => this.addDenomination(0.10)}>Add RM 0.10</button>
            <button onClick={() => this.addDenomination(0.20)}>Add RM 0.20</button>
            <button onClick={() => this.addDenomination(0.50)}>Add RM 0.50</button>
            <button onClick={() => this.addDenomination(1.00)}>Add RM 1.00</button>
          </div>
        </div>
        <div className={styles['customer-drink-list']}>
          <table className={styles['drink-table']}>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.drinks.map((drink) => (
                <tr key={drink.name}>
                  <td>
                    <div className={styles['checkbox-container']}>
                      <input
                        type="checkbox"
                        checked={selectedDrinks.includes(drink)}
                        onChange={() => this.handleCheckboxChange(drink)}
                      />
                    </div>
                  </td>
                  <td>{drink.name}</td>
                  <td>{drink.price}</td>
                  <td>{drink.quantity}</td>
                  <td><img src={drink.image} alt={drink.name} className={styles['drink-image']} /></td>
                  <td>
                    <button onClick={() => this.handleBuy()}>Buy</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          {Object.keys(drinkMessages).map((drinkName) => (
            <p key={drinkName} className={styles['message']}>
              {drinkMessages[drinkName]}
            </p>
          ))}
        </div>
        {/* <CoinStorage/> */}
      </div>
    );
  }
}

export default withVendingMachine(Customer);