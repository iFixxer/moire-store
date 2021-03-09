import router from '@/router';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const state = () => ({
  orderData: null,
  orderInfo: null,

  orderSendingFailed: false,

  deliveryTypes: [],
  paymentTypes: [],

  open: false,
  orderError: {},
  orderErrorMessage: '',
});

const getters = {};

const actions = {
  loadOrderData(context, {
    name, address, phone, email, deliveryTypeId, paymentTypeId, comment,
  }) {
    context.commit('updateOrderSendingFailed', false);
    context.commit('updateOpen', false);
    return axios
      .post(`${API_BASE_URL}/api/orders`,
        {
          name,
          address,
          phone,
          email,
          deliveryTypeId,
          paymentTypeId,
          comment,
        },
        {
          params: {
            userAccessKey: localStorage.getItem('userAccessKey'),
          },
        })
      .then((response) => {
        if (response.data) context.commit('updateOrderData', response.data);
        this.commit('cart/resetCart', response.data);
        router.push({ name: 'orderInfo', params: { id: response.data.id } });
      })
      .catch((error) => {
        context.commit('updateOrderSendingFailed', true);
        if (error.response.status === 500) {
          context.commit('updateOrderError', error.response.data.error);
          context.commit('updateOrderErrorMessage', error.response.data.error.message);
        } else {
          context.commit('updateOrderError', error.response.data.error.request);
          context.commit('updateOrderErrorMessage', 'Проверьте правильность заполнения полей');
        }
        context.commit('updateOpen', true);
      });
  },
  loadOrderInfo(context, { id }) {
    return axios
      .get(`${API_BASE_URL}/api/orders/${id}`, {
        params: {
          userAccessKey: localStorage.getItem('userAccessKey'),
        },
      })
      .then((response) => {
        context.commit('updateOrderInfo', response.data);
      })
      .catch((error) => {
        if (error.response.status === 500) {
          context.commit('updateOrderError', error.response.data.error);
          context.commit('updateOrderErrorMessage', error.response.data.error.message);
          context.commit('updateOpen', true);
        } else if (error.response.status === 400) {
          throw error;
        }
      });
  },
  loadPaymentTypes(context, { deliveryTypeId }) {
    return axios
      .get(`${API_BASE_URL}/api/payments`, {
        params: {
          deliveryTypeId,
        },
      })
      .then((response) => {
        context.commit('updatePaymentTypes', response.data);
      });
  },
  loadDeliveryTypes(context) {
    return axios.get(`${API_BASE_URL}/api/deliveries`).then((response) => {
      context.commit('updateDeliveryTypes', response.data);
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
  updateDeliveryTypes(state, deliveryTypes) {
    state.deliveryTypes = deliveryTypes;
  },
  updatePaymentTypes(state, paymentTypes) {
    state.paymentTypes = paymentTypes;
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
