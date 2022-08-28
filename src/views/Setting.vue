<template>
  <div class="row setting-wrapper">
    <Navbar class="col-2 pl-0" />
    <div class="col-7 setting-form-area">
      <h4>帳戶設定</h4>
      <hr />
      <form action="submit" @submit.prevent.stop="handleSubmit">
        <div class="setting-form-container">
          <div class="form-container">
            <div class="form-field account-field">
              <label for="account">帳號</label>
              <input
                v-model="account"
                id="account"
                name="account"
                type="text"
                placeholder="請輸入帳號"
                required
              />
              <div
                class="alert-msg"
                v-if="errorMsg === 'The account is registered.'"
              >
                <span class="msg">account已重複註冊！</span>
              </div>
            </div>

            <div class="form-field name-field">
              <label for="name">名稱</label>
              <input
                :class="{ error: name.length > 50 }"
                v-model="name"
                id="name"
                name="name"
                type="text"
                placeholder="請輸入使用者名稱"
                required
              />
              <div class="alert-msg">
                <span class="msg" v-if="name.length > 50">字數超過上限！</span>
                <span class="letter-count">{{ name.length }}/50</span>
              </div>
            </div>

            <div class="form-field email-field">
              <label for="email">Email</label>
              <input
                v-model="email"
                id="email"
                name="email"
                type="email"
                placeholder="請輸入Email"
                required
              />
              <div
                class="alert-msg"
                v-if="errorMsg === 'The email is registered.'"
              >
                <span class="msg">Email已重複註冊！</span>
              </div>
              <div
                class="alert-msg"
                v-if="errorMsg === 'Invalid email address.'"
              >
                <span class="msg">Email格式錯誤</span>
              </div>
            </div>

            <div class="form-field password-field">
              <label for="password">密碼</label>
              <input
                v-model="password"
                id="password"
                name="password"
                type="password"
                placeholder="請設定密碼"
                required
              />
            </div>

            <div class="form-field check-password-field">
              <label for="check-password">密碼確認</label>
              <input
                v-model="checkPassword"
                id="check-password"
                name="checkPassword"
                type="password"
                placeholder="請再次輸入密碼"
                required
              />
            </div>
          </div>
        </div>
        <div class="btn-container">
          <button class="processing-btn" disabled v-if="isProcessing">
            處理中
          </button>
          <button
            class="save-btn"
            type="submit"
            v-else
            :disabled="name.length > 50"
          >
            儲存
          </button>
        </div>
      </form>
    </div>
    <div class="col-3 right"></div>
    <CreateTweetModal />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import CreateTweetModal from "../components/CreateTweetModal.vue";
import { Toast } from "./../utils/helpers";
import { mapState } from "vuex";
import usersAPI from "./../apis/users";

