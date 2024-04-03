<script>
import AppUpload from '@/components/AppUpload.vue'
import AppSongs from '@/components/AppSongs.vue'

export default {
  name: 'ManageView',
  components: {
    AppUpload,
    AppSongs
  },
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUploads()
  //   next()
  // }
  beforeRouteLeave(to, from, next) {
    if (!this.$refs.appSongs.isEditingForm) {
      next()
    } else {
      const leave = confirm('Are you sure you want to leave?')
      if (leave) {
        next()
      }
    }
  },
  methods: {
    addSong(songRef) {
      this.$refs.appSongs.addSongToUserSongs(songRef)
    }
  }
}
</script>
<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <app-songs ref="appSongs" />
      </div>
    </div>
  </section>
</template>
