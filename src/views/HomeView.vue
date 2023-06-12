<template lang="pug">
.shell
  .head
    br
    br
    h1(style="margin-bottom:0;font-size: 3em;") broadway&nbsp;Inc.
    p(style="margin-top:0;") If&nbsp;you&nbsp;can&nbsp;imagine&nbsp;it, it's&nbsp;possible.
    br
    br
    br
    h3 Our Services
    hr
    h2 Skapi: Frontend&nbsp;Driven BaaS&nbsp;service
    p.
      Skapi reimagines the backend development, providing a seamless experience with unparalleled simplicity.
      Our Robust and highly accessible APIs allow developers to focus solely on what truly matters:
    p Building&nbsp;the&nbsp;next&nbsp;innovation
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

h3,h2,h1 {
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
