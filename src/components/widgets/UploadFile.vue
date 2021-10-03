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
          dictDefaultMessage: "Drop here a <code>.json</code> file"
      }
    }
  },
  methods: {
    trigger() {
      this.$emit('aaaaa')
      console.log('b')
    },
    sendingFile(file) {
      this.$emit('aaaaa')
      // var vm = this
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload =  evt => {
        var text = evt.target.result;
        // vm.$emit('aaaaaaaa', text)
        // this.$emit('update:title')
        this.trigger()
        console.log(text)
        console.log('-----------')
      }
      reader.onerror = evt => {
        console.error(evt);
      }
    }
  }
}
</script>

<style>
#dropzone {
  margin: 10px;
  border: 3px dashed #CCC;
  border-radius: 10px;
  min-height: 0;
}
  .dropzone .dz-message {
    margin: 0 !important;
  }
</style>