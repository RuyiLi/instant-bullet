<template lang="pug">

    section.section.has-text-centered.py-0
        video#player.is-hidden(
            :src='`/src/assets/${this.$route.params.songName}.mp4`' 
            @play='playVideo' @loadeddata='resizeCanvas'
            autoplay
        )
        div#overlay
        canvas#game(@mousemove='updateMousePosition')
        h1#miss-counter {{ misses }}X
        div.beat#first-beat
        div.beat#second-beat
        h1#song-name

</template>

<script>
const radius = 6;

const songData = {
    badapple: {
        name: 'Bad Apple!!',
        bpm: 140,
        startDelay: 1300,
    },
    chuuni: {
        name: 'Sparkling Daydream',
        bpm: 175,
        startDelay: 500,
    },
    worldexecuteme: {
        name: 'world.execute(me);',
        bpm: 140,
        startDelay: 0,
    }
}

export default {
    name: 'song-view',
    data: () => ({
        loading: true,
        misses: 0,
        x: 0,
        y: 0,
        colors: [
            [ 0, 0, 0 ],
            [ 255, 255, 255 ],
        ],
        mode: 0,
        tolerance: 127,
        bpm: 140,
        startDelay: 1000,
        songName: 'Song',
    }),
    computed: {
        player: () => document.querySelector('video#player'),
        canvas: () => document.querySelector('canvas#game'),
        overlay: () => document.querySelector('div#overlay'),
        beats: () => document.querySelectorAll('div.beat'),
        songNameText: () => document.querySelector('h1#song-name'),
        currentColor: function () {
            return this.colors[this.mode];
        }
    },
    mounted () {
        let file = this.$route.params.file;
        if (typeof file !== 'undefined') {
            this.player.src = URL.createObjectURL(this.$route.params.file);
        } else {
            file = { name: this.$route.params.songName };
        }
        const { startDelay, bpm, name } =  songData[file.name.replace('.mp4', '')];
        this.startDelay = startDelay;
        this.bpm = bpm;
        this.songName = name;
        this.player.crossOrigin = 'anonymous';
        document.addEventListener('keydown', this.maybeSwitchModes.bind(this));
    },
    methods: {
        resizeCanvas () {
            const missCounter = document.querySelector('h1#miss-counter');

            const documentHeight = document.body.clientHeight;
            this.canvas.width = documentHeight * this.player.videoWidth / this.player.videoHeight;
            this.canvas.height = documentHeight;
            
            const left = this.canvas.offsetLeft - this.canvas.width / 2;
            this.canvas.style.left = `${left}px`;

            missCounter.style.cssText = `
                left: ${this.canvas.offsetLeft + 21}px;
            `;
        },
        colorWithin (c1, c2) {
            return Math.sqrt(
                (c1[0] - c2[0]) ** 2 + 
                (c1[1] - c2[1]) ** 2 + 
                (c1[2] - c2[2]) ** 2
            ) <= this.tolerance;
        },
        maybeSwitchModes (evt) {
            if (evt.code === 'KeyX') {
                overlay.style.transform = `
                    rotate(10deg)
                    translateY(-${100 * this.mode}%)
                `;
                this.mode = 1 - this.mode;
                // overlay.style.backgroundColor = `rgb(${this.currentColor.join(',')})`;
            }
        },
        updateMousePosition (evt) {
            this.x = evt.pageX - this.canvas.offsetLeft;
            this.y = evt.pageY - this.canvas.offsetTop;
        },
        playVideo () {
            this.songNameText.innerText = this.songName;
            this.songNameText.style.clipPath = 'inset(0 0 0 0)';
            console.log(this.songNameText.style.clipPath);
            setTimeout(() => {
                this.songNameText.style.clipPath = 'inset(0 0 0 100%)';
            }, 2000);
            
            const { player: video, canvas } = this;
            const ctx = canvas.getContext('2d');

            ctx.shadowBlur = 10;
            ctx.shadowColor = ctx.fillStyle = 'red';

            let beatSize = 0;
            const checkHit = () => {
                setTimeout(checkHit, 60 * 1000 / this.bpm);
                const hoverColor = ctx.getImageData(this.x, this.y, 1, 1).data;
                if (!this.colorWithin(hoverColor, this.currentColor)) {
                    this.misses++;
                }
                beatSize = 100;
            }
            setTimeout(checkHit, this.startDelay);

            const drawVideo = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (!video.ended) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    // ctx.beginPath();
                    // ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
                    // ctx.fill();
                    if (beatSize) beatSize += 1;
                    this.beats[0].style.transform = this.beats[1].style.transform = `scale(${beatSize / 100})`;
                    requestAnimationFrame(drawVideo);
                }
            };
            
            drawVideo();
        }
    }
}
</script>

<style lang="scss">

    @import '../scss/variables';
    @import '../scss/mixins';

    html, body {
        padding: 0;
        margin: 0;
        overflow: hidden;
        background: black !important;
    }

    canvas {
        position: fixed;
        top: 0;
        left: 50%;
        cursor: url('../assets/img/cursor.png') 32 32, crosshair;
        z-index: 2;
    }

    h1#song-name {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: .7s;
        clip-path: inset(0 100% 0 0);
        will-change: clip-path;
        z-index: 999;
        font-size: 4rem;
        padding: 0.5rem 1rem;
        // background-color: black;
        mix-blend-mode: difference;
        color: $white;
        pointer-events: none;
    }

    div#overlay {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        transform: rotate(10deg) translateY(-100%);
        transition: .2s;
        background: white;
        z-index: 1;
        will-change: transform;
    }

    #miss-counter {
        position: absolute;
        bottom: 5px;
        font-weight: 200;
        font-size: 3rem;
        pointer-events: none;
        mix-blend-mode: difference;
        color: $white;
        z-index: 3;
    }

    div.beat {
        $size: 100px;
        position: fixed;
        top: calc(50% - #{$size} / 2);
        width: $size;
        height: $size;
        border-radius: $size;
        background-color: white;
        mix-blend-mode: difference;
        z-index: 999;
        transform-origin: center;
        pointer-events: none;

        &#first-beat {
            left: 5%;
        }

        &#second-beat {
            right: 5%;
        }
    }

</style>