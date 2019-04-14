<template>
  <v-layout row wrap class="pa-4">
    <v-flex lg12 md12>
      <EventForm />
    </v-flex>
  </v-layout>
</template>
<script>
import EventForm from "../components/form/EventForm";

export default {
  name: "AddApplication",
  components: {
    EventForm
  },
  methods: {}
};
</script>