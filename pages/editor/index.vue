<template>
  <div class="editor-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-10 offset-md-1 col-xs-12">
        <form>
          <fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control form-control-lg" v-model="data.article.title" placeholder="Article Title">
            </fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control" v-model="data.article.description" placeholder="What's this article about?">
            </fieldset>
            <fieldset class="form-group">
                <textarea class="form-control" rows="8" v-model="data.article.body" placeholder="Write your article (in markdown)"></textarea>
            </fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control" @keyup.enter="addTag(tempTag)" v-model="tempTag" placeholder="Enter tags">
                <div class="tag-list">
                  <span class="tag-default tag-pill" v-for="tag in data.article.tagList" :key="tag">
                  <i class="ion-close-round" @click="removeTag(tag)"></i> {{ tag }}
                </span>
                </div>
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary" @click.prevent="onSubmitArticle()" type="button">
                Publish Article
            </button>
          </fieldset>
        </form>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import { getArticle, createArticle, updateArticle } from '@/api/article'

export default {
  middleware: 'authenticated',
  name: 'EditorIndex',
  async asyncData({ params }){
    const data = {article:{
      title: null,
      description: null,
      body: null,
      tagList: [],
    }}
    if(params.slug){
      const articleRes = await getArticle(params.slug)
      data.article = articleRes.data.article
    }
    return {
      data,
      tempTag:null,
    }
  },
  methods:{
    async onSubmitArticle() {
      const submitArticle = this.data.article.slug ? updateArticle : createArticle
      const { data } = await submitArticle(this.data.article.slug,this.data)
      this.$router.push({name:'article',params:{slug:data.article.slug}})
    },
    addTag(tag){
      if(this.data.article.tagList.indexOf(tag) === -1){
        this.data.article.tagList.push(tag)
        this.tempTag = null
      }
    },
    removeTag(tag){
      const index = this.data.article.tagList.indexOf(tag)
      this.data.article.tagList.splice(index,1)
    }
  }
}
</script>