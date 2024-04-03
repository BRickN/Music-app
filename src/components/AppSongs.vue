<script>
import { songsCollection, auth } from '@/includes/firebase'
import CompositionItem from '@/components/CompositionItem.vue'
export default {
  name: 'AppSongs',
  components: {
    CompositionItem
  },
  data() {
    return {
      songs: [],
      isEditingForm: false
    }
  },
  async created() {
    const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()
    snapshot.forEach(this.addSongToUserSongs)
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name
      this.songs[i].genre = values.genre
    },
    removeSong(i) {
      this.songs.splice(i, 1)
    },
    addSongToUserSongs(document) {
      const song = {
        ...document.data(),
        docId: document.id
      }
      this.songs.push(song)
    },
    updateIsEditingForm(value) {
      this.isEditingForm = value
    }
  }
}
</script>

<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">My Songs</span>
      <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Composition Items -->
      <composition-item
        :song="song"
        :updateSong="updateSong"
        :index="idx"
        v-for="(song, idx) in songs"
        :key="song.docId"
        :removeSong="removeSong"
        :updateIsEditingForm="updateIsEditingForm"
      />
    </div>
  </div>
</template>
