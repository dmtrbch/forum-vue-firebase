<template>
  <div v-if="asyncDataStatus_ready" class="col-full">
    <div class="col-large push-top">
      <h1>{{thread.title}}</h1>     

      <router-link
        class="btn-green btn-small"
        :style="!enableThreadEditing ? 'background: grey;' : 'background: #4e9c7f;'"
        :disabled="!enableThreadEditing"
        :to="{name: 'ThreadEdit', id: this.id}"
        tag="button"
      >
        Edit thread
      </router-link>

      <p>
        By <a href="#" class="link-unstyled">{{user.name}}</a>, <AppDate :timestamp="thread.publishedAt"/>.
        <span style="float: right; margin-top: 2px;" class="hide-mobile text-faded text-small">{{repliesCount}} replies by {{contributorsCount}} contributors</span>
      </p>
      <PostList 
        :posts="posts"
      />

      <PostEditor
        v-if="authUser"
        :threadId="id"
      />
      <div v-else class="text-center" style="margin-bottom:50px;">
        <router-link :to="{name: 'SignIn', query: {redirectTo: $route.path}}">Sign In</router-link> or
        <router-link :to="{name: 'Register', query: {redirectTo: $route.path}}">Register</router-link> to post a reply.
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {countObjectProperties} from '@/utils'
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  components: {
    PostList,
    PostEditor
  },
  mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      authUser: 'auth/authUser'
    }),
    thread () {
      return this.$store.state.threads.items[this.id]
    },
    repliesCount () {
      return this.$store.getters['threads/threadRepliesCount'](this.thread['.key'])
    },
    user () {
      return this.$store.state.users.items[this.thread.userId]
    },
    contributorsCount () {
      return countObjectProperties(this.thread.contributors)
    },
    posts () {
      const postIds = Object.values(this.thread.posts)
      return Object.values(this.$store.state.posts.items)
        .filter(post => postIds.includes(post['.key']))
    }
  },

  data () {
    return {
      enableThreadEditing: false
    }
  },

  methods: {
    ...mapActions('threads', ['fetchThread']),
    ...mapActions('users', ['fetchUser']),
    ...mapActions('posts', ['fetchPosts']),
    enableThreadEdit () {
      if (this.authUser !== null && this.authUser['.key'] === this.thread.userId) {
        this.enableThreadEditing = true
      }
    }
  },

  created () {
    // fetch thread
    this.fetchThread({id: this.id})
      .then(thread => {
        this.fetchUser({id: thread.userId})
        return this.fetchPosts({ids: Object.keys(thread.posts)})
      })
      .then(posts => {
        return Promise.all(posts.map(post => {
          this.fetchUser({id: post.userId})
        }))
      })
      .then(() => {
        this.enableThreadEdit()
        this.asyncDataStatus_fetched()
      })
  }
}
</script>