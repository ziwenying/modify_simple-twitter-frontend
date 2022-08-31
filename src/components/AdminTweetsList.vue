
<template>
  <div class="tweets-list">
    <h4 class="title">推文清單</h4>
    <div class="tweets">
      <div class="tweet" v-for="tweet in initialTweets" :key="tweet.id">
        <img
          class="avatar"
          :src="tweet.User.avatar | emptyImage"
          alt="avatar"
        />
        <div class="tweet-info">
          <div class="tweet-detail">
            <span class="user-name">{{ tweet.User.name }}</span>
            <span class="account-created-time"
              >@{{ tweet.User.account }}&#xb7;{{
                tweet.createdAt | fromNow
              }}</span
            >
          </div>
          <p class="tweet-text">
            {{ tweet.description | onlyDisplay50Letters }}
          </p>
        </div>
        <button
          class="delete-btn"
          @click.prevent.stop="handleDeleteBtnClick(tweet.id)"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { fromNowFilter } from "./../utils/mixins";
import { emptyImageFilter } from "./../utils/mixins";
import { Toast } from "./../utils/helpers";
import adminAPI from "./../apis/admin";

export default {
  name: "AdminTweetsList",
  mixins: [fromNowFilter, emptyImageFilter],
  props: {
    initialTweets: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async handleDeleteBtnClick(tweetId) {
      try {
        // 發送API請伺服器刪掉這則tweet
        const { data } = await adminAPI.tweets.delete({ tweetId });
        if (data.status === "error") {
          throw new Error(data.message);
        }
        // 告訴父元件哪一條tweet被刪掉
        this.$emit("after-delete-tweet", tweetId);
        Toast.fire({
          icon: "success",
          title: "推文刪除成功",
        });
      } catch (error) {
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法刪除此推文，請稍後再試",
        });
      }
    },
  },
  filters: {
    onlyDisplay50Letters(string) {
      return string.length > 50 ? string.slice(0, 50) + "..." : string;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./../assets/application.scss";
.tweets-list {
  width: 100%;
  border-right: 1px solid $light-blue2;
  border-left: 1px solid $light-blue2;
  padding: 0;
  .title {
    font-size: 24px;
    font-weight: 700;
    color: $black;
    padding-top: 24px;
    padding-bottom: 24px;
    padding-left: 20px;
  }
  .tweets {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-top: 1px solid $light-blue2;

    .tweet {
      display: flex;
      padding: 16px 23px;
      position: relative;
      border-bottom: 1px solid $light-blue2;
      &:hover {
        background-color: $gray-white3;
      }
      .avatar {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        margin-right: 8px;
      }
      .tweet-info {
        display: flex;
        flex-direction: column;
        .tweet-detail {
          > span {
            font-size: 16px;
            font-weight: 700;
            color: $black;
            margin-right: 8px;
          }
          .account-created-time {
            font-size: 14px;
            font-weight: 400;
            color: $gray4;
          }
        }
        .tweet-text {
          margin-right: 0;
          margin-top: 8px;
          padding-right: 50px;
          color: $black;
          font-size: 16px;
          font-weight: 400;
          overflow-wrap: anywhere;
        }
      }
      .delete-btn {
        position: absolute;
        right: 5%;
        top: 30%;
        margin: 5px;
        height: 16px;
        width: 16px;
      }
    }
  }
}
</style>