import React from 'react';
import useApiData from './useApiData';
import DataRenderer from './DataRenderer';
function App() {
  return (
    <div className="App">
      <DataRenderer endpoint="http://localhost:4000/api/reportingDetails" />
    </div>
  );
}

export default App;
