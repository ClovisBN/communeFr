<template>
    <div class="sidebar">
        <ul class="nav">
            <li class="nav-item">
                <a class="nav-link" href="/">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/forms">Forms</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/about">About</a>
            </li>
            <!-- Ajoutez d'autres liens ici -->
        </ul>
    </div>
</template>

<script>
export default {
    name: "SideBar",
};
</script>

<style scoped>
.sidebar {
    width: 180px;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background-color: #121212;
    padding-top: 20px;
    border-right: 1px solid rgb(0, 0, 0);
}

.nav {
    list-style-type: none;
    padding: 0;
}

.nav-item {
    margin: 5px 10px;
}

.nav-link {
    color: #fff;
    text-decoration: none;
    padding: 5px 10px;
    display: block;
    border-radius: 5px;
}

.nav-link:hover {
    background-color: #fbfbfb20;
}
</style>
