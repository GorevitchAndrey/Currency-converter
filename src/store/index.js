import { createStore } from "vuex";
import axios from "axios";
import { clone } from "../utils/helpers"

export default createStore({
  state: {
    valutes: {},
    currenciesList: {},
    currentCurrency: {},
    currentStateCurrency: {},
    baseCurrency: "",
  },

  getters: {
    valutes(state) {
      return state.valutes;
    },

    currenciesWithoutBase(state) {
      return state.currenciesList;
    },

    baseCurrency(state) {
      return state.baseCurrency;
    },
  },

  mutations: {
    SET_CURRENT_CURRENCY(state, object) {
      const { previous, value } = object;
      state.currentCurrency = object;

      if (previous > value) {
        state.currentCurrency.currentCurrencyDown = true;
        state.currentCurrency.difference = previous - value; 
      } else {
        state.currentCurrency.currentCurrencyUp = true;
        state.currentCurrency.difference = value - previous; 
      }
    },
  
    SET_CURRENCIES: (state, res) => {
      state.valutes = res.Valute;
    },

    SET_CURRENCIES_LIST_WITHOUT_BASE: (state) => {
      state.currenciesList = clone(state.valutes);
      delete state.currenciesList[state.baseCurrency];
    },

    SET_BASE_CURRENCY: (state, currency) => {
      state.baseCurrency = currency;
    },

    CLEAR_CURRENT_CURRENCIES_STATE(state) {
      state.currentCurrency = {};
    },
  },

  actions: {
    getCurrenciesFromApi({ commit }) {
      return axios("https://www.cbr-xml-daily.ru/daily_json.js", {
        method: "GET",
      })
        .then((res) => {
          commit("SET_CURRENCIES", res.data);
          commit("SET_CURRENCIES_LIST_WITHOUT_BASE");
          return res;
        })
        .catch((error) => {
          console.error(error)
          return error;
        });
    },

    changeBaseCurrency({ commit }, payload) {
      commit("SET_CURRENT_CURRENCY", payload);
      commit("SET_BASE_CURRENCY", payload.code);
      commit("SET_CURRENCIES_LIST_WITHOUT_BASE");
    },
  },
});
