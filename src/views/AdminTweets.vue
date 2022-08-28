<template>
  <div class="admin-tweets-wrapper row">
    <Navbar class="col-2 pl-0" />
    <!-- <div>後台推文清單</div> -->
    <Spinner class="col-10" v-if="isLoading" />
    <AdminTweetsList
      v-else
      class="col-10"
      :initial-tweets="tweets"
      @after-delete-tweet="afterTweetDelete"
    />
  </div>
</template>
<script>
import Navbar from "../components/Navbar.vue";
import AdminTweetsList from "./../components/AdminTweetsList.vue";
import adminAPI from "./../apis/admin";
import { Toast } from "./../utils/helpers";
import Spinner from "./../components/Spinner.vue";

export default {
  name: "AdminTweets",
  components: {
    Navbar,
    AdminTweetsList,
    Spinner,
  },
  data() {
    return {
      tweets: [],
      isLoading: true,
    };
  },
  created() {
    this.fetchTweets();
  },
  methods: {
    async fetchTweets() {
      try {
        this.isLoading = true;
        const { data } = await adminAPI.tweets.get();
        if (data.status === "error") {
          throw new Error(data.message);
        }
        this.tweets = data;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法取得推文清單資料，請稍後再試",
        });
      }
    },
    // 刪除tweet
    afterTweetDelete(tweetId) {
      // 過濾掉要刪除的tweet
      this.tweets = this.tweets.filter((tweet) => tweet.id !== tweetId);
    },
  },
};
</script>
