<template>
  <div>
    <h6>Simulator</h6>
    <p>
      <span v-if="this.status.accepting"><font-awesome-icon icon="check" style="color: rgb(0, 204, 0);" /> Status: accepting</span>
      <span v-else>
          <font-awesome-icon icon="exclamation" style="color: rgb(170, 20, 20);" /> Activities missing:
          <span
            v-bind:key="a"
            v-for="a in this.status.pendingActivities">
            <b-badge variant="primary">{{ activityIdToName(a) }}</b-badge>&nbsp;
          </span>
      </span>
    </p>
    <b-card no-body header="Enabled activities">
      <b-card-body v-if="status.enabledActivities.length == 0">
        <b-card-text><em>No enabled activities</em></b-card-text>
      </b-card-body>
      <b-list-group flush v-else>
        <b-list-group-item
          v-bind:key="a"
          v-for="a in status.enabledActivities"
          button
          @click="execute(a)">
          {{ activityIdToName(a) }}
        </b-list-group-item>
      </b-list-group>
    </b-card>
    <b-card class="mt-3" no-body header="Execution history" v-if="this.simulationHistory.length > 0">
      <b-list-group flush>
        <b-list-group-item
          v-bind:key="a.id"
          v-for="a in simulationHistory">
          <small>{{ a.id + 1 }}.</small>
          {{ activityIdToName(a.name) }}
        </b-list-group-item>
        <b-list-group-item button variant="danger" @click="reset()">Reset simulation</b-list-group-item>
      </b-list-group>
    </b-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProcessSimulator',
  props: ['json'],
  data() {
    return {
      simluationId: '',
      status: {
        enabledActivities: [],
        isAccepting: false
      },
      simulationHistory: []
    }
  },
  watch: {
    json: 'initiateSimulation'
  },
  mounted() {
    this.initiateSimulation()
  },
  methods: {
    initiateSimulation() {
      axios
        .post(this.$backend.getUrlInitializeSimulation(), this.json)
        .then((res) => { this.simluationId = res.data; this.checkStatus() })
        .catch((err) => console.error(err))
    },
    checkStatus() {
      this.status.enabledActivities = []
      axios
        .get(this.$backend.getUrlSimulationStatus(this.simluationId))
        .then((res) => {this.status = res.data})
        .catch((err) => console.error(err))
    },
    execute(name) {
      axios
        .get(this.$backend.getUrlSimulate(this.simluationId, name))
        .then((res) => {
          this.status = res.data;
          this.simulationHistory = [...this.simulationHistory, { name: name, id: this.simulationHistory.length }]
          // this.$toastr.s('Activity executed')
        })
        .catch((err) => console.error(err))
    },
    reset() {
      axios
        .get(this.$backend.getUrlSimulationReset(this.simluationId))
        .then(() => { this.initiateSimulation(); this.simulationHistory = [] ; this.$toastr.s('Simulation reset')})
        .catch((err) => console.error(err))
    },
    activityIdToName(id) {
      var res = this.json.activities.filter(a => a.id === id)
      return res[0].name
    }
  }
}
</script>
