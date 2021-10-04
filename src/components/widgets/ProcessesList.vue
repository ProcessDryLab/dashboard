<template>
  <div class="list-group list-group-flush">
    <b-list-group-item
      v-bind:key="proc.id"
      v-for="proc in processes"
      class="list-group-item list-group-item-action bg-light border-0 align-items-center p-2 pl-3"
      :to="{ name: 'ProcessView', params: { id: proc.id } }">
      <font-awesome-icon icon="file" />
      {{ proc.name }}
    </b-list-group-item>
    <UploadFile @uploadedFile='uploadedFile' />
  </div>
</template>

<script>
import UploadFile from './UploadFile.vue'

export default {
  name: 'ProcessesList',
  props: ['processes'],
  components: {
    UploadFile
  },
  methods: {
    uploadedFile(fileName, file) {
      var title = JSON.parse(file).DCRModel[0].title
      if (title === undefined) {
        title = "Imported from " + fileName
      }
      this.$emit('newProcessJson', title, file)
    }
  }
}
</script>
