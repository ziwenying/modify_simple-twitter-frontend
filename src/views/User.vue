<template>
  <div class="row outer-user-wrapper">
    <!--component Navbar -->
    <Navbar
      class="main-nav"
      :class="{ 'col-2': fullWidth > 574, 'd-none': fullWidth <= 574 }"
    />
    <Spinner v-if="isLoading" class="col-7" />
    <div class="user-page" :class="{ 'col-7': fullWidth > 574 }" v-else>
      <div class="user-outer">
        <div class="reply-lists-title">
          <router-link :to="{ name: 'main-page' }">
            <img class="arrow" src="~@/assets/image/arrow.png" alt="arrow" />
          </router-link>
          <div class="name-tweet">
            <p class="name">{{ targetProfile.name }}</p>
            <p class="tweet-count">{{ targetProfile.tweetCount }} 推文</p>
          </div>
        </div>
        <!-- component UserProfileCard.vue -->
        <UserProfileCard
          :targetProfile="targetProfile"
          :initialChangeFollow="followShip"
          @change-follow-ship="changeFollowShip"
        />
        <!-- component UserNavPills.vue -->
        <UserNavPills />
        <!-- view MainTweets.vue or Replies.vue or likedTweets.vue -->
        <router-view
          :theTweetId="theTweetId"
          @after-click-reply="afterClickReply"
          class="scrollbar bottom-lists"
        />
      </div>
    </div>
    <!--component Populars -->
    <Populars
      class="col-3 popular"
      @change-profile-follow="changeProfilePopular"
      :class="{ 'col-3': fullWidth > 574, 'd-none': fullWidth <= 574 }"
    />
    <!-- component UserEditModal -->
    <UserEditModal
      @after-submit-profile="afterSubmitProfile"
      :initialTargetProfile="targetProfile"
    />
    <CreateTweetModal />
    <ReplyModal
      @user-after-submit-reply="userAfterSubmitReply"
      :replyModalData="replyModalData"
    />
    <MobileNavbar class="mobile-navbar" />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import MobileNavbar from "../components/MobileNavbar.vue";
import UserProfileCard from "../components/UserProfileCard.vue";
import UserNavPills from "../components/UserNavPills.vue";
import Populars from "../components/Populars.vue";
import UserEditModal from "../components/UserEditModal.vue";
import CreateTweetModal from "../components/CreateTweetModal.vue";
import ReplyModal from "../components/ReplyModal.vue";
import Spinner from "./../components/Spinner.vue";
import { mapState } from "vuex";
import { Toast } from "./../utils/helpers";
import usersAPI from "./../apis/users";

