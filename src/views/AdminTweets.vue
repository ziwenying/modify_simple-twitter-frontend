<template>
  <div class="admin-tweets-wrapper row">
    <div class="admin-nav-wrapper">
      <!-- 推文清單 -->
      <router-link to="/admin/tweets" class="nav">
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
      </router-link>
      <!-- 使用者列表 -->
      <router-link to="/admin/users" class="nav">
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
      </router-link>
      <button class="logout-btn" @click="logout">登出</button>
    </div>
    <Navbar
      class="nav pl-0"
      :class="{ 'col-2': fullWidth > 574, 'd-none': fullWidth <= 574 }"
    />
    <!-- <div>後台推文清單</div> -->
    <Spinner
      class="spinner"
      :class="{ 'col-10': fullWidth > 574 }"
      v-if="isLoading"
    />
    <AdminTweetsList
      v-else
      :class="{ 'col-10': fullWidth > 574 }"
      :initial-tweets="tweets"
      @after-delete-tweet="afterTweetDelete"
    />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import AdminTweetsList from "./../components/AdminTweetsList.vue";
import adminAPI from "./../apis/admin";
import { Toast } from "./../utils/helpers";
import { mapState } from "vuex";
import Spinner from "./../components/Spinner.vue";

export default {
  name: "AdminTweets",
  components: {
    Navbar,
    AdminTweetsList,
    Spinner,
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  data() {
    return {
      role: "",
      tweets: [],
      isLoading: true,
      fullWidth: 0,
    };
  },
  created() {
    this.fetchTweets();
  },
  mounted() {
    this.fullWidth = window.innerWidth;
    // window.onresize 及時監聽視窗大小
    window.onresize = () => {
      this.fullWidth = window.innerWidth;
    };
  },
  destroyed() {
    // 元件銷毀要 解綁事件
    window.onresize = null;
  },
  methods: {
    async fetchTweets() {
      try {
        this.isLoading = true;
        const { data } = await adminAPI.tweets.get();
        if (data.status === "error") {
          throw new Error(data.message);
        }
        this.tweets = data;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法取得推文清單資料，請稍後再試",
        });
      }
    },
    // 刪除tweet
    afterTweetDelete(tweetId) {
      // 過濾掉要刪除的tweet
      this.tweets = this.tweets.filter((tweet) => tweet.id !== tweetId);
    },
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
.admin-nav-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: sticky;
  top: 0;
  width: 100%;
  height: 52px;
  background: $white;
  z-index: 1;
  img {
    width: 24px;
    height: 24px;
  }
  .logout-btn {
    &:hover {
      color: #0062ff;
      text-decoration: underline;
    }
  }
}
.spinner {
  width: 100%;
}

@media screen and (min-width: 575px) {
  .admin-nav-wrapper {
    display: none;
  }
}
</style>