<template>
  <div class="main-tweet-wrapper">
    <div class="tweet-title">
      <router-link :to="{ path: `/users/${oneTweet.userId}/tweets` }">
        <img class="user-avatar" :src="oneTweet.userAvatar" alt="user-avatar" />
      </router-link>
      <div class="tweet-title-name-account">
        <p class="name">{{ oneTweet.userName }}</p>
        <p class="account">@{{ oneTweet.userAccount }}</p>
      </div>
    </div>
    <div class="tweet-text">
      <p class="text">
        {{ oneTweet.description }}
      </p>
      <p class="time">{{ oneTweet.createdAt | exactTime }}</p>
    </div>
    <div class="count">
      <div class="count-reply">
        <p>{{ repliesLength }}</p>
        <p>回覆</p>
      </div>
      <div class="count-like">
        <p>{{ oneTweet.likeCount }}</p>
        <p>喜歡次數</p>
      </div>
    </div>
    <div class="tweet-reply-heart">
      <img
        data-toggle="modal"
        data-target="#replyTweetModal"
        @click.prevent="isClickedTweet(oneTweet.id)"
        class="icon"
        src="~@/assets/image/reply.png"
        alt="reply"
      />
      <img
        v-if="oneTweet.isLiked"
        @click.stop.prevent="deleteLiked(oneTweet.id)"
        class="icon"
        src="~@/assets/image/red-heart.png"
        alt="heart"
      />
      <img
        v-if="!oneTweet.isLiked"
        @click.stop.prevent="addLiked(oneTweet.id)"
        class="icon"
        src="~@/assets/image/heart.png"
        alt="heart"
      />
    </div>
    <div
      class="reply-box"
      @click.prevent="isClickedTweet(oneTweet.id)"
      data-toggle="modal"
      data-target="#replyTweetModal"
    >
      <div class="modal-user-avatar">
        <img :src="currentUser.avatar" alt="avatar" />
      </div>
      <div class="reply-box-content">
        <div class="text">回覆你的推</div>
        <button class="modal-reply-btn">回覆</button>
      </div>
    </div>
  </div>
</template>

<script>
import { exactTimeFilter } from "./../utils/mixins";
import { Toast } from "./../utils/helpers";
import { mapState } from "vuex";
import tweetsAPI from "./../apis/tweets";

export default {
  name: "Reply",
  mixins: [exactTimeFilter],
  props: {
    initialTweet: {
      type: Object,
      required: true,
    },
    initialRepliesLength: {
      type: Number,
      require: true,
    },
  },
  computed: {
    ...mapState(["currentUser", "topPopular"]),
  },
  data() {
    return {
      oneTweet: {},
      repliesLength: 0,
    };
  },
  watch: {
    initialTweet(newValue) {
      this.oneTweet = {
        ...this.oneTweet,
        ...newValue,
      };
      // 拆成一層，不然會報錯
      const {
        userAvatar,
        userId,
        userAccount,
        userName,
        createdAt,
        description,
        id,
        isLiked,
        likeCount,
        replyCount,
      } = {
        userAvatar: this.oneTweet.User.avatar,
        userId: this.oneTweet.User.id,
        userAccount: this.oneTweet.User.account,
        userName: this.oneTweet.User.name,
        createdAt: this.oneTweet.createdAt,
        description: this.oneTweet.description,
        id: this.oneTweet.id,
        isLiked: this.oneTweet.isLiked,
        likeCount: this.oneTweet.likeCount,
        replyCount: this.oneTweet.replyCount,
      };
      this.oneTweet = {
        userAvatar,
        userId,
        userAccount,
        userName,
        createdAt,
        description,
        id,
        isLiked,
        likeCount,
        replyCount,
      };
    },
    // 當新增評論時，及時更新評論數使用
    initialRepliesLength(newValue) {
      this.repliesLength = newValue;
    },
  },
  created() {
    this.fetchTweet();
  },
  methods: {
    fetchTweet() {
      this.oneTweet = this.initialTweet;
    },
    isClickedTweet() {
      // 被點擊的那則留言的資料，顯示 modal 使用
      this.oneTweet = this.initialTweet;
      this.$emit("after-click-reply", this.oneTweet);
    },
    async addLiked(tweetId) {
      try {
        const { data } = await tweetsAPI.tweets.addLiked({ tweetId });
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        //顯示紅心 & 愛心數加一
        this.oneTweet = {
          ...this.oneTweet,
          isLiked: !this.oneTweet.isLiked,
          likeCount: this.oneTweet.likeCount + 1,
        };
      } catch (error) {
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法將此推文加入喜歡的內容，請稍後再試",
        });
      }
    },
    async deleteLiked(tweetId) {
      try {
        const { data } = await tweetsAPI.tweets.deleteLiked({ tweetId });
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        //顯示空心 & 愛心數減一
        this.oneTweet = {
          ...this.oneTweet,
          isLiked: !this.oneTweet.isLiked,
          likeCount: this.oneTweet.likeCount - 1,
        };
      } catch (error) {
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法將此推文從喜歡的內容移除，請稍後再試",
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "./../assets/application.scss";

.main-tweet-wrapper {
  display: flex;
  flex-direction: column;
  margin: 0 16px 16px 32px;
  .tweet-title {
    display: flex;
    margin: 16px 0 10px 0;
    .user-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .tweet-title-name-account {
      margin: 0 0 0 8px;
      .account {
        color: $Secondary;
      }
    }
  }
  .tweet-text {
    .text {
      font-size: 24px;
      overflow-wrap: anywhere;
    }
    .time {
      margin: 8px 0;
      font-size: 14px;
      color: $Secondary;
    }
  }
  .count {
    display: flex;
    padding: 16px 0;
    border-top: $light-blue2 1px solid;
    border-bottom: $light-blue2 1px solid;
    .count-reply,
    .count-like {
      display: flex;
      font-size: 19px;
      font-weight: 500;
      p:nth-child(2) {
        margin: 0 0 0 2px;
        color: $Secondary;
      }
    }
    .count-like {
      margin: 0 0 0 24px;
    }
  }
  .tweet-reply-heart {
    display: flex;
    margin: 16px 0;
    .icon {
      width: 25px;
      height: 25px;
      cursor: pointer;
    }
    img:nth-child(1) {
      margin: 0 40px 0 0;
    }
  }
  .reply-box {
    display: flex;
    align-items: center;
    padding: 16px 0 0 0;
    border-top: $light-blue2 1px solid;
    .modal-user-avatar {
      img {
        @extend %user-avatar;
      }
    }
    .reply-box-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      cursor: pointer;
      .text {
        margin: 0 0 0 8px;
        color: $Secondary;
      }
      .modal-reply-btn {
        @extend %btn-style;
        margin: 0 24px 0 0;
        width: 64px;
      }
    }
  }
}

@media screen and (min-width: 575px) {
  .main-tweet-wrapper {
    margin: 0 16px 16px 16px;
    .tweet-reply-heart {
      margin: 16px 0 0 0;
      img:nth-child(1) {
        margin: 0 133px 0 0;
      }
    }
    .reply-box {
      display: none;
    }
  }
}
</style>