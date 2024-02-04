import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './MachineryControl.module.css';
import withVendingMachine from '../Context/VendingMachineWrapper';
import api from '../../utils/api';
import DrinkStorage from '../DrinkStorage/DrinkStorage';

class MachineryControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      isPasswordCorrect: false,
      invalidPasswordAttempt: false,
      newDrinkName: '',
      newDrinkPrice: '',
      newDrinkQuantity: '',
      newDrinkImage: '',
    };
  }

  async componentDidMount() {
    // Fetch drinks from the API and update the state
    try {
      const response = await api.get('/drinks');
      const drinks = response.data;
      this.props.vendingMachineContext.dispatch({ type: 'SET_DRINKS', payload: drinks });
    } catch (error) {
      console.error('Error fetching drinks:', error.message);
    }
  }

  addDrink = async () => {
    const { isPasswordCorrect, newDrinkName, newDrinkPrice, newDrinkQuantity, newDrinkImage } = this.state;
    const { dispatch } = this.props.vendingMachineContext;

    if (isPasswordCorrect) {
      const newDrink = {
        name: newDrinkName,
        price: parseFloat(newDrinkPrice),
        quantity: parseInt(newDrinkQuantity),
        image: newDrinkImage,
      };

      try {
        // Add the new drink to the API
        const response = await api.post('/drinks', newDrink);
        const createdDrink = response.data;

        // Update the state with the created drink
        dispatch({ type: 'ADD_DRINK', payload: createdDrink });
      } catch (error) {
        console.error('Error adding drink:', error.message);
        console.error('Error response:', error.response.data);
      }

      // Reset the input fields
      this.setState({
        newDrinkName: '',
        newDrinkPrice: '',
        newDrinkQuantity: '',
        newDrinkImage: '',
      });
    }
  };

  deleteDrink = async (drink) => {
    const { isPasswordCorrect } = this.state;
    const { dispatch } = this.props.vendingMachineContext;

    if (isPasswordCorrect) {
      try {
        // Delete the drink from the API
        await api.delete(`/drinks/${drink.id}`);

        // Update the state by removing the deleted drink
        dispatch({ type: 'DELETE_DRINK', payload: drink });
      } catch (error) {
        console.error('Error deleting drink:', error.message);
        console.error('Error response:', error.response.data);
      }
    }
  };

  addQuantity = async (drink) => {
    const { isPasswordCorrect } = this.state;
    const { dispatch } = this.props.vendingMachineContext;

    if (isPasswordCorrect) {
      try {
        // Increase the quantity of the drink in the API
        await api.post(`/drinks/${drink.id}/add-quantity`);

        // Update the state with the updated drink
        dispatch({ type: 'REFILL_DRINK', payload: drink });
      } catch (error) {
        console.error('Error adding quantity:', error.message);
      }
    }
  };

  getNewPrice = async (drink, newPrice) => {
    const { isPasswordCorrect } = this.state;
    const { dispatch } = this.props.vendingMachineContext;

    if (isPasswordCorrect) {
      if (!isNaN(newPrice) && newPrice >= 0) {
        try {
          // Change the price of the drink in the API
          await api.put(`/drinks/${drink.id}`, { price: parseFloat(newPrice) });

          // Update the state with the updated drink
          dispatch({ type: 'CHANGE_PRICE', payload: { drink, newPrice } });
        } catch (error) {
          console.error('Error changing price:', error.message);
        }
      } else {
        alert('Invalid new price:', newPrice);
      }
    }
  };

  render() {
    const {
      password,
      isPasswordCorrect,
      invalidPasswordAttempt,
      newDrinkName,
      newDrinkPrice,
      newDrinkQuantity,
      newDrinkImage,
    } = this.state;
    const { state } = this.props.vendingMachineContext;

    return (
      <div className={styles['machinery-control-panel']}>
        {!isPasswordCorrect ? (
          <div className={styles['input-container']}>
            <p>Enter password to access the Machinery Control panel:</p>
            <input
              type="password"
              value={password}
              onChange={(e) => this.setState({ password: e.target.value })}
            />
            <button
              onClick={() => {
                if (password === 'admin') {
                  this.setState({
                    isPasswordCorrect: true,
                    invalidPasswordAttempt: false,
                  });
                } else {
                  this.setState({ invalidPasswordAttempt: true });
                }
              }}
            >
              Submit
            </button>
            {invalidPasswordAttempt && (
              <p className={styles['error-message']}>Invalid password. Please try again.</p>
            )}
          </div>
        ) : (
          <div>
            <Link to="/">
              <button className={styles.btn}>End Simulation</button>
              <button className={styles.btn1}>Lock</button>
            </Link>
            <div className={styles['drink-list']}>
              {state.drinks.map((drink) => (
                <div key={drink.name}>
                  <DrinkStorage
                    drink={drink}
                    addQuantity={() => this.addQuantity(drink)}
                    getNewPrice={(newPrice) => this.getNewPrice(drink, newPrice)}
                    deleteDrink={() => this.deleteDrink(drink)}
                  />
                </div>
              ))}
            </div>
            <div className={styles['input-container']}>
              <h3>Add New Drink</h3>
              <input
                type="text"
                placeholder="Drink Name"
                value={newDrinkName}
                onChange={(e) => this.setState({ newDrinkName: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                value={newDrinkPrice}
                onChange={(e) => this.setState({ newDrinkPrice: e.target.value })}
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newDrinkQuantity}
                onChange={(e) => this.setState({ newDrinkQuantity: e.target.value })}
              />
              <input
                type="url"
                placeholder="Image URL"
                value={newDrinkImage}
                onChange={(e) => this.setState({ newDrinkImage: e.target.value })}
              />
              <button onClick={this.addDrink}>Add Drink</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withVendingMachine(MachineryControl);
