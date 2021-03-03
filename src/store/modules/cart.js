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
  cartError: {},
  cartErrorMessage: '',
});

const getters = {
  cartDetailproducts(state) {
    return state.cartProducts.map(item => {
      return {
        ...item,
      };
    });
  },
  cartTotalPrice(state, getters) {
    return getters.cartDetailproducts.reduce(
      (acc, item) => item.product.price * item.quantity + acc,
      0
    );
  },
  cartTotalQuantity(state, getters) {
    return getters.cartDetailproducts.reduce((acc, item) => item.quantity + acc, 0);
  },
  productAddSending() {
    return state.productAddSending;
  },
  cartAddingFailed() {
    return state.cartAddingFailed;
  },
  productAdded() {
    return state.productAdded;
  },
  open() {
    return state.open;
  },
  cartError() {
    return state.cartError;
  },
  cartErrorMessage() {
    return state.cartErrorMessage;
  },
};

const actions = {
  loadCart(context) {
    return axios
      .get(API_BASE_URL + '/api/baskets', {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
      .then(response => {
        if (!context.state.userAccessKey) {
          localStorage.setItem('userAccessKey', response.data.user.accessKey);
          context.commit('updateUserAccessKey', response.data.user.accessKey);
        }

        context.commit('updateCartProductsData', response.data.items);
        context.commit('syncCartProducts');
      });
  },
  addProductToCart(context, { productId, colorId, sizeId, quantity }) {
    context.commit('updateCartAddingFailed', false);
    context.commit('updateProductAdded', false);
    context.commit('updateProductAddSending', true);
    return axios
      .post(
        API_BASE_URL + '/api/baskets/products',
        {
          productId: productId,
          colorId: colorId.id,
          sizeId: sizeId,
          quantity: quantity,
        },
        {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        }
      )
      .then(response => {
        context.commit('updateCartProductsData', response.data.items);
        context.commit('syncCartProducts');
        context.commit('updateProductAdded', true);
        context.commit('updateProductAddSending', false);
        context.commit('updateOpen', true);
      })
      .catch(error => {
        context.commit('updateProductAddSending', false);
        context.commit('updateCartAddingFailed', true);
        context.commit('updateOpen', true);
        context.commit('updateCartError', error.response.data.error.request);
        if (error.response.data.error.message.lenght > 1) {
          context.commit('updateCartErrorMessage', error.response.data.error.message);
        } else {
          context.commit('updateCartErrorMessage', error.response.data.error.request.sizeId);
        }
      });
  },
  updateCartProductQuantity(context, { basketItemId, quantity }) {
    context.commit('updateCartProductQuantity', { basketItemId, quantity });

    if (quantity < 1) {
      return;
    }

    return axios
      .put(
        API_BASE_URL + '/api/baskets/products',
        {
          basketItemId: basketItemId,
          quantity: quantity,
        },
        {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        }
      )
      .then(response => {
        context.commit('updateCartProductsData', response.data.items);
      })
      .catch(() => {
        context.commit('syncCartProducts');
      });
  },
  deleteCartProduct(context, { basketItemId }) {
    return axios
      .delete(API_BASE_URL + '/api/baskets/products', {
        data: {
          basketItemId: basketItemId,
        },
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
      .then(response => {
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
    const item = state.cartProducts.find(item => item.basketItemId === basketItemId);

    if (item) {
      item.quantity = quantity;
    }
  },
  syncCartProducts(state) {
    state.cartProducts = state.cartProductsData.map(item => {
      return {
        basketItemId: item.id,
        product: item.product,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      };
    });
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
