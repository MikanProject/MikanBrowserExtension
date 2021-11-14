<template>
  <svg :width="size" :height="size" :viewBox="viewBox">
    <path :d="path" />
  </svg>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

export default class SvgIcon extends Vue {
  @Prop({ default: '' }) path!: string;

  @Prop({ default: 24 }) size!: number | string;

  @Prop({ default: '0 0 24 24' }) viewBox!: string;
}
</script>
