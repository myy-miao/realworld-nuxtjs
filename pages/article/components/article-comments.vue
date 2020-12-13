<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea class="form-control" placeholder="Write a comment..." v-model="myComment" rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" @click.prevent="onAddComment()">
        Post Comment
        </button>
      </div>
    </form>
    
    <div class="card" v-for="(comment, index) in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link :to="{
          name: 'profile',
          params:{
            username: comment.author.username
          }
        }" class="comment-author">
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link :to="{
          name: 'profile',
          params:{
            username: comment.author.username
          }
        }" class="comment-author">{{ comment.author.username }}</nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY')}}</span>
        <span class="mod-options" v-if="comment.author.username === user.username">
          <i class="ion-trash-a" @click="onDeleteComment(comment, index)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComment, deleteComment } from '@/api/article';
import { mapState } from "vuex";

export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required:true,
    },
  },
  data(){
    return {
      comments: [],
      myComment: '',
    }
  },
  async mounted() {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments;
  },
  methods:{
    async onAddComment() {
      const { data } = await addComment(this.article.slug, {
        comment:{
          body: this.myComment
        }
      })
      const { comment } = data
      this.comments.unshift(comment);
      this.myComment = ''
    },
    async onDeleteComment(comment,index) {
      await deleteComment(this.article.slug, comment.id);
      this.comments.splice(index,1)
    }
  },
  computed:{
    ...mapState(["user"]),
  }
}
</script>