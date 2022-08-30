import { apiHelper } from "../utils/helpers";

export default {
  getCurrentUser() {
    return apiHelper.get('/users/currentUser')
  },
  getTopUser() {
    return apiHelper.get('/followships')
  },
  getFollowers({ userId }) {
    return apiHelper.get(`/users/${userId}/followers`)
  },
  getFollowings({ userId }) {
    return apiHelper.get(`/users/${userId}/followings`)
  },
  addfollowed({ id }) {
    return apiHelper.post(`/followships`, { id })
  },
  deletefollowed({ userId }) {
    return apiHelper.delete(`/followships/${userId}`)
  },
  getTheUser({ userId }) {
    return apiHelper.get(`/users/${userId}`)
  },
  getTheUserReplies({ userId }) {
    return apiHelper.get(`/users/${userId}/replied_tweets`)
  },
  getTheUserTweets({ userId }) {
    return apiHelper.get(`/users/${userId}/tweets`)
  },
  getTheLikeTweets({ userId }) {
    return apiHelper.get(`/users/${userId}/likes`)
  },
  update({ userId, formData }) {
    return apiHelper.put(`/users/${userId}`, formData)
  },
}

