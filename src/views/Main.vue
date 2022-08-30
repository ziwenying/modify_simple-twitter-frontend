<template>
  <div class="row outer-main-wrapper">
    <!--component Navbar -->
    <Navbar
      class="main-nav"
      :class="{ 'col-2': fullWidth > 574, 'd-none': fullWidth <= 574 }"
    />
    <Spinner v-if="isLoading" class="col-7 spinner" />
    <!-- MainPage.vue & ReplyList -->
    <router-view
      v-else
      :theTweetId="theTweetId"
      :initialTweets="tweets"
      :newReply="newReply"
      :popular="topPopular"
      @after-click-reply="afterClickReply"
      class="main-page scrollbar"
      :class="{ 'col-7': fullWidth > 574 }"
    />
    <!--component Populars -->
    <Populars
      class="popular"
      :class="{ 'col-3': fullWidth > 574, 'd-none': fullWidth <= 574 }"
    />
    <!-- Modal -->
    <CreateTweetModal @after-submit-tweet="afterSubmitTweet" />
    <ReplyModal
      :replyModalData="replyModalData"
      @main-after-submit-reply="mainAfterSubmitReply"
    />
    <MobileNavbar class="mobile-navbar" />
  </div>
</template>

<script>
import Populars from "../components/Populars.vue";
import MobileNavbar from "../components/MobileNavbar.vue";
import Navbar from "../components/Navbar.vue";
import CreateTweetModal from "../components/CreateTweetModal.vue";
import ReplyModal from "../components/ReplyModal.vue";
import Spinner from "../components/Spinner.vue";
import { mapState } from "vuex";
import { Toast } from "./../utils/helpers";
import tweetsAPI from "./../apis/tweets";

export default {
  name: "MainPage",
  computed: {
    ...mapState(["currentUser", "topPopular"]),
  },
  components: {
    Populars,
    Navbar,
    ReplyModal,
    CreateTweetModal,
    Spinner,
    MobileNavbar,
  },
  data() {
    return {
      tweets: [],
      replyModalData: {},
      newReply: {},
      theTweetId: -1, //及時增加留言數使用
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
        const response = await tweetsAPI.tweets.getTweets();
        if (response.statusText !== "OK") {
          throw new Error("無法取得推文資料，請稍後再試");
        }
        this.tweets = response.data;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法取得推文資料，請稍後再試",
        });
      }
    },
    mainAfterSubmitReply(id) {
      //即時顯示留言數字 + 1
      this.theTweetId = id;
    },
    afterSubmitTweet(payload) {
      const { tweetId, description } = payload;
      // 新增的推文加入下面的推文清單中
      this.tweets.unshift({
        id: tweetId,
        description: description,
        likeCount: 0,
        replyCount: 0,
        isLiked: false,
        createdAt: new Date(),
        User: {
          id: this.currentUser.id,
          name: this.currentUser.name,
          avatar: this.currentUser.avatar,
          account: this.currentUser.account,
        },
      });
    },
    afterClickReply(payload) {
      // 點擊回覆，顯示 modal 使用的資料
      const { id, description, User, createdAt } = payload;
      this.replyModalData = {
        id,
        description,
        userName: User.name,
        userAccount: User.account,
        userAvatar: User.avatar,
        createdAt: createdAt,
      };
    },
  },
};
</script>

<style scoped lang="scss">
@import "./../assets/application.scss";

.outer-main-wrapper {
  .spinner {
    margin: 10% auto;
  }
  .main-page {
    overflow-y: scroll;
    max-height: 914px;
  }
  .scrollbar {
    &::-webkit-scrollbar {
      width: 1px;
    }
  }
}

@media screen and (min-width: 575px) {
  .outer-main-wrapper {
    .mobile-navbar {
      display: none;
    }
  }
}
</style>