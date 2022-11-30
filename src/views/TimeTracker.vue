<template lang="pug">
.shell
  .head
    h1 Time Tracker
    hr
    br
    br
    br
    br
    div
      h2 Login
      form(style="display:inline-block;text-align:left;")
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

<style scoped lang="less">
.shell {
  max-width: 1024px;
  margin:auto;

  .head {
    margin: 8px;
    label {
      display: block;
      font-weight: bold;
      margin-bottom: 4px;
    }
    sui-input {
      width: 20em;
    }
    &>div{
      text-align: center;
    }
  }
}
</style>
