import store from '@/store';
import router from '@/router';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const state = () => ({
  orderData: null,
  orderInfo: null,

  orderSendingFailed: false,

  orderDeliveryTypes: [],
  orderPaymentTypes: [],

  open: false,
  orderError: {},
  orderErrorMessage: '',
});

const getters = {
  orderInfo() {
    return state.orderInfo;
  },
  deliveryTypes() {
    return state.orderDeliveryTypes;
  },
  paymentTypes() {
    return state.orderPaymentTypes;
  },
  orderSendingFailed() {
    return state.orderSendingFailed;
  },
  open() {
    return state.open;
  },
  orderError() {
    return state.orderError;
  },
  orderErrorMessage() {
    return state.orderErrorMessage;
  },
};

const actions = {
  loadOrderData(context, { name, address, phone, email, deliveryTypeId, paymentTypeId, comment }) {
    context.commit('updateOrderSendingFailed', false);
    context.commit('updateOpen', false);
    return axios
      .post(
        API_BASE_URL + '/api/orders',
        {
          name: name,
          address: address,
          phone: phone,
          email: email,
          deliveryTypeId: deliveryTypeId,
          paymentTypeId: paymentTypeId,
          comment: comment,
        },
        {
          params: {
            userAccessKey: localStorage.getItem('userAccessKey'),
          },
        }
      )
      .then(response => {
        if (response.data) context.commit('updateOrderData', response.data);
        store.commit('cart/resetCart', response.data);
        router.push({ name: 'orderInfo', params: { id: response.data.id } });
      })
      .catch(error => {
        context.commit('updateOrderSendingFailed', true);
        context.commit('updateOrderError', error.response.data.error.request);
        if (error.response.data.error.message.lenght > 1) {
          context.commit('updateOrderErrorMessage', error.response.data.error.message);
        } else {
          context.commit('updateOrderErrorMessage', 'Проверьте правильность заполнения полей');
        }
        context.commit('updateOpen', true);
      });
  },
  loadOrderInfo(context, { id }) {
    return axios
      .get(API_BASE_URL + `/api/orders/` + id, {
        params: {
          userAccessKey: localStorage.getItem('userAccessKey'),
        },
      })
      .then(response => {
        context.commit('updateOrderInfo', response.data);
      })
      .catch(error => {
        if (error.response.status == 400) {
          throw error;
        }
      });
  },
  loadOrderPaymentTypes(context, { deliveryTypeId }) {
    return axios
      .get(API_BASE_URL + '/api/payments', {
        params: {
          deliveryTypeId: deliveryTypeId,
        },
      })
      .then(response => {
        context.commit('updateOrderPaymentTypes', response.data);
      });
  },
  loadOrderDeliveryTypes(context) {
    return axios.get(API_BASE_URL + '/api/deliveries').then(response => {
      context.commit('updateOrderDeliveryTypes', response.data);
    });
  },
  closeModal(context) {
    context.commit('updateOpen', false);
  },
};

const mutations = {
  updateOrderData(state, orderData) {
    state.orderData = orderData;
  },
  updateOrderInfo(state, orderInfo) {
    state.orderInfo = orderInfo;
  },
  updateOrderDeliveryTypes(state, orderDeliveryTypes) {
    state.orderDeliveryTypes = orderDeliveryTypes;
  },
  updateOrderPaymentTypes(state, orderPaymentTypes) {
    state.orderPaymentTypes = orderPaymentTypes;
  },
  updateOrderSendingFailed(state, orderSendingFailed) {
    state.orderSendingFailed = orderSendingFailed;
  },
  updateOpen(state, open) {
    state.open = open;
  },
  updateOrderError(state, orderError) {
    state.orderError = orderError;
  },
  updateOrderErrorMessage(state, orderErrorMessage) {
    state.orderErrorMessage = orderErrorMessage;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
