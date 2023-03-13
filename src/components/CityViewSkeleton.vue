<template>
  <div class="flex flex-col flex-1">
    <div class="flex flex-col py-12 items-center">
      <AnimatedPlaceholder class="max-w-[300px] w-full mb-4" />
      <AnimatedPlaceholder class="max-w-[200px] w-full mb-12" />
      <AnimatedPlaceholder class="max-w-[100px] w-full mb-12" />
      <AnimatedPlaceholder class="max-w-[100px] w-full mb-8" />
      <AnimatedPlaceholder class="max-w-[100px] w-full mb-10" />
      <AnimatedPlaceholder class="max-w-[80px] h-[80px] rounded-full w-full mb-10" />
    </div>
    <div class="flex flex-col py-12 items-center">
      <AnimatedPlaceholder class="max-w-screen-md h-[100px] w-full mb-10" />
    </div>
  </div>
</template>

<script setup>
import AnimatedPlaceholder from './AnimatedPlaceholder.vue';
</script>