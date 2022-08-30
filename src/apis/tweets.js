import { apiHelper } from "../utils/helpers";

export default {
  tweets: {
    getTweets() {
      return apiHelper.get(`/tweets`)
    },
    getOneTweet({ tweetId }) {
      return apiHelper.get(`/tweets/${tweetId}`)
    },
    getUsersTweets({ userId }) {
      return apiHelper.get(`/users/${userId}/tweets`)
    },
    create({ userId, description }) {
      return apiHelper.post(`/tweets`, { userId, description })
    },
    addLiked({ tweetId }) {
      return apiHelper.post(`/tweets/${tweetId}/like`, null)
    },
    deleteLiked({ tweetId }) {
      return apiHelper.post(`/tweets/${tweetId}/unlike`, null)
    },
    createReply({ tweetId, comment }) {
      return apiHelper.post(`tweets/${tweetId}/replies`, { tweetId, comment })
    },
  },
  replies: {
    getReplies({ tweetId }) {
      return apiHelper.get(`/tweets/${tweetId}/replies`)
    },
  }
}