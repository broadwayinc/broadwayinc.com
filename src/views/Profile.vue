<template lang="pug">
.shell
  br
  br
  sui-overlay#success(style="background-color:rgba(0 0 0 / 33%);" onclick='success.close()')
    .success_msg
      h2 Update Success!
      p Your profile has been updated.
  .head(v-if='user')
    h2(style="margin:0;") Edit Profile
    hr
    div
      br
      form(ref='updatePf' @submit.prevent="skapi.updateUserSettings($refs.updatePf, update_opt)")
        label(for="email") E-Mail
        br
        sui-input#email(name='email' type='email' placeholder='your-email@broadwayinc.com' :value='user.email')
        br
        br
        label(for="name") Name
        sui-input#name(name='name' :value='user.name')
        br
        br
        sui-input(type='submit')

    br
    br
    br

    h2(style="margin:0;") Change Password
    hr
    div
      br
      form(ref='updatePw' @submit.prevent="skapi.updateUserSettings($refs.updatePw, update_opt)")
        label(for="opw") Current Password
        sui-input#opw(autocomplete="new-password" :name='current_password' type='password' placeholder='Password' required)
        br
        br
        label(for="pw") New Password
        sui-input#pw(autocomplete="new-password" ref='new_password' name='new_password' type='password' placeholder='Password' required)
        br
        br
        sui-input(type='submit')
        
</template>
<script setup>
import { skapi, user } from '../main';
import router from '../router';

if (!user.value) {
  router.replace('timepunch');
}

let update_opt = {
  response: async (u) => {
    user.value = u;
    window.success.open();
  }
}

</script>
<style scoped lang="less">
.success_msg {
  background-color: white;
  text-align: center;
  padding: 2em;
  border-radius: 8px;
  border: 2px solid black;
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
