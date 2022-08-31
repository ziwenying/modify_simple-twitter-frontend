<template>
  <ul class="nav-pills">
    <router-link
      :to="{ name: 'user-followers' }"
      class="pills-link"
      :class="{ 'pills-link-active': $route.name === 'user-followers' }"
    >
      <li
        class="nav-item"
        :class="{ 'nav-item-selected': $route.name === 'user-followers' }"
      >
        追隨者
      </li>
    </router-link>
    <router-link
      :to="{ name: 'user-followings' }"
      class="pills-link"
      :class="{ 'pills-link-active': $route.name === 'user-followings' }"
    >
      <li
        class="nav-item"
        :class="{ 'nav-item-selected': $route.name === 'user-followings' }"
      >
        正在追隨
      </li>
    </router-link>
  </ul>
</template>

<script>
export default {
  name: "FollowerNavPills",
};
</script>

<style scoped lang="scss">
@import "./../assets/application.scss";

.nav-pills {
  display: flex;
  position: sticky;
  top: 74px;
  height: 55px;
  background: $white;
  border-right: $light-blue2 1px solid;
  border-bottom: $light-blue2 1px solid;
  border-left: $light-blue2 1px solid;
  z-index: 1;
  .pills-link {
    color: $Secondary;
    .nav-item {
      text-align: center;
      padding: 15px 0 15px 0;
      font-weight: 700;
      font-size: 15px;
      width: 130px;
    }
    .nav-item-selected {
      height: 100%;
      border-bottom: 2px $brand-color solid;
    }
    .nav-item:hover {
      cursor: pointer;
      color: $brand-color;
    }
  }
  .pills-link:hover {
    color: $brand-color;
  }
  .pills-link-active {
    color: $brand-color;
  }
}
</style>