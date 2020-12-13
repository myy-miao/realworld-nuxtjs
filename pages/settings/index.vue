<template>
  <div class="settings-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Your Settings</h1>

        <form @submit.prevent="updateCurrentUser()">
          <fieldset>
              <fieldset class="form-group">
                <input class="form-control" type="text" v-model="data.user.image" placeholder="URL of profile picture">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" v-model="data.user.username" type="text" placeholder="Your Name">
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control form-control-lg" v-model="data.user.bio" rows="8" placeholder="Short bio about you"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" v-model="data.user.email" type="text" placeholder="Email">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" v-model="data.user.password" type="password" placeholder="Password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
          </fieldset>
        </form>
        <hr>
        <button class="btn btn-outline-danger" @click="logout()">
          Or click here to logout.
        </button>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import { getCurrentUser, updateUser } from "@/api/user";
// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'authenticated',
  name:'settingsIndex',
  async asyncData(){
    const { data } = await getCurrentUser()
    data.user.password = ''
    return {
      data
    }
  },
  methods:{
    async updateCurrentUser(){
      const fields = ['username', 'image', 'bio', 'email', 'password']
      const query = {}
      fields.forEach(field => {
        query[field] = this.data.user[field]
      })
      await updateUser(query)
      this.$router.push({name:'profile',params:{username:this.data.user.username}})
    },
    logout() {
      Cookie.remove('user')
      this.$router.push('/')
    }
  }
}
</script>