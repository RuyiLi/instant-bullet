<template lang="pug">
    
    section.section
        h1.title.is-size-1.has-text-centered.py-5.has-text-white.glitch(data-text="INSTANT BULLET").
            INSTANT BULLET
        h2.subtitle.has-text-danger.has-text-centered.mb-0 ⚠️ Epilepsy Warning: Flashing Colors ⚠️
        h3.subtitle.has-text-info.has-text-centered.is-size-6.py-1 If the game is lagging, try refreshing the window
        div.columns.mt-2
            div.column
            div.column.is-5
                h2.subtitle Song list
                div.columns.has-text-grey#headings
                    div.column Artists
                    div.column Name
                    div.column.is-2 Length
                div#song-list
                    router-link.song.neon-button.columns.is-vcentered(to='/songs/badapple')
                        div.column Alstroemeria Records ft. Nomico
                        div.column Bad Apple!!
                        div.column.is-narrow 3:39
                    router-link.song.neon-button.columns.is-vcentered(to='/songs/1000000times')
                        div.column MY FIRST STORY ft. chelly from EGOIST
                        div.column 1,000,000 TIMES
                        div.column.is-narrow 1:28
            div.column.is-1
            div.column.is-3#upload-song
                h2.subtitle ...or upload your own
                b-field
                    b-upload(drag-drop expanded accept='.mp4' @input='uploadSong')
                        section.section
                            div.content.has-text-centered
                                p
                                    b-icon(icon='upload' size='is-large')
                                p Upload .mp4
            div.column

</template>

<script>
export default {
    mounted () {
        document.body.style.background = '#181818';
    },
    methods: {
        uploadSong (file) {
            console.log(1, file.name);
            this.$router.push({  
                name: 'custom-song', 
                params: { file },
            });
        },
    }
}
</script>

<style lang="scss">
    @use 'sass:color';
    @import '../scss/variables';
    @import '../scss/mixins';

    $button-color: $red;

    .neon-button {
        @include neon($button-color, 'flicker-red');
    }

    body {
        background: $black;
    }

    div#song-list, div#headings {
        margin-left: 0;
        margin-right: 0;
    }

    .song {
        padding: 10px;

        &:hover {
            div.column:nth-child(1) {
                box-shadow: none;
            }
        }

        div.column:nth-child(1) {
            $glow-color: color.scale($button-color, $lightness: 5%);
            background: $button-color;
            color: $white;
            text-shadow: 0 0 $glow-spread / 2 white;
            box-shadow: inset 0 0 $glow-spread $glow-color, 0 0 $glow-spread * 4 $glow-color;
            flex: 0.9;
            margin-right: 20px;
        }
        
        div.column:nth-child(2) {
            font-size: 1.4rem;
        }

        + .song {
            margin-top: 20px;
        }
    }

</style>