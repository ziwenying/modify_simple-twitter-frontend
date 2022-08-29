<template>
  <div class="reply-lists">
    <div class="reply-list" v-for="reply in replies" :key="reply.id">
      <router-link
        :to="{ path: `/users/${$route.params.id}/tweets` }"
        class="tweet-link"
      >
        <img class="user-avatar" :src="reply.avatar" alt="user-avatar" />
      </router-link>
      <div class="reply-content">
        <div class="reply-title">
          <router-link :to="{ path: `/users/${$route.params.id}/tweets` }">
            <p class="name">{{ reply.name }}</p>
          </router-link>
          <router-link :to="{ path: `/users/${$route.params.id}/tweets` }">
            <p class="account">@{{ reply.account }}</p>
          </router-link>
          <p class="time">&nbsp;‧&nbsp;{{ reply.createdAt | fromNow }}</p>
        </div>
        <div class="reply-who">
          <p class="reply">回覆</p>
          <p v-if="!reply.targetAccount" class="no-account">"此推文已被刪除"</p>
          <router-link v-else :to="{ path: `/users/${reply.targetId}/tweets` }">
            <p class="account">@{{ reply.targetAccount }}</p>
          </router-link>
        </div>
        <p class="text">
          {{ reply.comment }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { fromNowFilter } from "./../utils/mixins";
import { Toast } from "./../utils/helpers";
import usersAPI from "./../apis/users";

export default {
  name: "Replies",
  mixins: [fromNowFilter],
  data() {
    return {
      replies: [],
    };
  },
  beforeRouteUpdate(to, from, next) {
    // 監聽路由
    const { id } = to.params;
    this.fetchReplies(id);
    next();
  },
  created() {
    const { id } = this.$route.params;
    this.fetchReplies(id);
  },
  methods: {
    async fetchReplies(id) {
      try {
        const response = await usersAPI.getTheUserReplies({
          userId: id,
        });
        if (response.statusText !== "OK") {
          throw new Error("無法取得留言資料，請稍後再試");
        }

        this.replies = response.data;
        // 資料拆層
        this.replies = this.replies.map((reply) => {
          return {
            id: reply.id,
            avatar: reply.User.avatar,
            name: reply.User.name,
            account: reply.User.account,
            createdAt: reply.createdAt,
            comment: reply.comment,
            targetAccount: reply.Tweet.User.account,
            targetId: reply.Tweet.User.id,
          };
        });
      } catch (error) {
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法取得留言資料，請稍後再試",
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "./../assets/application.scss";

.reply-lists {
  overflow-y: scroll;
  max-height: 400px;
  border-left: $light-blue2 1px solid;
  border-right: $light-blue2 1px solid;

  .reply-list {
    display: flex;
    width: 100%;
    padding: 16px 23px 16px 23px;
    border-bottom: $light-blue2 1px solid;

    .user-avatar {
      margin: 0 0 0 24px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .reply-content {
      width: 80%;
      overflow-wrap: anywhere;
      margin: 0 0 0 8px;
      .reply-title {
        width: 100%;
        display: flex;
        align-items: center;
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
      .reply-who {
        width: 100%;
        display: flex;
        .reply {
          color: $Secondary;
        }
        .account {
          margin: 0 0 0 8px;
          color: $brand-color;
        }
        .no-account {
          margin: 0 0 0 8px;
        }
        .account:hover {
          text-decoration: underline;
        }
      }
      .text {
        width: 100%;
        line-height: 26px;
      }
      .reply-who,
      .text {
        margin: 8px 0 0 0;
      }
    }
  }
}
@media screen and (min-width: 575px) {
  .reply-lists {
    .reply-list {
      .user-avatar {
        margin: 0;
      }
      .reply-content {
        width: 90%;
      }
    }
  }
}
</style>