export default {
  name: "Setting",
  components: {
    Navbar,
    CreateTweetModal,
  },
  data() {
    return {
      id: -1,
      account: "",
      name: "",
      email: "",
      password: "",
      checkPassword: "",
      isProcessing: false,
      errorMsg: "",
    };
  },
  created() {
    // 避免currentUser資料還沒傳進來, 就已經渲染元件
    if (this.currentUser.id === -1) {
      return;
    }
    const { id } = this.$route.params;
    this.fetchUserProfile(id);
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  // 避免currentUser資料還沒傳進來, 就已經渲染元件
  watch: {
    currentUser(newVal) {
      this.currentUser = {
        ...this.currentUser,
        ...newVal,
      };
      (this.id = this.currentUser.id),
        (this.account = this.currentUser.account),
        (this.name = this.currentUser.name),
        (this.email = this.currentUser.email);
    },
  },
  beforeRouteUpdate(to, from, next) {
    // 避免currentUser資料還沒傳進來, 就已經渲染元件
    if (this.currentUser.id === -1) {
      return;
    }
    const { id } = to.params;
    this.fetchUserProfile(id);
    next();
  },
  methods: {
    fetchUserProfile(userId) {
      (this.id = this.currentUser.id),
        (this.account = this.currentUser.account),
        (this.name = this.currentUser.name),
        (this.email = this.currentUser.email);
      // 如果當前登入的使用者id和路由id不符合, 轉址
      if (this.id !== Number(userId)) {
        this.$router.push("not-found");
      }
    },
    async handleSubmit(e) {
      try {
        this.errorMsg = "";
        if (
          !this.account.trim() ||
          !this.email.trim() ||
          !this.name.trim() ||
          !this.password.trim() ||
          !this.checkPassword.trim()
        ) {
          Toast.fire({
            icon: "warning",
            title: "請輸入所有欄位，如不更新密碼，請輸入舊密碼",
          });
          return;
        } else if (this.password !== this.checkPassword) {
          this.password = "";
          this.checkPassword = "";
          Toast.fire({
            icon: "warning",
            title: "兩次密碼輸入不同",
          });
          return;
        } else if (this.name.length > 50) {
          Toast.fire({
            icon: "warning",
            title: "暱稱不可超過50字",
          });
          return;
        }
        this.isProcessing = true;
        const form = e.target;
        const formData = new FormData(form);
        const response = await usersAPI.update({
          userId: this.id,
          formData,
        });
        const { data } = response;
        if (response.statusText !== "OK") {
          throw new Error(data.message);
        }
        Toast.fire({
          icon: "success",
          title: "更新帳戶資料成功",
        });
        // 更新成功, 清空密碼
        this.password = "";
        this.checkPassword = "";
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        console.error(error.message);
        if (error.message === "The email is registered.") {
          this.errorMsg = error.message;
          Toast.fire({
            icon: "error",
            title: "Email已重複註冊！",
          });
        } else if (error.message === "The account is registered.") {
          this.errorMsg = error.message;
          Toast.fire({
            icon: "error",
            title: "account已重複註冊！",
          });
        } else if (error.message === "Name is too long.") {
          this.errorMsg = error.message;
          Toast.fire({
            icon: "error",
            title: "暱稱不可超過50字",
          });
        } else if (
          error.message === "Password and checkPassword are not same."
        ) {
          this.errorMsg = error.message;
          Toast.fire({
            icon: "error",
            title: "兩次密碼輸入不相符",
          });
        } else if (error.message === "Invalid email address.") {
          this.errorMsg = error.message;
          Toast.fire({
            icon: "error",
            title: "Email格式錯誤，請填入有效的Email地址",
          });
        } else {
          this.errorMsg = error.message;
          Toast.fire({
            icon: "error",
            title: "資料更新失敗",
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./../assets/application.scss";

.setting-wrapper {
  width: 100%;
  margin: 0 auto;
  height: 914px;
  .setting-form-area {
    position: relative;
    padding-right: 24px;
    padding-left: 24px;
    padding-top: 24px;
    border-right: 1px solid $light-blue2;
    border-left: 1px solid $light-blue2;
    h4 {
      color: $black;
      font-weight: 700;
      margin-bottom: 24px;
    }
    hr {
      width: 100%;
      position: absolute;
      color: $light-blue2;
      top: 62px;
      left: 0;
    }
    .setting-form-container {
      // 表格置中
      display: flex;
      justify-content: center;
      .form-container {
        padding-top: 24px;
        width: 593px;
        .form-field {
          position: relative;
          width: 100%;
          height: 54px;
          padding: 2px 0px 4px 0px;
          margin-bottom: 32px;
          background-color: #f5f8fa;
          border-radius: 2px;
          &.check-password-field {
            margin-bottom: 0;
          }
          .alert-msg {
            position: absolute;
            top: 54px;
            left: 0;
            width: 100%;
            margin: 4px 0 0 0;
            span {
              font-size: 12px;
              &.msg {
                position: absolute;
                left: 0;
                color: $Error;
              }
              &.letter-count {
                position: absolute;
                right: 0;
                color: $gray1;
              }
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
          input {
            width: 100%;
            height: 26px;
            border-color: transparent;
            background-color: transparent;
            border-bottom: 2px solid #657786;
            padding-bottom: 10px;
            padding-left: 9px;
            &:disabled {
              border-color: transparent;
              background-color: transparent;
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
        }
      }
    }
    .btn-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 40px;
      .processing-btn {
        background-color: $gray3;
        width: 120px;
        height: 46px;
        border-radius: 50px;
        padding: 8px 24px;
        font-size: 20px;
        color: $white;
      }
      .save-btn {
        width: 88px;
        height: 46px;
        border-radius: 50px;
        background-color: $brand-color;
        padding: 8px 24px;
        font-size: 20px;
        color: $white;
        &:disabled {
          background-color: $gray3;
        }
      }
    }
  }
}
</style>