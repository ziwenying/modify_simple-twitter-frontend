<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="user-edit"
    tabindex="-1"
    aria-labelledby="user-edit-label"
    aria-hidden="true"
  >
    <form
      @submit.stop.prevent="handleSubmit"
      class="modal-dialog"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="user-edit-label">編輯個人資料</h5>
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
            type="submit"
            class="modal-save"
            :disabled="
              profile.name.length > 50 ||
              profile.name.trim().length === 0 ||
              profile.introduction.length > 160
            "
          >
            儲存
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-img">
            <div @click="$refs.cover.click()" class="black">
              <!-- 背景圖這邊 -->
              <img
                class="background-img"
                :src="profile.cover"
                alt="user-background"
              />
            </div>
            <div class="icon-add-delete">
              <!-- 新增背景圖 -->
              <input
                id="image-cover"
                ref="cover"
                type="file"
                name="cover"
                accept="image/*"
                class="d-none"
                @change="handleCoverChange"
              />
              <img
                @click="$refs.cover.click()"
                class="add-avatar"
                src="~@/assets/image/add-avatar.png"
                alt="add-avatar"
              />
              <!-- 刪除前一次上傳的圖片 -->
              <img
                @click="restoreDefaultCover"
                class="delete-img"
                src="~@/assets/image/delete-img.png"
                alt="delete-img"
              />
            </div>
            <div class="avatar-wrapper">
              <input
                id="image-avatar"
                ref="avatar"
                type="file"
                name="avatar"
                accept="image/*"
                class="d-none"
                @change="handleAvatarChange"
              />
              <div class="black" @click="$refs.avatar.click()">
                <!-- 大頭貼 -->
                <img
                  class="user-avatar"
                  :src="profile.avatar"
                  alt="user-avatar"
                />
              </div>
              <!-- 新增大頭貼圖片 -->
              <img
                @click="$refs.avatar.click()"
                class="add-avatar"
                src="~@/assets/image/add-avatar.png"
                alt="add-avatar"
              />
            </div>
          </div>
          <!-- input -->
          <div class="name-introduction">
            <div class="form-field name-field">
              <label for="name">名稱</label>
              <input
                :class="{
                  error:
                    profile.name.trim().length > 50 ||
                    profile.name.length > 50 ||
                    profile.name.trim().length === 0,
                }"
                v-model="profile.name"
                id="name"
                name="name"
                type="text"
                placeholder="請輸入名稱"
                required
              />
              <div class="alert-msg">
                <span class="msg" v-if="profile.name.length > 50">
                  字數超出上限！
                </span>
                <span
                  class="msg"
                  :class="{ blank: profile.name.length > 50 }"
                  v-if="profile.name.trim().length === 0"
                >
                  名稱不可空白！
                </span>
                <span class="number">{{ profile.name.length }}/50</span>
              </div>
            </div>
            <div class="form-field introduction-field">
              <label for="introduction">自我介紹</label>
              <textarea
                :class="{ error: profile.introduction.length > 160 }"
                v-model="profile.introduction"
                id="introduction"
                name="introduction"
                type="text"
                placeholder="請輸入自我介紹"
              />
              <div class="alert-msg-intro">
                <span class="msg" v-if="profile.introduction.length > 160"
                  >字數超出上限！</span
                >
                <span class="number"
                  >{{ profile.introduction.length }}/160</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import $ from "jquery";
import { Toast } from "./../utils/helpers";
import { mapState } from "vuex";

