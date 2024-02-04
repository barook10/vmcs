import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "./Maintainer.module.css";
import CoinStorage from "../CoinStorage/CoinStorage";
import withVendingMachine from "../Context/VendingMachineWrapper";
import DrinkStorage from "../DrinkStorage/DrinkStorage";
import api from "../../utils/api";

class Maintainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      isPasswordCorrect: false,
    };
  }

  async componentDidMount() {
    const { isPasswordCorrect } = this.state;
    const { dispatch } = this.props.vendingMachineContext;

    if (isPasswordCorrect) {
      try {
        // Fetch sales data from the API
        const response = await api.get("/sales");
        console.log("API Response:", response); // Log the entire response

        const salesData = response.data;


        // Update the context with sales data
        dispatch({
          type: "UPDATE_SALES_INFO",
          payload: {
            sales: salesData.sales,
            totalDrinksSold: salesData.totalDrinksSold,
          },
        });
      } catch (error) {
        console.error("Error fetching sales data:", error.message);
      }
    }
  }

  dispenseCash = () => {
    const { isPasswordCorrect } = this.state;
    const { dispatch } = this.props.vendingMachineContext;

    if (isPasswordCorrect) {
      dispatch({ type: "RESET_SALES" });
    }
  };

  getDenomination = () => {
    const { state, fetchedData } = this.props.vendingMachineContext;
    const totalSales = state.drinks.reduce(
      (total, drink) => total + parseFloat(drink.sales || 0),
      0
    );
    return isNaN(totalSales) ? 0 : totalSales.toFixed(2);
  };

  render() {
    const { password, isPasswordCorrect } = this.state;

    return (
      <div className={styles["sales-container"]}>
        {!isPasswordCorrect ? (
          <div className={styles["input-container"]}>
            <p>Enter password to access the Sales panel:</p>
            <input
              type="password"
              value={password}
              onChange={(e) => this.setState({ password: e.target.value })}
            />
            <button
              onClick={() => {
                if (password === "admin") {
                  this.setState({ isPasswordCorrect: true });
                }
              }}
            >
              Submit
            </button>
          </div>
        ) : (
          <div>
            <Link to="/">
              <button className={styles["collect-cash-button"]}>
                End Simulation
              </button>
            </Link>

            {/* Display sales stats for each drink */}
            <table className={styles["sales-table"]}>
              <thead>
                <tr>
                  <th>Drink Name</th>
                  <th>Total Sales</th>
                  <th>Total Drinks Sold</th>
                  <th>Remaining Stock</th>
                </tr>
              </thead>
              <tbody>
                {this.props.vendingMachineContext.state.drinks.map((drink) => (
                  <tr key={drink.name} className={styles["drink-stats"]}>
                    <td>
                      <DrinkStorage
                        drink={drink}
                        image={drink.image}
                        isSalesView={true}
                      />
                    </td>
                    {/* Additional sales information for each drink */}
                    <td>
                      {drink.sales !== undefined && (
                        <p>Total Sales: RM {Number(drink.sales)}</p>
                      )}
                    </td>
                    <td>
                      {drink.totalSold !== undefined && (
                        <p>Total Drinks Sold: {drink.totalSold}</p>
                      )}
                    </td>
                    <td>
                      {drink.quantity !== undefined && (
                        <p>Remaining Stock: {drink.quantity}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <CoinStorage />

            {/* Button to Collect all cash */}
            <button
              className={styles["collect-cash-button"]}
              onClick={this.dispenseCash}
            >
              Collect all cash
            </button>
            <p>Total Sales: RM {this.getDenomination()}</p>
          </div>
        )}
      </div>
    );
  }
}

export default withVendingMachine(Maintainer);