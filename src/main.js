import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueModalTor from "vue-modaltor";
import VueMask from "v-mask";

Vue.use(VueModalTor, {
  defaultWidth: "360px",
  bgPanel: "#fff",
  bgOverlay: "rgba(0,0,0,.55)",
  closeScroll: false
});

Vue.use(VueMask);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
