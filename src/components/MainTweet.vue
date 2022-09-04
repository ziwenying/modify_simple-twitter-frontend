<template>
  <div class="tweet-lists">
    <div v-for="tweet in tweets" :key="tweet.id" class="tweet-list">
      <router-link
        :to="{ path: `/main/replylist/${tweet.id}/` }"
        class="tweet-link"
      >
        <router-link
          class="user-avatar"
          :to="{ path: `/users/${tweet.User.id}/tweets` }"
        >
          <img :src="tweet.User.avatar" alt="user-avatar" />
        </router-link>
        <div class="tweet-content">
          <div class="tweet-title">
            <router-link :to="{ path: `/users/${tweet.User.id}/tweets` }">
              <p class="name">{{ tweet.User.name }}</p>
            </router-link>
            <router-link :to="{ path: `/users/${tweet.User.id}/tweets` }">
              <p class="account">@{{ tweet.User.account }}</p>
            </router-link>
            <p class="time">&nbsp;‧&nbsp;{{ tweet.createdAt | fromNow }}</p>
          </div>
          <div class="tweet-text">
            <p>
              {{ tweet.description }}
            </p>
          </div>
          <div class="tweet-reply-heart">
            <!-- 要跳出 modal -->
            <div
              @click.prevent="isClickedTweet(tweet.id)"
              data-toggle="modal"
              data-target="#replyTweetModal"
              class="tweet-reply"
            >
              <img class="icon" src="~@/assets/image/reply.png" alt="reply" />
              <p>{{ tweet.replyCount }}</p>
            </div>
            <div
              v-if="tweet.isLiked"
              @click.stop.prevent="deleteLiked(tweet.id)"
              class="tweet-heart"
            >
              <img
                class="icon"
                src="~@/assets/image/red-heart.png"
                alt="heart"
              />
              <p class="text">{{ tweet.likeCount }}</p>
            </div>
            <div
              v-if="!tweet.isLiked"
              @click.stop.prevent="addLiked(tweet.id)"
              class="tweet-heart"
            >
              <img class="icon" src="~@/assets/image/heart.png" alt="heart" />
              <p>{{ tweet.likeCount }}</p>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { fromNowFilter } from "./../utils/mixins";
import { Toast } from "./../utils/helpers";
import tweetsAPI from "./../apis/tweets";

export default {
  name: "MainTweets",
  mixins: [fromNowFilter],
  props: {
    initialShowTweets: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tweets: [],
      oneTweet: {},
    };
  },
  watch: {
    initialShowTweets(newValue) {
      // 監聽：Infinite Scroll
      this.tweets = [...newValue];
    },
  },
  created() {
    this.fetchTweets();
  },
  methods: {
    fetchTweets() {
      this.tweets = this.initialShowTweets;
    },
    isClickedTweet(tweetId) {
      //被點擊那則推文的資料 -> 顯示 modal 使用
      this.oneTweet = this.tweets.find((tweet) => {
        return tweet.id === tweetId;
      });
      this.$emit("after-click-reply", this.oneTweet);
    },
    async addLiked(tweetId) {
      try {
        const { data } = await tweetsAPI.tweets.addLiked({ tweetId });
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        //顯示紅心 & 愛心數加一
        this.tweets = this.tweets.map((tweet) => {
          return tweetId === tweet.id
            ? {
                ...tweet,
                isLiked: !tweet.isLiked,
                likeCount: tweet.likeCount + 1,
              }
            : tweet;
        });
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
        this.tweets = this.tweets.map((tweet) => {
          return tweetId === tweet.id
            ? {
                ...tweet,
                isLiked: !tweet.isLiked,
                likeCount: tweet.likeCount - 1,
              }
            : tweet;
        });
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

.tweet-lists {
  .tweet-list {
    width: 100%;
    .tweet-link {
      display: flex;
      padding: 0 0 0 12px;
      border: $light-blue2 1px solid;
      color: $black;
    }
    .user-avatar img {
      margin: 16px 8px 0 24px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .tweet-content {
      display: flex;
      flex-direction: column;
      padding: 0 29px 0 0;
      overflow-wrap: anywhere;
      .tweet-title {
        display: flex;
        align-items: center;
        margin: 16px 0 8px 0;
        .name {
          margin: 0 8px 0 0;
          color: $black;
          font-size: 16px;
          font-weight: 700;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:hover {
            text-decoration: underline;
          }
        }
        .account,
        .time {
          color: $Secondary;
          font-size: 14px;
        }
        .account:hover {
          text-decoration: underline;
          color: $brand-color;
        }
      }
      .tweet-text {
        margin: 0 0 8px 0;
        font-size: 16px;
        line-height: 26px;
      }
      .tweet-reply-heart {
        width: 100%;
        display: flex;
        margin: 0 0 18px 0;
        .tweet-reply,
        .tweet-heart {
          display: flex;
          align-items: center;
          margin: 0 41px 0 0;
          font-size: 14px;
          .text {
            margin: 0 2px 0 0;
          }
          &:hover {
            cursor: pointer;
            background: $gray-white3;
            border-radius: 5px;
          }
          .icon {
            width: 14px;
            height: 14px;
            margin: 0 8px 0 1px;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 575px) {
  .tweet-lists {
    .tweet-list {
      .user-avatar img {
        margin: 16px 8px 0 12px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
  }
}
</style>