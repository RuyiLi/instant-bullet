<template lang="pug">

    div
        router-link#home(to='/') 
            b-icon(icon='home' size='is-small')
            p.is-inline.ml-3 Home

        transition(name='slide')
            router-view

</template>

<style lang="scss">

    // @import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
    @import '~bulma/sass/utilities/_all';
    @import './scss/variables';
    @import './scss/mixins';
    @import '~bulma';
    @import '~buefy/src/scss/buefy';

    body {
        font-family: $family-monospace;
        min-height: 100vh;
    }

    #home {
        @include neon($blue, 'flicker-blue');

        position: fixed;
        top: 15px;
        left: 15px;
        width: 100px;
        z-index: 999;
    }
    
</style>