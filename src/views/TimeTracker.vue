<template lang="pug">
.shell
  .head
    h1 Time Tracker
    hr

    div(v-if="user")
      .stamp(v-for="h in history") {{new Date(h.uploaded)}}

    div(v-else)
      h2 Login to punch In/Out
      form(ref='loginForm' @submit.prevent="skapi.login($refs.loginForm, login_opt)")
        label(for="email") E-Mail
        sui-input#email(name='email' type='email' placeholder='your-email@broadwayinc.com' required)
        br
        br
        label(for="pw") Password
        sui-input#pw(name='password' type='password' placeholder='Password' required)
        br
        br
        sui-input(type='submit')
</template>
<script setup>
import { ref } from 'vue';
import { skapi } from '../main';

let user = ref(null);
let history = ref([]);
let lastStartKey = null;

let login_opt = {
  response: async (u) => {
    user.value = u;
    await skapi.postRecord(null, {
      table: 'timetrack'
    });
    let rec = await skapi.getRecords({
      table: 'timetrack',
      reference: skapi.user.user_id
    }, {
      ascending: false,
      limit: 60,
      startKey: lastStartKey
    });
    lastStartKey = rec.startKey;
    history.value = history.value.concat(rec.list);
  }
}

</script>
<style scoped lang="less">
.shell {
  max-width: 1024px;
  margin: auto;

  .head {
    margin: 8px;

    &>div {
      text-align: center;

      .stamp {
        display: block;
        background: rgba(0 0 0 / 8%);
        padding: 0.5em;
        border-radius: 8px;
        font-weight: bold;
        margin-bottom: 4px;
        text-align: left;
        font-family: monospace;
      }

      form {
        display: inline-block;
        text-align: left;

        label {
          display: block;
          font-weight: bold;
          margin-bottom: 4px;
        }

        sui-input {
          width: 20em;
        }
      }
    }
  }
}
</style>
