<template>
  <div w:bg="white" w:shadow="md" w:border="rounded-md" w:overflow="hidden" w:m="3">
    <div w:pos="relative" w:shadow="md">
      <img :src="`https://mikanani.me${episode?.Cover}`" />
      <div w:pos="absolute bottom-0" w:bg="opacity-60 black" w:p="4" w:grid="gap-1" w:w="full">
        <div w:text="2xl white" w:font="medium">{{ episode.BangumiName }}</div>
        <div w:text="sm gray-300">{{ episode.Name }}</div>
      </div>
    </div>
    <ListButton :icon="icon.mdiDownload" @click="download">
      {{ i18n.getKey('updateNotificationButtonDownload') }}
    </ListButton>
    <ListButton :icon="icon.mdiDownload" @click="downloadTorrent">
      {{ i18n.getKey('updateNotificationButtonDownloadTorrent') }}
    </ListButton>
    <ListButton :icon="icon.mdiContentCopy" @click="copyMagentLink">
      {{ i18n.getKey('updateNotificationButtonCopy') }}
    </ListButton>
    <ListButton :icon="icon.mdiOpenInNew" @click="openDetailPage">
      {{ i18n.getKey('updateNotificationButtonOpen') }}
    </ListButton>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { mdiDownload, mdiContentCopy, mdiOpenInNew } from '@mdi/js';
import { sendMessage } from 'webext-bridge';
import useI18n from '../composables/useI18n';
import { Episode } from '../../types/episode';
import ListButton from './ListButton.vue';

@Options({
  components: {
    ListButton,
  },
})
export default class BigCard extends Vue {
  @Prop({ default: [] }) episode!: Episode;

  i18n = useI18n();

  icon = {
    mdiDownload,
    mdiContentCopy,
    mdiOpenInNew,
  };

  async download() {
    await sendMessage('openWindow', { targetUrl: this.episode.FullMagnetLink });
  }

  async downloadTorrent() {
    const publishDate = new Date(new Date(this.episode.PublishDate).getTime() + 8 * 60 * 60 * 1000);
    const year = publishDate.getFullYear().toString();
    const month = (publishDate.getMonth() + 1).toString().padStart(2, '0');
    const day = publishDate.getDate().toString().padStart(2, '0');
    await sendMessage('openWindow', {
      targetUrl: `https://mikanani.me/Download/${year}${month}${day}/${this.episode.MagnetLink}.torrent`,
    });
  }

  async copyMagentLink() {
    await navigator.clipboard.writeText(this.episode.FullMagnetLink);
  }

  async openDetailPage() {
    await sendMessage('openWindow', { targetUrl: `https://mikanani.me/Home/Episode/${this.episode.MagnetLink}` });
  }
}
</script>