export default {
  name: "UserEditModal",
  props: {
    initialTargetProfile: {
      type: Object,
      default: () => ({
        id: -1,
        name: "",
        avatar:
          "https://github.com/ziwenying/simple-twitter-frontend/blob/main/src/assets/image/user-image.png?raw=true",
        cover:
          "https://github.com/ziwenying/simple-twitter-frontend/blob/main/src/assets/image/profile-background.png?raw=true",
        introduction: "",
      }),
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  data() {
    return {
      profile: {
        id: -1,
        avatar: "",
        cover: "",
        name: "",
        introduction: "",
      },
    };
  },
  watch: {
    initialTargetProfile(newValue) {
      this.profile = { ...newValue };
    },
  },
  created() {
    // const { id: UserId } = this.$route.params;
    this.getProfile();
  },
  methods: {
    getProfile() {
      const { avatar, cover, name, introduction } = {
        avatar: this.initialTargetProfile.avatar,
        cover: this.initialTargetProfile.cover,
        name: this.initialTargetProfile.name,
        introduction: this.initialTargetProfile.introduction,
      };
      this.profile = { avatar, cover, name, introduction };
    },
    handleCoverChange(e) {
      const { files } = e.target;
      if (files.length === 0) {
        // 使用者沒有選擇上傳的檔案，用原本的
        return this.profile.cover;
      } else {
        // 否則產生預覽圖
        const imageURL = window.URL.createObjectURL(files[0]);
        this.profile.cover = imageURL;
      }
    },
    handleAvatarChange(e) {
      const { files } = e.target;
      if (files.length === 0) {
        // 使用者沒有選擇上傳的檔案，用原本的
        return this.avatar.cover;
      } else {
        // 否則產生預覽圖
        const imageURL = window.URL.createObjectURL(files[0]);
        this.profile.avatar = imageURL;
      }
    },
    restoreDefaultCover() {
      // 清掉上傳的 cover
      //下面選到上傳檔案的 input，直接清空就好
      document.querySelector("#image-cover").value = "";
      // 恢復原本的 cover
      this.profile.cover = this.initialTargetProfile.cover;
    },
    async handleSubmit(e) {
      if (!this.profile.name.trim()) {
        Toast.fire({
          icon: "warning",
          title: "名稱不可空白！",
        });
        return;
      } else if (
        this.profile.name.trim().length > 50 ||
        this.profile.introduction.length > 160
      ) {
        Toast.fire({
          icon: "warning",
          title: "字數超出上限！",
        });
        return;
      }
      //關掉Modal
      $("#user-edit").modal("hide");
      // 表單資料轉為物件傳回父層 User.vue
      const form = e.target; // <form></form>
      const formData = new FormData(form);
      this.$emit("after-submit-profile", formData);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./../assets/application.scss";

.modal {
  .modal-dialog {
    all: unset;
    .modal-content {
      border-radius: 0px;
      .modal-header {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        position: relative;
        height: 57px;
        padding: 0;
        .modal-title {
          position: absolute;
          left: 56px;
          font-size: 18px;
        }
        .close-btn {
          position: absolute;
          left: 19.5px;
          .close-orange {
            display: none;
          }
          .arrow {
            width: 24px;
            height: 24px;
          }
          z-index: 2;
        }
        .modal-save {
          @extend %btn-style;
          position: absolute;
          top: 8px;
          right: 16px;
          width: 64px;
          padding: 8px 0 8px 0;
          &:disabled {
            background-color: $gray3;
            color: $near-white;
          }
        }
      }
      .modal-body {
        padding: 0;
        height: 100vh;
        .modal-img {
          position: relative;
          width: 100vw;
          .black {
            .background-img {
              height: 200px;
              width: 100vw;
            }
          }
          .black::before {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            height: 200px;
            width: 639px;
            background: $black;
            cursor: pointer;
            opacity: 0.25;
          }
          .icon-add-delete {
            display: flex;
            align-items: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            height: 15px;
            .add-avatar {
              cursor: pointer;
              width: 20px;
              height: 20px;
            }
            .delete-img {
              width: 15px;
              height: 15px;
              cursor: pointer;
              margin: 0 0 0 38.5px;
            }
          }
          .avatar-wrapper {
            position: absolute;
            top: 159px;
            left: 16px;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            .black::before {
              display: block;
              content: "";
              width: 80px;
              height: 80px;
              background: $black;
              border-radius: 50%;
              opacity: 0.5;
              z-index: 1;
            }
            .black {
              .user-avatar {
                border-radius: 50%;
                width: 80px;
                height: 80px;
                cursor: pointer;
                object-fit: cover;
              }
            }
            .add-avatar {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 20px;
              height: 20px;
              cursor: pointer;
              z-index: 1;
            }
          }
        }
        .name-introduction {
          margin: 56px 16px 40px 16px;
          .form-field.name-field {
            margin-bottom: 32px;
          }
          .form-field {
            position: relative;
            width: 100%;
            height: 54px;
            padding: 2px 0px 4px 0px;
            background-color: #f5f8fa;
            border-radius: 2px;

            .alert-msg {
              position: absolute;
              top: 54px;
              width: 100%;
              margin: 4px 0 0 0;
              .msg {
                position: absolute;
                left: 0;
                color: $brand-color;
                font-size: 12px;
              }
              .blank {
                margin: 0 0 0 90px;
              }
              .number {
                position: absolute;
                right: 0;
                color: $gray1;
                font-size: 12px;
              }
            }
            > label {
              display: block;
              width: 100%;
              height: 22px;
              font-size: 14px;
              color: $gray1;
              margin-bottom: 0;
              margin-left: 10px;
            }
            input,
            textarea {
              width: 100%;
              border-color: transparent;
              background-color: transparent;
              border-bottom: 2px solid #657786;
              padding-bottom: 10px;
              padding-left: 9px;
              &:disabled {
                border-color: transparent;
                background-color: transparent;
                border-bottom: 2px solid $gray-white1;
              }
              &:hover,
              &:focus {
                border-bottom: 2px solid $light-blue1;
              }
              &.error {
                border-bottom: 2px solid $Error;
              }
              &::-webkit-input-placeholder {
                color: $gray3;
                font-size: 16px;
              }
            }
            input {
              height: 26px;
            }
          }
          .introduction-field {
            position: relative;
            background-color: #f5f8fa;
            height: 145px;
            textarea {
              height: 122px;
              overflow: hidden;
              resize: none;
            }
            .alert-msg-intro {
              position: absolute;
              bottom: -8px;
              right: 0;
              width: 100%;
              .msg {
                position: absolute;
                left: 0;
                color: $brand-color;
                font-size: 12px;
              }
              .number {
                position: absolute;
                right: 0;
                color: $gray1;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}

@media screen and (min-width: 575px) {
  .modal {
    .modal-dialog {
      position: absolute;
      top: 20px;
      left: 25%;
      .modal-content {
        width: 641px;
        border-radius: 14px;
        .modal-header {
          .close-btn {
            .close-orange {
              display: block;
              width: 15px;
              height: 15px;
            }
            .arrow {
              display: none;
            }
          }
          .modal-save {
            @extend %btn-style;
          }
        }
        .modal-body {
          width: 100%;
          .modal-img {
            width: 639px;
            .black {
              .background-img {
                width: 639px;
              }
            }
            .icon-add-delete {
              display: flex;
              align-items: center;
              top: 90px;
              left: 297px;
              height: 15px;
            }
            .avatar-wrapper {
              top: 124px;
              left: 16px;
              width: 140px;
              height: 140px;
              border: 4px white solid;
              .black::before {
                width: 132px;
                height: 132px;
              }
              .black {
                .user-avatar {
                  width: 132px;
                  height: 132px;
                }
              }
            }
          }
          .name-introduction {
            margin: 80px 16px 40px 16px;
          }
        }
      }
    }
  }
}
</style>