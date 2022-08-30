<template>
  <div class="row outer-follow-wrapper">
    <!--component Navbar -->
    <Navbar
      class="main-nav"
      :class="{ 'col-2': fullWidth > 574, 'd-none': fullWidth <= 574 }"
    />
    <Spinner v-if="isLoading" class="spinner col-7" />
    <div
      v-else
      class="follow-page scrollbar"
      :class="{ 'col-7': fullWidth > 574 }"
    >
      <div class="follow-outer">
        <div class="follow-lists-title">
          <router-link
            :to="{ name: 'user', params: { userId: $route.params } }"
          >
            <img class="arrow" src="~@/assets/image/arrow.png" alt="arrow" />
          </router-link>
          <div class="name-tweet">
            <p class="name">{{ userName }}</p>
            <p class="tweet-count">{{ tweets.length }}&ensp;推文</p>
          </div>
        </div>
        <!-- component UserProfileCard.vue -->
        <UserProfileCard
          class="user-profile-card"
          :targetProfile="targetProfile"
          :initialChangeFollow="followShip"
          @change-follow-ship="changeFollowShip"
        />
        <!-- component FollowerNavPills.vue -->
        <FollowerNavPills />
        <!-- UserFollowers.vue, UserFollowings.vue -->
        <router-view
          class="bottom-lists scrollbar"
          :change-follow="changeFollow"
        />
      </div>
    </div>

    <!--component Populars -->
    <Populars
      class="popular"
      :class="{ 'col-3': fullWidth > 574, 'd-none': fullWidth <= 574 }"
      @after-follow-change-in-popular="afterFollowChange"
    />
    <MobileNavbar class="mobile-navbar" />
    <CreateTweetModal />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import MobileNavbar from "../components/MobileNavbar.vue";
import FollowerNavPills from "../components/FollowerNavPills.vue";
import Populars from "../components/Populars.vue";
import UserProfileCard from "../components/UserProfileCard.vue";
import Spinner from "./../components/Spinner.vue";
import { mapState } from "vuex";
import { Toast } from "./../utils/helpers";
import tweetsAPI from "./../apis/tweets";
import CreateTweetModal from "../components/CreateTweetModal.vue";
import usersAPI from "./../apis/users";

export default {
  name: "UserFollowList",
  components: {
    Navbar,
    Populars,
    UserProfileCard,
    FollowerNavPills,
    CreateTweetModal,
    Spinner,
    MobileNavbar,
  },
  computed: {
    ...mapState(["currentUser", "topPopular"]),
  },
  data() {
    return {
      targetProfile: {
        id: -1,
        account: "",
        email: "",
        name: "",
        avatar: "",
        cover: "",
        introduction: "",
        role: "",
      },
      tweets: [],
      userName: "", // 渲染頁面上方標題
      changeFollow: false,
      followShip: false,
      isLoading: true,
      fullWidth: 0,
    };
  },
  created() {
    const { id: userId } = this.$route.params;
    this.fetchProfile(userId);
    this.fetchTweets(userId);
    this.fetchFollowings(this.currentUser.id);
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
    async fetchProfile(userId) {
      try {
        this.isLoading = true;
        const response = await usersAPI.getTheUser({ userId });
        if (response.statusText !== "OK") {
          throw new Error("無法取得使用者資料，請稍後再試");
        }
        const {
          id,
          account,
          email,
          name,
          avatar,
          cover,
          introduction,
          role,
          followerCount,
          followingCount,
          tweetCount,
        } = {
          id: response.data.id,
          account: response.data.account,
          email: response.data.email,
          name: response.data.name,
          avatar: response.data.avatar,
          cover: response.data.cover,
          introduction: !response.data.introduction
            ? ""
            : response.data.introduction,
          role: response.data.role,
          followerCount: response.data.followerCount,
          followingCount: response.data.followingCount,
          tweetCount: response.data.tweetCount,
        };
        this.targetProfile = {
          id,
          account,
          email,
          name,
          avatar,
          cover,
          introduction,
          role,
          followerCount,
          followingCount,
          tweetCount,
        };
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法取得使用者資料，請稍後再試",
        });
      }
    },
    afterFollowChange() {
      this.changeFollow = !this.changeFollow;
    },
    // 利用使用者 id 取得所有推文，計算推文數量使用
    async fetchTweets(userId) {
      try {
        this.isLoading = true;
        const response = await tweetsAPI.tweets.getUsersTweets({ userId });
        const { data } = response;

        if (response.statusText !== "OK") {
          throw new Error(data.message);
        }
        this.tweets = data;
        this.userName = data[0].User.name;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法取得推文數量資料",
        });
      }
    },
    changeFollowShip(payload) {
      this.followShip = payload;
      // 在"別人"的個人頁面按下追蹤或退追按鈕, 下方的追隨者人數會相應變化
      if (this.followShip === true) {
        this.targetProfile = {
          ...this.targetProfile,
          followerCount: this.targetProfile.followerCount + 1,
        };
      } else if (this.followShip === false) {
        this.targetProfile = {
          ...this.targetProfile,
          followerCount: this.targetProfile.followerCount - 1,
        };
      }
    },
    async fetchFollowings(userId) {
      // 這邊為了個人頁面的追蹤按鈕
      try {
        const response = await usersAPI.getFollowings({ userId });
        const { data } = response;
        if (response.statusText !== "OK") {
          throw new Error(data.message);
        }
        this.followingList = data;
        const followingShip = this.followingList.find(
          (following) => following.followingId === Number(this.$route.params.id)
        );
        this.followShip = !!followingShip; //可以判斷 true 正在追蹤，傳到 UserProfileCard 使用
      } catch (error) {
        console.error(error.message);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "./../assets/application.scss";

.outer-follow-wrapper {
  .spinner {
    margin: 10% auto;
  }
  .follow-page {
    overflow-y: scroll;
    max-height: 914px;
    .follow-outer {
      .follow-lists-title {
        display: flex;
        align-items: center;
        position: sticky;
        top: 0;
        height: 74px;
        background: $white;
        border: $light-blue2 1px solid;
        z-index: 1;
        .arrow {
          margin: 0 0 0 28px;
          width: 17px;
          height: 14px;
          font-weight: 700;
        }
        .name-tweet {
          margin: 0 0 0 19px;
          .name {
            font-size: 18px;
            font-weight: 700;
          }
          .tweet-count {
            color: $Secondary;
            font-size: 13px;
          }
        }
      }
    }
  }
  .scrollbar {
    &::-webkit-scrollbar {
      width: 1px;
    }
  }
}

@media screen and (min-width: 575px) {
  .outer-follow-wrapper {
    .follow-page {
      .follow-outer {
        .user-profile-card {
          display: none;
        }
        .follow-lists-title {
          .arrow {
          }
          .name-tweet {
            .name {
            }
            .tweet-count {
            }
          }
        }
      }
    }
    .mobile-navbar {
      display: none;
    }
  }
}
</style>