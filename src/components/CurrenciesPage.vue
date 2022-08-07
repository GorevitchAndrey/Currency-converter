<template>
  <div class="currencies-page">
    <button
      class="currencies-page__choose-button"
      @click="toggleCurrencyMenu"
    >
      Select
    </button>
    <div v-if="visibleCurrency" class="currencies-page__choose-menu">
      <div class="currencies-page__base-currency">
        Currency: {{ currencyValue }}
        <div :class="{
          'currencies-page__currency-up': currentCurrency?.currentCurrencyUp,
          'currencies-page__currency-down': currentCurrency?.currentCurrencyDown
        }">
          <arrow class="arrow"/>
          <span>{{ currencyDifference }}</span>
        </div>
      </div>

      
    </div>
    <div
        v-if="isSelectVisible"
        class="currencies-list currencies-menu"
      >
        <div
          v-for="(currencyData, index) in currenciesWithoutBase"
          :key="index"
          class="currencies-list__item"
          @click="changeCurrency(currencyData)"
        >
          {{ valueName(index) }}
        </div>
      </div>

    <div v-if="visibleCurrency" class="currencies-page__rates-list">
      <div
        v-for="(currencyData, index) in currenciesWithoutBase"
        :key="index"
        class="rates-list__item"
      >
        <p class="currency-list__item">
          <span>{{ valueName(index) }}</span>
          <span>{{ valueTotal(index) }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Arrow from "./svg/ArrowDown.vue"

export default {
  name: "CurrenciePpage",

  components: {
    Arrow,
  },

  data() {
    return {
      isSelectVisible: false,
    };
  },

  computed: {
    ...mapGetters(["valutes", "currenciesWithoutBase", "baseCurrency"]),

    currentCurrency() {
      return this.$store.state.currentCurrency;
    },

    currencyValue() {
      return `${this.currentCurrency.code}(${this.currentCurrency.name}) - ${this.currentCurrency.value}`;
    },

    currencyDifference() {
      return this.currentCurrency.difference?.toFixed(4);
    },

    visibleCurrency() {
      return Object.keys(this.currentCurrency).length;
    }
  },

  methods: {
    ...mapActions(["getCurrenciesFromApi", "changeBaseCurrency"]),

    valueName(index) {
      return this.valutes[index].CharCode;
    },

    valueTotal(index) {
      return (this.valutes[index].Value / this.valutes[this.baseCurrency].Value).toFixed(4);
    },

    toggleCurrencyMenu() {
      this.isSelectVisible = !this.isSelectVisible;
    },

    changeCurrency(data) {
      const { CharCode, Previous, Value, Name } = data;
      this.changeBaseCurrency({ code: CharCode, name: Name, value: Value, previous: Previous });
    },
  },

  created() {
    this.getCurrenciesFromApi();
    document.onclick = (e) => {
      if (e.target.className != "currencies-page__choose-button")
        this.isSelectVisible = false;
    };
  },
};
</script>

<style lang="scss">
.currencies-page {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__base-currency {
    font-size: 1.2rem;
    font-weight: 600;
    padding: 1.5rem;
  }

  &__currency-up,
  &__currency-down {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
    gap: 5px;
    font-size: 1rem;
    font-weight: 400;
  }

  &__choose-menu {
    display: flex;
    align-items: center;
    position: relative;
  }

  &__rates-list {
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem 10rem;
  }

  &__choose-button {
    font-size: 1.2rem;
    box-sizing: border-box;
    padding: 0.5rem;
    background-color: rgb(108, 173, 233);
    border: none;
    color: white;
    border-radius: 0.25rem;
    cursor: pointer;
    margin-top: 0.8rem;

    &:hover {
      box-shadow: 0 0 0.5rem rgb(88, 142, 192);
    }
  }

    &__currency-up {
    fill: green;
    color: green;

    .arrow {
      transform: rotate(180deg);
    }
  }

  &__currency-down {
    fill: red;
    color: red;

    .arrow {
      transform: rotate(360deg);
    }
  }

    .currencies-menu {
    top: 9rem;
    width: 50%;
    left: auto;
  }

  .rates-list__item {
    width: 9rem;
    display: flex;
    justify-content: space-between;
  }

  .currency-list__item {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}

@media screen and (max-width: 576px) {
  .currencies-page__rates-list {
    box-sizing: border-box;
    width: 100%;
    gap: 1rem 22vw;
  }
  .rates-list__item {
    margin: 0 auto;
  }
}
</style>
