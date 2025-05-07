import axios from 'axios';

// Get the API URL from the environment variable
const apiUrl = process.env.REACT_APP_API_URL;

axios.get(`${apiUrl}/some-endpoint`)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log('Error:', error);
  });

