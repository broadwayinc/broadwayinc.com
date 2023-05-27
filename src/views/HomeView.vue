<template lang="pug">
.shell
  .head
    h2 broadway&nbsp;Inc.
    hr
    p.
      If&nbsp;you&nbsp;can&nbsp;dream&nbsp;it, we&nbsp;know&nbsp;it's&nbsp;possible.
      We&nbsp;also&nbsp;know&nbsp;what&nbsp;it&nbsp;takes to make your dreams&nbsp;a&nbsp;reality.
      It requires more sacrifice than you'd expect.
      You might hit a brick wall when your goal seems to be just within your grasp.
      On&nbsp;top&nbsp;of&nbsp;that, there's also an element of luck to be involved.
      Yet, we see these challenges as the beauty of your&nbsp;great&nbsp;journey, and we are eager to make&nbsp;it&nbsp;happen.
    p(style="opacity:1;text-align:right") from&nbsp;the&nbsp;CEO - &nbsp;Baksa Gimm
    br
    br
    h2 Our Services
    hr
    h2 Skapi: Backend&nbsp;API&nbsp;service
    p.
      Setting up a web service can be costly and time-consuming for businesses.
      We see this as stifling innovation, especially for young startup entrepreneurs.
    p.
      Skapi reimagines the backend development, providing a seamless experience with unparalleled simplicity.
      Our Robust and highly accessible backend resources lets the developers focus solely on what truly matters: Building the next innovation
    div(style='text-align:right')
      a(href="https://www.skapi.com")
        img(style='height:2em;' src="@/assets/Skapi_logo.svg")
        br
        |[www.skapi.com]
    br
    br
    h2 Wato: Media&nbsp;Production
    p.
      Great imagination and great media can shape the world, inspiring the youth to dream beyond their limits.
    p.
      Wato Production's goal is to create inspiring video content for businesses and to generate entertainment for the next generations.
    div(style='text-align:right')
      a(href="https://www.youtube.com/@watostudio4035")
        img(style='height:1.5em;' src="@/assets/wato_logo.svg")
        br
        |[YouTube]
    br
    br
    hr
    div(style="font-size: 14px;") broadway&nbsp;Inc.
    div(style="font-size: 14px;") Headquarters: 2F&nbsp;Yohan&nbsp;House, 24, Seongmisan-ro, Mapo-gu, Seoul,&nbsp;03997,&nbsp;Republic&nbsp;of&nbsp;Korea
    div(style="font-size: 14px;") Tech&nbsp;Division: 101-3302, 109&nbsp;Mapo-daero, Mapo-gu, Seoul,&nbsp;04146,&nbsp;Republic&nbsp;of&nbsp;Korea
</template>
<style scoped lang="less">
hr {
  opacity: 0.2;
}

h2 {
  font-weight: 300;
}
p{
  opacity: .8;
}
.shell {
  max-width: 1200px;
  margin: auto;
  // min-height: 100vh;
  align-items: center;
  // display: flex;
  flex-wrap: wrap;

  .head {
    margin: 1rem;

    .addr {
      opacity: 0.88;
      text-align: right;
    }
  }
}
</style>
