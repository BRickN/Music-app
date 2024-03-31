<script>
import AppUpload from '@/components/AppUpload.vue'
import AppSongs from '@/components/AppSongs.vue'

export default {
  name: 'ManageView',
  components: {
    AppUpload,
    AppSongs
  }
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUploads()
  //   next()
  // }
}
</script>
<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" />
      </div>
      <div class="col-span-2">
        <app-songs />
      </div>
    </div>
  </section>
</template>
