import { apiHelper } from "../utils/helpers";
const getToken = () => localStorage.getItem('token')

export default {
  tweets: {
    get() {
      return apiHelper.get('/tweets', {
        headers: { Authorization : `Bearer ${getToken()}`  }
      })
    },
    delete({tweetId}) {
      return apiHelper.delete(`/admin/tweets/${tweetId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    }
  },
  users: {
    get() {
      return apiHelper.get('/admin/users', {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    }
  }
}