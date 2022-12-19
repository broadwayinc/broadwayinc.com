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
      // history box
      
      template(v-if="!history.length")
        // loader
        .stamp(v-if="didCall") No history
        .stamp(v-else) ... History loading
      
      template(v-else)
        // history
        .stamp(v-for="h, idx in history" :style="{'color': h.opt === 'in' ? 'green' : 'red'}") {{h.punch.toLocaleString()}} [{{h.opt === 'in' ? 'in' : 'out:&nbsp;'}}{{h.opt === 'out' ? h.duration : ''}}]
      
      br
      
      sui-button(v-if="lastStartKey && lastStartKey !== 'end'" @click='getRecords') Load More

    div(v-else)
      // login box

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
import { onUnmounted, ref } from 'vue';
import { skapi, user } from '../main';

let history = ref([]);
let lastStartKey = ref(null);
let lastPunch = null;
let startPunch = null;
let didCall = ref(false);

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

function resolveLeftovers(punchTime) {
  let arr = history.value;

  if (startPunch) {
    // use lastPunch(out) / startPunch(in)
    arr.push({ opt: 'out', punch: lastPunch, duration: msToHMS(lastPunch - startPunch).str });
    arr.push({ opt: 'in', punch: startPunch });
  }

  else if (lastPunch) {
    // use lastPunch(in)
    arr.push({ opt: 'in', punch: lastPunch });
  }

  if (punchTime) {
    lastPunch = punchTime;
  }
}

async function getRecords() {
  if (lastStartKey.value === 'end') {
    // no more fetching
    return;
  }

  let rec = await skapi.getRecords({
    table: 'timestamp',
    reference: user.value.user_id,
    access_group: 'private'
  }, {
    ascending: false,
    limit: 1000,
    refresh: !lastStartKey.value
  });

  didCall.value = true;

  let list = rec.list;
  for (let h of list) {
    // h = punch record

    if (h.ip !== '211.217.251.144') {
      // wrong record ip
      continue;
    }

    let punchTime = new Date(h.uploaded);

    // history = [ out, ... within 12 hour , in ]
    // history = [ in, ... passed 12 hour , out ]

    if (!lastPunch) {
      lastPunch = punchTime;
      continue;
    }

    let diff = msToHMS(lastPunch - punchTime);

    if (diff.hours <= 11) {
      // within 12 hour
      startPunch = punchTime;
    }
    else {
      // out of range
      resolveLeftovers(punchTime);
    }
  }

  if (rec.startKey === 'end') {
    // end of list, resolve leftovers
    resolveLeftovers();
  }

  lastStartKey.value = rec.startKey;
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
  // already logged in
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
