import { showAlert } from '/alerts';
import axios from 'axios';
export const updateProduct = async function (data, productId) {
  try {
    const response = await axios({
      method: 'PATCH',
      url: `/products/${productId}`,
      data,
    });
    showAlert('success', 'Product has been updated successfully!');
    window.setTimeout(() => {
      location.assign(`/all-products`);
    }, 1500);
  } catch (e) {
    console.log(e);
    showAlert('error', 'Something went wrong while updating the product.');
  }
};

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
