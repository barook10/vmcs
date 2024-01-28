// Higher-Order Component

import React from 'react';
import { useVendingMachine } from '../Context/VendingMachineContext';

const withVendingMachine = (WrappedComponent) => {
  return (props) => {
    const vendingMachineContext = useVendingMachine();
    return <WrappedComponent {...props} vendingMachineContext={vendingMachineContext} />;
  };
};

export default withVendingMachine;
