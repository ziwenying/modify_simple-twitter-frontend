<template>
  <div id="infinite-list" ref="infinite_list" class="main-outer">
    <div class="main-page-title">
      <h4 class="pb-4">首頁</h4>
    </div>
    <form @submit.stop.prevent="handleSubmit">
      <div class="main-wrapper">
        <div class="main-tweet-wrapper">
          <div class="avatar-input">
            <router-link :to="{ name: 'main-page' }">
              <img
                class="user-avatar"
                :src="currentUser.avatar"
                alt="user-avatar"
              />
            </router-link>
            <textarea
              v-model="description"
              class="textarea-tweet"
              type="text"
              placeholder="有什麼新鮮事？"
            />
          </div>
          <!-- if more 140 show waring-msg-->
          <div class="input-footer">
            <p v-if="description.length > 140" class="waring-msg">
              字數不可超過 140 字
            </p>
            <button
              type="submit"
              class="btn-setting"
              :disabled="description.length > 140"
            >
              推文
            </button>
          </div>
        </div>
      </div>
    </form>
    <!-- component MainTweet -->
    <MainTweet
      @after-click-reply="afterClickReply"
      :initialShowTweets="showTenTweets"
    />
  </div>
</template>

<script>
import MainTweet from "../components/MainTweet.vue";
import { Toast } from "./../utils/helpers";
import tweetsAPI from "./../apis/tweets";
import { mapState } from "vuex";

export default {
  name: "MainPage",
  components: {
    MainTweet,
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  props: {
    initialTweets: {
      type: Array,
      required: true,
    },
    theTweetId: {
      type: Number,
      default: () => ({
        theTweetId: -1,
      }),
    },
  },
  data() {
    return {
      tweets: [],
      showTenTweets: [],
      pushIndex: 0,
      loading: false,
      description: "",
    };
  },
  watch: {
    initialTweets(newValue) {
      this.tweets = [...newValue];
    },
    theTweetId(newVal) {
      this.addReplyCount(newVal);
    },
  },
  created() {
    this.tweets = this.initialTweets;
    for (let i = this.pushIndex; i < 10; i++) {
      this.showTenTweets.push(this.tweets[i]);
    }
    this.pushIndex += 10;
  },
  mounted() {
    const listScroll = this.$refs.infinite_list;
    listScroll.addEventListener("scroll", () => {
      const list = this.$refs.infinite_list;
      if (list.scrollTop + list.clientHeight + 1 >= list.scrollHeight) {
        this.loadMore();
      }
    });
  },
  methods: {
    loadMore() {
      if (this.showTenTweets.length >= this.tweets.length) {
        return;
      }
      this.loading = true;
      setTimeout(() => {
        for (let i = this.pushIndex; i < this.pushIndex + 10; i++) {
          this.showTenTweets.push(this.tweets[i]);
        }
        this.pushIndex += 10;
        this.loading = false;
      }, 500);
    },
    async handleSubmit() {
      try {
        // 先判斷有無超過字數
        if (this.description.length > 140) {
          Toast.fire({
            icon: "warning",
            title: "字數不可超過 140 字",
          });
          return;
        }
        // 若沒超過，刪掉空白後再檢查一次
        this.description = this.description.trim();
        if (!this.description) {
          Toast.fire({
            icon: "warning",
            title: "內容不可空白",
          });
          return;
        }
        // api post
        const response = await tweetsAPI.tweets.create({
          userId: this.currentUser.id,
          description: this.description,
        });
        if (response.data.status !== "success") {
          throw new Error(response.data.status);
        }
        // 新的推文資料放入陣列第一筆
        this.tweets.unshift({
          id: response.data.tweetId,
          description: this.description,
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
        // 將發推區內的文字清空
        this.description = "";
        Toast.fire({
          icon: "success",
          title: "推文發送成功",
        });
      } catch (error) {
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "推文發送失敗，請稍後再試",
        });
      }
    },
    addReplyCount(id) {
      this.tweets = this.tweets.map((tweet) => {
        return tweet.id === id
          ? { ...tweet, replyCount: tweet.replyCount + 1 }
          : tweet;
      });
    },
    afterClickReply(payload) {
      // 被點擊的那則留言的資料，繼續傳到父層 Main.vue
      this.$emit("after-click-reply", payload);
    },
  },
};
</script>

<style scoped lang="scss">
@import "./../assets/application.scss";

.main-outer {
  position: relative;
  .main-page-title {
    display: flex;
    position: sticky;
    top: 0;
    width: 100%;
    background: $white;
    height: 74px;
    border-bottom: $light-blue2 1px solid;
    z-index: 1;
    .user-avatar {
      @extend %user-avatar;
      margin: 12px 0 0 36px;
    }
    h4 {
      height: 74px;
      padding: 24px 0 0 23px;
      font-size: 24px;
      font-weight: 700;
      z-index: 1;
    }
  }
  form {
    .main-wrapper {
      display: none;
    }
  }
}

@media screen and (min-width: 575px) {
  .main-outer {
    h4 {
      width: 100%;
      border-left: $light-blue2 1px solid;
      border-right: $light-blue2 1px solid;
    }
    .main-wrapper {
      display: block;
      position: relative;
      border-top: $light-blue2 1px solid;
      border-left: $light-blue2 1px solid;
      border-right: $light-blue2 1px solid;
      .main-tweet-wrapper {
        position: relative;
        .avatar-input {
          display: flex;
          position: relative;
          padding: 16px 0 0 23px;

          .user-avatar {
            @include user-avatar-mixin();
            margin: 0 8px 0 0;
          }
          .textarea-tweet {
            padding: 12px;
            width: 100%;
            height: 150px;
            border: none;
            resize: none;
          }
          textarea::-webkit-input-placeholder {
            color: $Secondary;
            font-size: 16px;
            font-weight: 700;
          }
        }
        .input-footer {
          display: flex;
          justify-content: flex-end;
          padding: 0 15px 15px 20px;
          border-bottom: $light-blue2 10px solid;
          .waring-msg {
            padding: 10px;
            color: $brand-color;
            font-size: 15px;
          }
          .btn-setting {
            width: 64px;
            font-size: 18px;
            @include btn-style-mixin();
            &:disabled {
              background-color: $gray3;
              color: $near-white;
            }
          }
        }
      }
    }
  }
}
</style>