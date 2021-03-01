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
            @click.prevent="clearMinPrice"
            id="min-price"
          />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="max-price"
            v-model.number="currentPriceTo"
            @click.prevent="clearMaxPrice"
            id="max-price"
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
        <CheckboxMaterialButtons
          :materials="materials"
          :select-material-ids.sync="selectMaterialIds"
        >
        </CheckboxMaterialButtons>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <CheckboxSeasonButtons :seasons="seasons" :select-season-ids.sync="selectSeasonIds">
        </CheckboxSeasonButtons>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit" :blocked="submitDisabled">
        Применить
      </button>
      <button
        v-if="resetActivated"
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
import ProductFilterRadioButtons from "@/components/Product/ProductFilterRadioButtons";
import CheckboxMaterialButtons from "@/components/Product/CheckboxMaterialButtons";
import CheckboxSeasonButtons from "@/components/Product/CheckboxSeasonButtons";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import numberFormat from "@/helpers/numberFormat";

export default {
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      selectColorIds: [],
      selectMaterialIds: [],
      selectSeasonIds: [],

      resetActivated: false,
      submitDisabled: true
    };
  },
  components: { ProductFilterRadioButtons, CheckboxMaterialButtons, CheckboxSeasonButtons },
  props: ["priceFrom", "priceTo", "categoryId", "colorIds", "materialIds", "seasonIds"],
  filters: {
    numberFormat
  },
  computed: {
    ...mapGetters({
      categoriesData: "categoriesData",
      colorsData: "colorsData",
      materialsData: "materialsData",
      seasonsData: "seasonsData"
    }),

    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    colors() {
      return this.colorsData ? this.colorsData.items : [];
    },
    materials() {
      return this.materialsData ? this.materialsData.items : [];
    },
    seasons() {
      return this.seasonsData ? this.seasonsData.items : [];
    }
  },
  methods: {
    ...mapActions(["loadCategoriesData", "loadColorsData", "loadMaterialsData", "loadSeasonsData"]),

    submit() {
      if (this.currentPriceFrom != null) {
        this.$emit("update:priceFrom", this.currentPriceFrom);
      }
      if (this.currentPriceTo != null) {
        this.$emit("update:priceTo", this.currentPriceTo);
      }
      if (this.currentCategoryId != null) {
        this.$emit("update:categoryId", this.currentCategoryId);
      }
      this.$emit("update:colorIds", this.selectColorIds);
      this.$emit("update:materialIds", this.selectMaterialIds);
      this.$emit("update:seasonIds", this.selectSeasonIds);
    },
    reset() {
      if (this.currentPriceFrom != 0) {
        this.$emit("update:priceFrom", 0);
      }
      if (this.currentPriceTo != 0) {
        this.$emit("update:priceTo", 0);
      }
      if (this.currentCategoryId != 0) {
        this.$emit("update:categoryId", 0);
      }
      if (this.selectColorIds.length > 0) {
        this.$emit("update:colorIds", (this.selectColorIds = []));
      }
      if (this.selectMaterialIds.length > 0) {
        this.$emit("update:materialIds", (this.selectMaterialIds = []));
      }
      if (this.selectSeasonIds.length > 0) {
        this.$emit("update:seasonIds", (this.selectSeasonIds = []));
      }
    },
    clearMinPrice() {
      if (document.getElementById("min-price").value == 0)
        document.getElementById("min-price").value = "";
    },
    clearMaxPrice() {
      if (document.getElementById("max-price").value == 0)
        document.getElementById("max-price").value = "";
    }
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
    currentPriceFrom(value) {
      if (value != 0) {
        this.resetActivated = true;
      } else {
        this.resetActivated = false;
      }
    },
    currentPriceTo(value) {
      if (value != 0) {
        this.resetActivated = true;
      } else {
        this.resetActivated = false;
      }
    },
    currentCategoryId(value) {
      if (value != 0) {
        this.resetActivated = true;
      } else {
        this.resetActivated = false;
      }
    },
    selectColorIds(value) {
      if (value.length > 0) {
        this.resetActivated = true;
      } else {
        this.resetActivated = false;
      }
    },
    selectMaterialIds(value) {
      if (value.length > 0) {
        this.resetActivated = true;
      } else {
        this.resetActivated = false;
      }
    },
    selectSeasonIds(value) {
      if (value.length > 0) {
        this.resetActivated = true;
      } else {
        this.resetActivated = false;
      }
    }
  },
  created() {
    this.loadCategoriesData();
    this.loadColorsData();
    this.loadMaterialsData();
    this.loadSeasonsData();
  }
};
</script>
