<template>
  <ul class="nav-pills">
    <router-link
      :to="{ name: 'main-tweets' }"
      class="pills-link"
      :class="{ 'pills-link-active': $route.name === 'main-tweets' }"
      ><li
        class="nav-item"
        :class="{ 'nav-item-selected': $route.name === 'main-tweets' }"
      >
        推文
      </li>
    </router-link>
    <router-link
      :to="{ name: 'replies' }"
      class="pills-link"
      :class="{ 'pills-link-active': $route.name === 'replies' }"
      ><li
        class="nav-item"
        :class="{ 'nav-item-selected': $route.name === 'replies' }"
      >
        回覆
      </li></router-link
    >
    <router-link
      :to="{ name: 'liked-tweets' }"
      class="pills-link"
      :class="{ 'pills-link-active': $route.name === 'liked-tweets' }"
    >
      <li
        class="nav-item"
        :class="{ 'nav-item-selected': $route.name === 'liked-tweets' }"
      >
        喜歡的內容
      </li></router-link
    >
  </ul>
</template>

<script>
export default {
  name: "UserNavPills",
};
</script>

<style lang="scss" scoped>
@import "./../assets/application.scss";

.nav-pills {
  display: flex;
  padding: 30px 0 0 0;
  border-right: $light-blue2 1px solid;
  border-bottom: $light-blue2 1px solid;
  border-left: $light-blue2 1px solid;
  .pills-link {
    color: $Secondary;
    .nav-item {
      text-align: center;
      padding: 0 0 15px 0;
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