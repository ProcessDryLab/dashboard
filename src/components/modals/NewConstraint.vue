<template>
  <b-modal
    id="new-constraint"
    title="New Constraint"
    @ok="handleOk"
  >
    <b-form-group label="Source activity:" label-for="source">
      <b-form-input
        v-model="source"
        required
        placeholder="Activity"
      ></b-form-input>
    </b-form-group>
    <b-form-group label="Relation:" label-for="relation">
      <b-form-select
          v-model="relation"
          :options="possibleRelations"
          required
        ></b-form-select>
    </b-form-group>
    <b-form-group label="Target activity:" label-for="target">
      <b-form-input
        v-model="target"
        required
        placeholder="Activity"
      ></b-form-input>
    </b-form-group>
    
  </b-modal>
</template>

<script>
export default {
  name: 'NewConstraint',
  data () {
    return {
      source: '',
      relation: '',
      target: '',
      possibleRelations: ['CONDITION', 'RESPONSE', 'INCLUDE', 'EXCLUDE', 'MILESTONE']
    }
  },
  methods: {
    handleOk () {
      this.$emit('newConstraint', this.source, this.relation, this.target)
    }
  }
}
</script>
