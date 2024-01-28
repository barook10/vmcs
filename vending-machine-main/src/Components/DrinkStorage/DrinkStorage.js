import React, { Component } from "react";
import styles from "./Drink.module.css";

class DrinkStorage extends Component {
  constructor(props) {
    super(props);
    console.log("DrinkStorage Constructor - props:", props);
    this.state = {
      price: this.props.drink.price || 0,
      newPriceInput: "",
    };
  }

  setNewPrice = (e) => {
    this.setState({ newPriceInput: e.target.value });
  };

  handlePriceSubmit = () => {
    const newPrice = parseFloat(this.state.newPriceInput);
    if (!isNaN(newPrice)) {
      this.setState({ price: newPrice, newPriceInput: "" });
      this.props.getNewPrice(newPrice);
    } else {
      alert("Please enter a valid number for the new price.");
    }
  };

  render() {
    const { name, quantity, image } = this.props.drink;
    const { price, newPriceInput } = this.state;
    const { onBuy, addQuantity, deleteDrink, isCustomerView, isSalesView } =
      this.props;

    const formattedPrice = `RM ${price}`;

    return (
      <div className={styles["drink-box"]}>
        <img
          src={image}
          alt={name}
          style={{ width: "100px", height: "100px" }}
        />
        <h3>{name}</h3>
        <p>{formattedPrice}</p>

        {isSalesView ? null : <p>Quantity: {quantity}</p>}

        {isCustomerView ? (
          <button onClick={onBuy}>Buy</button>
        ) : (
          <div>
            {isSalesView ? null : (
              <button onClick={() => addQuantity(this.props.drink)}>
                Refill
              </button>
            )}
            {isSalesView ? null : (
              <div>
                <input
                  className={styles["drink-input"]}
                  type="number"
                  placeholder="New Price"
                  value={newPriceInput}
                  onChange={this.setNewPrice}
                />
                <button onClick={this.handlePriceSubmit}>Change Price</button>
                <br />
                <br />
                <button onClick={() => deleteDrink(this.props.drink)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default DrinkStorage;
