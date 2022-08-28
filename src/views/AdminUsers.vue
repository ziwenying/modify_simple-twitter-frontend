<template>
  <div class="admin-users-wrapper row">
    <Navbar class="col-2 pl-0" />
    <!-- <div>後台使用者列表</div> -->
    <Spinner v-if="isLoading" class="col-10 p-0" />
    <AdminUserCards v-else class="col-10 p-0" :initial-users="users" />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import AdminUserCards from "./../components/AdminUserCards.vue";
import Spinner from "./../components/Spinner.vue";
import adminAPI from "./../apis/admin";
import { Toast } from "./../utils/helpers";
export default {
  name: "AdminUsers",
  components: {
    Navbar,
    AdminUserCards,
    Spinner,
  },
  data() {
    return {
      users: [],
      isLoading: true,
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        this.isLoading = true;
        const response = await adminAPI.users.get();
        const { data } = response;
        if (response.statusText !== "OK") {
          throw new Error(data.message);
        }
        this.users = data;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = true;
        console.error(error.message);
        Toast.fire({
          icon: "error",
          title: "無法取得使用者清單資料，請稍後再試",
        });
      }
    },
  },
};
</script>