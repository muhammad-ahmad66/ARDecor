import axios from 'axios';
import { showAlert } from './alerts';

export const uploadProduct = async (data) => {
  try {
    const result = await axios({
      method: 'POST',
      url: '/products',
      data,
    });

    // from our api
    // if (res.data.status === 'success') {
    // alert('Logged in successfully');
    showAlert('success', 'Data Inserted successfully!');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
    // }
    console.log(result);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
