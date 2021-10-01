<template>
  <div id='app'>
    <b-navbar toggleable='lg' type='dark' variant='dark' class='shadow'>
      <b-navbar-brand href='#'>
        <img src='@/assets/dtu.png' class='d-inline-block align-top' alt='DTU' height='30' />
        DCR Engine
      </b-navbar-brand>
      <b-navbar-toggle target='nav-collapse'></b-navbar-toggle>
      <b-collapse id='nav-collapse' is-nav>
        <b-navbar-nav class='ml-auto'>
          <b-nav-item>About</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-container fluid>
      <b-row>
        <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse border-right p-0 ">
          <div class='sidebar-sticky pt-3'>

            <b-button-group class="ml-3">
              <b-button variant='outline-secondary' v-b-modal.new-process-empty
                :disabled="this.systemStatus != 'online'"><font-awesome-icon icon="file" /> New</b-button>
              <b-dropdown right text="Import" variant="outline-secondary">
                <b-dropdown-item variant='outline-secondary' @click="loadDemo"
                  :disabled="this.systemStatus != 'online'">Demo</b-dropdown-item>
                <b-dropdown-item variant='outline-secondary' v-b-modal.new-process
                  :disabled="this.systemStatus != 'online'">Import from JSON</b-dropdown-item>
              </b-dropdown>
            </b-button-group>            
            <h6 class="sidebar-heading justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
              :class="this.processes.length > 0 ? 'd-flex' : 'd-none'">
              Processes
            </h6>
            <ProcessesList v-bind:processes='processes' />
            <SystemStatus v-bind:systemStatus='systemStatus' />
            
            <NewProcess @newProcessFromJson="newProcessFromJson" />
            <NewProcessEmpty @newProcessEmpty="newProcessEmpty" />
          </div>
        </nav>
        <main role='main' class='col-md-9 ml-sm-auto col-lg-10 pl-md-4 pt-3 pr-0'>
          <router-view
            :processes='processes'
            :refreshProcess='refreshProcess'
            @newConstraint='newConstraint'
            @processRereshed='processRereshed' />
        </main>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import ProcessesList from './components/widgets/ProcessesList.vue'
import SystemStatus from './components/widgets/SystemStatus.vue'
import NewProcess from './components/modals/NewProcess.vue'
import NewProcessEmpty from './components/modals/NewProcessEmpty.vue'

import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default {
  components: {
    ProcessesList,
    SystemStatus,
    NewProcess,
    NewProcessEmpty
  },
  data () {
    return {
      processes: [],
      systemStatus: 'booting',
      refreshProcess: false
    }
  },
  methods: {
    checkStatus() {
      axios
        .get(this.$backend.getUrlPing())
        .then((res) => (this.systemStatus = res.data === 'pong' ? 'online' : 'offline'))
        .catch((err) => console.error(err))
    },
    newProcessFromJson(processName, processJson) {
      this.processes = [...this.processes, { id: uuidv4(), name: processName, json: JSON.parse(processJson) }]
      this.$toastr.s('New process created!')
    },
    newProcessEmpty(processName) {
      this.newProcessFromJson(processName, '{"activities":[],"executedActivities":[],"relations":[],"included":[],"pending":[]}')
    },
    loadDemo() {
      this.newProcessFromJson("Demo", '{"activities":[{"name":"Payout"},{"name":"Create"},{"name":"Approve"},{"name":"Reject"}],"executedActivities":[],"relations":[{"source":{"name":"Approve"},"target":{"name":"Payout"},"relation":"INCLUDE"},{"source":{"name":"Create"},"target":{"name":"Reject"},"relation":"CONDITION"},{"source":{"name":"Approve"},"target":{"name":"Payout"},"relation":"CONDITION"},{"source":{"name":"Create"},"target":{"name":"Approve"},"relation":"CONDITION"},{"source":{"name":"Create"},"target":{"name":"Payout"},"relation":"RESPONSE"},{"source":{"name":"Reject"},"target":{"name":"Payout"},"relation":"EXCLUDE"},{"source":{"name":"Reject"},"target":{"name":"Approve"},"relation":"EXCLUDE"},{"source":{"name":"Approve"},"target":{"name":"Reject"},"relation":"EXCLUDE"},{"source":{"name":"Approve"},"target":{"name":"Approve"},"relation":"EXCLUDE"},{"source":{"name":"Create"},"target":{"name":"Create"},"relation":"EXCLUDE"}],"included":[{"name":"Payout"},{"name":"Create"},{"name":"Approve"},{"name":"Reject"}],"pending":[{"name":"Create"}]}')
    },
    newConstraint(id, source, relationship, target) {
      const matches = this.processes.filter((p) => p.id === id)
      if (matches.length === 1) {
        var idx = this.processes.indexOf(matches[0])
        axios
          .post(this.$backend.getUrlEditModel(source, relationship, target), this.processes[idx].json)
          .then((res) => {
            this.processes[idx].json = res.data
            this.refreshProcess = true
          })
          .catch((err) => console.error(err))
      }
    },
    processRereshed() {
      this.refreshProcess = false
    }
  },
  mounted () {
    this.checkStatus()
    setInterval(() => {
      this.checkStatus()
    }, 1000 * 15)
  }
}
</script>

<style>
.sidebar-sticky {
  height: calc(100vh - 56px);
}
</style>
