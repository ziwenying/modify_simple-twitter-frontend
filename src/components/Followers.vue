<template>
  <div class="follow-lists">
    <div
      v-for="followList in showFollowLists"
      :key="followList.followId"
      class="follow-list"
    >
      <router-link
        class="follow-link"
        :to="{ path: `/users/${followList.followId}/tweets` }"
      >
        <img class="user-avatar" :src="followList.avatar" alt="user-avatar" />
        <div class="follow-content">
          <p class="follow-name">{{ followList.name }}</p>
          <p class="follow-intro">
            {{ followList.introduction }}
          </p>
        </div>
        <button
          @click.stop.prevent="deleteFollowed(followList.followId)"
          v-if="followList.isFollowing"
          class="btn-follow"
        >
          正在跟隨
        </button>
        <button
          @click.stop.prevent="addFollowed(followList.followId)"
          v-if="!followList.isFollowing"
          class="btn-unfollow"
        >
          跟隨
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { Toast } from "../utils/helpers";
import usersAPI from "./../apis/users";
import { mapState } from "vuex";
export default {
  name: "FollowerNavPills",
  props: {
    followerList: {
      type: Array,
      default: () => [
        {
          followId: -1,
          followerId: -1,
          name: "",
          account: "",
          avatar: "",
          introduction: "",
          isFollowing: false,
        },
      ],
    },
    followingList: {
      type: Array,
      default: () => [
        {
          followId: -1,
          followingId: -1,
          name: "",
          account: "",
          avatar: "",
          introduction: "",
          isFollowing: false,
        },
      ],
    },
  },
  computed: {
    ...mapState(["currentUser", "topPopular"]),
  },
  data() {
    return {
      showFollowLists: [],
    };
  },
  watch: {
    followerList(newVal) {
      this.showFollowLists = [...newVal];
    },
    followingList(newVal) {
      this.showFollowLists = [...newVal];
    },
  },
  created() {
    // 使用路由判斷 要顯示追蹤者，還是正在追蹤的資料
    if (this.$route.name === "user-followers") {
      // 如果沒有跟隨者, 賦值空陣列
      this.showFollowLists = this.followerList.length ? this.followerList : [];
    } else if (this.$route.name === "user-followings") {
      // 如果沒有跟隨中對象, 賦值空陣列
      this.showFollowLists = this.followingList.length
        ? this.followingList
        : [];
    }
  },
  methods: {
    async addFollowed(userId) {
      try {
        const { data } = await usersAPI.addfollowed({ id: userId });
        if (data.status === "error") {
          throw new Error(data.message);
        }
        this.showFollowLists = this.showFollowLists.map((showFollowList) => {
          return userId === showFollowList.followId
            ? {
                ...showFollowList,
                isFollowing: !showFollowList.isFollowing,
              }
            : showFollowList;
        });
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
        this.showFollowLists = this.showFollowLists.map((showFollowList) => {
          return userId === showFollowList.followId
            ? {
                ...showFollowList,
                isFollowing: !showFollowList.isFollowing,
              }
            : showFollowList;
        });
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

<style scoped lang="scss">
@import "./../assets/application.scss";

.follow-lists {
  border-right: $light-blue2 1px solid;
  .follow-list {
    &:hover {
      background: $gray-white3;
    }
    .follow-link {
      display: flex;
      position: relative;
      padding: 16px 23px 16px 35px;
      border-bottom: $light-blue2 1px solid;
      border-left: $light-blue2 1px solid;
      .user-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .follow-content {
        margin: 0 0 0 8px;
        width: 88%;
        .follow-name {
          margin: 7px 8px 0 0;
          font-weight: 700;
          color: $black;
          &:hover {
            text-decoration: underline;
          }
        }
        .account-time {
          color: $Secondary;
          font-size: 14px;
        }
        .follow-intro {
          margin: 15px 0 0 0;
          color: $black;
          line-height: 26px;
          overflow-wrap: break-word;
        }
      }
      .btn-follow {
        position: absolute;
        top: 16px;
        right: 30px;
        @extend %btn-style;
        width: 96px;
      }
      .btn-unfollow {
        position: absolute;
        top: 16px;
        right: 30px;
        @extend %btn-unfollowed-style;
        width: 64px;
      }
    }
  }
}

@media screen and (min-width: 575px) {
  .follow-link {
    padding: 16px 23px 16px 23px;
  }
}
</style>