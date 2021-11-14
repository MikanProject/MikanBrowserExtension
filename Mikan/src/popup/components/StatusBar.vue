<template>
  <div>
    <transition name="slide">
      <div v-if="showMessage" w:pos="fixed bottom-0 z-1" w:bg="gray-700" w:text="white sm" w:p="4" w:w="full">
        {{ message }}
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

export default class StatusBar extends Vue {
  @Prop(String) message!: string;

  get showMessage() {
    return (this.message ?? '') !== '';
  }
}
</script>

<style lang="scss" scoped>
.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
}
.slide-enter-active {
  transition: transform 0.25s ease-out;
}
.slide-leave-active {
  transition: transform 0.25s ease-in;
}
.slide-enter-to,
.slide-leave-from {
  transform: translateY(0);
}
</style>
