<template>
  <div w:flex="col">
    <BigCard v-for="episode in episodes" :key="episode.EpisodeId" :episode="episode" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Episode } from '../../types/episode';
import BigCard from './BigCard.vue';

@Options({
  components: {
    BigCard,
  },
})
export default class CardList extends Vue {
  @Prop({ default: [] }) episodes!: Episode[];
}
</script>
