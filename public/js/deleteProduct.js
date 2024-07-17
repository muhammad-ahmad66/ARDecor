import { showAlert } from '/alerts';
import axios from 'axios';

export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`/products/${productId}`);

    showAlert('success', 'Product has been deleted successfully!');
    window.setTimeout(() => {
      location.reload();
    }, 1500);
  } catch (error) {
    console.log(error);
    showAlert('error', 'Something went wrong while deleting the user.');
  }
};
