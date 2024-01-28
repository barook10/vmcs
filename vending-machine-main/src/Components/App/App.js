
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Customer from '../Customer/Customer';
import MachineryControl from '../MachineryControl/MachineryControl';
import Maintainer from '../Maintainer/Maintainer';
import SimulatorControlPanel from '../SimulatorControlPanel/SimulatorControlPanel';
import { VendingMachineProvider } from '../Context/VendingMachineContext';


const App = () => {
  return (
    <VendingMachineProvider>
      <div className="app-container">
        <Router>
          <Routes>
            <Route path='/' element={<SimulatorControlPanel />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/MachineryControl" element={<MachineryControl />} />
            <Route path="/Maintainer" element={<Maintainer />} />
            
          </Routes>
        </Router>
      </div>
    </VendingMachineProvider>
  );
};

export default App;