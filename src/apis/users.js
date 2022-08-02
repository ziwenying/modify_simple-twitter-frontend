import { apiHelper } from "../utils/helpers";
const getToken = () => localStorage.getItem('token')

export default {
  getCurrentUser() {
    return apiHelper.get('/users/currentUser', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  addLiked({ tweetId }) {
    return apiHelper.post(`/tweets/${tweetId}/like`, null, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  deleteLiked({ tweetId }) {
    return apiHelper.post(`/tweets/${tweetId}/unlike`, null, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
}