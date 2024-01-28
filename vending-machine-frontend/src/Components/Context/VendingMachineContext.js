import React, { createContext, useContext, useReducer, useEffect } from "react";
import api from "../../utils/api";

const VendingMachineContext = createContext();

const initialState = {
  drinks: [],
  sales: 0,
  totalDrinksSold: 0,
  remainingStock: 0,
  coinStorage: {
    coins: {
      100: 10,
      50: 20,
      20: 10,
      10: 10,
    },
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DRINKS":
      return {
        ...state,
        drinks: action.payload,
      };

    case "ADD_DRINK":
      const newDrink = { ...action.payload, sales: 0, totalSold: 0, cost: 0 };
      return {
        ...state,
        drinks: [...state.drinks, newDrink],
      };

    case "DELETE_DRINK":
      return {
        ...state,
        drinks: state.drinks.filter(
          (drink) => drink.name !== action.payload.name
        ),
      };

    case "BUY_DRINK":
      const updatedState = {
        ...state,
        drinks: state.drinks.map((drink) =>
          drink.name === action.payload.name
            ? {
                ...drink,
                quantity: drink.quantity - 1,
                sales: drink.sales + drink.price,
                totalSold: drink.totalSold + 1,
              }
            : drink
        ),
      };

      // Dispatch an action to record the sale
      api.post(`/sales/${action.payload.id}`, {
        quantity_sold: 1,
        total_sales: action.payload.price,
      });

      return updatedState;

    case "UPDATE_STOCK":
      const remainingStock = state.drinks.reduce(
        (total, drink) => total + drink.quantity,
        0
      );
      return { ...state, remainingStock };

    case "REFILL_DRINK":
      return {
        ...state,
        drinks: state.drinks.map((drink) =>
          drink.name === action.payload.name
            ? { ...drink, quantity: drink.quantity + 1 }
            : drink
        ),
      };

    case "CHANGE_PRICE":
      return {
        ...state,
        drinks: state.drinks.map((drink) =>
          drink.name === action.payload.drink.name
            ? { ...drink, price: action.payload.newPrice }
            : drink
        ),
      };

    case "UPDATE_SALES_INFO":
      return {
        ...state,
        sales: state.sales + action.payload.sales,
        totalDrinksSold: state.totalDrinksSold + action.payload.totalDrinksSold,
      };

    case "RESET_SALES":
      const resetSalesDrinks = state.drinks.map((drink) => ({
        ...drink,
        sales: 0,
      }));
      return {
        ...state,
        drinks: resetSalesDrinks,
        sales: 0,
        totalDrinksSold: 0,
      };

    // Inside the "UPDATE_COIN_STORAGE" case in the reducer
    case "UPDATE_COIN_STORAGE":
      const { change } = action.payload;
      console.log("Updating coinStorage with coins:", change);

      // Deduct change from coin denominations
      let remainingChange = change;
      const updatedCoins = { ...state.coinStorage.coins };

      const availableDenominations = Object.keys(updatedCoins)
        .sort((a, b) => b - a)
        .map(Number);

      availableDenominations.forEach((denomination) => {
        const numberOfCoins = Math.floor(remainingChange / denomination);

        if (numberOfCoins > 0 && updatedCoins[denomination] >= numberOfCoins) {
          updatedCoins[denomination] -= numberOfCoins;
          remainingChange -= numberOfCoins * denomination;
        }
      });

      if (remainingChange === 0) {
        return {
          ...state,
          coinStorage: {
            ...state.coinStorage,
            coins: updatedCoins,
          },
        };
      } else {
        // Handle insufficient change scenario or other logic as needed
        return state; // Return the unchanged state or handle the error as needed
      }

    case "UPDATE_LOCAL_STORAGE":
      localStorage.setItem("drinks", JSON.stringify(state.drinks));
      localStorage.setItem("sales", state.sales.toFixed(2));
      localStorage.setItem("totalDrinksSold", state.totalDrinksSold.toString());
      localStorage.setItem("coinStorage", JSON.stringify(state.coinStorage));
      return state;

    default:
      return state;
  }
};

const VendingMachineProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateSalesInformation = (sales, totalDrinksSold) => {
    dispatch({
      type: "UPDATE_SALES_INFO",
      payload: { sales, totalDrinksSold },
    });
  };

  useEffect(() => {
    // Load coinStorage from local storage and update the initial state
    const storedCoins = JSON.parse(localStorage.getItem("coinStorage")) || {};
    if (Object.keys(storedCoins).length > 0) {
      dispatch({
        type: "UPDATE_COIN_STORAGE",
        payload: { change: storedCoins.coins },
      });
    }

    // Load other data from local storage if needed
    const storedDrinks = JSON.parse(localStorage.getItem("drinks")) || [];
    if (storedDrinks.length > 0) {
      dispatch({ type: "SET_DRINKS", payload: storedDrinks });
    }

    const storedSales = parseFloat(localStorage.getItem("sales")) || 0;
    const storedTotalDrinksSold =
      parseInt(localStorage.getItem("totalDrinksSold")) || 0;

    if (storedSales > 0 || storedTotalDrinksSold > 0) {
      dispatch({
        type: "UPDATE_SALES_INFO",
        payload: { sales: storedSales, totalDrinksSold: storedTotalDrinksSold },
      });
    }
  }, []);

  useEffect(() => {
    // Update local storage when coinStorage changes
    localStorage.setItem("coinStorage", JSON.stringify(state.coinStorage));
  }, [state.coinStorage]);

  useEffect(() => {
    if (state.drinks && state.drinks.length > 0) {
      try {
        localStorage.setItem("drinks", JSON.stringify(state.drinks));
      } catch (error) {
        console.error("Error while saving drinks to local storage:", error);
      }
    }
  }, [state.drinks]);

  return (
    <VendingMachineContext.Provider
      value={{ state, dispatch, updateSalesInformation }}
    >
      {children}
    </VendingMachineContext.Provider>
  );
};

const useVendingMachine = () => {
  const context = useContext(VendingMachineContext);
  if (!context) {
    throw new Error(
      "useVendingMachine must be used within a VendingMachineProvider"
    );
  }
  return context;
};

export { VendingMachineProvider, useVendingMachine };
