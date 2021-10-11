<template>
  <b-modal
    id="mine-log"
    title="Mine a log"
    @ok="handleOk"
  >
    <b-form-group>
      <b-form-file
        v-model="file"
        :state="Boolean(file)"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
      ></b-form-file>
    </b-form-group>
  </b-modal>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      file: null
    }
  },
  methods: {
    handleOk() {
      this.$toastr.s('Log submitted for mining')
      var formData = new FormData();
      formData.append("file", this.file);
      axios
        .post(this.$backendMiner.getUrlMiner(), formData, { headers: { 'Content-Type': 'multipart/form-data' }})
        .then((res) => this.$emit('newProcessMined', "Mined from " + this.file.name, res.data))
        .catch((err) => console.error(err))
    }
  }
}
</script>
