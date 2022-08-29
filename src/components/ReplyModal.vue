<template>
  <div
    class="modal fade"
    id="replyTweetModal"
    tabindex="-1"
    aria-labelledby="replyTweetModalLabe"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <form class="form-wrapper" @submit.stop.prevent="handleSubmitReply">
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
                alt="close-icon"
              />
            </button>
            <button
              class="modal-reply-btn top-btn"
              type="submit"
              :disabled="!description.trim().length"
            >
              回覆
            </button>
          </div>
          <div class="modal-body">
            <div class="tweet-area">
              <div class="tweet">
                <img
                  class="avatar"
                  :src="replyModalData.userAvatar"
                  alt="avatar"
                />
                <div class="tweet-info">
                  <div class="tweet-detail">
                    <span class="user-name">{{ replyModalData.userName }}</span>
                    <span class="account-created-time"
                      >@{{ replyModalData.userAccount }}&#xb7;{{
                        replyModalData.createdAt | fromNow
                      }}</span
                    >
                  </div>
                  <p class="tweet-text">
                    {{ replyModalData.description }}
                  </p>
                  <div class="reply-to">
                    <span>回覆給</span>&nbsp;<span class="reply-to-account"
                      >@{{ replyModalData.userAccount }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="reply-area">
              <div class="modal-user-avatar">
                <!-- 這邊圖片之後記得改 currentUser 的大頭貼 -->
                <img :src="currentUser.avatar" alt="avatar" />
              </div>
              <div class="modal-tweet-text">
                <textarea
                  v-model="description"
                  id="tweet-text"
                  name="tweet-text"
                  type="text"
                  placeholder="推你的回覆"
                  required
                />
              </div>
            </div>
            <span
              v-if="description && description.trim().length === 0"
              class="alert-msg"
              >內容不可空白</span
            >
            <button
              class="modal-reply-btn bottom-btn"
              type="submit"
              :disabled="!description.trim().length"
            >
              回覆
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { fromNowFilter } from "./../utils/mixins";
import { mapState } from "vuex";
import { Toast } from "./../utils/helpers";
import tweetsAPI from "./../apis/tweets";

export default {
  name: "ReplyModal",
  mixins: [fromNowFilter],
  computed: {
    ...mapState(["currentUser"]),
  },
  props: {
    replyModalData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      description: "",
    };
  },
  methods: {
    async handleSubmitReply() {
      try {
        // 檢驗內容是否符合標準
        if (!this.description.trim()) {
          Toast.fire({
            icon: "warning",
            title: "內容不可空白",
          });
          return;
        }
        const { data } = await tweetsAPI.tweets.createReply({
          tweetId: this.replyModalData.id,
          comment: this.description,
        });
        if (data.status !== "success") {
          throw new Error(data.status);
        }

        // 如果在單一貼文頁面使用回覆功能，需要即時顯示新回覆內容，傳 ->> ReplyList.vue
        if (this.$route.name === "reply-list") {
          this.$emit("after-submit-reply", this.replyModalData.id);
        } else if (this.$route.name === "main-page") {
          this.$emit("main-after-submit-reply", this.replyModalData.id);
        } else if (
          this.$route.name === "main-tweets" ||
          this.$route.name === "liked-tweets"
        ) {
          this.$emit("user-after-submit-reply", this.replyModalData.id);
        }
        Toast.fire({
          icon: "success",
          title: "回覆推文成功",
        });
        // 送出後清空新增推文區塊的文字
        this.description = "";
        //關掉Modal
        $("#replyTweetModal").modal("hide");
      } catch (error) {
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法發送回覆，請稍後再試",
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
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: $white;
    background-clip: padding-box;
    border-radius: 0px;
    z-index: 10;
    .form-wrapper {
      .modal-header {
        position: relative;
        width: 100%;
        height: 74px;
        border-bottom: 1px solid $light-blue2;
        display: flex;
        align-items: center;
        .close-btn {
          .close-orange {
            display: none;
          }
          .arrow {
            width: 24px;
            height: 24px;
          }
        }
        .top-btn {
          top: 17px;
          right: 24px;
          @extend %btn-style;
          width: 64px;
          &:disabled {
            background-color: $gray3;
            color: $near-white;
          }
        }
      }
      .modal-body {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 80vh;
        padding: 16px 24px;

        .tweet-area {
          display: flex;
          flex-direction: column;
          .tweet {
            display: flex;
            position: relative;
            // 連結線
            &::before {
              content: "";
              position: absolute;
              left: 25px;
              top: 60px;
              height: calc(100% - 45px); // 裝飾線長度自動調整
              background-color: $gray3;
              border-right: 1px solid $gray3;
              border-left: 1px solid $gray3;
            }
            .avatar {
              height: 50px;
              width: 50px;
              margin-right: 8px;
              border-radius: 50%;
            }
            .tweet-info {
              width: 85%;
              display: flex;
              flex-direction: column;
              .tweet-detail {
                width: 100%;
                align-items: center;
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
                width: 100%;
                margin-right: 0;
                margin-top: 8px;
                color: $black;
                font-size: 16px;
                font-weight: 400;
                // 避免文字過長溢出
                overflow-wrap: break-word;
              }
              .reply-to {
                width: 100%;
                margin-top: 10px;
                span {
                  font-size: 14px;
                  font-weight: 400;
                  color: $gray4;
                }
                .reply-to-account {
                  color: $brand-color;
                }
              }
            }
          }
        }
        .reply-area {
          display: flex;
          flex: 1;
          width: 100%;
          margin-top: 23px;
          .modal-user-avatar {
            width: 50px;
            height: 50px;
            margin-right: 8px;
            & > img {
              border-radius: 50%;
            }
          }
          .modal-tweet-text {
            flex: 1;
            height: 100%;
            textarea {
              width: 100%;
              height: 100%;
              border-radius: 5px;
              border: none;
              resize: none;
              &::placeholder {
                margin-left: 0;
              }
            }
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
        .modal-reply-btn.bottom-btn {
          display: none;
        }
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
      width: 634px;
      height: 500px;
      border-radius: 14px;
      .form-wrapper {
        .modal-header {
          .close-btn {
            display: block;
            align-items: center;
            img {
              width: 24px;
              height: 24px;
            }
          }
          .arrow {
            display: none;
          }
          .top-btn {
            display: none;
          }
        }
      }
      .modal-body {
        height: 450px;
        .tweet-area {
          .tweet {
            .tweet-info {
              .tweet-detail {
                .account-created-time {
                }
              }
              .tweet-text {
              }
              .reply-to {
              }
              .reply-to-account {
              }
            }
          }
        }
      }
      .reply-area {
        .modal-user-avatar {
        }
      }
      .modal-tweet-text {
        textarea {
          width: 90%;
          height: 75%;
          &::-webkit-scrollbar {
            width: 6px;
          }
          &::-webkit-scrollbar-thumb {
            background-color: $light-blue2;
            border-radius: 3px;
          }
        }
      }

      .alert-msg {
      }
      .modal-reply-btn.bottom-btn {
        display: block;
        @include btn-style-mixin();
        width: 64px;
        position: absolute;
        bottom: 16px;
        right: 16px;
        font-size: 16px;
        font-weight: 400;
        &:disabled {
          background-color: $gray3;
          color: $near-white;
        }
      }
    }
  }
}
</style>