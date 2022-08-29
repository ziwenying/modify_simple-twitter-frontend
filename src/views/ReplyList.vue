<template>
  <div class="reply-outer">
    <div class="reply-lists-title">
      <router-link :to="{ name: 'main' }">
        <img class="arrow" src="~@/assets/image/arrow.png" alt="arrow" />
      </router-link>
      <h4 class="pb-4">推文</h4>
    </div>
    <div class="main-wrapper">
      <!-- component TweetDetail -->
      <TweetDetail
        :initialTweet="tweet"
        :initialRepliesLength="repliesLength"
        @after-click-reply="afterClickReply"
      />
      <!-- component Reply -->
      <Reply :initialTweet="tweet" :initialReplies="replies" />
      <ReplyModal :replyModalData="tweet" @after-submit-reply="fetchReplies" />
    </div>
  </div>
</template>

<script>
import Reply from "../components/Reply.vue";
import TweetDetail from "../components/TweetDetail.vue";
import ReplyModal from "../components/ReplyModal.vue";
import { mapState } from "vuex";
import { Toast } from "./../utils/helpers";
import tweetsAPI from "./../apis/tweets";

export default {
  name: "ReplyList",
  components: {
    TweetDetail,
    Reply,
    ReplyModal,
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  data() {
    return {
      tweet: {},
      replies: [],
      repliesLength: 0,
    };
  },
  beforeRouteUpdate(to, from, next) {
    // 監聽路由
    const { id } = to.params;
    this.fetchTweet(id);
    this.fetchReplies(id);
    next();
  },
  created() {
    const { id } = this.$route.params;
    this.fetchTweet(id);
    this.fetchReplies(id);
  },
  methods: {
    async fetchTweet(id) {
      try {
        const response = await tweetsAPI.tweets.getOneTweet({
          tweetId: id,
        });
        if (response.statusText !== "OK") {
          throw new Error("無法取得推文資料，請稍後再試");
        }
        this.tweet = response.data;
      } catch (error) {
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法取得推文資料，請稍後再試",
        });
      }
    },
    async fetchReplies(id) {
      try {
        const response = await tweetsAPI.replies.getReplies({
          tweetId: id,
        });

        if (response.statusText !== "OK") {
          throw new Error("無法取得留言資料，請稍後再試");
        }
        this.replies = [...response.data];
        this.repliesLength = this.replies.length;
      } catch (error) {
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法取得留言資料，請稍後再試",
        });
      }
    },
    afterClickReply(payload) {
      // 顯示 reply modal 使用的資料
      this.$emit("after-click-reply", payload);
      const { id, description, User, createdAt } = payload;
      this.tweet = {
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

.reply-outer {
  position: relative;
  width: 100%;
  .reply-lists-title {
    display: flex;
    align-items: center;
    position: sticky;
    top: 0;
    background: $white;
    border-right: $light-blue2 1px solid;
    border-bottom: $light-blue2 1px solid;
    border-left: $light-blue2 1px solid;
    z-index: 1;
    .arrow {
      margin: 0 0 0 32px;
      width: 24px;
      height: 24px;
      z-index: 1;
    }
    h4:nth-child(1) {
      cursor: pointer;
    }
    h4 {
      padding: 24px 0 0 19px;
      font-size: 24px;
      font-weight: 700;
      z-index: 1;
    }
  }
  .main-wrapper {
    position: relative;
    border-right: $light-blue2 1px solid;
    border-left: $light-blue2 1px solid;
    border-bottom: $light-blue2 1px solid;
  }
}

@media screen and (min-width: 575px) {
  // .reply-outer {
  //   position: relative;
  //   .reply-lists-title {
  //     display: flex;
  //     align-items: center;
  //     position: sticky;
  //     top: 0;
  //     background: $white;
  //     border-right: $light-blue2 1px solid;
  //     border-bottom: $light-blue2 1px solid;
  //     border-left: $light-blue2 1px solid;
  //     z-index: 1;
  //     .arrow {
  //       margin: 0 0 0 28px;
  //       width: 17px;
  //       height: 14px;
  //       z-index: 1;
  //     }
  //     h4:nth-child(1) {
  //       cursor: pointer;
  //     }
  //     h4 {
  //       padding: 24px 0 0 19px;
  //       font-size: 24px;
  //       font-weight: 700;
  //       z-index: 1;
  //     }
  //   }
  //   .main-wrapper {
  //     position: relative;
  //     border-right: $light-blue2 1px solid;
  //     border-left: $light-blue2 1px solid;
  //     border-bottom: $light-blue2 1px solid;
  //   }
  // }
}
</style>