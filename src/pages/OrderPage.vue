<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'catalog' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'cart' }">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Оформление заказа
        </h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText
              v-model="formData.name"
              :error="orderError.name"
              title="ФИО"
              placeholder="Введите ваше полное имя"
              id="name"
              maxlength="70"
            />

            <BaseFormText
              v-model="formData.address"
              :error="orderError.address"
              title="Адрес доставки"
              placeholder="Введите ваш адрес"
              id="address"
              maxlength="200"
            />

            <BaseFormText
              v-model="formData.phone"
              :error="orderError.phone"
              title="Телефон"
              placeholder="Введите ваш телефон"
              id="phone"
              maxlength="12"
              v-mask="'+7##########'"
            />

            <BaseFormText
              v-model="formData.email"
              :error="orderError.email"
              title="Email"
              placeholder="Введи ваш Email"
              id="email"
              maxlength="70"
            />

            <BaseFormTextarea
              v-model="formData.comment"
              :error="orderError.comment"
              title="Комментарий к заказу"
              placeholder="Ваши пожелания"
              id="comment"
              maxlength="500"
            />
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <OrderDelivery
              :deliveryTypes="deliveryTypes"
              :deliveryTypeId.sync="formData.deliveryTypeId"
              :deliveryPrice.sync="deliveryPrice"
            />

            <h3 class="cart__title">Оплата</h3>
            <OrderPayment
              :paymentTypes="paymentTypes"
              :paymentTypeId.sync="formData.paymentTypeId"
            />
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <OrderItem v-for="item in products" :key="item.productId" :item="item" />
          </ul>

          <div class="cart__total">
            <p>
              Доставка: <b>{{ deliveryPrice }} ₽</b>
            </p>
            <p>
              Итого товаров: <b>{{ products.length }}</b> на сумму
              <b>{{ (Number(totalPrice) + Number(deliveryPrice)) | numberFormat }} ₽</b>
            </p>
          </div>

          <button
            class="cart__button button button--primery"
            type="submit"
            v-if="products.length > 0"
          >
            Оформить заказ
          </button>
        </div>
        <vue-modaltor :visible="open" @hide="closeModal" :show-close-button="false">
          <div class="cart__error form__error-block" style="text-align:center;">
            <h4>Ошибка при отправке заказа!</h4>
            <p v-if="orderSendingFailed">
              {{ orderErrorMessage }}
            </p>
          </div>
        </vue-modaltor>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from '@/components/Base/BaseFormText.vue';
import BaseFormTextarea from '@/components/Base/BaseFormTextarea.vue';
import OrderItem from '@/components/Order/OrderItem.vue';
import OrderDelivery from '@/components/Order/OrderDelivery.vue';
import OrderPayment from '@/components/Order/OrderPayment.vue';
import numberFormat from '@/helpers/numberFormat';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  components: {
    BaseFormText, BaseFormTextarea, OrderDelivery, OrderPayment, OrderItem,
  },
  filters: {
    numberFormat,
  },
  data() {
    return {
      formData: {
        name: '',
        address: '',
        phone: '',
        email: '',
        deliveryTypeId: 1,
        paymentTypeId: 1,
        comment: '',
      },
      deliveryPrice: '0',
    };
  },
  computed: {
    ...mapGetters('cart', {
      products: 'cartDetailproducts',
      totalPrice: 'cartTotalPrice',
    }),
    ...mapState('order', [
      'paymentTypes',
      'deliveryTypes',
      'orderSendingFailed',
      'open',
      'orderError',
      'orderErrorMessage',
    ]),
  },
  watch: {
    deliveryPrice: {
      handler() {
        this.changeOrderType();
      },
    },
  },
  created() {
    this.changeOrderType();
    this.loadDeliveryTypes();
  },
  methods: {
    ...mapActions('order', [
      'loadPaymentTypes',
      'loadDeliveryTypes',
      'loadOrderData',
      'closeModal',
    ]),

    order() {
      this.loadOrderData({
        name: this.formData.name,
        address: this.formData.address,
        phone: this.formData.phone,
        email: this.formData.email,
        deliveryTypeId: this.formData.deliveryTypeId,
        paymentTypeId: this.formData.paymentTypeId,
        comment: this.formData.comment,
      });
    },
    changeOrderType() {
      this.loadPaymentTypes({ deliveryTypeId: this.formData.deliveryTypeId });
    },
  },
};
</script>

<style>
/* Classes for non-selected deliveries and payments */
.options__label:hover .options__hover {
  background-color: rgba(224, 45, 113, 0.2);
}
.options__label:hover .options__hover::before {
  border: 4px solid #fff;
}

/* Classes for selected delivery and payment */
.options__select {
  background-color: rgba(224, 45, 113, 0.2);
}
.options__select::before {
  background-color: #222;
}
.options__select {
  background-color: #e02d71;
  color: #fff;
}
.options__select::before {
  border: 4px solid #fff;
}
</style>