export default {
  name: "User",
  components: {
    Navbar,
    UserProfileCard,
    UserNavPills,
    Populars,
    UserEditModal,
    ReplyModal,
    CreateTweetModal,
    Spinner,
    MobileNavbar,
  },
  computed: {
    ...mapState(["currentUser", "topPopular"]),
  },
  data() {
    return {
      targetProfile: {
        id: -1,
        account: "",
        email: "",
        name: "",
        avatar: "",
        cover: "",
        introduction: "",
        role: "",
      },
      replyModalData: {},
      followingList: [],
      followShip: false,
      isLoading: true,
      theTweetId: -1, //及時增加留言數使用
      fullWidth: 0,
    };
  },
  beforeRouteUpdate(to, from, next) {
    // 監聽路由
    const { id } = to.params;
    this.fetchProfile(id);
    this.fetchFollowings(this.currentUser.id);
    next();
  },
  created() {
    //透過 id 取得指定使用者的資料
    const { id } = this.$route.params;
    this.fetchProfile(id);
    this.$store.dispatch("fetchPopular");
    this.fetchFollowings(this.currentUser.id);
  },
  mounted() {
    this.fullWidth = window.innerWidth;
    // window.onresize 及時監聽視窗大小
    window.onresize = () => {
      this.fullWidth = window.innerWidth;
    };
  },
  destroyed() {
    // 元件銷毀要 解綁事件
    window.onresize = null;
  },
  methods: {
    async fetchProfile(userId) {
      try {
        this.isLoading = true;
        const response = await usersAPI.getTheUser({ userId });
        if (response.statusText !== "OK") {
          throw new Error("無法取得使用者資料，請稍後再試");
        }
        const {
          id,
          account,
          email,
          name,
          avatar,
          cover,
          introduction,
          role,
          followerCount,
          followingCount,
          tweetCount,
        } = {
          id: response.data.id,
          account: response.data.account,
          email: response.data.email,
          name: response.data.name,
          avatar: response.data.avatar,
          cover: response.data.cover,
          introduction: !response.data.introduction
            ? ""
            : response.data.introduction,
          role: response.data.role,
          followerCount: response.data.followerCount,
          followingCount: response.data.followingCount,
          tweetCount: response.data.tweetCount,
        };
        this.targetProfile = {
          id,
          account,
          email,
          name,
          avatar,
          cover,
          introduction,
          role,
          followerCount,
          followingCount,
          tweetCount,
        };
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法取得使用者資料，請稍後再試",
        });
      }
    },
    afterClickReply(payload) {
      // 點擊回覆，顯示 modal 使用的資料
      const { id, description, User, createdAt } = payload;
      this.replyModalData = {
        id,
        description,
        userName: User.name,
        userAccount: User.account,
        userAvatar: User.avatar,
        createdAt: createdAt,
      };
    },
    userAfterSubmitReply(id) {
      //即時顯示留言數字 + 1
      this.theTweetId = id;
    },
    async afterSubmitProfile(formData) {
      try {
        const response = await usersAPI.update({
          userId: this.currentUser.id,
          formData,
        });
        // 更新後的資料，渲染用
        if (response.statusText !== "OK") {
          throw new Error("無法編輯個人資料，請稍後再試");
        }
        // 及時更新圖
        const data = response.data;
        const { name, avatar, cover, introduction } = {
          name: data.name,
          avatar: data.avatar,
          cover: data.cover,
          introduction: data.introduction,
        };
        this.targetProfile = {
          ...this.targetProfile,
          name,
          avatar,
          cover,
          introduction,
        };
        Toast.fire({
          icon: "success",
          title: "個人資料編輯成功",
        });
      } catch (error) {
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法編輯個人資料，請稍後再試",
        });
      }
    },
    async fetchFollowings(userId) {
      // 這邊為了個人頁面的追蹤按鈕
      try {
        const response = await usersAPI.getFollowings({ userId });
        const { data } = response;
        if (response.statusText !== "OK") {
          throw new Error(data.message);
        }
        this.followingList = data;
        const followingShip = this.followingList.find(
          (following) => following.followingId === Number(this.$route.params.id)
        );
        this.followShip = !!followingShip; //可以判斷 true 正在追蹤，傳到 UserProfileCard 使用
      } catch (error) {
        console.error(error.message);
      }
    },
    changeProfilePopular(change) {
      // 個人頁面的追蹤按鈕
      // popular 傳回來的 change 物件包含 id 和 改變狀態 true or false
      const userId = change.userId;
      const { id } = this.$route.params;
      // 如果目前是在別人的個人頁面: 如果popular改動的追蹤按鈕使用者id跟當前個人頁面id相符合, 才改變按鈕狀態
      if (userId === Number(id)) {
        this.followShip = change.change;
        // 改變user profile頁面的跟隨中與跟隨者人數
        if (this.followShip === true) {
          this.targetProfile = {
            ...this.targetProfile,
            followerCount: this.targetProfile.followerCount + 1,
          };
        } else if (this.followShip === false) {
          this.targetProfile = {
            ...this.targetProfile,
            followerCount: this.targetProfile.followerCount - 1,
          };
        }
        // 如果是在自己的個人頁面: 追蹤中人數相應改變
      } else if (userId !== Number(id) && Number(id) === this.currentUser.id) {
        if (change.change === true) {
          this.targetProfile = {
            ...this.targetProfile,
            followingCount: this.targetProfile.followingCount + 1,
          };
        } else if (change.change === false) {
          this.targetProfile = {
            ...this.targetProfile,
            followingCount: this.targetProfile.followingCount - 1,
          };
        }
      }
    },
    changeFollowShip(payload) {
      this.followShip = payload;
      // 在"別人"的個人頁面按下追蹤或退追按鈕, 下方的追隨者人數會相應變化
      if (this.followShip === true) {
        this.targetProfile = {
          ...this.targetProfile,
          followerCount: this.targetProfile.followerCount + 1,
        };
      } else if (this.followShip === false) {
        this.targetProfile = {
          ...this.targetProfile,
          followerCount: this.targetProfile.followerCount - 1,
        };
      }
    },
  },
};
</script>
<style scoped lang="scss">
@import "./../assets/application.scss";

.outer-user-wrapper {
  .user-page {
    .user-outer {
      .reply-lists-title {
        display: flex;
        align-items: center;
        height: 75px;
        background: $white;
        .arrow {
          margin: 0 0 0 28px;
          width: 14px;
          height: 14px;
          font-weight: 700;
        }
        .name-tweet {
          margin: 0 0 0 19px;
          .name {
            font-size: 18px;
            font-weight: 700;
          }
          .tweet-count {
            color: $Secondary;
            font-size: 13px;
          }
        }
      }
    }
  }
  .scrollbar {
    &::-webkit-scrollbar {
      width: 1px;
    }
  }
}

@media screen and (min-width: 575px) {
  .outer-user-wrapper {
    .user-page {
      .user-outer {
        .reply-lists-title {
          margin: 16px 0 17px 0;
        }
      }
    }
    .mobile-navbar {
      display: none;
    }
  }
}
</style>