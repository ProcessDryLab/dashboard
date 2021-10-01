<template>
  <div class="list-group list-group-flush">
    <b-list-group-item
      v-bind:key="proc.name"
      v-for="proc in processes"
      class="list-group-item list-group-item-action bg-light border-0 align-items-center p-2 pl-3"
      :to="{ name: 'ProcessView', params: { id: proc.id } }">
      <font-awesome-icon icon="file" />
      Process {{ proc.name }}
    </b-list-group-item>
  </div>
</template>

<script>
export default {
  name: 'ProcessesList',
  props: ['processes']
}
</script>
