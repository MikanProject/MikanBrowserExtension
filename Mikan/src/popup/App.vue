<template>
  <div style="height: 600px" w:text="base">
    <div w:flex="shrink-0">
      <TitleBar @refresh="refresh" @error="error" />
    </div>
    <div w:flex="grow" w:overflow="auto">
      <LoginCard v-if="episodes.length === 0" />
      <CardList v-else :episodes="episodes" />
    </div>
    <StatusBar :message="message" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import CardList from './components/CardList.vue';
import { Episode } from '../types/episode';
import TitleBar from './components/TitleBar.vue';
import StatusBar from './components/StatusBar.vue';
import useI18n from './composables/useI18n';
import LoginCard from './components/LoginCard.vue';

@Options({
  components: {
    CardList,
    TitleBar,
    StatusBar,
    LoginCard,
  },
})
export default class App extends Vue {
  episodes: Episode[] = [];

  message = '';

  i18n = useI18n();

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  loadData() {
    const mentionDatasJson = localStorage.getItem('mentionDatas');
    if (mentionDatasJson) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const episodes = JSON.parse(mentionDatasJson);
      if (episodes instanceof Array) {
        this.episodes = episodes as Episode[];
      }
    }
  }

  refresh() {
    this.loadData();
    this.showMessage(this.i18n.getKey('refreshSuccess'));
  }

  error(message: string) {
    this.showMessage(`${this.i18n.getKey('refreshFailed')}: ${message}`);
  }

  beforeMount() {
    this.loadData();
  }
}
</script>

<style lang="scss">
/* noto-sans-sc-100 - latin_chinese-simplified */
@font-face {
  font-family: 'Noto Sans SC';
  font-style: normal;
  font-weight: 100;
  src: local(''), url('/assets/noto-sans-sc-v20-latin_chinese-simplified-100.woff2') format('woff2'),
    url('assets/noto-sans-sc-v20-latin_chinese-simplified-100.woff') format('woff');
}
/* noto-sans-sc-300 - latin_chinese-simplified */
@font-face {
  font-family: 'Noto Sans SC';
  font-style: normal;
  font-weight: 300;
  src: local(''), url('/assets/noto-sans-sc-v20-latin_chinese-simplified-300.woff2') format('woff2'),
    url('assets/noto-sans-sc-v20-latin_chinese-simplified-300.woff') format('woff');
}
/* noto-sans-sc-regular - latin_chinese-simplified */
@font-face {
  font-family: 'Noto Sans SC';
  font-style: normal;
  font-weight: 400;
  src: local(''), url('/assets/noto-sans-sc-v20-latin_chinese-simplified-regular.woff2') format('woff2'),
    url('assets/noto-sans-sc-v20-latin_chinese-simplified-regular.woff') format('woff');
}
/* noto-sans-sc-500 - latin_chinese-simplified */
@font-face {
  font-family: 'Noto Sans SC';
  font-style: normal;
  font-weight: 500;
  src: local(''), url('/assets/noto-sans-sc-v20-latin_chinese-simplified-500.woff2') format('woff2'),
    url('assets/noto-sans-sc-v20-latin_chinese-simplified-500.woff') format('woff');
}
/* noto-sans-sc-700 - latin_chinese-simplified */
@font-face {
  font-family: 'Noto Sans SC';
  font-style: normal;
  font-weight: 700;
  src: local(''), url('/assets/noto-sans-sc-v20-latin_chinese-simplified-700.woff2') format('woff2'),
    url('assets/noto-sans-sc-v20-latin_chinese-simplified-700.woff') format('woff');
}

body {
  background-color: #f5f5f5;
  width: 350px;
}

div {
  display: flex;
  flex-direction: column;
}

#app button {
  outline: 2px solid transparent;
  outline-offset: 2px;
  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-thumb {
  background: #a0a0a0;
  border: 0px none #ffffff;
  border-radius: 50px;
}
::-webkit-scrollbar-thumb:hover {
  background: #8c8c8c;
}
::-webkit-scrollbar-thumb:active {
  background: #787878;
}
::-webkit-scrollbar-track {
  background: #f0f0f0;
  border: 0px none #ffffff;
  border-radius: 50px;
}
::-webkit-scrollbar-track:hover {
  background: #e6e6e6;
}
::-webkit-scrollbar-track:active {
  background: #c8c8c8;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
