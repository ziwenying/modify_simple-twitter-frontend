<template>
  <div class="nav-wrapper">
    <!-- 首頁 -->
    <router-link to="/main" class="nav-text">
      <img
        v-if="$route.name === 'main-page' || $route.name === 'reply-list'"
        class="home-icon"
        src="~@/assets/image/home-orange.png"
        alt="home-icon"
      />
      <img
        v-else
        class="home-icon"
        src="~@/assets/image/home.png"
        alt="home-icon"
      />
    </router-link>
    <!-- 發推 -->
    <img
      data-toggle="modal"
      data-target="#createTweetModal"
      class="pen-icon"
      src="~@/assets/image/pen.png"
      alt="pen-icon"
    />
    <!-- 個人頁面 -->
    <router-link
      :to="{ name: 'user', params: { id: currentUser.id } }"
      class="nav-text"
    >
      <img
        v-if="
          $route.name === 'main-tweets' ||
          $route.name === 'replies' ||
          $route.name === 'liked-tweets'
        "
        class="user-icon"
        src="~@/assets/image/user-orange.png"
        alt="user-icon"
      />
      <img
        v-else
        class="user-icon"
        src="~@/assets/image/user.png"
        alt="user-icon"
      />
    </router-link>
    <!-- 設定 -->
    <router-link
      :to="{ name: 'setting', params: { id: currentUser.id } }"
      class="nav-text"
    >
      <img
        v-if="$route.name === 'setting'"
        class="setting-icon"
        src="~@/assets/image/setting-orange.png"
        alt="setting-icon"
      />
      <img
        v-else
        class="setting-icon"
        src="~@/assets/image/setting.png"
        alt="setting-icon"
      />
    </router-link>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MobileNavbar",
  // 取得Vuex中的currentUser資料
  computed: {
    ...mapState(["currentUser"]),
  },
  data() {
    return {
      role: "",
    };
  },
  methods: {
    logout() {
      // 因為呼叫revokeAuthentication幫忙改state資料時, currentUser就會被清空, 先把role存起來, 以便等一下判別轉址到哪裡
      this.role = this.currentUser.role;
      this.$store.commit("revokeAuthentication");
      if (this.role === "user") {
        // 使用者登出-> 前台登入頁
        this.$router.push("/login");
      } else {
        // 管理員登出-> 前台登入頁
        this.$router.push("/admin/login");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./../assets/application.scss";

.nav-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: sticky;
  bottom: 0;
  width: 100%;
  height: 52px;
  background: $white;
  img {
    width: 24px;
    height: 24px;
  }
  .pen-icon {
    cursor: pointer;
  }
}
</style>