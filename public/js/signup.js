import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const result = await axios({
      method: 'POST',
      url: '/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    // from our api
    // if (res.data.status === 'success') {
    // alert('Logged in successfully');
    showAlert('success', 'Sig up successfully!');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
    // }
    console.log(result);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
