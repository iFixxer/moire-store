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

      <h1 class="content__title" v-if="orderInfo">
        Заказ оформлен <span>№{{ this.$route.params.id }}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо
            с&nbsp;деталями заказа. Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для
            уточнения деталей доставки.
          </p>

          <ul class="dictionary" v-if="orderInfo">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Статус заказа
              </span>
              <span class="dictionary__value">
                {{ orderInfo.status.title }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ orderInfo.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ orderInfo.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{ orderInfo.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ orderInfo.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{ orderInfo.paymentType }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Комментарий
              </span>
              <span class="dictionary__value">
                {{ orderInfo.comment }}
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders" v-if="orderInfo">
            <OrderItem v-for="item in orderInfo.basket.items" :key="item.id" :item="item" />
          </ul>

          <div class="cart__total" v-if="orderInfo">
            <p>
              Доставка: <b>{{ this.orderInfo.deliveryType.price }} ₽</b>
            </p>
            <p>
              Итого товаров: <b>{{ this.orderInfo.basket.items.length }}</b> на сумму
              <b
                >{{
                  
                    totalOrderPrice | numberFormat
                }}
                ₽</b
              >
            </p>
          </div>
        </div>
        <vue-modaltor :visible="open" @hide="closeModal" :show-close-button="false">
          <div class="cart__error form__error-block" style="text-align:center;">
              <h4>Ошибка!</h4>
              <p>
                {{ orderErrorMessage }}
              </p>
          </div>
        </vue-modaltor>
      </form>
    </section>
  </main>
</template>

<script>
import OrderItem from '@/components/Order/OrderItem.vue';
import numberFormat from '@/helpers/numberFormat';
import { mapState, mapActions } from 'vuex';

export default {
  components: { OrderItem },
  filters: { numberFormat },
  computed: {
    ...mapState('order', [
      'orderInfo',
      'open',
      'orderError',
      'orderErrorMessage',
    ]),

    totalOrderPrice() {
      return (Number(this.orderInfo.totalPrice));
    }
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadOrder();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions('order', [
      'loadOrderInfo',
      'closeModal',
    ]),

    loadOrder() {
      this.loadOrderInfo({
        userAccessKey: this.$store.state.userAccessKey,
        id: this.$route.params.id,
      }).catch(() => {
        this.$router.replace('/notFound');
      });
    },
  },
};
</script>
