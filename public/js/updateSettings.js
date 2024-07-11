import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password' ? '/users/updateMyPassword' : '/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    showAlert('success', `${type.toUpperCase()} updated successfully!`);

    setTimeout(() => location.reload(), 1000);

    // if (res.data.status === 'success') {
    // }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
