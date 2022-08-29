<template>
  <div class="tweet-lists">
    <div class="tweet-list" v-for="likeTweet in likeTweets" :key="likeTweet.id">
      <router-link
        :to="{ path: `/main/replylist/${likeTweet.tweetId}/` }"
        class="tweet-link"
      >
        <router-link :to="{ path: `/users/${likeTweet.userId}/tweets` }">
          <img class="user-avatar" :src="likeTweet.avatar" alt="user-avatar" />
        </router-link>
        <div class="tweet-content">
          <div class="tweet-title">
            <router-link :to="{ path: `/users/${likeTweet.userId}/tweets` }">
              <p class="name">{{ likeTweet.name }}</p>
            </router-link>
            <router-link :to="{ path: `/users/${likeTweet.userId}/tweets` }">
              <p class="account">@{{ likeTweet.account }}</p>
            </router-link>
            <p class="time">
              &nbsp;‧&nbsp;{{ likeTweet.tweetCreatedAt | fromNow }}
            </p>
          </div>
          <div class="tweet-text">
            <p>
              {{ likeTweet.description }}
            </p>
          </div>
          <div class="tweet-reply-heart">
            <!-- 要跳出 modal -->
            <div
              @click.prevent="isClickedTweet(likeTweet.tweetId)"
              data-toggle="modal"
              data-target="#replyTweetModal"
              class="tweet-reply"
            >
              <img class="icon" src="~@/assets/image/reply.png" alt="reply" />
              <p>{{ likeTweet.replyCount }}</p>
            </div>
            <div
              v-if="likeTweet.isLiked"
              @click.stop.prevent="deleteLiked(likeTweet.tweetId)"
              class="tweet-heart"
            >
              <img
                class="icon"
                src="~@/assets/image/red-heart.png"
                alt="heart"
              />
              <p class="text">{{ likeTweet.likeCount }}</p>
            </div>
            <div
              v-if="!likeTweet.isLiked"
              @click.stop.prevent="addLiked(likeTweet.tweetId)"
              class="tweet-heart"
            >
              <img class="icon" src="~@/assets/image/heart.png" alt="heart" />
              <p>{{ likeTweet.likeCount }}</p>
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
import usersAPI from "./../apis/users";

export default {
  name: "likedTweets",
  mixins: [fromNowFilter],
  props: {
    theTweetId: {
      type: Number,
      default: () => ({
        theTweetId: -1,
      }),
    },
  },
  data() {
    return {
      likeTweets: [],
      oneTweet: {},
    };
  },
  watch: {
    theTweetId(newVal) {
      this.addReplyCount(newVal);
    },
  },
  beforeRouteUpdate(to, from, next) {
    // 監聽路由
    const { id } = to.params;
    this.fetchLikeTweets(id);
    next();
  },
  created() {
    const { id } = this.$route.params;
    this.fetchLikeTweets(id);
  },
  methods: {
    async fetchLikeTweets(id) {
      try {
        const response = await usersAPI.getTheLikeTweets({
          userId: id,
        });
        if (response.statusText !== "OK") {
          throw new Error("無法取得推文資料，請稍後再試");
        }
        this.likeTweets = response.data;
        this.likeTweets = this.likeTweets.map((likeTweet) => {
          return {
            id: likeTweet.id,
            tweetId: likeTweet.TweetId,
            avatar: likeTweet.Tweet.User.avatar,
            name: likeTweet.Tweet.User.name,
            account: likeTweet.Tweet.User.account,
            description: likeTweet.Tweet.description,
            tweetCreatedAt: likeTweet.Tweet.createdAt,
            createdAt: likeTweet.createdAt,
            likeCount: likeTweet.Tweet.likeCount,
            replyCount: likeTweet.Tweet.replyCount,
            isLiked: likeTweet.isLiked,
            userId: likeTweet.Tweet.User.id,
          };
        });
      } catch (error) {
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法取得推文資料，請稍後再試",
        });
      }
    },
    addReplyCount(id) {
      this.likeTweets = this.likeTweets.map((likeTweet) => {
        return likeTweet.tweetId === id
          ? { ...likeTweet, replyCount: likeTweet.replyCount + 1 }
          : likeTweet;
      });
    },
    isClickedTweet(tweetId) {
      // 被點擊的那則留言的資料，傳到父層 User.vue
      this.oneTweet = this.likeTweets.find((tweet) => {
        return tweet.tweetId === tweetId;
      });
      this.oneTweet = {
        id: this.oneTweet.tweetId,
        description: this.oneTweet.description,
        createdAt: this.oneTweet.tweetCreatedAt,
        User: {
          name: this.oneTweet.name,
          account: this.oneTweet.account,
          avatar: this.oneTweet.avatar,
        },
      };
      this.$emit("after-click-reply", this.oneTweet);
    },
    async addLiked(tweetId) {
      try {
        const { data } = await tweetsAPI.tweets.addLiked({ tweetId });
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        this.likeTweets = this.likeTweets.map((tweet) => {
          return tweetId === tweet.tweetId
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
        this.likeTweets = this.likeTweets.map((tweet) => {
          return tweetId === tweet.tweetId
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
  overflow-y: scroll;
  height: 400px;
  border-right: $light-blue2 1px solid;
  .tweet-list {
    width: 100%;
    .tweet-link {
      display: flex;
      padding: 0 0 17px 23px;
      color: $black;
      border-top: $light-blue2 1px solid;
      border-bottom: $light-blue2 1px solid;
      border-left: $light-blue2 1px solid;
    }
    .user-avatar {
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
        align-items: center;
        margin: 16px 0 8px 0;
        .name {
          margin: 0 8px 0 0;
          color: $black;
          font-size: 16px;
          font-weight: 700;
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
        font-size: 16px;
        line-height: 26px;
      }
      .tweet-reply-heart {
        width: 100%;
        display: flex;
        .tweet-reply,
        .tweet-heart {
          display: flex;
          align-items: center;
          margin: 10px 41px 0 0;
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
            margin: 0 8px 0 0;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 575px) {
  .tweet-lists {
    .tweet-list {
      .user-avatar {
        margin: 16px 8px 0 0;
      }
    }
  }
}
</style>