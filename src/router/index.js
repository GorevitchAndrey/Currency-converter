import { createRouter, createWebHashHistory } from "vue-router";
import ConverterPage from "../components/ConverterPage";
import CurrenciesPage from "../components/CurrenciesPage";
const routes = [
  {
    path: "/",
    name: "Converter",
    component: ConverterPage,
  },
  {
    path: "/currencies",
    name: "Currencies",
    component: CurrenciesPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
