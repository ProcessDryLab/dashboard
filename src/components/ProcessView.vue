<template>
  <div>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 mr-4 border-bottom ">
      <h1 class='h2'>Process {{ this.process.name }}</h1>
      <b-button-group class="float-right">
        <b-button
          variant="outline-secondary"
          v-b-modal.new-constraint size="sm">
          Add constraint</b-button>
        <b-dropdown right text="Export" variant="outline-secondary" size="sm">
            <b-dropdown-item @click="exportJson">Export .json</b-dropdown-item>
        </b-dropdown>
      </b-button-group>
    </div>
    <b-container fluid>
      <b-row>
        <b-col cols="10">
          <ProcessRenderer ref='dot' :dot='this.dot' />
        </b-col>
        <b-col class="bg-light border-left border-bottom border-top pt-2">
          <ProcessSimulator :json='this.process.json' />
        </b-col>
      </b-row>
    </b-container>
    <NewConstraint @newConstraint='newConstraint' />
  </div>
</template>

<script>
import ProcessRenderer from './widgets/ProcessRenderer'
import ProcessSimulator from './widgets/ProcessSimulator.vue'
import NewConstraint from './modals/NewConstraint.vue'
import axios from 'axios'

export default {
  name: 'ProcessView',
  props: ['processes'],
  data () {
    return {
      process: {
        id: '',
        name: '',
        json: ''
      },
      dot: null,
      toRefresh: false
    }
  },
  components: {
    ProcessRenderer,
    ProcessSimulator,
    NewConstraint
  },
  created () {
    this.fetchData()
  },
  watch: {
    $route: 'fetchData',
    toRefresh: 'renderProcess'
  },
  methods: {
    fetchData () {
      if ('id' in this.$route.params) {
        const matches = this.processes.filter((p) => p.id === this.$route.params.id)
        if (matches.length === 1) {
          this.process = matches[0]
          this.renderProcess()
        } else {
          this.$router.push('/')
        }
      }
    },
    renderProcess () {
      this.dot = null
      this.toRefresh = false
      axios
        .post(this.$backend.getUrlDcr2Dot(), this.process.json)
        .then((res) => (this.dot = res.data))
        .catch((err) => console.error(err))
    },
    exportJson() {
        var url = window.URL.createObjectURL(new Blob([JSON.stringify(this.process.json)], { type: 'application/json' }));
        var fileLink = document.createElement('a');
        fileLink.href = url;
        fileLink.download = 'Process-' + this.process.name + ".json";
        fileLink.click();
    },
    newConstraint(source, relationship, target) {
      this.$emit('newConstraint', this.process.id, source, relationship, target)
      setTimeout(() => { this.toRefresh = true }, 2000);
    }
  }
}
</script>
