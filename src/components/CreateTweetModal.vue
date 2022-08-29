<template>
  <form action="submit" @submit.prevent.stop="handleSubmit">
    <div
      class="modal fade create-tweet-modal-container"
      id="createTweetModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="createTweetModal"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="close-btn"
              data-dismiss="modal"
              aria-label="Close"
            >
              <img
                class="close-orange"
                aria-hidden="true"
                src="~@/assets/image/modal-close-icon.png"
                alt="close-icon"
              />
              <img
                class="arrow"
                aria-hidden="true"
                src="~@/assets/image/arrow.png"
                alt="arrow-icon"
              />
            </button>
            <button
              class="modal-tweet-btn top-btn"
              type="submit"
              :disabled="description.length > 140"
            >
              推文
            </button>
          </div>
          <div class="modal-body">
            <div class="modal-user-avatar">
              <img :src="currentUser.avatar" alt="avatar" />
            </div>
            <div class="modal-tweet-text">
              <textarea
                v-model="description"
                class="form-text"
                id="tweet-text"
                name="tweet-text"
                type="text"
                placeholder="有什麼新鮮事？"
              />
            </div>
            <span class="alert-msg" v-if="description.length > 140"
              >字數不可超過 140 字</span
            >
            <button
              class="modal-tweet-btn bottom-btn"
              @click.prevent="isClickedTweet(oneTweet.id)"
              type="submit"
              :disabled="description.length > 140"
            >
              推文
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { Toast } from "./../utils/helpers";
import tweetsAPI from "./../apis/tweets";
import { mapState } from "vuex";
import $ from "jquery";

export default {
  name: "CreateTweetModal",
  data() {
    return {
      description: "",
    };
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  methods: {
    async handleSubmit() {
      try {
        // 表單驗證
        if (!this.description.trim()) {
          Toast.fire({
            icon: "warning",
            title: "內容不可空白",
          });
          return;
        } else if (this.description.length > 140) {
          Toast.fire({
            icon: "warning",
            title: "字數不可超過 140 字",
          });
          return;
        } else {
          Toast.fire({
            icon: "success",
            title: "推文發送成功",
          });
        }
        const { data } = await tweetsAPI.tweets.create({
          description: this.description,
        });
        if (data.status === "error") {
          throw new Error(data.message);
        }
        // 伺服器新增 Comment 成功後...
        this.$emit("after-submit-tweet", {
          tweetId: data.tweetId,
          description: this.description,
        });
        // 送出後清空新增推文區塊的文字
        this.description = "";
        //關掉Modal
        $("#createTweetModal").modal("hide");
      } catch (error) {
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法新增推文，請稍後再試",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./../assets/application.scss";

.modal-dialog {
  all: unset;
  height: 100vh;
  .modal-content {
    border-radius: 0;
    height: 100%;
    .modal-header {
      display: flex;
      width: 100%;
      align-items: center;
      .close-btn {
        .close-orange {
          display: none;
          width: 24px;
          height: 24px;
        }
        .arrow {
          width: 24px;
          height: 24px;
        }
      }
      .modal-tweet-btn {
        @extend %btn-style;
        width: 64px;
      }
    }
    .modal-body {
      display: flex;
      position: relative;
      width: 100%;
      .modal-user-avatar {
        img {
          @extend %user-avatar;
        }
      }
      .modal-tweet-text {
        flex-grow: 1;
        height: 100%;
        textarea {
          width: 100%;
          height: 100%;
          margin: 8px;
          border: none;
          resize: none;
        }
      }
      .alert-msg {
        position: absolute;
        right: 100px;
        bottom: 28px;
        font-size: 15px;
        font-weight: 500;
        color: $Error;
      }
      .bottom-btn {
        display: none;
      }
    }
  }
}

@media screen and (min-width: 575px) {
  .modal-dialog {
    position: fixed;
    top: 56px;
    left: 25%;
    .modal-content {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 634px;
      height: 300px;
      background-color: $white;
      border-radius: 14px;
      z-index: 10;
      .modal-header {
        width: 100%;
        height: 17%;
        border-bottom: 1px solid $light-blue2;
        display: flex;
        .close-btn {
          align-items: center;
          width: 24px;
          height: 24px;
          .close-orange {
            display: block;
          }
          .arrow {
            display: none;
          }
        }
      }
      .modal-body {
        display: flex;
        width: 100%;
        height: 83%;
        padding: 16px 24px;
        .modal-user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          img {
            border-radius: 50%;
          }
        }
        .modal-tweet-text {
          flex: 1;
          margin-left: 8px;
          margin-top: 8px;
          textarea {
            width: 90%;
            height: 75%;
            border-color: transparent;
            border-radius: 5px;
            resize: none;
            &::-webkit-scrollbar {
              width: 6px;
            }
            &::-webkit-scrollbar-thumb {
              background-color: $light-blue2;
              border-radius: 3px;
            }
          }
        }
        .modal-tweet-btn {
          @include btn-style-mixin();
          width: 64px;
          position: absolute;
          bottom: 16px;
          right: 16px;
          font-size: 16px;
          font-weight: 400;
          &:disabled {
            background-color: $gray3;
          }
        }
      }
    }
  }
}
</style>