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

        <div v-if="productsLoadingFailed">
          Произошла непредвиденная ошибка.
          <button @click.prevent="loadProducts">
            Попробовать снова
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import ProductList from "@/components/Product/ProductList";
import BasePagination from "@/components/Base/BasePagination";
import ProductFilter from "@/components/Product/ProductFilter";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

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
      productsPerPage: 12,

      productsLoadingFailed: false
    };
  },
  computed: {
    ...mapGetters({
      productsData: "productsData"
    }),

    products() {
      return this.productsData
        ? this.productsData.items.filter((product, index, items) => {
            if (items.indexOf(product) == index)
              return {
                ...product
              };
          })
        : [];
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    }
  },
  methods: {
    ...mapActions(["loadProductsData"]),

    loadProducts() {
      NProgress.start();
      this.productsLoadingFailed = false;
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
          seasonIds: this.filterSeasonIds
        })
          .catch(() => (this.productsLoadingFailed = true))
          .then(() => NProgress.done());
      }, 300);
    }
  },
  watch: {
    page: "loadProducts",
    productsPerPage: "loadProducts",
    filterCategoryId: "loadProducts",
    filterPriceFrom: "loadProducts",
    filterPriceTo: "loadProducts",
    filterColorIds: "loadProducts",
    filterMaterialIds: "loadProducts",
    filterSeasonIds: "loadProducts"
  },
  created() {
    this.loadProducts();
  }
};
</script>
