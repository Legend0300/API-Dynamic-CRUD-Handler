import { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";

const login = async (email, password, endpoint) => {
  const payload = {
    email: email,
    password: password,
  };

  try {
    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      // Login successful, handle the response data
      console.log('Login successful!');
      return response.data.token;
    } else {
      // Handle other status codes if needed
      console.error('Login failed with status code:', response.status);
      return null;
    }
  } catch (error) {
    // Handle error during login
    console.error('Login error:', error);
    return null;
  }
};

const useApiData = (endpoint) => {
  const [token, setToken] = useState(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [role , setRole] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get token from localStorage or sessionStorage
        const token = localStorage.getItem('jwt');  

        // If token is found, add it to the request headers
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        // Make the axios request with the optional token in the headers
        const response = await axios.get(endpoint, { headers });

        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }

        const jsonData = response.data;

        var decodedHeader = jwt_decode(token);
  
        setRole(decodedHeader.user.role);
        console.log(decodedHeader.user.role);

        // Convert object to array if data is an object
        const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
        setData(dataArray);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  useEffect(() => {
    const returnToken = async () => {
      // Call the login function to get the token
      const token = await login("johndoe@example.com", "mypassword", "http://localhost:4000/api/admin/login");
  
      // Set the token as a cookie
      document.cookie = `jwt=${token}; path=/`;
      localStorage.setItem('jwt', token);
  
      // Update the state with the token
      setToken(token);
  
      var decodedHeader = jwt_decode(token);
  
      setRole(decodedHeader.role);
    };
  
    returnToken();
  }, []);
  


  if (token) {
    // Do something with the token, e.g., display it or use it in your application.
  } else {
    // Token not found, handle this case as per your application's logic.
    console.log("Token not found");
  }



  return { data, loading, setData };
};

export {useApiData , login};
