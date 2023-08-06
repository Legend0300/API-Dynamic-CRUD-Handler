import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";
import {useApiData , login} from "./useApiData";

function EditPopup({ editedData, setEditedData, handleSaveClick, handleClosePopup }) {
  const renderFormFields = (data, keyPath = "") => {
    if (!data || typeof data !== "object") {
      return null;
    }

    return Object.entries(data).map(([key, value]) => {
      const propertyKeyPath = keyPath ? keyPath + "." + key : key;

      if (typeof value === "object" && value !== null) {
        return (
          <div key={propertyKeyPath}>
            {renderFormFields(value, propertyKeyPath)}
          </div>
        );
      } else {
        return (
          <div key={propertyKeyPath} className="mb-2">
            <label className="font-bold">{propertyKeyPath}:</label>
            <input
              type="text"
              name={propertyKeyPath}
              value={value || ""}
              onChange={(e) => handleFieldChange(propertyKeyPath, e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
        );
      }
    });
  };

  const handleFieldChange = (propertyName, value) => {
    setEditedData((prevData) => {
      const newData = { ...prevData };
      // Utilize lodash.set to handle nested objects properly
      _.set(newData, propertyName, value);
      return newData;
    });
  };

  return (
    <div className="popup fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div className="w-full max-w-lg bg-white p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Data</h2>
        <form>
          {renderFormFields(editedData)}
        </form>
        <div className="flex mt-4 justify-end">
          <button onClick={handleSaveClick} className="bg-blue-500 text-white px-4 py-2 mr-2 rounded hover:bg-blue-600">
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
  );
}

function CreatePopup({ editedData, renderFormFields, handleCreateSubmit, setShowCreatePopup }) {
  return (
    <div className="popup fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div className="w-full max-w-lg bg-white p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create New Entity</h2>
        <form onSubmit={(event) => handleCreateSubmit(event, editedData)} className="mb-4">
          {renderFormFields()}
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2">
            Create
          </button>
          <button onClick={() => setShowCreatePopup(false)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

function DataTable({ data, setData, role, handleEditClick, deleteAction }) {
  const renderTableCell = (value, keyPath = "") => {
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
        onChange={(e) => setData((prevData) => ({ ...prevData, [keyPath]: e.target.value }))}
        className="border rounded px-2 py-1"
      />
    );
  };

  return (
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
  );
}




function DataRenderer({ endpoint }) { 
  const [token, setToken] = useState(null);

  useEffect(() => {
    const returnToken = async () => {
      // Call the login function to get the token
      const token = await login("texashouse003@gmail.com", "pass", "http://localhost:4000/api/user/login");

      // Set the token in localStorage or sessionStorage
      localStorage.setItem('jwt', token);
      // sessionStorage.setItem('userjwt', token); // Use sessionStorage if needed

      // Update the state with the token
      setToken(token);
    };

    returnToken();
  }, []);


  const { data, loading, setData } = useApiData(endpoint);
  
  
  if (token) {
    // Do something with the cookie value, e.g., display it or use it in your application.
    console.log("Found cookie");
  } else {
    // Cookie not found, handle this case as per your application's logic.
    console.log("Cookie not found");
  }
   

  const role = "admin"

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [showCreatePopup, setShowCreatePopup] = useState(false);

  const editAction = async () => {
    try {
      // Get token from localStorage or sessionStorage
      const token =
        localStorage.getItem("userjwt") || sessionStorage.getItem("userjwt");

      // If token is found, add it to the request headers
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.put(
        endpoint + "/" + editedData._id,
        editedData,
        { headers }
        );
      
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
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

      // Get token from localStorage or sessionStorage
      const token =
        localStorage.getItem("userjwt") || sessionStorage.getItem("userjwt");

      // If token is found, add it to the request headers
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.delete(endpoint + "/" + item._id , { headers });

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

  return (
    <div className="data-table">
      {showEditPopup && (
        <EditPopup
          editedData={editedData}
          setEditedData={setEditedData}
          handleSaveClick={handleSaveClick}
          handleClosePopup={handleClosePopup}
        />
      )}

      {showCreatePopup && (
        <CreatePopup
          editedData={editedData}
          renderFormFields={renderFormFields}
          handleCreateSubmit={handleCreateSubmit}
          setShowCreatePopup={setShowCreatePopup}
        />
      )}

      <button
        onClick={handleCreateClick}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
      >
        +
      </button>

      <DataTable data={data} setData={setData} role={role} handleEditClick={handleEditClick} deleteAction={deleteAction} />
    </div>
  );
}

export default DataRenderer;
