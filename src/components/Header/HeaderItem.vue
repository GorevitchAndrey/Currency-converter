<template>
  <div   class="header__nav">
    <div v-for="item in items" :key="item" class="header__nav-item">
      <router-link :to="{ name: item.link }">
        <p class="header__link">{{ item.title }}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainHeader",

  props: {
    items :{
      type: Object,
      default: () => {},
    }
  }
};
</script>

<style lang="scss">
.header {
  &__nav {
    height: inherit;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(108, 173, 233);
  }

  &__nav-item {
    margin: 10px;
    font-weight: bold;

    &:hover {
      font-weight: bold;
    }
  }


  &__link {
    position: relative;
    color: white;

    &::after {
      display: block;
      position: absolute;
      left: 0;
      width: 0;
      height: 2px;
      background-color: white;
      content: "";
      transition: width 0.3s ease-out;
    }

    &:hover::after {
      width: 100%;
    }
  }
}
</style>
