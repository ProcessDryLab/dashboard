<template>
  <div id='app'>
    <b-navbar toggleable='lg' type='dark' variant='dark' class='shadow' style="background-color: #900 !important">
      <b-navbar-brand href='#'>
        <img src='@/assets/dtu.png' class='d-inline-block align-top' alt='DTU' height='30' />
        PDL - ProcessDryLab
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
                <b-dropdown-item variant='outline-secondary' v-b-modal.mine-log
                  :disabled="this.systemStatus != 'online'">Mine from an XES with DisCoveR</b-dropdown-item>
              </b-dropdown>
            </b-button-group>            
            <h6 class="sidebar-heading justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
              :class="this.processes.length > 0 ? 'd-flex' : 'd-none'">
              Processes
            </h6>
            <ProcessesList
              v-bind:processes='processes'
              @newProcessJson='newProcessFromJson' />
            <SystemStatus v-bind:systemStatus='systemStatus' :systemStatusMiner='systemStatusMiner' />
            
            <NewProcess @newProcessFromJson="newProcessFromJson" />
            <NewProcessEmpty @newProcessEmpty="newProcessEmpty" />
            <Mine @newProcessMined="newProcessMined" />
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
import Mine from './components/modals/Mine.vue'

import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default {
  components: {
    ProcessesList,
    SystemStatus,
    NewProcess,
    NewProcessEmpty,
    Mine
  },
  data () {
    return {
      processes: [],
      systemStatus: 'booting',
      systemStatusMiner: 'booting',
      refreshProcess: false
    }
  },
  methods: {
    checkStatus() {
      axios
        .get(this.$backend.getUrlPing())
        .then((res) => (this.systemStatus = res.data === 'pong' ? 'online' : 'offline'))
        .catch((err) => { console.error(err) ; this.systemStatus = 'offline' })
      axios
        .get(this.$backendMiner.getUrlPing())
        .then((res) => (this.systemStatusMiner = res.data === 'pong' ? 'online' : 'offline'))
        .catch((err) => { console.error(err) ; this.systemStatusMiner = 'offline' })
    },
    addProcess(processName, processJson) {
      this.processes = [...this.processes, { id: uuidv4(), name: processName, json: JSON.parse(processJson) }]
      this.$toastr.s('New process created!')
    },
    newProcessFromJson(processName, processJson) {
      axios
        .post(this.$backend.getUrlImportFromDcrJson(), JSON.parse(processJson))
        .then((res) => 
          this.addProcess(processName, JSON.stringify(res.data))
          // console.log(res)
        )
        .catch((err) => console.error(err))
    },
    newProcessMined(processName, processJson) {
      this.addProcess(processName, JSON.stringify(processJson))
    },
    newProcessEmpty(processName) {
      this.addProcess(processName, '{"activities":[],"relations":[]}')
    },
    loadDemo() {
      this.newProcessFromJson("Demo", '{"DCRModel":[{"description":"","type":"DCRModel","roles":[],"events":[{"id":"35f2811d-75f6-41bc-8c4c-cedae6afd4a2","label":"Create"},{"id":"229f74ee-8ec1-4b95-8a26-7cbaed060a08","label":"Approve"},{"id":"070adbfc-dd39-4db2-a5ee-b599c70d5e80","label":"Payout"},{"id":"18cb3d0f-9fd4-47d8-b86f-f1654eaed760","label":"Reject"}],"rules":[{"type":"exclude","source":"35f2811d-75f6-41bc-8c4c-cedae6afd4a2","target":"35f2811d-75f6-41bc-8c4c-cedae6afd4a2","description":""},{"type":"include","source":"229f74ee-8ec1-4b95-8a26-7cbaed060a08","target":"070adbfc-dd39-4db2-a5ee-b599c70d5e80","description":""},{"type":"condition","source":"35f2811d-75f6-41bc-8c4c-cedae6afd4a2","target":"229f74ee-8ec1-4b95-8a26-7cbaed060a08","description":""},{"type":"condition","source":"35f2811d-75f6-41bc-8c4c-cedae6afd4a2","target":"18cb3d0f-9fd4-47d8-b86f-f1654eaed760","description":""},{"type":"condition","source":"229f74ee-8ec1-4b95-8a26-7cbaed060a08","target":"070adbfc-dd39-4db2-a5ee-b599c70d5e80","description":""},{"type":"response","source":"35f2811d-75f6-41bc-8c4c-cedae6afd4a2","target":"070adbfc-dd39-4db2-a5ee-b599c70d5e80","description":""},{"type":"exclude","source":"18cb3d0f-9fd4-47d8-b86f-f1654eaed760","target":"070adbfc-dd39-4db2-a5ee-b599c70d5e80","description":""}]}]}')
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
