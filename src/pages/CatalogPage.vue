<template>
  <main class="content container">
    <div class="content__top">
      <div class="content__row content__row_flex">
        <h1 class="content__title">
          Каталог
        </h1>
        <span class="content__info"> Кол-во товаров: {{ countProducts }} </span>
        <span class="content__info">
          Показывать:
          <label>
            <select type="text" name="productsPerPage" v-model="productsPerPage">
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="32">32</option>
            </select>
          </label>
        </span>
      </div>
    </div>

    <div class="content__catalog">
      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :color-ids.sync="filterColorIds"
        :material-ids.sync="filterMaterialIds"
        :season-ids.sync="filterSeasonIds"
      />

      <section class="catalog">
        <ProductList :products="products" />
        <BasePagination v-model="page" :count="countProducts" :per-page="productsPerPage" />

        <vue-modaltor :visible="open" @hide="closeModal" :show-close-button="false">
          <div class="cart__error form__error-block">
            <center>
              <h4 v-if="productLoadingFailed">Ошибка при загрузке!</h4>
              <p v-if="productErrorMessage">
                {{ productErrorMessage }}
              </p>
            </center>
          </div>
        </vue-modaltor>
      </section>
    </div>
  </main>
</template>

<script>
import ProductList from '@/components/Product/ProductList.vue';
import BasePagination from '@/components/Base/BasePagination.vue';
import ProductFilter from '@/components/Product/ProductFilter.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: { ProductList, BasePagination, ProductFilter },
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColorIds: [],
      filterMaterialIds: [],
      filterSeasonIds: [],

      page: 1,
      productsPerPage: '12',
    };
  },
  computed: {
    ...mapGetters('products', {
      productsData: 'productsData',
      productLoadingFailed: 'productLoadingFailed',
      open: 'open',
      productError: 'productError',
      productErrorMessage: 'productErrorMessage',
    }),

    products() {
      return this.productsData
        ? this.productsData.items.filter((product, index, items) => {
          if (items.indexOf(product) === index) {
            return {
              ...product,
            };
          }
          return null;
        })
        : [];
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  watch: {
    page: 'loadProducts',
    productsPerPage: 'loadProducts',
    filterCategoryId: 'loadProducts',
    filterPriceFrom: 'loadProducts',
    filterPriceTo: 'loadProducts',
    filterColorIds: 'loadProducts',
    filterMaterialIds: 'loadProducts',
    filterSeasonIds: 'loadProducts',
  },
  created() {
    this.loadProducts();
  },
  methods: {
    ...mapActions('products', ['loadProductsData', 'closeModal', 'openModal']),

    loadProducts() {
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        this.loadProductsData({
          page: this.page,
          limit: this.productsPerPage,
          minPrice: this.filterPriceFrom,
          maxPrice: this.filterPriceTo,
          categoryId: this.filterCategoryId,
          colorIds: this.filterColorIds,
          materialIds: this.filterMaterialIds,
          seasonIds: this.filterSeasonIds,
        });
      }, 300);
    },
  },
};
</script>
