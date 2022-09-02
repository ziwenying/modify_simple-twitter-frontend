<template>
  <div class="container">
    <form class="login-form" @submit.prevent.stop="handleSubmit">
      <div class="logo">
        <img src="~@/assets/image/logo.png" alt="logo" />
      </div>
      <div class="title">
        <h3>後台登入</h3>
      </div>
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
        <div class="alert-msg">
          <span class="msg" v-if="errorMsg === 'Account not exists for admin'"
            >帳號不存在</span
          >
        </div>
      </div>
      <div class="form-field password-field">
        <label for="password">密碼</label>
        <input
          v-model="password"
          id="password"
          name="password"
          type="password"
          placeholder="請輸入密碼"
          required
        />
        <div class="alert-msg">
          <span class="msg" v-if="errorMsg === 'Password incorrect.'"
            >密碼錯誤</span
          >
        </div>
      </div>
      <div class="btn-container">
        <button class="login-btn" type="submit" :disabled="isProcessing">
          {{ isProcessing ? "驗證中" : "登入" }}
        </button>
      </div>
      <div class="router-link-container">
        <div class="router-link-group">
          <router-link to="/login">前台登入</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { Toast } from "./../utils/helpers";
import authorizationAPI from "./../apis/authorization";
export default {
  name: "AdminLogin",
  data() {
    return {
      account: "",
      password: "",
      isProcessing: false,
      errorMsg: "",
    };
  },
  methods: {
    async handleSubmit() {
      this.isProcessing = true;
      this.errorMsg = "";
      try {
        if (!this.account || !this.password) {
          Toast.fire({
            icon: "warning",
            title: "請填入帳號和密碼",
          });
          return;
        }
        const response = await authorizationAPI.adminSignIn({
          account: this.account,
          password: this.password,
        });

        if (response.status !== 200 && response.statusText !== "OK") {
          throw new Error(response.data.message);
        }
        localStorage.setItem("token", response.data.token);
        this.$store.commit("setCurrentUser", response.data.user);
        this.$router.push("/admin/tweets");
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "warning",
          title: "無法登入，請稍後再試",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./../assets/application.scss";

.container {
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 356px;
    margin: 0 auto;
    margin-top: 60px;
    .logo {
      width: 40px;
      height: 40px;
    }
    .title {
      margin: 40px 0;
      h3 {
        font-weight: 700;
      }
    }
    .form-field.account-field {
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
        top: 50px;
        left: 0;
        width: 100%;
        margin: 4px 0 0 0;
        span {
          font-size: 12px;
          color: $Error;
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
    }
    .btn-container {
      width: 100%;
      height: 46px;
      margin-top: 40px;
      .login-btn {
        width: 100%;
        height: 100%;
        background-color: $brand-color;
        border-radius: 50px;
        color: $white;
        font-size: 20px;
        &:disabled {
          background-color: $gray3;
        }
      }
    }
    .router-link-container {
      width: 100%;
      margin-top: 22px;
      display: flex;
      justify-content: flex-end;
      .router-link-group {
        text-align: center;
        line-height: 24px;
        span {
          padding: 0 12px;
        }
        a {
          text-decoration-line: underline;
          font-size: 16px;
          color: $Primary;
        }
      }
    }
  }
}
</style>
