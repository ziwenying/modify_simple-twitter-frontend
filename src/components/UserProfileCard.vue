<template>
  <div class="user-profile-outer">
    <img
      class="background-img"
      :src="targetProfile.cover"
      alt="user-background"
    />
    <!--  -->
    <div class="user-avatar">
      <!-- 大頭貼 -->
      <img :src="targetProfile.avatar" alt="user-avatar" class="avatar" />
    </div>
    <!--  -->
    <button
      v-if="Number($route.params.id) === currentUser.id"
      class="user-edit"
      data-toggle="modal"
      data-target="#user-edit"
    >
      編輯個人資料
    </button>
    <!-- v-if 如果此頁面非當前的使用者 -->
    <div
      v-else-if="Number($route.params.id) !== currentUser.id"
      class="btn-icon"
    >
      <img
        src="~@/assets/image/message.png"
        alt="message-btn"
        class="message-btn"
      />
      <!-- 小鈴鐺 -->
      <!-- <img src="~@/assets/image/bell.png" alt="bell-btn" class="bell-btn" /> -->
      <img src="~@/assets/image/notfi.png" alt="bell-btn" class="bell-btn" />
      <button
        @click.stop.prevent="addFollowed(targetProfile.id)"
        v-if="!this.initialChangeFollow"
        class="handle-follow btn-unfollow"
      >
        跟隨
      </button>
      <button
        @click.stop.prevent="deleteFollowed(targetProfile.id)"
        v-if="this.initialChangeFollow"
        class="handle-follow btn-follow"
      >
        正在跟隨
      </button>
    </div>
    <div class="user-title">
      <div class="name">{{ targetProfile.name }}</div>
      <div class="account">@{{ targetProfile.account }}</div>
    </div>
    <p class="user-text">
      {{ targetProfile.introduction }}
    </p>
    <div class="follow">
      <router-link :to="{ name: 'user-followings' }" class="following">
        <div class="follow-count">{{ targetProfile.followingCount }} 個</div>
        <div class="follow-text">跟隨中</div>
      </router-link>
      <router-link :to="{ name: 'user-followers' }" class="follower">
        <div class="follow-count">{{ targetProfile.followerCount }} 位</div>
        <div class="follow-text">跟隨者</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Toast } from "./../utils/helpers";
import usersAPI from "./../apis/users";

export default {
  name: "UserProfileCard",
  props: {
    targetProfile: {
      type: Object,
      require: true,
    },
    initialChangeFollow: {
      type: Boolean,
      require: true,
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  data() {
    return {
      followingList: [],
      followShip: false,
    };
  },
  watch: {
    initialChangeFollow(newVal) {
      this.followShip = newVal;
    },
  },
  methods: {
    async fetchFollowings() {
      //追蹤功能需使用的資料
      try {
        const response = await usersAPI.getFollowings({
          userId: this.$route.params.id,
        });
        const { data } = response;
        if (response.statusText !== "OK") {
          throw new Error(data.message);
        }
        this.followingList = data;
      } catch (error) {
        console.error(error.message);
      }
    },
    async addFollowed(userId) {
      try {
        const { data } = await usersAPI.addfollowed({ id: userId });
        if (data.status === "error") {
          throw new Error(data.message);
        }
        this.followingList = this.followingList.map((following) => {
          return userId === following.followId
            ? {
                ...following,
                isFollowing: !following.isFollowing,
              }
            : following;
        });
        this.$emit("change-follow-ship", true);
        this.$store.dispatch("fetchPopular");
        Toast.fire({
          icon: "success",
          title: "成功追蹤該使用者",
        });
      } catch (error) {
        console.error(error.message);
        if (error.message === "Can not follow yourself.") {
          Toast.fire({
            icon: "warning",
            title: "不能追蹤自己唷！",
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "無法追蹤該使用者，請稍後再試",
          });
        }
      }
    },
    async deleteFollowed(userId) {
      try {
        const { data } = await usersAPI.deletefollowed({ userId });
        if (data.status === "error") {
          throw new Error(data.message);
        }
        this.followingList = this.followingList.map((following) => {
          return userId === following.followId
            ? {
                ...following,
                isFollowing: !following.isFollowing,
              }
            : following;
        });
        this.$emit("change-follow-ship", false);
        this.$store.dispatch("fetchPopular");
        Toast.fire({
          icon: "success",
          title: "已取消追蹤該使用者",
        });
      } catch (error) {
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法取消追蹤該使用者，請稍後再試",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./../assets/application.scss";

.user-profile-outer {
  position: relative;
  height: calc(409px + 10%);
  overflow-wrap: anywhere;
  border-left: $light-blue2 1px solid;
  border-right: $light-blue2 1px solid;
  .background-img {
    width: 100%;
    height: 124px;
  }
  .user-avatar {
    position: absolute;
    top: 89px;
    left: 16px;
    width: 80px;
    height: 80px;
    margin: 0 0 0 24px;
    border-radius: 50%;
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
  }

  .user-edit {
    @extend %btn-unfollowed-style;
    position: absolute;
    top: 140px;
    left: calc(10px + 45%);
    width: 128px;
  }

  .btn-icon {
    display: flex;
    position: absolute;
    left: calc(10px + 30%);
    top: 133px;
    width: 220px;
    .message-btn,
    .bell-btn {
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
    .message-btn,
    .bell-btn,
    .handle-follow {
      margin: 0 0 0 16px;
    }

    .btn-follow {
      @extend %btn-style;
      width: 96px;
    }
    .btn-unfollow {
      @extend %btn-unfollowed-style;
      width: 64px;
    }
  }

  .user-title {
    margin: 48px 0 0 16px;
    .name {
      font-size: 18px;
      font-weight: 700;
    }
    .account {
      font-size: 14px;
      color: $Secondary;
    }
  }
  .user-text {
    margin: 6px 17px 0 16px;
    font-size: 14px;
  }
  .follow {
    display: flex;
    margin: 16px 0 0 16px;
    font-size: 14px;

    .following,
    .follower {
      display: flex;
      .follow-text {
        color: $Secondary;
      }
      .follow-count {
        color: $black;
      }
    }
    .following:hover,
    .follower:hover {
      text-decoration: underline;
    }
    .follower {
      margin: 0 0 0 20px;
    }
  }

  .user-title,
  .user-text,
  .follow {
    padding: 0 24px;
    width: 100vw;
  }
}

@media screen and (min-width: 575px) {
  .user-profile-outer {
    .background-img {
      height: 200px;
    }
    .user-avatar {
      position: absolute;
      top: 124px;
      left: 16px;
      margin: 0;
      width: 140px;
      height: 140px;
      border: 4px $white solid;
      .avatar {
        width: 132px;
        height: 132px;
        object-fit: cover;
      }
    }

    .user-edit {
      all: unset;
      @include btn-unfollowed-style-mixin();
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 216px;
      right: 16px;
      width: 128px;
    }
    .btn-icon {
      top: 216px;
      right: 16px;
      width: 100%;
    }
    .user-title {
      margin: 72px 0 0 16px;
    }
    .user-text {
      margin: 6px 17px 0 16px;
      font-size: 14px;
    }
    .user-title,
    .user-text,
    .follow {
      padding: 0;
      width: 100%;
    }
  }
}
</style>