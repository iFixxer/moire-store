<template>
  <aside class="filter">
    <form class="filter__form form" action="#" method="get" @submit.prevent="submit">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="min-price"
            v-model.number="currentPriceFrom"
            @focus="focusPriceFrom"
            @blur="blurPriceFrom"
          />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="max-price"
            v-model.number="currentPriceTo"
            @focus="focusPriceTo"
            @blur="blurPriceTo"
          />
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select
            class="form__select"
            type="text"
            name="category"
            v-model.number="currentCategoryId"
          >
            <option value="0">Все категории</option>
            <option :value="category.id" v-for="category in categories" :key="category.id">{{
              category.title
            }}</option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ProductFilterRadioButtons :colors="colors" :select-color-ids.sync="selectColorIds">
        </ProductFilterRadioButtons>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ProductFilterCheckboxMaterials
          :materials="materials"
          :select-material-ids.sync="selectMaterialIds"
        >
        </ProductFilterCheckboxMaterials>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ProductFilterCheckboxSeasons :seasons="seasons" :select-season-ids.sync="selectSeasonIds">
        </ProductFilterCheckboxSeasons>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit" :blocked="submitDisabled">
        Применить
      </button>
      <button
        v-if="showResetBtn"
        class="filter__reset button button--second"
        type="button"
        @click.prevent="reset"
      >
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import ProductFilterRadioButtons from '@/components/Product/ProductFilterRadioButtons.vue';
import ProductFilterCheckboxMaterials from '@/components/Product/ProductFilterCheckboxMaterials.vue';
import ProductFilterCheckboxSeasons from '@/components/Product/ProductFilterCheckboxSeasons.vue';
import numberFormat from '@/helpers/numberFormat';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    ProductFilterRadioButtons,
    ProductFilterCheckboxMaterials,
    ProductFilterCheckboxSeasons,
  },
  filters: {
    numberFormat,
  },
  props: {
    priceFrom: Number,
    priceTo: Number,
    categoryId: Number,
    colorIds: Array,
    materialIds: Array,
    seasonIds: Array,
  },
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      selectColorIds: [],
      selectMaterialIds: [],
      selectSeasonIds: [],

      focused: false,

      submitDisabled: true,
    };
  },
  computed: {
    ...mapState('products', [
      'categories',
      'colors',
      'materials',
      'seasons',
    ]),

    filters() {
      return {
        currentPriceFrom: this.currentPriceFrom,
        currentPriceTo: this.currentPriceTo,
        currentCategoryId: this.currentCategoryId,
        selectColorIds: this.selectColorIds,
        selectMaterialIds: this.selectMaterialIds,
        selectSeasonIds: this.selectSeasonIds,
      };
    },
    showResetBtn() {
      const initial = {
        currentPriceFrom: 0,
        currentPriceTo: 0,
        currentCategoryId: 0,
        selectColorIds: [],
        selectMaterialIds: [],
        selectSeasonIds: [],
      };
      return JSON.stringify(initial) !== JSON.stringify(this.filters);
    },
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    categoryId(value) {
      this.currentCategoryId = value;
    },
    colorIds(value) {
      this.selectColorIds = value;
    },
    materialIds(value) {
      this.selectMaterialIds = value;
    },
    seasonIds(value) {
      this.selectSeasonIds = value;
    },
  },
  created() {
    this.loadCategories();
    this.loadColors();
    this.loadMaterials();
    this.loadSeasons();
  },
  methods: {
    ...mapActions('products', [
      'loadCategories',
      'loadColors',
      'loadMaterials',
      'loadSeasons',
    ]),
    submit() {
      if (this.currentPriceFrom !== null) {
        this.$emit('update:priceFrom', this.currentPriceFrom);
      }
      if (this.currentPriceTo !== null) {
        this.$emit('update:priceTo', this.currentPriceTo);
      }
      if (this.currentCategoryId !== null) {
        this.$emit('update:categoryId', this.currentCategoryId);
      }
      this.$emit('update:colorIds', this.selectColorIds);
      this.$emit('update:materialIds', this.selectMaterialIds);
      this.$emit('update:seasonIds', this.selectSeasonIds);
    },
    reset() {
      if (this.currentPriceFrom !== 0) {
        this.$emit('update:priceFrom', (this.currentPriceFrom = 0));
      }
      if (this.currentPriceTo !== 0) {
        this.$emit('update:priceTo', (this.currentPriceTo = 0));
      }
      if (this.currentCategoryId !== 0) {
        this.$emit('update:categoryId', (this.currentCategoryId = 0));
      }
      if (this.selectColorIds.length > 0) {
        this.$emit('update:colorIds', (this.selectColorIds = []));
      }
      if (this.selectMaterialIds.length > 0) {
        this.$emit('update:materialIds', (this.selectMaterialIds = []));
      }
      if (this.selectSeasonIds.length > 0) {
        this.$emit('update:seasonIds', (this.selectSeasonIds = []));
      }
    },
    focusPriceFrom() {
      this.focused = true;
      if (this.currentPriceFrom === 0) this.currentPriceFrom = '';
    },
    blurPriceFrom() {
      this.focused = false;
      if (this.currentPriceFrom === '') this.currentPriceFrom = 0;
    },
    focusPriceTo() {
      this.focused = true;
      if (this.currentPriceTo === 0) this.currentPriceTo = '';
    },
    blurPriceTo() {
      this.focused = false;
      if (this.currentPriceTo === '') this.currentPriceTo = 0;
    },
  },
};
</script>
