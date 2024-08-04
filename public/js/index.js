import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { uploadProduct } from './uploadProduct';
import { addToCart } from './cart';
import { updateCartItem } from './cart';
import { removeCartItem } from './cart';
import { purchaseProduct } from './stripe';
import { showAlert } from '/alerts';
import axios from 'axios';

const loginForm = document.querySelector('.form-login');
const signupForm = document.querySelector('.form-signup');
const logoutBtn = document.querySelector('#logout');

const uploadProductForm = document.getElementById('form-upload-product');

const addToCartBtn = document.querySelectorAll('#addToCartButton');
const deleteCartButtons = document.querySelectorAll('#delete-cart-btn');
const updateCartButtons = document.querySelectorAll('#update-cart-btn');

const checkoutButton = document.getElementById('checkout-btn');

// ! LOGIN FORM
const labels = document.querySelectorAll('.form-control label');
labels.forEach((label) => {
  label.innerHTML = label.innerText
    .split('')
    .map(
      (letter, idx) =>
        `<span style="transition-delay:${idx * 50}ms">${letter}</span>`,
    )
    .join('');
});

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });

// ! SIGNUP FORM
if (signupForm)
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    signup(name, email, password, passwordConfirm);
  });

if (uploadProductForm)
  uploadProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get the file input element
    const imageInput = document.getElementById('image');
    // Get the selected file
    const imageFile = imageInput.files[0];
    // Create a new Blob object with the file data and the MIME type 'model/gltf-binary'
    const fileWithMimeType = new Blob([imageFile], {
      type: 'model/gltf-binary',
    });
    // Append the file to FormData

    const form = new FormData();

    form.append('image', fileWithMimeType);
    // form.append("image", imageFile);
    form.append('name', document.getElementById('name').value.toLowerCase());
    form.append(
      'category',
      document.getElementById('category').value.toLowerCase(),
    );
    form.append('description', document.getElementById('description').value);
    form.append('price', document.getElementById('price').value);
    form.append('quantity', document.getElementById('quantity').value);
    // form.append("image", document.getElementById("image").files[0]);

    // uploadProduct(form);

    try {
      await uploadProduct(form);
    } catch (err) {
      console.error('Error uploading product:', err);
    }
  });

// ! LOGGING USER OUT
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

// ! TO TOGGLE AR-BUTTON
const arBtn = document.getElementById('ar-button');
if (arBtn)
  arBtn.addEventListener('click', function (e) {
    try {
      e.preventDefault();
      let modelViewer = document.getElementById('modelViewer');
      if (modelViewer.canActivateAR) {
        modelViewer.activateAR();
      } else {
        alert(
          'AR is not supported on this device or browser! Please try with another device.',
        );
      }
    } catch (e) {
      console.log('Error: ', e);
    }
  });

if (addToCartBtn)
  addToCartBtn.forEach((button) =>
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const productId = this.getAttribute('data-product-id');
      const quantityInput = document.getElementById('quantityInput');
      let quantity;
      if (quantityInput) quantity = quantityInput.value;
      else quantity = 1;

      addToCart(productId, quantity);
    }),
  );

if (deleteCartButtons)
  deleteCartButtons.forEach((button) =>
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const productId = e.target.getAttribute('data-product-id');
      // const quantity = parseInt(document.getElementById("quantityInput").value);
      removeCartItem(productId);
    }),
  );

if (updateCartButtons)
  updateCartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.getAttribute('data-product-id');
      const quantityInput = document.getElementById(`quantity-${productId}`);
      const newQuantity = quantityInput.value;

      updateCartItem(productId, newQuantity);
    });
  });

// ! PURCHASE PRODUCT
if (checkoutButton)
  checkoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.target.textContent = 'Processing...';
    purchaseProduct();
  });

//  ! USER ACCOUNT DASHBOARD.
const navItems = document.querySelectorAll('.side-nav a');
const contentContainers = document.querySelectorAll(
  '.user-view__form-container',
);

// For update form
const updateFormContainer = document.getElementById('update-form-container');
const foundReports = document.getElementById('my-found-reports');
const updateBtn = document.querySelector('.update-button');

