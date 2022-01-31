import Vue from "vue";
import App from "./App.vue";
import store from "./store.js";
import VWave from "v-wave";
import Dispatcher from "./util/dispatcher";
import "./util/cache";

Vue.config.productionTip = false;

Vue.use(VWave, {
	startingOpacity: 0.4,
	finialOpacity: 0.75,
	duration: 0.2,
	easing: "ease-in",
	cancellationPeriod: 25
});

new Vue({
	store: store,
	render: (h) => h(App)
}).$mount("#app");


window.addEventListener("keydown", (e) => {
	if (
		e.ctrlKey &&
		(e.code === "KeyV" || e.key === "v" || e.key === "V" || e.key === "м" || e.key === "М")
	)
		Dispatcher.call("ctrl+v");
	else
		Dispatcher.call("anyKey");
});
