import React from 'react';
import useApiData from './useApiData';
import DataRenderer from './DataRenderer';
function App() {
  return (
    <div className="App">
      <DataRenderer endpoint="your Desired Endpoint" />
    </div>
  );
}

export default App;
