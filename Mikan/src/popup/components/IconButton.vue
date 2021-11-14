<template>
  <button
    style="outline: 2px solid transparent; outline-offset: 2px"
    w:p="1"
    w:border="rounded-1/2"
    w:overflow="hidden"
    w:svg="fill-white hover:fill-amber-300"
    w:bg="hover:amber-100 active:amber-200"
    w:transition="all duration-200 ease"
    :class="spinning ? 'animate-spin' : ''"
  >
    <SvgIcon :path="icon" />
  </button>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import SvgIcon from './SvgIcon.vue';

@Options({
  components: {
    SvgIcon,
  },
})
export default class IconButton extends Vue {
  @Prop(String) icon?: string;

  @Prop({ default: false }) spinning!: boolean;
}
</script>
