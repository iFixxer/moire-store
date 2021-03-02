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

      <h1 class="content__title" v-if="order">
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

          <ul class="dictionary" v-if="order">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Статус заказа
              </span>
              <span class="dictionary__value">
                {{ this.order.status.title }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ this.order.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ this.order.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{ this.order.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ this.order.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{ this.order.paymentType }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Комментарий
              </span>
              <span class="dictionary__value">
                {{ this.order.comment }}
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders" v-if="order">
            <OrderItem v-for="item in order.basket.items" :key="item.id" :item="item" />
          </ul>

          <div class="cart__total" v-if="order">
            <p>
              Доставка: <b>{{ this.order.deliveryType.price }} ₽</b>
            </p>
            <p>
              Итого товаров: <b>{{ this.order.basket.items.length }}</b> на сумму
              <b
                >{{
                  (Number(this.order.totalPrice) + Number(this.order.deliveryType.price))
                    | numberFormat
                }}
                ₽</b
              >
            </p>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import OrderItem from "@/components/Order/OrderItem";
import numberFormat from "@/helpers/numberFormat";
import { mapGetters, mapActions } from "vuex";

export default {
  components: { OrderItem },
  filters: { numberFormat },
  computed: {
    ...mapGetters("order", {
      order: "orderInfo"
    })
  },
  watch: {
    "$route.params.id": {
      handler() {
        this.loadOrder();
      }
    },
    immediate: true
  },
  created() {
    this.loadOrder();
  },
  methods: {
    ...mapActions("order", ["loadOrderInfo"]),

    loadOrder() {
      this.loadOrderInfo({
        userAccessKey: this.$store.state.userAccessKey,
        id: this.$route.params.id
      }).catch(error => {
        this.$router.push("/notFound");
      });
    }
  }
};
</script>
