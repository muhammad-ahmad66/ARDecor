// * ADD TO CART

import { showAlert } from "./alerts";

// Helper function to send AJAX requests
export function sendRequest(url, method, data, callback) {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data !== null) {
    options.body = JSON.stringify(data);
  }

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => callback(null, data))
    .catch((error) => callback(error, null));
}

// Function to add a product to the cart
export function addToCart(productId, quantity) {
  const url = "/cart/add";
  const method = "POST";
  const data = { productId, quantity };

  sendRequest(url, method, data, (error, response) => {
    if (error) {
      showAlert("error", error.message);
    } else {
      showAlert("success", response.message);
    }
  });
}

// Function to update cart item quantity
export function updateCartItem(productId, quantity) {
  const url = "/cart/update/" + productId;
  const method = "PATCH";
  const data = { quantity: quantity };

  sendRequest(url, method, data, (error, response) => {
    if (error) {
      showAlert("error", error.message);
    } else {
      showAlert("success", response.message);
      window.setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  });
}

// Function to remove a product from the cart
export function removeCartItem(productId) {
  const url = "/cart/remove/" + productId;
  const method = "DELETE";

  sendRequest(url, method, null, (error, response) => {
    if (error) {
      showAlert("error", error.message);
    } else {
      showAlert("success", response.message);
      window.setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  });
}
