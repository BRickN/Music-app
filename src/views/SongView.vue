<script>
import { songsCollection, auth, commentsCollection } from '@/includes/firebase'
import { mapState, mapActions } from 'pinia'
import useUserStore from '@/stores/user'
import usePlayerStore from '@/stores/player'

export default {
  name: 'SongView',
  data() {
    return {
      song: {},
      commentSchema: {
        comment: 'required|min:3'
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: 'Please wait',
      comments: [],
      sort: '1'
    }
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    ...mapState(usePlayerStore, ['playing']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        const dateA = new Date(a.datePosted)
        const dateB = new Date(b.datePosted)

        return this.sort === '1' ? dateA - dateB : dateB - dateA
      })
    }
  },
  watch: {
    sort(newValue) {
      if (newValue === this.$route.query.sort) {
        return
      }
      this.$router.push({
        query: {
          sort: newValue
        }
      })
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong', 'toggleAudio']),
    async submitComment(values, { resetForm }) {
      this.comment_in_submission = true
      this.comment_show_alert = true
      this.comment_alert_variant = 'bg-blue-500'
      this.comment_alert_message = 'Please wait'

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sId: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid
      }

      try {
        await commentsCollection.add(comment)
      } catch (error) {
        this.comment_in_submission = false
        this.comment_alert_variant = 'bg-red-500'
        this.comment_alert_message = 'Error adding comment. Please try again!'
        return
      }

      this.song.comment_count += 1
      await songsCollection.doc(this.$route.params.id).update({
        comment_count: this.song.comment_count
      })

      this.comment_in_submission = false
      this.comment_alert_variant = 'bg-green-500'
      this.comment_alert_message = 'Comment added!'

      resetForm()
      this.getComments()
    },
    async getComments() {
      const snapshots = await commentsCollection.where('sId', '==', this.$route.params.id).get()

      this.comments = []
      snapshots.forEach((comment) => {
        this.comments.push({
          docId: comment.id,
          ...comment.data()
        })
      })
    }
  },
  async beforeRouteEnter(to, from, next) {
    const docSnapShot = await songsCollection.doc(to.params.id).get()

    next(async (vm) => {
      if (!docSnapShot.exists) {
        vm.$router.push({ name: 'home' })
        return
      }

      const { sort } = vm.$route.query
      if (sort === '1' || sort === '2') {
        vm.sort = sort
      }
      vm.song = docSnapShot.data()
      await vm.getComments()
    })
  }
}
</script>
<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="playing ? toggleAudio() : newSong(song)"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i class="fas" :class="playing ? 'fa-pause' : 'fa-play'"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{ $n(1.12, 'currency') }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">{{
            $t('song.comment_count', { count: song.comment_count })
          }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p4 mb-4"
            v-if="comment_show_alert"
            :class="comment_alert_variant"
          >
            {{ comment_alert_message }}
          </div>
          <vee-form :validation-schema="commentSchema" @submit="submitComment" v-if="userLoggedIn">
            <vee-field
              name="comment"
              as="textarea"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <error-message class="text-red-600" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="comment_in_submission"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            v-model="sort"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.docId"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>
