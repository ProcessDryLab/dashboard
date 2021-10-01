<template>
  <b-modal
    id="new-process-empty"
    title="New Process"
    @ok="handleOk"
  >
    <b-form-group label="Process name:" label-for="processName">
      <b-form-input
        v-model="processName"
        required
        placeholder="Process name"
      ></b-form-input>
    </b-form-group>
  </b-modal>
</template>

<script>
export default {
  data () {
    return {
      processName: ''
    }
  },
  methods: {
    handleOk() {
      this.$emit('newProcessEmpty', this.processName)
    }
  }
}
</script>
