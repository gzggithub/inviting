<template>
    <div id="app">
        <!-- <img src="./assets/logo.png"> -->
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App'
    };
</script>

<style>
    #app {
        font-family: 'PingFangSC-Medium', Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale
    }
</style>
