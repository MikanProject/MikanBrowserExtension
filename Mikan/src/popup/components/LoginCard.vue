<template>
  <div w:bg="white" w:shadow="md" w:border="rounded-md" w:overflow="hidden" w:m="3" w:p="4" w:grid="gap-2">
    <div>Please login to Mikan to use this extension. If you already login, try to refresh the content.</div>
    <div w:justify="end" w:flex="row"><Button @click="login">Login</Button></div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { sendMessage } from 'webext-bridge/content-script';
import Button from './Button.vue';

@Options({
  components: {
    Button,
  },
})
export default class LoginCard extends Vue {
  async login() {
    await sendMessage('openWindow', { targetUrl: `https://mikanani.me/Account/Login` });
  }
}
</script>
