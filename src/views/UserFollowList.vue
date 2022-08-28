<template>
  <div class="row outer-follow-wrapper">
    <!--component Navbar -->
    <Navbar class="col-2 main-nav" />
    <Spinner v-if="isLoading" class="col-7" />
    <div v-else class="col-7 follow-page scrollbar">
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
      class="col-3 popular"
      @after-follow-change-in-popular="afterFollowChange"
    />
    <CreateTweetModal />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import FollowerNavPills from "../components/FollowerNavPills.vue";
import Populars from "../components/Populars.vue";
import Spinner from "./../components/Spinner.vue";
import { Toast } from "./../utils/helpers";
import tweetsAPI from "./../apis/tweets";
import CreateTweetModal from "../components/CreateTweetModal.vue";

export default {
  name: "UserFollowList",
  components: {
    Navbar,
    Populars,
    FollowerNavPills,
    CreateTweetModal,
    Spinner,
  },
  data() {
    return {
      tweets: [],
      userName: "", // 渲染頁面上方標題
      changeFollow: false,
      isLoading: true,
    };
  },
  created() {
    const { id: userId } = this.$route.params;
    // this.fetchPopular();
    this.fetchTweets(userId);
  },
  methods: {
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
  },
};
</script>

<style scoped lang="scss">
@import "./../assets/application.scss";

.outer-follow-wrapper {
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
</style>