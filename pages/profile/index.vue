<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button
              class="btn btn-sm action-btn"
              :class="profile.following ? 'btn-secondary' : 'btn-outline-secondary'"
              v-if="profile.username !== user.username"
              @click="onFollow(profile)"
            >
              <i class="ion-plus-round"></i>
              &nbsp;
              {{ (profile.following ? "Unfollow " : "Follow ") + profile.username }}
            </button>
            <nuxt-link
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
              :to="{
                name: 'settings',
                params: {
                  username: profile.username,
                },
              }"
            >
              <i class="ion-gear-a"></i>
              Edit Profile Settings
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'my_articles',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username,
                    },
                    query: {
                      tab: 'my_articles',
                    },
                  }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'favorited_articles',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username,
                    },
                    query: {
                      tab: 'favorited_articles',
                    },
                  }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
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
                <span class="date">{{
                  article.createdAt | date("MMM DD, YYYY")
                }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="article.favorited ? 'active' : ''"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <!-- 分页 -->
          <nav v-if="totalPage > 1">
            <ul class="pagination">
              <li
                class="page-item ng-scope"
                :class="{
                  active: p === page,
                }"
                v-for="p in totalPage"
                :key="p"
              >
                <nuxt-link
                  class="page-link ng-binding"
                  :to="{
                    name: 'home',
                    query: {
                      page: p,
                      tab: tab,
                    },
                  }"
                  >{{ p }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
          <!-- 分页 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  listArticles,
  feedArticles,
  addFavorite,
  deleteFavorite,
} from "@/api/article";
import { getProfile, followUser, unfollowUser } from "@/api/user";
import { mapState } from "vuex";

export default {
  middleware: "authenticated",
  name: "profileIndex",
  async asyncData({ params, query }) {
    const page = parseInt(query.page || 1);
    const limit = 10;
    const { author, favorited } = query;
    const tab = query.tab || 'my_articles'
    const profileRes = await getProfile(params.username)
    const { profile } = profileRes.data
    const articleQuery = {
      limit,
      offset: (page - 1) * limit,
      author,
      favorited,
    }
    if(tab === 'my_articles'){
      articleQuery.author = profile.username
    }else{
      articleQuery.favorited = profile.username
    }
    const articleRes = await listArticles(articleQuery);
    const { articles, articlesCount } = articleRes.data;

    articles.forEach((article) => {
      article.favoriteDisabled = false;
    })
    profile.followDisabled = false

    return {
      profile,
      articles,
      articlesCount,
      limit,
      page,
      tab,
    };
  },
  watchQuery: ["page", "tab"],
  computed: {
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    },
    ...mapState(["user"]),
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
      article.favoriteDisabled = true
      if (article.favorited) {
        await deleteFavorite(article.slug)
        article.favoritesCount--
        article.favorited = false
      } else {
        await addFavorite(article.slug)
        article.favoritesCount++
        article.favorited = true
      }
      article.favoriteDisabled = false
    },
  },
};
</script>