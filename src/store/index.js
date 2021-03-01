import Vue from "vue";
import Vuex from "vuex";
import { router } from "vuex-router";
import axios from "axios";
import { API_BASE_URL } from "@/config";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userAccessKey: null,

    productsData: null,

    productData: null,
    productLoadingFailed: false,

    categoriesData: null,
    colorsData: null,
    materialsData: null,
    seasonsData: null,

    cartProductsData: [],
    cartProducts: [],

    orderData: null,
    orderInfo: null,

    orderSendingFailed: false,

    orderDeliveryTypes: [],
    orderPaymentTypes: [],

    open: false,
    formError: {},
    formErrorMessage: ""
  },
  mutations: {
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateProductsData(state, productsData) {
      state.productsData = productsData;
    },
    updateCategoriesData(state, categoriesData) {
      state.categoriesData = categoriesData;
    },
    updateColorsData(state, colorsData) {
      state.colorsData = colorsData;
    },
    updateMaterialsData(state, materialsData) {
      state.materialsData = materialsData;
    },
    updateSeasonsData(state, seasonsData) {
      state.seasonsData = seasonsData;
    },
    updateProductData(state, productData) {
      state.productData = productData;
    },
    updateProductLoadingFailed(state, productLoadingFailed) {
      state.productLoadingFailed = productLoadingFailed;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    updateCartProductAmount(state, { basketItemId, amount }) {
      const item = state.cartProducts.find(item => item.basketItemId === basketItemId);

      if (item) {
        item.amount = amount;
      }
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map(item => {
        return {
          basketItemId: item.id,
          product: item.product,
          amount: item.quantity,
          color: item.color,
          size: item.size
        };
      });
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
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
    updateOpen(state, open) {
      state.open = open;
    },
    updateOrderSendingFailed(state, orderSendingFailed) {
      state.orderSendingFailed = orderSendingFailed;
    },
    updateFormError(state, formError) {
      state.formError = formError;
    },
    updateFormErrorMessage(state, formErrorMessage) {
      state.formErrorMessage = formErrorMessage;
    }
  },
  getters: {
    productsData(state) {
      return state.productsData;
    },
    categoriesData(state) {
      return state.categoriesData;
    },
    colorsData(state) {
      return state.colorsData;
    },
    materialsData(state) {
      return state.materialsData;
    },
    seasonsData(state) {
      return state.seasonsData;
    },
    productData(state) {
      return state.productData;
    },
    productLoadingFailed(state) {
      return state.productLoadingFailed;
    },
    cartDetailproducts(state) {
      return state.cartProducts.map(item => {
        return {
          ...item
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailproducts.reduce(
        (acc, item) => item.product.price * item.amount + acc,
        0
      );
    },
    cartTotalAmount(state, getters) {
      return getters.cartDetailproducts.reduce((acc, item) => item.amount + acc, 0);
    },
    orderInfo(state) {
      return state.orderInfo;
    },
    deliveryTypes(state) {
      return state.orderDeliveryTypes;
    },
    paymentTypes(state) {
      return state.orderPaymentTypes;
    },
    open(state) {
      return state.open;
    },
    orderSendingFailed(state) {
      return state.orderSendingFailed;
    },
    formError(state) {
      return state.formError;
    },
    formErrorMessage(state) {
      return state.formErrorMessage;
    }
  },
  actions: {
    loadProductsData(
      context,
      { page, limit, minPrice, maxPrice, categoryId, colorIds, materialIds, seasonIds }
    ) {
      return axios
        .get(API_BASE_URL + `/api/products`, {
          params: {
            page: page,
            limit: limit,
            minPrice: minPrice,
            maxPrice: maxPrice,
            categoryId: categoryId,
            colorIds: colorIds,
            materialIds: materialIds,
            seasonIds: seasonIds
          }
        })
        .then(response => {
          context.commit("updateProductsData", response.data);
        });
    },
    loadCategoriesData(context) {
      axios.get(API_BASE_URL + `/api/productCategories`).then(response => {
        context.commit("updateCategoriesData", response.data);
      });
    },
    loadColorsData(context) {
      axios.get(API_BASE_URL + `/api/colors`).then(response => {
        context.commit("updateColorsData", response.data);
      });
    },
    loadMaterialsData(context) {
      axios.get(API_BASE_URL + `/api/materials`).then(response => {
        context.commit("updateMaterialsData", response.data);
      });
    },
    loadSeasonsData(context) {
      axios.get(API_BASE_URL + `/api/seasons`).then(response => {
        context.commit("updateSeasonsData", response.data);
      });
    },
    loadProductData(context, { id }) {
      context.commit("updateProductLoadingFailed", false);
      axios
        .get(API_BASE_URL + "/api/products/" + id)
        .then(response => {
          context.commit("updateProductData", response.data);
        })
        .catch(error => {
          if (error.response.status == 400) {
            this.$router.push("/notFound");
          } else {
            context.commit("updateProductLoadingFailed", true);
          }
        });
    },
    loadCart(context) {
      return axios
        .get(API_BASE_URL + "/api/baskets", {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        .then(response => {
          if (!context.state.userAccessKey) {
            localStorage.setItem("userAccessKey", response.data.user.accessKey);
            context.commit("updateUserAccessKey", response.data.user.accessKey);
          }

          context.commit("updateCartProductsData", response.data.items);
          context.commit("syncCartProducts");
        });
    },
    addProductToCart(context, { productId, colorId, sizeId, amount }) {
      return axios
        .post(
          API_BASE_URL + "/api/baskets/products",
          {
            productId: productId,
            colorId: colorId.id,
            sizeId: sizeId,
            quantity: amount
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey
            }
          }
        )
        .then(response => {
          context.commit("updateCartProductsData", response.data.items);
          context.commit("syncCartProducts");
        });
    },
    updateCartProductAmount(context, { basketItemId, amount }) {
      context.commit("updateCartProductAmount", { basketItemId, amount });

      if (amount < 1) {
        return;
      }

      return axios
        .put(
          API_BASE_URL + "/api/baskets/products",
          {
            basketItemId: basketItemId,
            quantity: amount
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey
            }
          }
        )
        .then(response => {
          context.commit("updateCartProductsData", response.data.items);
        })
        .catch(() => {
          context.commit("syncCartProducts");
        });
    },
    deleteCartProduct(context, { basketItemId }) {
      return axios
        .delete(API_BASE_URL + "/api/baskets/products", {
          data: {
            basketItemId: basketItemId
          },
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        .then(response => {
          context.commit("updateCartProductsData", response.data.items);
          context.commit("syncCartProducts");
        });
    },
    loadOrderData(
      context,
      { name, address, phone, email, deliveryTypeId, paymentTypeId, comment }
    ) {
      context.commit("updateOrderSendingFailed", false);
      context.commit("updateOpen", false);
      return axios
        .post(
          API_BASE_URL + "/api/orders",
          {
            name: name,
            address: address,
            phone: phone,
            email: email,
            deliveryTypeId: deliveryTypeId,
            paymentTypeId: paymentTypeId,
            comment: comment
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey
            }
          }
        )
        .then(response => {
          context.commit("resetCart");
          context.commit("updateOrderData", response.data);
          this.$router.push({ name: "orderData", params: { id: response.data.id } });
        })
        .catch(error => {
          context.commit("updateOrderSendingFailed", true);
          context.commit("updateOpen", true);
          context.commit("updateFormError", error.response.data.error.request);
          if (error.response.data.error.message.lenght > 1) {
            context.commit("updateFormErrorMessage", error.response.data.error.message);
          } else {
            context.commit("updateFormErrorMessage", "Проверьте правильность заполнения полей");
          }
        });
    },
    loadOrderInfo(context, { userAccessKey, id }) {
      return axios
        .get(API_BASE_URL + `/api/orders/` + id, {
          params: {
            userAccessKey: userAccessKey
          }
        })
        .then(response => {
          context.commit("updateOrderInfo", response.data);
        })
        .catch(error => {
          if (error.response.status == 400) {
            this.$store.dispatch("router/push", { path: "/notFound" });
          }
        });
    },
    loadOrderPaymentTypes(context, { deliveryTypeId }) {
      return axios
        .get(API_BASE_URL + "/api/payments", {
          params: {
            deliveryTypeId: deliveryTypeId
          }
        })
        .then(response => {
          context.commit("updateOrderPaymentTypes", response.data);
        });
    },
    loadOrderDeliveryTypes(context) {
      return axios.get(API_BASE_URL + "/api/deliveries").then(response => {
        context.commit("updateOrderDeliveryTypes", response.data);
      });
    },
    closeModal(context) {
      context.commit("updateOpen", false);
    }
  }
});
