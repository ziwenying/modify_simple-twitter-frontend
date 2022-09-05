(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d26810a6"],{1277:function(o,t,l){var a=l("ed35");a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[o.i,a,""]]),a.locals&&(o.exports=a.locals);var s=l("499e").default;s("059be750",a,!0,{sourceMap:!1,shadowMode:!1})},"369c":function(o,t,l){"use strict";l.r(t);var a=function(){var o=this,t=o._self._c;return t("Followers",{attrs:{followerList:o.followerList}})},s=[],i=(l("d9e2"),l("cd53")),e=l("2fa3"),d=l("4cce"),n={name:"UserFollowers",props:{changeFollow:{type:Boolean,required:!0}},components:{Followers:i["a"]},data(){return{followerList:[]}},watch:{changeFollow(){const{id:o}=this.$route.params;this.fetchFollowers(o)}},created(){const{id:o}=this.$route.params;this.fetchFollowers(o)},methods:{async fetchFollowers(o){try{const t=await d["a"].getFollowers({userId:o}),{data:l}=t;if("OK"!==t.statusText)throw new Error(l.message);0===l.length&&e["a"].fire({icon:"info",title:"您的追隨者清單是空的"}),this.followerList=l}catch(t){console.error(t.message),e["a"].fire({icon:"error",title:"無法取得追隨者資料"})}}}},r=n,c=l("2877"),f=Object(c["a"])(r,a,s,!1,null,null,null);t["default"]=f.exports},"6a2d":function(o,t,l){"use strict";l("1277")},cd53:function(o,t,l){"use strict";var a=function(){var o=this,t=o._self._c;return t("div",{staticClass:"follow-lists"},o._l(o.showFollowLists,(function(l){return t("div",{key:l.followId,staticClass:"follow-list"},[t("router-link",{staticClass:"follow-link",attrs:{to:{path:`/users/${l.followId}/tweets`}}},[t("img",{staticClass:"user-avatar",attrs:{src:l.avatar,alt:"user-avatar"}}),t("div",{staticClass:"follow-content"},[t("p",{staticClass:"follow-name"},[o._v(o._s(l.name))]),t("p",{staticClass:"follow-intro"},[o._v(" "+o._s(l.introduction)+" ")])]),l.isFollowing?t("button",{staticClass:"btn-follow",on:{click:function(t){return t.stopPropagation(),t.preventDefault(),o.deleteFollowed(l.followId)}}},[o._v(" 正在跟隨 ")]):o._e(),l.isFollowing?o._e():t("button",{staticClass:"btn-unfollow",on:{click:function(t){return t.stopPropagation(),t.preventDefault(),o.addFollowed(l.followId)}}},[o._v(" 跟隨 ")])])],1)})),0)},s=[],i=(l("d9e2"),l("2fa3")),e=l("4cce"),d=l("2f62"),n={name:"FollowerNavPills",props:{followerList:{type:Array,default:()=>[{followId:-1,followerId:-1,name:"",account:"",avatar:"",introduction:"",isFollowing:!1}]},followingList:{type:Array,default:()=>[{followId:-1,followingId:-1,name:"",account:"",avatar:"",introduction:"",isFollowing:!1}]}},computed:{...Object(d["b"])(["currentUser","topPopular"])},data(){return{showFollowLists:[]}},watch:{followerList(o){this.showFollowLists=[...o]},followingList(o){this.showFollowLists=[...o]}},created(){"user-followers"===this.$route.name?this.showFollowLists=this.followerList.length?this.followerList:[]:"user-followings"===this.$route.name&&(this.showFollowLists=this.followingList.length?this.followingList:[])},methods:{async addFollowed(o){try{const{data:t}=await e["a"].addfollowed({id:o});if("error"===t.status)throw new Error(t.message);this.showFollowLists=this.showFollowLists.map(t=>o===t.followId?{...t,isFollowing:!t.isFollowing}:t),this.$store.dispatch("fetchPopular"),i["a"].fire({icon:"success",title:"成功追蹤該使用者"})}catch(t){console.error(t.message),"Can not follow yourself."===t.message?i["a"].fire({icon:"warning",title:"不能追蹤自己唷！"}):i["a"].fire({icon:"error",title:"無法追蹤該使用者，請稍後再試"})}},async deleteFollowed(o){try{const{data:t}=await e["a"].deletefollowed({userId:o});if("error"===t.status)throw new Error(t.message);this.showFollowLists=this.showFollowLists.map(t=>o===t.followId?{...t,isFollowing:!t.isFollowing}:t),this.$store.dispatch("fetchPopular"),i["a"].fire({icon:"success",title:"已取消追蹤該使用者"})}catch(t){console.error(t.message),i["a"].fire({icon:"error",title:"無法取消追蹤該使用者，請稍後再試"})}}}},r=n,c=(l("6a2d"),l("2877")),f=Object(c["a"])(r,a,s,!1,null,"1334d9c0",null);t["a"]=f.exports},ed35:function(o,t,l){var a=l("24fb");t=a(!1),t.push([o.i,"@import url(https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap);"]),t.push([o.i,"@import url(https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap);"]),t.push([o.i,"body[data-v-1334d9c0]{margin:0;padding:0;font-family:Noto Sans TC,sans-serif}*[data-v-1334d9c0]{box-sizing:border-box}h1[data-v-1334d9c0],h2[data-v-1334d9c0],h3[data-v-1334d9c0],h4[data-v-1334d9c0],h5[data-v-1334d9c0],h6[data-v-1334d9c0],p[data-v-1334d9c0]{margin:0;padding:0}h1[data-v-1334d9c0],h2[data-v-1334d9c0]{font-weight:700}h3[data-v-1334d9c0],h4[data-v-1334d9c0],h5[data-v-1334d9c0]{font-weight:medium}h1[data-v-1334d9c0]{font-size:68px}h2[data-v-1334d9c0]{font-size:42px}h3[data-v-1334d9c0]{font-size:28px}h4[data-v-1334d9c0]{font-size:24px}h5[data-v-1334d9c0]{font-size:18px}li[data-v-1334d9c0],ol[data-v-1334d9c0],ul[data-v-1334d9c0]{list-style:none;margin:0;padding:0}a[data-v-1334d9c0],a[data-v-1334d9c0]:focus,a[data-v-1334d9c0]:hover{text-decoration:none}img[data-v-1334d9c0]{width:100%;height:100%;display:block}.btn[data-v-1334d9c0],a[data-v-1334d9c0]:focus,button[data-v-1334d9c0],button[data-v-1334d9c0]:focus,input[data-v-1334d9c0]:focus,select[data-v-1334d9c0],select[data-v-1334d9c0]:focus,textarea[data-v-1334d9c0]:focus{outline:0!important}button[data-v-1334d9c0]{background-color:transparent;border:0;cursor:pointer}button[disabled][data-v-1334d9c0]{pointer-events:none}input[data-v-1334d9c0]{padding:0}input[data-v-1334d9c0]:invalid,input[data-v-1334d9c0]:required{box-shadow:none}.d-none[data-v-1334d9c0]{display:none}.follow-lists .follow-list .follow-link .btn-follow[data-v-1334d9c0]{height:40px;background:#f60;color:#fff;border-radius:50px}.follow-lists .follow-list .follow-link .btn-unfollow[data-v-1334d9c0]{height:40px;background:#fff;color:#f60;border-radius:50px;border:1px solid #f60}.follow-lists[data-v-1334d9c0]{border-right:1px solid #e6ecf0}.follow-lists .follow-list[data-v-1334d9c0]:hover{background:#f1f1f5}.follow-lists .follow-list .follow-link[data-v-1334d9c0]{display:flex;position:relative;padding:16px 23px 16px 35px;border-bottom:1px solid #e6ecf0;border-left:1px solid #e6ecf0}.follow-lists .follow-list .follow-link .user-avatar[data-v-1334d9c0]{width:50px;height:50px;border-radius:50%}.follow-lists .follow-list .follow-link .follow-content[data-v-1334d9c0]{margin:0 0 0 8px;width:88%}.follow-lists .follow-list .follow-link .follow-content .follow-name[data-v-1334d9c0]{margin:7px 8px 0 0;font-weight:700;color:#171725}.follow-lists .follow-list .follow-link .follow-content .follow-name[data-v-1334d9c0]:hover{text-decoration:underline}.follow-lists .follow-list .follow-link .follow-content .account-time[data-v-1334d9c0]{color:#6c757d;font-size:14px}.follow-lists .follow-list .follow-link .follow-content .follow-intro[data-v-1334d9c0]{margin:15px 0 0 0;color:#171725;line-height:26px;overflow-wrap:break-word}.follow-lists .follow-list .follow-link .btn-follow[data-v-1334d9c0]{position:absolute;top:16px;right:30px;width:96px}.follow-lists .follow-list .follow-link .btn-unfollow[data-v-1334d9c0]{position:absolute;top:16px;right:30px;width:64px}@media screen and (min-width:575px){.follow-link[data-v-1334d9c0]{padding:16px 23px 16px 23px}}",""]),o.exports=t}}]);
//# sourceMappingURL=chunk-d26810a6.04d50833.js.map