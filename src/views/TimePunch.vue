<template lang="pug">
.shell
  br
  br
  .head
    h1(style="margin:0;width:calc(100% - 128px);display:inline-block;vertical-align:middle;") {{user ? 'Hello ' + (user.name || user.email) : 'Time Punch'}}
    router-link(to="profile")
      sui-button(v-if="user" style="width: 128px;background-color:transparent;color:black;border:2px solid rgba(0 0 0 / 50%);vertical-align:middle;") Edit Profile
    hr
    div(v-if="user")
      .stamp(v-if="!history_computed.length") ... History loading
      template(v-for="h, idx in history_computed")
        .stamp(v-if="idx < history_computed.length - 2 || lastStartKey === 'end'" :style="{'color': h.opt === 'in' ? 'green' : 'red'}") {{h.punch.toLocaleString()}} [{{h.opt === 'in' ? 'in' : 'out:&nbsp;'}}{{h.opt === 'out' ? h.duration : ''}}]
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
import { computed, onUnmounted, ref } from 'vue';
import { skapi, user } from '../main';

let history = ref([]);
let lastStartKey = ref(null);
let punchOut = null;
let punchHold = null;

onUnmounted(() => {
  lastStartKey.value = null;
});

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
      if (lastStartKey.value === 'end' && punchHold) {
        // end of list
        arr.push({ opt: 'out', punch: punchOut, duration: msToHMS(punchOut - punchHold).str });
        arr.push({ opt: 'in', punch: punchHold });
      }
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

    // return with additional concat
    return history.value.concat(arr);
  }
});

function sortHistory(list) {
  let arr = [];

  for (let h of list) {
    if(h.ip !== '211.217.251.144') {
      // wrong record ip
      continue;
    }

    let punchTime = new Date(h.uploaded);

    if (!punchOut) {
      punchOut = punchTime;
      continue;
    }

    let diff = msToHMS(punchOut - punchTime);
    if (diff.hours <= 11) {
      // if within range (12 hour range)
      punchHold = punchTime;
    }
    else {
      // if out of range, show punch in/out
      if (punchHold) {
        arr.push({ opt: 'out', punch: punchOut, duration: msToHMS(punchOut - punchHold).str });
        arr.push({ opt: 'in', punch: punchHold });
        punchOut = punchTime;
      }
    }
  }

  return arr;
}

async function getRecords() {
  let rec = await skapi.getRecords({
    table: 'timestamp',
    reference: user.value.user_id,
    access_group: 'private'
  }, {
    ascending: false,
    limit: 1000,
    refresh: !lastStartKey.value
  });

  lastStartKey.value = rec.startKey;
  history.value = history.value.concat(sortHistory(rec.list));
}

let login_opt = {
  response: async (u) => {
    user.value = u;
    if (skapi.connection.ip == '211.217.251.144') {
      await skapi.postRecord(null, {
        table: 'timestamp',
        access_group: 'private'
      });
    }
    getRecords();
  }
};

if (user.value) {
  getRecords();
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
