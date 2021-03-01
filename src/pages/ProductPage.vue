<template>
  <div>
    <main class="content container" v-if="!product">Не удалось загрузить товар.</main>
    <main class="content container" v-else>
      <div class="content__top">
        <ul class="breadcrumbs">
          <li class="breadcrumbs__item">
            <router-link class="breadcrumbs__link" :to="{ name: 'catalog' }">
              Каталог
            </router-link>
          </li>
          <!-- В ТЗ не описано, что должно происходить при переходе в категрию -->
          <!-- <li class="breadcrumbs__item">
            <router-link class="breadcrumbs__link" :to="{ name: 'catalog' }">
              {{ product.category.title }}
            </router-link>
          </li> -->
          <li class="breadcrumbs__item">
            <a class="breadcrumbs__link">
              {{ product.title }}
            </a>
          </li>
        </ul>
      </div>

      <section class="item">
        <div class="item__pics pics">
          <div class="pics__wrapper">
            <img :src="currentImage" :alt="currentImage" />
          </div>
          <ProductGallery :images="images" :currentImage.sync="currentImage" />
        </div>

        <div class="item__info">
          <span class="item__code">Артикул: {{ product.id }}</span>
          <h2 class="item__title">
            {{ product.title }}
          </h2>
          <div class="item__form">
            <form class="form" action="#" method="POST" @submit.prevent="addToCart">
              <div class="item__row item__row--center">
                <ProductAmountButtons :amount.sync="amount" :productId="this.product.id" />

                <b class="item__price"> {{ product.price | numberFormat }} ₽ </b>
              </div>

              <div class="item__row">
                <fieldset class="form__block">
                  <legend class="form__legend">Цвет</legend>

                  <ProductRadioButtons
                    :colors="product.colors"
                    :currentColorId.sync="currentColorId"
                  >
                  </ProductRadioButtons>
                </fieldset>

                <fieldset class="form__block">
                  <legend class="form__legend">Размер</legend>
                  <label class="form__label form__label--small form__label--select">
                    <select
                      class="form__select"
                      type="text"
                      name="size"
                      v-model.number="currentSizeId"
                    >
                      <option value="0">Выберите размер</option>
                      <option :value="size.id" v-for="size in sizes" :key="size.id">
                        {{ size.title }}
                      </option>
                    </select>
                  </label>
                </fieldset>
              </div>

              <button class="button button--primery" type="submit" :disabled="productAddSending">
                В корзину
              </button>

              <vue-modaltor :visible="open" @hide="hideModal" :show-close-button="false">
                <div class="cart__error form__error-block">
                  <center>
                    <h4 v-if="incorrectSize">
                      Выберите размер
                    </h4>
                    <h4 v-if="productAddSending">
                      Товар добавляется в корзину...
                    </h4>
                    <h4 v-if="productAdded">
                      Товар добавлен в корзину
                    </h4>
                  </center>
                </div>
              </vue-modaltor>
            </form>
          </div>
        </div>

        <div class="item__desc">
          <ul class="tabs">
            <li class="tabs__item">
              <a class="tabs__link tabs__link--current">
                Информация о товаре
              </a>
            </li>
            <li class="tabs__item">
              <a class="tabs__link" href="#">
                Доставка и возврат
              </a>
            </li>
          </ul>

          <div class="item__content">
            <h3>Состав:</h3>

            <p>
              60% хлопок<br />
              30% полиэстер<br />
            </p>

            <h3>Уход:</h3>

            <p>
              Машинная стирка при макс. 30ºC короткий отжим<br />
              Гладить при макс. 110ºC<br />
              Не использовать машинную сушку<br />
              Отбеливать запрещено<br />
              Не подвергать химчистке<br />
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import ProductRadioButtons from "@/components/Product/ProductRadioButtons";
import ProductAmountButtons from "@/components/Product/ProductAmountButtons";
import ProductGallery from "@/components/Product/ProductGallery";
import noPhoto from "@/assets/img/noPhoto.jpg";
import numberFormat from "@/helpers/numberFormat";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      currentSizeId: 0,
      currentColorId: null,
      currentImage: null,
      amount: 1,
      open: false,

      incorrectSize: false,
      productAdded: false,
      productAddSending: false
    };
  },
  filters: {
    numberFormat
  },
  components: { ProductRadioButtons, ProductAmountButtons, ProductGallery },
  computed: {
    ...mapGetters({
      product: "productData",
      productLoadingFailed: "productLoadingFailed"
    }),
    sizes() {
      return this.product ? this.product.sizes : [];
    },
    images() {
      return this.product ? this.product.colors : [];
    }
  },
  methods: {
    ...mapActions(["addProductToCart", "loadProductData"]),

    addToCart() {
      if (this.currentSizeId > 0) {
        this.productAdded = false;
        this.productAddSending = true;
        this.open = true;

        this.addProductToCart({
          productId: this.product.id,
          colorId: this.currentColorId,
          sizeId: this.currentSizeId,
          amount: this.amount
        }).then(() => {
          this.productAdded = true;
          this.productAddSending = false;
        });
      } else {
        this.incorrectSize = true;
        this.open = true;
      }
      this.productAdded = false;
      this.productAddSending = false;
    },
    hideModal() {
      this.open = false;
    }
  },
  watch: {
    "$route.params.id": {
      handler() {
        this.loadProductData({ id: this.$route.params.id });
      },
      immediate: true
    },
    currentSizeId: {
      handler() {
        if (this.currentSizeId > 0) {
          this.incorrectSize = false;
        } else {
          this.incorrectSize = true;
        }
      }
    },
    product: {
      handler() {
        this.currentColorId = this.product.colors[0].color;
        this.currentImage = this.product.colors[0].gallery
          ? this.product.colors[0].gallery[0].file.url
          : noPhoto;
      }
    },
    currentColorId: {
      handler(value) {
        if (typeof value.color != "undefined") this.currentColorId = value.color;
        if (typeof value.gallery != "undefined") {
          if (value.gallery != null) {
            this.currentImage = value.gallery[0].file.url;
          } else {
            this.currentImage = noPhoto;
          }
        }
      }
    },
    currentImage: {
      handler(value) {
        if (typeof value.gallery != "undefined") {
          if (value.gallery != null) {
            this.currentImage = value.gallery[0].file.url;
          } else {
            this.currentImage = noPhoto;
          }
        }
        if (typeof value.color != "undefined") this.currentColorId = value.color;
      }
    }
  }
};
</script>

<style></style>
