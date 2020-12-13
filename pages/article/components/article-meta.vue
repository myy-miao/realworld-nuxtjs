<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
      ><img :src="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
        class="author"
        >{{ article.author.username }}</nuxt-link
      >
      <span class="date">{{ article.createAt | date("MMM DD, YYYY") }}</span>
    </div>
    <template v-if="article.author.username !== user.username">
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following,
        }"
        @click="onFollow(article.author)"
        :disabled="article.author.followDisabled"
      >
        <i class="ion-plus-round"></i>&nbsp;
        {{
          (article.author.following ? "Unfollow " : "Follow ") +
          article.author.username
        }}
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited,
        }"
        @click="onFavorite(article)"
        :disabled="article.btnDisabled"
      >
        <i class="ion-heart"></i>
        &nbsp; {{ article.favorited ? "Unf" : "F" }}avorite Article
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
    <template v-else>
      <nuxt-link
        class="btn btn-sm btn-outline-secondary"
        :to="{
          name: 'editor',
          params:{
            slug: article.slug,
          }
        }"
      >
        <i class="ion-edit"></i>
        Edit Article
      </nuxt-link>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-danger"
        @click="onDeleteArticle(article)"
        :disabled="article.btnDisabled"
      >
        <i class="ion-trash-a"></i>
        &nbsp; Delete Article
      </button>
    </template>
  </div>
</template>

<script>
import { followUser, unfollowUser } from "@/api/user";
import { addFavorite, deleteFavorite, deleteArticle } from "@/api/article";
import { mapState } from "vuex";

export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async onFollow(author) {
      author.followDisabled = true;
      if (author.following) {
        await unfollowUser(author.username);
        author.following = false;
      } else {
        await followUser(author.username);
        author.following = true;
      }
      author.followDisabled = false;
    },
    async onFavorite(article) {
      article.btnDisabled = true;
      if (article.favorited) {
        await deleteFavorite(article.slug);
        article.favoritesCount--;
        article.favorited = false;
      } else {
        await addFavorite(article.slug);
        article.favoritesCount++;
        article.favorited = true;
      }
      article.btnDisabled = false;
    },
    async onDeleteArticle(article) {
      article.btnDisabled = true;
      await deleteArticle(article.slug);
      this.$router.push('/')
    },
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>