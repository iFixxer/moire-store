import axios from "axios";
import { API_BASE_URL } from "@/config";

const state = () => ({
  productsData: null,

  productData: null,
  productLoadingFailed: false,

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
  productLoadingFailed(state) {
    return state.productLoadingFailed;
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
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
