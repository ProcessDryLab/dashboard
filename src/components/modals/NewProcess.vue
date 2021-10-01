<template>
  <b-modal
    id="new-process"
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
    <b-form-group label="JSON:" label-for="baseTopic">
      <b-form-textarea
        id="textarea"
        placeholder="DCR Json"
        rows="3"
        max-rows="6"
        required
        v-model="processJson"
      ></b-form-textarea>
    </b-form-group>
  </b-modal>
</template>

<script>
export default {
  data () {
    return {
      processName: '',
      processJson: ''
    }
  },
  methods: {
    handleOk (bvModalEvt) {
      this.$emit('newProcessFromJson', this.processName, this.processJson)
    }
  }
}
</script>
