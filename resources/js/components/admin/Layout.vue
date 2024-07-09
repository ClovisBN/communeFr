<template>
    <div class="layout-user">
        <!-- <SideBar @toggle-sidebar="handleSidebarToggle" /> -->
        <div class="content">
            <router-view :is-sidebar-closed="isSidebarClosed" />
        </div>
    </div>
</template>

<script>
import SideBar from "./SideBar.vue";

export default {
    name: "AdminLayout",
    components: {
        SideBar,
    },
    data() {
        return {
            isSidebarClosed: false,
        };
    },
    methods: {
        handleSidebarToggle(isClosed) {
            this.isSidebarClosed = isClosed;
        },
    },
};
</script>

<style scoped>
.layout-user {
    display: flex;
    flex-direction: row;
    height: 100vh;
}

.content {
    flex-grow: 1;
}
</style>
