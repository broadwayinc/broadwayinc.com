<template lang="pug">
.shell
  .head
    h1 {{user ? user.name || user.email : 'Time Tracker'}}
    hr

    div(v-if="user")
      .stamp(v-if="!history_computed.length") ... History loading
      .stamp(v-for="h in history_computed" :style="{'color': h.opt === 'in' ? 'green' : 'red'}") {{h.punch.toLocaleString()}} [{{h.opt === 'in' ? 'in' : 'out:&nbsp;'}}{{h.opt === 'out' ? h.duration : ''}}]
      br
      sui-button(v-if="lastStartKey && lastStartKey !== 'end'" @click='getRecords') Load More

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
import { computed, ref } from 'vue';
import { skapi } from '../main';

let user = ref(null);
let history = ref([]);
let lastStartKey = null;
let punchOut = null;
let punchHold = null;

function msToHMS(ms) {
  let seconds = parseInt(ms / 1000);
  let hours = parseInt(seconds / 3600);
  seconds = seconds % 3600;
  let minutes = parseInt(seconds / 60);
  seconds = seconds % 60;
  return { hours, minutes, seconds, str: `${hours}h ${minutes}m ${seconds}s` };
}

let history_computed = computed({
  get() {
    let arr = [];

    if (history.value.length) {
      return history.value;
    }
    else if (punchOut) {
      if (punchHold) {
        arr.push({ opt: 'out', punch: punchOut, duration: msToHMS(punchOut - punchHold).str });
        arr.push({ opt: 'in', punch: punchHold });
      }
      else {
        arr.push({ opt: 'in', punch: punchOut });
      }
    }
    return arr;
  }
});

function sortHistory(list) {
  let arr = [];

  for (let h of list) {
    let punchTime = new Date(h.uploaded);

    if (!punchOut) {
      punchOut = punchTime;
      continue;
    }

    let diff = msToHMS(punchOut - punchTime);

    if (diff.hours <= 14) {
      // if within range (0 ~ 14 hour range)
      punchHold = punchTime;
    }
    else {
      // if out of range, show punch in/out
      if (punchHold) {
        arr.push({ opt: 'out', punch: punchOut, duration: msToHMS(punchOut - punchHold).str });
        arr.push({ opt: 'in', punch: punchHold });
      }

      punchOut = punchTime;
      punchHold = null;
    }
  }

  return arr;
}

async function getRecords() {
  let rec = await skapi.getRecords({
    table: 'timetrack',
    reference: user.value.user_id,
    access_group: 'private'
  }, {
    ascending: false,
    limit: 100,
    startKey: lastStartKey
  });

  lastStartKey = rec.startKey;
  history.value = history.value.concat(sortHistory(rec.list));
}

let login_opt = {
  response: async (u) => {
    user.value = u;
    await skapi.postRecord(null, {
      table: 'timetrack',
      access_group: 'private'
    });
    getRecords();
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
        font-size: 14px;
        display: block;
        background: rgba(0 0 0 / 2%);
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
