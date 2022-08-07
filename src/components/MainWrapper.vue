<template>
  <div class="main-wrapper">
    <MainHeader />
    <router-view />
  </div>
</template>

<script>
import MainHeader from "./Header/MainHeader.vue";

export default {
  name: "MainWrapper",

  components: {
    MainHeader,
  },
};
</script>

<style lang="scss">
.main-wrapper {
  height: 100%;
}
</style>
