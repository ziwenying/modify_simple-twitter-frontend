<template>
  <div class="users-list">
    <h4 class="title">使用者列表</h4>
    <div class="cards-panel row">
      <div class="col-3 p-0" v-for="user in initialUsers" :key="user.id">
        <div class="user-card">
          <div class="background-img">
            <img :src="user.cover" alt="background-image" />
          </div>
          <img class="avatar" :src="user.avatar" alt="avatar" />
          <div class="card-content">
            <div class="name">
              <p :title="user.name">{{ user.name }}</p>
            </div>
            <div class="account">
              <p :title="`@${user.account}`">@{{ user.account }}</p>
            </div>
            <div class="tweets-likes">
              <div class="tweets-count">
                <img
                  class="pen-icon icon"
                  src="~@/assets/image/pen.png"
                  alt="pen-icon"
                />
                <span class="tweets-total">{{
                  user.tweetCount | displayCount
                }}</span>
              </div>
              <div class="likes-count">
                <img
                  class="like-icon icon"
                  src="~@/assets/image/heart.png"
                  alt="like-icon"
                />
                <span class="likes-total">{{
                  user.likeCount | displayCount
                }}</span>
              </div>
            </div>
            <div class="followings-followers">
              <div class="followings">
                <span class="followings-quantity"
                  >{{ user.followingCount | displayCount }}&nbsp;個</span
                ><span>跟隨中</span>
              </div>
              <div class="followers">
                <span class="followers-quantity"
                  >{{ user.followerCount | displayCount }}&nbsp;位</span
                ><span>跟隨者</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "AdminUserCards",
  props: {
    initialUsers: {
      type: Array,
      required: true,
    },
  },
  filters: {
    // 更改數字顯示
    displayCount(num) {
      // 數字大於100萬, 顯示M
      if (num >= 1000000 && num % 1000000 === 0) {
        return `${num * 0.000001}M`;
      } else if (num > 1000000) {
        return `${(num * 0.000001).toFixed(1)}M`;
        // 數字大於1000, 顯示k
      } else if (num % 1000 === 0 && num !== 0) {
        return `${num * 0.001}k`;
      } else if (num > 1000) {
        return `${(num * 0.001).toFixed(1)}k`;
        // 數字小於1000, 直接顯示
      } else {
        return num;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./../assets/application.scss";

.users-list {
  max-width: 100vw;
  padding-left: 15px;
  border-left: 1px solid $light-blue2;

  .title {
    font-size: 24px;
    font-weight: 700;
    padding: 24px 0 24px 24px;
    border-bottom: 1px solid $light-blue2;
  }
  .cards-panel {
    padding-top: 16px;
    margin: 0 0 0 7px;
    .user-card {
      position: relative;
      min-width: 100px;
      height: 360px;
      margin: 8px;
      background-color: $card-background-color;
      border-radius: 10px;
      .background-img {
        img {
          width: 100%;
          height: 100px;
          border-radius: 10px 10px 0 0;
        }
      }
      .avatar {
        position: absolute;
        left: 50%;
        top: 64px;
        // 頭像水平置中
        transform: translateX(-50%);
        height: 70px;
        width: 70px;
        border-radius: 50%;
        border: 4px solid $white;
      }
      .card-content {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 18px;
        padding-top: 10px;
        .name {
          width: 100%;
          text-align: center;
          p {
            height: 26px;
            font-size: 16px;
            font-weight: 700;
            color: $black;
            overflow: hidden; // 超過隱藏
            text-overflow: ellipsis; //超過的內容用...顯示
            display: -webkit-box;
            -webkit-line-clamp: 1; // 超過一行省略
            -webkit-box-orient: vertical;
          }
        }
        .account {
          width: 100%;
          text-align: center;
          p {
            font-size: 14px;
            font-weight: 400;
            color: $gray4;
            &:hover {
              width: auto;
            }
          }
        }
        .tweets-likes {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 10px;
          width: 139px;
          justify-content: space-between;
          .icon {
            height: 20px;
            width: 20px;
            display: inline-block;
          }
          .tweets-total,
          .likes-total {
            font-family: "Montserrat", sans-serif;
            font-size: 16px;
            font-weight: 500;
            color: $black;
            margin-left: 8px;
          }
        }
        .followings-followers {
          width: 100%;
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .followings {
            margin-right: 8px;
          }
          span {
            font-size: 14px;
            font-weight: 400;
            color: $gray4;
            &.followings-quantity,
            &.followers-quantity {
              color: $black;
            }
          }
        }
      }
    }
  }
}

@media screen and (min-width: 575px) {
  .users-list {
    .cards-panel {
      .user-card {
        height: 314px;
        .background-img {
          img {
            height: 140px;
          }
        }
        .avatar {
          height: 100px;
          width: 100px;
        }
        .card-content {
          .tweets-likes {
            flex-direction: row;
          }
          .followings-followers {
            flex-direction: row;
            justify-content: space-evenly;
          }
        }
      }
    }
  }
}
</style>