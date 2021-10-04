<template>
  <div>
    <vue-dropzone
      ref="myVueDropzone"
      id="dropzone"
      :options="dropzoneOptions"
      @vdropzone-file-added="sendingFile"></vue-dropzone>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  name: 'UploadFile',
  components: {
    vueDropzone: vue2Dropzone
  },
  data: function () {
    return {
      dropzoneOptions: {
          autoProcessQueue: false,
          url: 'https://localhost',
          previewsContainer: false,
          dictDefaultMessage: "Drop here a DCR <code>.json</code> file"
      },
    }
  },
  methods: {
    sendingFile(file) {
      const reader = new FileReader()
      reader.onload = e => this.$emit('uploadedFile', file.name, e.target.result)
      reader.readAsText(file, "UTF-8")
    }
  }
}
</script>

<style>
#dropzone {
  margin: 10px;
  position: absolute;
  bottom: 70px;
  width: 93%;
  border: 3px dashed #CCC;
  border-radius: 10px;
  min-height: 0;
  opacity: .5;
}
  .dropzone .dz-message {
    margin: 0 !important;
  }
</style>