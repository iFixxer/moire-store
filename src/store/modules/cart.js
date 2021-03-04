import axios from 'axios';
import { API_BASE_URL } from '@/config';

const state = () => ({
  userAccessKey: null,

  cartProductsData: [],
  cartProducts: [],

  productAddSending: false,
  cartAddingFailed: false,
  productAdded: false,

  open: false,
  cartErrors: false,
  cartError: {},
  cartErrorMessage: '',
});

const getters = {
  cartDetailproducts(state) {
    return state.cartProducts.map((item) => item.item);
  },
  cartTotalPrice(state, getters) {
    return getters.cartDetailproducts.reduce(
      (acc, item) => item.product.price * item.quantity + acc,
      0,
    );
  },
  cartTotalQuantity(state, getters) {
    return getters.cartDetailproducts.reduce((acc, item) => item.quantity + acc, 0);
  },
  productAddSending(state) {
    return state.productAddSending;
  },
  cartAddingFailed(state) {
    return state.cartAddingFailed;
  },
  productAdded(state) {
    return state.productAdded;
  },
  open(state) {
    return state.open;
  },
  cartErrors(state) {
    return state.cartErrors;
  },
  cartError(state) {
    return state.cartError;
  },
  cartErrorMessage(state) {
    return state.cartErrorMessage;
  },
};

const actions = {
  loadCart(context) {
    return axios
      .get(`${API_BASE_URL}/api/baskets`, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
      .then((response) => {
        if (!context.state.userAccessKey) {
          localStorage.setItem('userAccessKey', response.data.user.accessKey);
          context.commit('updateUserAccessKey', response.data.user.accessKey);
        }

        context.commit('updateCartProductsData', response.data.items);
        context.commit('syncCartProducts');
      });
  },
  addProductToCart(context, {
    productId, colorId, sizeId, quantity,
  }) {
    context.commit('updateCartAddingFailed', false);
    context.commit('updateProductAdded', false);
    context.commit('updateProductAddSending', true);
    return axios
      .post(`${API_BASE_URL}/api/baskets/products`,
        {
          productId,
          colorId: colorId.id,
          sizeId,
          quantity,
        },
        {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
      .then((response) => {
        context.commit('updateCartProductsData', response.data.items);
        context.commit('syncCartProducts');
        context.commit('updateProductAdded', true);
        context.commit('updateProductAddSending', false);
        context.commit('updateOpen', true);
      })
      .catch((error) => {
        context.commit('updateProductAddSending', false);
        context.commit('updateCartAddingFailed', true);
        context.commit('updateOpen', true);
        context.commit('updateCartError', error.response.data.error);
        if (error.response.status === 500) {
          context.commit('updateCartErrorMessage', error.response.data.error.message);
        }
        if (error.response.status === 400) {
          context.commit('updateCartErrorMessage', error.response.data.error.request.sizeId);
        }
      });
  },
  updateCartProductQuantity(context, { basketItemId, quantity }) {
    context.commit('updateCartErrors', false);
    context.commit('updateCartProductQuantity', { basketItemId, quantity });

    if (quantity < 1) {
      return 1;
    }

    return axios
      .put(`${API_BASE_URL}/api/baskets/products`,
        {
          basketItemId,
          quantity,
        },
        {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
      .then((response) => {
        context.commit('updateCartProductsData', response.data.items);
        context.commit('syncCartProducts');
      })
      .catch((error) => {
        context.commit('updateCartErrors', true);
        context.commit('updateCartError', error.response.data.error);
        if (error.response.status === 500) {
          context.commit('updateCartErrorMessage', error.response.data.error.message);
        }
        context.commit('updateOpen', true);
      });
  },
  deleteCartProduct(context, { basketItemId }) {
    return axios
      .delete(`${API_BASE_URL}/api/baskets/products`, {
        data: {
          basketItemId,
        },
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
      .then((response) => {
        context.commit('updateCartProductsData', response.data.items);
        context.commit('syncCartProducts');
      });
  },
  openModal(context) {
    context.commit('updateOpen', true);
  },
  closeModal(context) {
    context.commit('updateOpen', false);
    context.commit('updateProductAdded', false);
    context.commit('updateProductAddSending', false);
  },
};

const mutations = {
  updateUserAccessKey(state, accessKey) {
    state.userAccessKey = accessKey;
  },
  updateCartProductsData(state, items) {
    state.cartProductsData = items;
  },
  updateCartProductQuantity(state, { basketItemId, quantity }) {
    const item = state.cartProducts.find((item) => item.basketItemId === basketItemId);

    if (item) {
      item.quantity = quantity;
    }
  },
  syncCartProducts(state) {
    state.cartProducts = state.cartProductsData.map((item) => ({
      item: {
        basketItemId: item.id,
        product: item.product,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      },
    }));
  },
  resetCart(state) {
    state.cartProducts = [];
    state.cartProductsData = [];
  },
  updateProductAddSending(state, productAddSending) {
    state.productAddSending = productAddSending;
  },
  updateCartAddingFailed(state, cartAddingFailed) {
    state.cartAddingFailed = cartAddingFailed;
  },
  updateProductAdded(state, productAdded) {
    state.productAdded = productAdded;
  },
  updateOpen(state, open) {
    state.open = open;
  },
  updateCartErrors(state, cartErrors) {
    state.cartErrors = cartErrors;
  },
  updateCartError(state, cartError) {
    state.cartError = cartError;
  },
  updateCartErrorMessage(state, cartErrorMessage) {
    state.cartErrorMessage = cartErrorMessage;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
