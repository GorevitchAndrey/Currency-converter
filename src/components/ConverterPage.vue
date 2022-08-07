<template>
  <div class="converter-page">
    <div class="converter-page__wrapper">
      <div class="converter-page__calc-block calc">
        <div class="calc__switcher">
          <div
            v-for="(currency, index) in firstBaseCurrencies"
            :key="index"
            :class="[{'calc__switcher__item__active': currency == firstActiveCurrency}, 'calc__switcher-item']"
            @click="setActiveCurrency(currency, 'firstActiveCurrency')"
          >
            {{ currency }}
          </div>
          <div
            :class="[{ 'arrow__active': isFirstListVisible }, 'calc__switcher-button']"
            @click="toggleCurrencyMenu('isFirstListVisible', 'isSecondListVisible')"
          >
            <ArrowSvg/>
          </div>
          <div v-if="isFirstListVisible"
            class="currencies-list"
          >
            <div
              v-for="currency in valutes"
              :key="currency.ID"
              class="currencies-list__item"
            >
              <p
                @click="setOptionalCurrency(currency.CharCode, 'firstBaseCurrencies', 'firstActiveCurrency', 'isFirstListVisible')"
              >
                {{ currency.CharCode }}
              </p>
            </div>
          </div>
        </div>

        <div class="calc__input-area">
          <input
            :class="[{ 'calc__input__field__small': isSmallFont }, 'calc__input-field']"
            :value="firstInput"
            type="number"
            @keydown="checkKeyCode"
            @input="updateInputValue($event, 'firstInput')"
            @keyup="firstInputCalc()"
          />
          <p class="calc__rate">{{ firstRate }}</p>
        </div>
      </div>

      <div class="converter-page__switcher" @click="reverse()">
        <ArrowChangeSvg />
      </div>
      <div class="converter-page__calc-block calc">
        <div class="calc__switcher">
          <div
            v-for="(currency, index) in secondBaseCurrencies"
            :key="index"
            :class="[{'calc__switcher__item__active': currency == secondActiveCurrency}, 'calc__switcher-item']"
            @click="setActiveCurrency(currency, 'secondActiveCurrency')"
          >
            {{ currency }}
          </div>
          <div
            :class="[{ 'arrow__active': isSecondListVisible }, 'calc__switcher-button']"
            @click="toggleCurrencyMenu('isSecondListVisible', 'isFirstListVisible')"
          >
            <ArrowSvg />
          </div>
          <div v-if="isSecondListVisible" class="second-list currencies-list">
            <div
              class="currencies-list__item"
              v-for="currency in valutes"
              :key="currency.ID"
            >
              <p
                @click="setOptionalCurrency(currency.CharCode, 'secondBaseCurrencies', 'secondActiveCurrency', 'isSecondListVisible')"
              >
                {{ currency.CharCode }}
              </p>
            </div>
          </div>
        </div>
        <div class="calc__input-area">
          <input
            :class="[{ 'calc__input__field__small': isSmallFont }, 'calc__input-field']"
            :value="secondInput"
            type="number"
            @keydown="checkKeyCode"
            @input="updateInputValue($event, 'secondInput')"
            @keyup="secondInputCalc()"
          />
          <p class="calc__rate">{{ secondRate }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ArrowSvg from "./svg/ArrowDown.vue";
import ArrowChangeSvg from "./svg/ArrowChange.vue";

export default {
  name: "ConverterPage",

  components: {
    ArrowSvg,
    ArrowChangeSvg,
  },

  data() {
    return {
      firstBaseCurrencies: ["USD", "EUR", "GBP"],
      secondBaseCurrencies: ["USD", "EUR", "GBP"],
      firstActiveCurrency: "USD",
      secondActiveCurrency: "EUR",
      firstInput: null,
      secondInput: null,
      firstRate: null,
      secondRate: null,
      isFirstListVisible: false,
      isSecondListVisible: false,
      isSmallFont: false,
      isMaxLength: false,
      keyCode: null,
      inputMaxLength: 11,
    };
  },

  computed: {
    ...mapGetters(["valutes"]),
  },

  methods: {
    ...mapActions(["getCurrenciesFromApi"]),
    //Сохраняем код нажатой клавиши в поле ввода для дальнейшей првоерки в методах updateFirstValue и updateSecondValue. Значение this.keyCodr сбрасывается в null в конце этиx методов после проверки.
    checkKeyCode(event) {
      this.keyCode = event.key;
    },

    resetKeyKode() {
      this.$forceUpdate();
      this.keyCode = null;
    },

    toggleCurrencyMenu(currentMenu, competitorMenu) {
      this[currentMenu] = !this[currentMenu];
      this[competitorMenu] = false;
    },

    updateInputValue(event, key) {
      const value = event.target.value;
      if (String(value).length <= this.inputMaxLength || this.keyCode === "Backspace") {
        this[key] = value;
      }
      this.resetKeyKode();
    },

    setOptionalCurrency(code, baseCurrencies, activeCurrency, listVisible) {
      if (code !== "USD" && code !== "EUR") {
        this[baseCurrencies][2] = code;
        this[activeCurrency] = code;
      } else {
        this[activeCurrency] = code;
      }
      this[listVisible] = false;
      this.firstInputCalc();
    },

    setActiveCurrency(currency, activeCurrency) {
      this[activeCurrency] = currency;
      this.firstInputCalc();
    },

    firstInputCalc() {
      this.secondInput = this.convertibleValue('firstInput', 'firstActiveCurrency', 'secondActiveCurrency');
    },

    secondInputCalc() {
      this.firstInput = this.convertibleValue('secondInput', 'secondActiveCurrency', 'firstActiveCurrency');
    },

    convertibleValue(inputValue, a, b) {
      return parseFloat(((this[inputValue] * this.valutes[this[a]].Value) / this.valutes[this[b]].Value).toFixed(4));
    },

    setRates() {
      this.firstRate =
        "1 " +
        this.firstActiveCurrency +
        " = " +
        this.makeCurrentNumber('firstActiveCurrency', 'secondActiveCurrency')
        +
        " " +
        this.secondActiveCurrency;
      this.secondRate =
        "1 " +
        this.secondActiveCurrency +
        " = " +
        this.makeCurrentNumber('secondActiveCurrency', 'firstActiveCurrency')
        +
        " " +
        this.firstActiveCurrency;
    },

    makeCurrentNumber(a, b) {
      return parseFloat((this.valutes[this[a]].Value / this.valutes[this[b]].Value).toFixed(4))
    },

    reverse() {
      [this.firstActiveCurrency, this.secondActiveCurrency] = [this.secondActiveCurrency, this.firstActiveCurrency];
      [this.firstBaseCurrencies[2], this.secondBaseCurrencies[2]] = [this.secondBaseCurrencies[2], this.firstBaseCurrencies[2]];
      this.firstInputCalc();
    },

    reset() {
      this.firstInput = null;
      this.secondInput = null;
      this.firstRate = null;
      this.secondRate = null;
    },
  },

  mounted() {
    this.getCurrenciesFromApi();
  },

  watch: {
    firstInput() {
      if (this.firstInput === 0 || this.firstInput === null) {
        this.reset();
      } else {
        this.setRates();
      }
    },

    secondInput() {
      if (this.secondInput == 0 || this.secondInput == null) {
        this.reset();
      } else {
        this.setRates();
        this.secondInput.toString().length >= 11 ||
        (this.firstInput != null && this.firstInput.toString().length >= 11)
          ? (this.isSmallFont = true)
          : (this.isSmallFont = false);
      }
    },
  },
};
</script>

<style lang="scss">
.converter-page {
  height: calc(100% - 5rem);

  &__wrapper {
    margin: 0 auto;
    width: min(100%, 1000px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    box-sizing: border-box;
    padding: 2rem 2rem 4rem 2rem;
  }

  &__calc-block {
    flex: 1;
    margin: 0 3rem;
    display: flex;
    flex-direction: column;
  }

  &__switcher {
    width: 3rem;
    display: flex;
    align-items: center;
  }

  &__arrows {
    width: 100%;
    height: auto;
    cursor: pointer;
    opacity: 0.8;
    user-select: none;

    &:hover {
      opacity: 0.5;
    }
  }

  .calc {
    &__title {
      margin-bottom: 2rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    &__switcher {
      width: 100%;
      display: flex;
      margin-bottom: 2rem;
      border-radius: 0.5rem;
      border: 1px solid rgb(100, 100, 100);
      position: relative;
    }

    &__switcher-item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding: 1rem;
      cursor: pointer;
      border-right: 1px solid rgb(100, 100, 100);

      &:first-child {
        border-top-left-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
      }

      &:hover,:focus {
      background-color: rgb(77, 129, 179);
    }
    }

    &__switcher__item__active {
      background-color: rgb(108, 173, 233) !important;
    }

    &__switcher-button {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding: 1rem;
      cursor: pointer;
      user-select: none;
      border-top-left-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
    }

    &__input-area {
      min-height: 8rem;
      height: 15rem;
      width: 100%;
      border-radius: 0.5rem;
      border: 1px solid rgb(100, 100, 100);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }

    &__input-field {
      font-size: 3rem;
      height: 80%;
      width: 80%;
      border: none;
      outline: none;
    }

    &__input__field__small {
      font-size: 2rem !important;
    }

    &__rate {
      padding-bottom: 1rem;
    }
  }

  .arrow__active {
    transform: rotate(180deg);
    background-color: rgb(108, 173, 233) !important;
  }

  .list__item {
    font-weight: 400;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
  }
}

@media screen and (max-width: 768px) {
  .converter-page {
    &__wrapper {
      flex-direction: column;
    }

    &__switcher {
      padding: 2rem 0;
      transform: rotate(90deg);
    }

    &__calc-block {
      width: 100%;
    }

    .calc__input-area {
      height: unset;
      flex: 1;
    }

    .second-list {
      top: -20rem;
    }
  }
}

@media screen and (max-width: 1070px) {
  .calc__list {
    left: -0.5rem;
    width: 100%;
    padding: 0.5rem;
  }
}
</style>
