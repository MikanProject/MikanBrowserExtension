<template>
  <div w:bg="amber-300" w:p="3" w:justify="between" w:flex="row" w:align="items-center">
    <div w:text="2xl white" w:font="medium">{{ i18n.getKey('recentUpdate') }}</div>
    <IconButton :icon="icon.mdiRefresh" :spinning="spinning" @click="refresh" />
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { mdiRefresh } from '@mdi/js';
import { sendMessage } from 'webext-bridge';
import useI18n from '../composables/useI18n';
import IconButton from './IconButton.vue';

@Options({
  components: {
    IconButton,
  },
})
export default class TitleBar extends Vue {
  i18n = useI18n();

  icon = {
    mdiRefresh,
  };

  spinning = false;

  async refresh() {
    this.spinning = true;
    try {
      const { status, error: errorMessage } = await sendMessage('refresh', '', 'background');
      if (status === 'success') {
        this.$emit('refresh');
      } else {
        this.$emit('error', errorMessage);
      }
    } catch (error) {
      if (error instanceof Error) {
        this.$emit('error', error.message);
      } else {
        this.$emit('error');
      }
    } finally {
      this.spinning = false;
    }
  }
}
</script>
