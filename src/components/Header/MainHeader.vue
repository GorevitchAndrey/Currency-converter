<template>
  <div class="header">
    <HeaderItem :items="elementList" />
  </div>
</template>

<script>
import HeaderItem  from "./HeaderItem.vue";

export default {
  name: "MainHeader",

  components: {
    HeaderItem,
  },

  data() {
    return {
      elementList: [
        { link: "Converter", title: "Converter" },
        { link: "Currencies", title: "Currencies" }
      ]
    }
  }
};
</script>

<style>
.header {
  width: 100%;
  height: 5rem;
  text-transform: uppercase;
}
</style>
