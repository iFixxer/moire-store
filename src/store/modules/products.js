import axios from "axios";
import { API_BASE_URL } from "@/config";

const state = () => ({
  productsData: null,

  productData: null,
  productLoadingFailed: false,

  open: false,
  productError: {},
  productErrorMessage: "",

  categoriesData: null,
  colorsData: null,
  materialsData: null,
  seasonsData: null
});

const getters = {
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
  open(state) {
    return state.open;
  },
  productLoadingFailed(state) {
    return state.productLoadingFailed;
  },
  productError(state) {
    return state.productError;
  },
  productErrorMessage(state) {
    return state.productErrorMessage;
  }
};

const actions = {
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
      })
      .catch(error => {
        context.commit("updateProductLoadingFailed", true);
        context.commit("updateProductError", error.response.data.error);
        if (error.response.status == 500)
          context.commit("updateProductErrorMessage", error.response.data.error.message);
        context.commit("updateOpen", true);
      });
  },
  loadCategoriesData(context) {
    return axios.get(API_BASE_URL + `/api/productCategories`).then(response => {
      context.commit("updateCategoriesData", response.data.items);
    });
  },
  loadColorsData(context) {
    return axios.get(API_BASE_URL + `/api/colors`).then(response => {
      context.commit("updateColorsData", response.data.items);
    });
  },
  loadMaterialsData(context) {
    return axios.get(API_BASE_URL + `/api/materials`).then(response => {
      context.commit("updateMaterialsData", response.data.items);
    });
  },
  loadSeasonsData(context) {
    return axios.get(API_BASE_URL + `/api/seasons`).then(response => {
      context.commit("updateSeasonsData", response.data.items);
    });
  },
  loadProductData(context, { id }) {
    context.commit("updateProductLoadingFailed", false);
    return axios
      .get(API_BASE_URL + "/api/products/" + id)
      .then(response => {
        context.commit("updateProductData", response.data);
      })
      .catch(error => {
        context.commit("updateProductLoadingFailed", true);
        if (error.response.status == 404) {
          throw error;
        } else {
          context.commit("updateOpen", true);
        }
      });
  },
  openModal(context) {
    context.commit("updateOpen", true);
  },
  closeModal(context) {
    context.commit("updateOpen", false);
  }
};

const mutations = {
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
  updateOpen(state, open) {
    state.open = open;
  },
  updateProductError(state, productError) {
    state.productError = productError;
  },
  updateProductErrorMessage(state, productErrorMessage) {
    state.productErrorMessage = productErrorMessage;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
