<template>
  <button
    style="outline: 2px solid transparent; outline-offset: 2px"
    w:display="flex"
    w:flex="row"
    w:align="items-center"
    w:p="y-2 x-4"
    w:grid="gap-4"
    w:bg="amber-300 hover:amber-100 active:amber-200"
    w:transition="all duration-200 ease"
    w:text="white base"
  >
    <SvgIcon v-if="icon" :path="icon" />
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import SvgIcon from './SvgIcon.vue';

@Options({
  components: {
    SvgIcon,
  },
})
export default class Button extends Vue {
  @Prop(String) icon?: string;
}
</script>
