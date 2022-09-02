
<template>
  <div class="side-navbar">
    <div class="nav-container">
      <template v-if="currentUser.role === 'user'">
        <div class="nav-top">
          <router-link :to="{ name: 'main' }">
            <img
              class="logo-img"
              src="~@/assets/image/logo.png"
              alt="logo-img"
            />
          </router-link>
          <!-- 在該頁面時, 選項文字變成橘色 -->
          <div
            class="home-btn nav-item"
            :class="{
              'btn-clicked':
                $route.name === 'main-page' || $route.name === 'reply-list',
            }"
          >
            <!-- 在該頁面時, icon變成橘色 -->
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
            <router-link to="/main" class="nav-text">首頁</router-link>
          </div>
          <div
            class="user-profile-btn nav-item"
            :class="{
              'btn-clicked':
                $route.name === 'main-tweets' ||
                $route.name === 'replies' ||
                $route.name === 'liked-tweets',
            }"
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
            <router-link
              :to="{ name: 'user', params: { id: currentUser.id } }"
              class="nav-text"
              >個人資料</router-link
            >
          </div>
          <div
            class="setting-btn nav-item"
            :class="{ 'btn-clicked': $route.name === 'setting' }"
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
            <router-link
              :to="{ name: 'setting', params: { id: currentUser.id } }"
              class="nav-text"
              >設定</router-link
            >
          </div>
          <button
            class="tweet-btn"
            data-toggle="modal"
            data-target="#createTweetModal"
          >
            推文
          </button>
        </div>
      </template>
      <!-- 後台Navbar  -->
      <template v-else>
        <div class="nav-top">
          <img class="logo-img" src="~@/assets/image/logo.png" alt="logo-img" />
          <div
            class="home-btn nav-item"
            :class="{ 'btn-clicked': $route.name === 'admin-tweets' }"
          >
            <img
              v-if="$route.name === 'admin-tweets'"
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
            <router-link :to="{ name: 'admin-tweets' }" class="nav-text"
              >推文清單</router-link
            >
          </div>
          <div
            class="user-profile-btn nav-item"
            :class="{ 'btn-clicked': $route.name === 'admin-users' }"
          >
            <img
              v-if="$route.name === 'admin-users'"
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
            <router-link :to="{ name: 'admin-users' }" class="nav-text"
              >使用者列表</router-link
            >
          </div>
        </div>
      </template>
      <div class="nav-bottom">
        <img
          class="logout-icon"
          src="~@/assets/image/logout-icon.png"
          alt="logout-icon"
        />
        <button type="button" class="nav-text" @click="logout">登出</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Navbar",
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
      this.role = this.currentUser.role;
      this.$store.commit("revokeAuthentication");
      if (this.role === "user") {
        this.$router.push("/login");
      } else if (this.role === "admin") {
        this.$router.push("/admin/login");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./../assets/application.scss";
.side-navbar {
  max-height: 914px;
  .nav-container {
    width: 178px;
    height: 100%;
    margin: 0 24px 0 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .nav-text {
      display: inline-block;
    }
    .nav-top {
      display: flex;
      flex-direction: column;
      .tweet-btn {
        width: 178px;
        height: 46px;
        color: $white;
        font-size: 20px;
        border-radius: 50px;
        background-color: $brand-color;
      }
      .nav-item {
        display: flex;
        align-items: center;
        margin-bottom: 40px;
        margin-left: 17px;
        &:hover {
          cursor: pointer;
        }
        .nav-text {
          font-weight: 700;
          font-size: 18px;
          color: $darkgray;
          &:hover {
            color: $brand-color;
          }
        }
        &.btn-clicked {
          .nav-text {
            color: $brand-color;
          }
        }
        > img {
          margin-right: 20px;
        }
        .home-icon,
        .user-icon,
        .setting-icon {
          width: 24px;
          height: 24px;
          &:hover {
            color: $brand-color;
          }
        }
      }
      .nav-item.setting-btn {
        margin-bottom: 24px;
      }
      .logo-img {
        width: 50px;
        height: 50px;
        margin: 8px 120px 30px 8px;
      }
    }
    .nav-bottom {
      position: fixed;
      bottom: 16px;
      display: flex;
      align-items: center;
      &:hover {
        cursor: pointer;
      }
      .logout-icon {
        width: 24px;
        height: 24px;
        margin: 16px;
        &:hover {
          color: $brand-color;
        }
      }
      .nav-text {
        color: $darkgray;
        font-weight: 700;
        font-size: 18px;
        &:hover {
          color: $brand-color;
        }
      }
    }
  }
}
</style>