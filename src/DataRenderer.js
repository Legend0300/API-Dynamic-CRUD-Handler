import React, { useState, useEffect } from "react";
import useApiData from "./useApiData";
import axios from "axios";

function DataRenderer({ endpoint }) {
  const { data, loading, setData } = useApiData(endpoint);
  
  //roles can be anything fetch from session or JWT and add it here to access Edit Delete Create functionality dynamically
  const role = "admin"; // Replace with the actual role value from your app

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [showCreatePopup, setShowCreatePopup] = useState(false);

  const editAction = async () => {
    try {
      await axios.put(endpoint + "/" + editedData._id, editedData);

      // Update the data state with the edited data
      setData((prevData) =>
        prevData.map((item) => (item._id === editedData._id ? editedData : item))
      );

      // Close the edit popup
      setShowEditPopup(false);
    } catch (error) {
      console.error("Error during edit:", error);
    }
  };

  const deleteAction = async (item) => {
    try {
      await axios.delete(endpoint + "/" + item._id);

      // Update the data state by removing the deleted item
      setData((prevData) => prevData.filter((dataItem) => dataItem._id !== item._id));
    } catch (error) {
      console.error("Error during delete:", error);
    }
  };

  const handleEditClick = (item) => {
    setEditedData(item);
    setShowEditPopup(true);
  };

  const handleClosePopup = () => {
    setEditedData(null);
    setShowEditPopup(false);
  };

  const handleCreateClick = () => {
    setShowCreatePopup(true);
  };

  const handleCreateSubmit = async (event, formData) => {
    event.preventDefault();
    try {
      const { _id, ...dataWithoutId } = formData;
      const response = await axios.post(endpoint, dataWithoutId);

      setData((prevData) => [...prevData, response.data]);

      setShowCreatePopup(false);
    } catch (error) {
      console.error("Error during create:", error);
    }
  };
  

  const renderFormFields = () => {
    if (!data.length) {
      return null;
    }

    const firstItem = data[0];
    const propertyNames = Object.keys(firstItem);

    return propertyNames.map((propertyName) => {
      const propertyValue = firstItem[propertyName];
      return (
        <div key={propertyName} className="mb-2">
          <label className="font-bold">{propertyName}:</label>
          <input
            type="text"
            name={propertyName}
            value={editedData ? editedData[propertyName] || "" : ""}
            onChange={(e) => setEditedData((prevData) => ({ ...prevData, [propertyName]: e.target.value }))}
            className="border rounded px-2 py-1"
          />
        </div>
      );
    });
  };

  const handleSaveClick = () => {
    editAction();
  };

  useEffect(() => {
    if (!loading && editedData) {
      setData((prevData) =>
        prevData.map((item) => (item._id === editedData._id ? editedData : item))
      );
    }
  }, [loading, editedData, setData]);

  if (loading) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  function renderTableCell(value, keyPath = "") {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        return value.map((item, index) => (
          <ul key={index}>
            <li>{renderTableCell(item, keyPath + "[" + index + "]")}</li>
          </ul>
        ));
      } else {
        return (
          <table className="table table-bordered table-striped">
            <tbody>
              {Object.entries(value).map(([key, val], index) => (
                <tr key={index}>
                  <td>{keyPath ? keyPath + "." + key : key}</td>
                  <td>{renderTableCell(val, keyPath + "." + key)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
    }
    return (
      <input
        type="text"
        value={value || ""}
        onChange={(e) => setEditedData((prevData) => ({ ...prevData, [keyPath]: e.target.value }))}
        className="border rounded px-2 py-1"
      />
    );
  }
  
  
  
  
  
  

  return (
    <div className="data-table">
      {/* Edit Popup */}
      {showEditPopup && (
        <div className="popup fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
          <div className="w-full max-w-lg bg-white p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Data</h2>
            <div>
              {Object.entries(editedData).map(([key, val]) => (
                <div key={key} className="mb-2">
                  <label className="font-bold">{key}:</label>
                  <input
                    type="text"
                    value={val || ""}
                    onChange={(e) => setEditedData((prevData) => ({ ...prevData, [key]: e.target.value }))}
                    className="border rounded px-2 py-1"
                  />
                </div>
              ))}
            </div>
            <div className="flex mt-4 justify-end">
              <button
                onClick={handleSaveClick}
                className="bg-blue-500 text-white px-4 py-2 mr-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={handleClosePopup}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Popup */}
      {showCreatePopup && (
        <div className="popup fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
          <div className="w-full max-w-lg bg-white p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Create New Entity</h2>
            <form onSubmit={(event) => handleCreateSubmit(event, editedData)} className="mb-4">
              {renderFormFields()}
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreatePopup(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Create Button */}
      <button
        onClick={handleCreateClick}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
      >
        +
      </button>

      {/* Table */}
      <table className="table table-bordered table-striped w-full">
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key} className="border px-4 py-2 font-bold">
                {key}
              </th>
            ))}
            {role === "admin" && <th className="border px-4 py-2 font-bold">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {Object.values(item).map((value, index) => (
                <td key={index} className="border px-4 py-2">
                  {typeof value === "object" && value !== null ? (
                    <div>
                      {Array.isArray(value) ? (
                        <ul>
                          {value.map((item, index) => (
                            <li key={index}>{renderTableCell(item)}</li>
                          ))}
                        </ul>
                      ) : (
                        <table className="table table-bordered table-striped w-full">
                          <tbody>
                            {Object.entries(value).map(([key, val], index) => (
                              <tr key={index}>
                                <td>{key}</td>
                                <td>{renderTableCell(val)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={value || ""}
                      onChange={(e) =>
                        setData((prevData) => {
                          const newData = [...prevData];
                          newData[index][Object.keys(item)[index]] = e.target.value;
                          return newData;
                        })
                      }
                      className="border rounded px-2 py-1"
                    />
                  )}
                </td>
              ))}
              {role === "admin" && (
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="bg-green-500 text-white px-4 py-2 mr-2 rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAction(item)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataRenderer;
