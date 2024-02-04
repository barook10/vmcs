
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerPanel from '../CustomerPanel/CustomerPanel';
import MachineryControlPanel from '../MachineryControlPanel/MachineryControlPanel';
import MaintainerPanel from '../MaintainerPanel/MaintainerPanel';
import SimulatorControlPanel from '../SimulatorControlPanel/SimulatorControlPanel';
import { VendingMachineProvider } from '../Context/VendingMachineContext';


const App = () => {
  return (
    <VendingMachineProvider>
      <div className="app-container">
        <Router>
          <Routes>
            <Route path='/' element={<SimulatorControlPanel />} />
            <Route path="/customer" element={<CustomerPanel />} />
            <Route path="/MachineryControl" element={<MachineryControlPanel />} />
            <Route path="/Maintainer" element={<MaintainerPanel />} />
            
          </Routes>
        </Router>
      </div>
    </VendingMachineProvider>
  );
};

export default App;