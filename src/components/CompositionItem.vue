<script>
import { songsCollection, storage } from '@/includes/firebase'

export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true
    },
    updateSong: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    removeSong: {
      type: Function,
      required: true
    },
    updateIsEditingForm: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      showForm: false,
      songSchema: {
        modified_name: 'required',
        genre: 'alpha_spaces'
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait... updating song info'
    }
  },
  methods: {
    async editSong(values) {
      this.show_alert = true
      this.in_submission = true
      this.alert_variant = 'bg-blue-500'
      this.alert_message = 'Please wait... updating song info'

      try {
        await songsCollection.doc(this.song.docId).update({
          modified_name: values.modified_name,
          genre: values.genre
        })
      } catch (error) {
        this.in_submission = false
        this.alert_variant = 'bg-red-500'
        this.alert_message = 'something went wrong'
        return
      }

      this.updateSong(this.index, values)
      this.in_submission = false
      this.alert_variant = 'bg-green-500'
      this.alert_message = 'Success'
      this.updateIsEditingForm(false)
    },
    async deleteSong() {
      const storageRef = storage.ref()
      const songRef = storageRef.child(`songs/${this.song.original_name}`)

      await songRef.delete()
      await songsCollection.doc(this.song.docId).delete()
      this.removeSong(this.index)
    }
  }
}
</script>
<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-if="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-if="showForm">
      <div
        class="test-white text-center font-bold p-4 mb-4"
        v-if="show_alert"
        :class="alert_variant"
      >
        {{ alert_message }}
      </div>
      <vee-form :validation-schema="songSchema" @submit="editSong" :initial-values="song">
        <div class="mb-3">
          <label class="inline-block mb-2">{{ song.modified_name }}</label>
          <vee-field
            name="modified_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateIsEditingForm(true)"
          />
          <error-message class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">{{ song.genre }}</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateIsEditingForm(true)"
          />
          <error-message class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submission"
          @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>