navItems.forEach((item) => {
  item.addEventListener('click', (event) => {
    event.preventDefault();

    // Remove active class from all nav items and content containers
    navItems.forEach((nav) =>
      nav.parentElement.classList.remove('side-nav--active'),
    );
    contentContainers.forEach((container) =>
      container.classList.remove('active'),
    );

    updateFormContainer.classList.remove('active');

    // Add active class to the clicked nav item
    const sectionId = event.target.getAttribute('data-section');
    document.getElementById(sectionId).classList.add('active');
    const target = event.target;
    event.target.parentElement.classList.add('side-nav--active');

    updateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(sectionId).classList.remove('active');
      // target.parentElement.classList.remove('side-nav--active');
      updateFormContainer.classList.add('active');
    });
  });
});

// ! UPDATE USER SETTINGS AND PASSWORD
import { updateSettings } from './updateSettings';
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

// ! CHANGE USER DATA(NAME, PASSWORD, PHOTO) FROM ACCOUNT PAGE
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // const form = new FormData();
    // form.append('name', document.getElementById('name').value);
    // form.append('email', document.getElementById('email').value);
    // form.append('photo', document.getElementById('photo').files[0]);

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    updateSettings({ name, email }, 'data');
  });

// ! CHANGE PASSWORD FORM FROM USER-ACCOUNT PAGE
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').textContent = 'Save Password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

// ! Delete Product

import { deleteProduct } from '/deleteProduct';

const deleteProductBtn = document.querySelectorAll('#delete-product-btn');

if (deleteProductBtn) {
  deleteProductBtn.forEach((button) =>
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const productId = this.getAttribute('data-product-id');

      console.log(productId);
      deleteProduct(productId);
    }),
  );
}

// ! UPDATE PRODUCT DETAILS

import { updateProduct } from '/updateProduct';

const updateProductForm = document.querySelector('#form-update-product');

if (updateProductForm)
  updateProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;
    const productId = document.getElementById('submit').dataset.productId;
    updateProduct({ name, category, quantity, price, description }, productId);
  });

// Helper function to get current URL parameters
const getQueryParams = () => {
  const queryParams = new URLSearchParams(window.location.search);
  return {
    category: queryParams.get('category') || '',
    price: queryParams.get('price') || '',
  };
};

// Helper function to update URL with new filters
const updateURLWithFilters = (category, price) => {
  const queryParams = new URLSearchParams();

  if (category) {
    queryParams.set('category', category);
  }

  if (price) {
    queryParams.set('price', price);
  }

  const newURL = `/products?${queryParams.toString()}`;
  window.location.href = newURL;
};

// Category filter
const categoryBtn = document.querySelectorAll('.select-category');

if (categoryBtn) {
  categoryBtn.forEach((button) =>
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const category = this.dataset.category;

      const { price } = getQueryParams();
      updateURLWithFilters(category, price);
    }),
  );
}

// Price range filter
const priceRangeBtn = document.querySelectorAll('.price-range');

if (priceRangeBtn) {
  priceRangeBtn.forEach((button) =>
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const minPrice = parseInt(this.dataset.min);
      const maxPrice = parseInt(this.dataset.max);

      // Format price range as a string to be URL-encoded
      const priceFilter = `gte=${minPrice}&lte=${maxPrice}`;

      const { category } = getQueryParams();
      updateURLWithFilters(category, priceFilter);
    }),
  );
}

const clearFilterBtn = document.getElementById('btn-clear-filter');

if (clearFilterBtn) {
  clearFilterBtn.addEventListener('click', () => {
    updateURLWithFilters('', '');
  });
}

const hasQueryParams = () => {
  return window.location.search.length > 0;
};

// Get the button element
// const clearFilterBtn = document.getElementById('btn-clear-filter');

// Show or hide the button based on the presence of query parameters
if (clearFilterBtn) {
  if (hasQueryParams()) {
    clearFilterBtn.style.display = 'block'; // Show button
  } else {
    clearFilterBtn.style.display = 'none'; // Hide button
  }
}
