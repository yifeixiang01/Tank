<script setup>
import { onUnmounted } from 'vue';
import * as Phaser from 'phaser'
import MainGame from '@/main/MainGame.js'


const gameWidth = 600
const gameHeight = 500

const game = new Phaser.Game({
  type: Phaser.AUTO,
  pixelArt: true,
  backgroundColor: '0x7F7F7F',
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game-wrap',
    width: gameWidth,
    height: gameHeight,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0
      }
    },
    arcade: {
      debug: false
    }
  },
  scene: [
    new MainGame()
  ]
})

onUnmounted(() => {
  game.destroy(true)
})
</script>

<template>
  <div id="game-wrap">

  </div>
</template>

<style scoped>
  
</style>
