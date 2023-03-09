<template lang="pug">
.shell
  br
  br
  .head
    h1(style="margin:0;display:inline-block;vertical-align:middle;") {{user ? 'Hello ' + (user.name || user.email) + (isAdmin ? ' [Admin]' : '') : 'Time Punch'}}

    router-link(to="profile")
      sui-button(v-if="user" style="float:right;background-color:transparent;color:black;border:2px solid rgba(0 0 0 / 50%);vertical-align:middle;") Edit Profile

    hr

    div(v-if='!user')
      // login box

      h2 Login to punch In/Out

      form(ref='loginForm' @submit.prevent="skapi.login($refs.loginForm, login_opt)")
        label(for="email") E-Mail
        sui-input#email(name='email' type='email' placeholder='your-email@broadwayinc.com' required autocomplete='username')

        br
        br

        label(for="pw") Password
        sui-input#pw(name='password' type='password' placeholder='Password' required autocomplete='current-password')

        br
        br

        sui-input(type='submit')

    div(v-else-if='isAdmin && !didCall')
      template(v-if='!userToFetch')
        template(v-if="!users.length")
          // loader
          .stamp(v-if="didCallUsers") No Users
          .stamp(v-else) ... Users loading
        template(v-else)
          .stamp.userSelect(v-for="u, idx in users" @click="()=>{userToFetch = u.user_id;getRecords().then(()=>didCall = true);}") {{u.name || u.email || u.user_id}}

    div(v-else)
      // history box
      template(v-if="!history.length")
        // loader
        .stamp(v-if="didCall") No history
        .stamp(v-else) ... History loading

      template(v-else)
        // history
        .stamp Days: {{ trackHours.days}}, Hour Gap: {{calcHMS(trackHours.gap).str}}
        .stamp(v-for="h, idx in history" :style="{'color': h.opt === 'in' ? 'green' : 'red'}") {{h.punch.toLocaleString()}} [{{h.opt === 'in' ? 'in' : 'out:&nbsp;'}}{{h.opt === 'out' ? h.duration : ''}}]

      br

      sui-button(v-if="lastStartKey && lastStartKey !== 'end'" @click='getRecords') Load More
        
</template>
<script setup>
import { ref } from 'vue';
import { skapi, user } from '../main';

let history = ref([]);
let lastStartKey = ref(null);
let lastPunch = null;
let startPunch = null;
let didCall = ref(false);
let isAdmin = ref(false);
let didCallUsers = ref(false);
let users = ref([]);
let userToFetch = ref(null);


function calcHMS(ms) {

  function getHMS(ms) {
    let seconds = parseInt(ms / 1000);
    let hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    let minutes = parseInt(seconds / 60);
    seconds = seconds % 60;
    return { seconds, hours, minutes };
  }

  let nine_hrs = 32400000;
  let { seconds, hours, minutes } = getHMS(ms);

  return { hours, minutes, seconds, str: `${hours}h ${minutes}m ${seconds}s`, gap: ms - nine_hrs };
}

let trackHours = ref({
  days: 0,
  total: [0, 0, 0],
  gap: 0
});

function resolvePunch(punchTime) {
  let arr = history.value;

  if (startPunch) {
    // use lastPunch(out) / startPunch(in)
    let calc = calcHMS(lastPunch - startPunch);
    if (calc.seconds < 0 || calc.minutes < 0) {
      arr.push({ opt: 'in', punch: lastPunch });
    }
    else {
      if (calc.hours) {
        trackHours.value.days++;
        trackHours.value.total[0] += calc.hours;
        trackHours.value.total[1] += calc.minutes;
        trackHours.value.total[2] += calc.seconds;

        trackHours.value.gap += calc.gap;
      }
      arr.push({ opt: 'out', punch: lastPunch, duration: calc.str });
      arr.push({ opt: 'in', punch: startPunch });
    }
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
  let rec = await skapi.getRecords({
    service: 'ap22TP6OQRDgenwunsVi',
    table: {
      name: 'timestamp',
      access_group: 'private'
    },
    reference: userToFetch.value
  }, {
    ascending: false,
    limit: 1000,
    fetchMore: true
  });
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

    let diff = calcHMS(lastPunch - punchTime);

    if (diff.hours <= 11 && diff.hours >= 0) {
      // within 12 hour
      startPunch = punchTime;
    }
    else {
      // out of range
      resolvePunch(punchTime);
    }
  }

  if (rec.startKey === 'end') {
    // end of list, resolve leftovers
    resolvePunch();
  }

  lastStartKey.value = rec.startKey;
}

async function getUsers() {
  users.value = (await skapi.getUsers()).list;
  didCallUsers.value = true;
}

let login_opt = {
  response: async (u) => {
    user.value = u;
    if (u.access_group == 99) {
      isAdmin.value = true;
      getUsers();
    }
    else {
      if (skapi.connection.ip == '211.217.251.144') {
        await skapi.postRecord(null, {
          table: {
            name: 'timestamp',
            access_group: 'private'
          }
        });
      }
      userToFetch.value = u.user_id;
      getRecords().then(r => didCall.value = true);
    }
  }
};

if (user.value && !isAdmin.value) {
  // already logged in
  userToFetch.value = u.user_id;
  getRecords().then(r => didCall.value = true);
}

</script>
<style scoped lang="less">
.userSelect {
  cursor: pointer;

  &:hover {
    color: green;
  }
}

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
