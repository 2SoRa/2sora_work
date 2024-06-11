<template>
<!-- 영어도서관 : 단계별-->
  <ul class="col-list col-3 step">
    <li v-for="item in stepData" :key="item">
      <button type="button" @click="goEngList(item.id,item.name)" :class="item.class">
        <span class="motion-bg"></span>
        <span class="title"></span>
      </button>
    </li>
  </ul>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      stepData:[
        {
          id:0,
          name:"Basic",
          class: "basic"
        },
        {
          id:1,
          name:"Intermediate",
          class:"intermediate",
        },
        {
          id:2,
          name:"Advanced",
          class:"advanced",
        },
      ]
    };
  },
  methods: {
    ...mapMutations('englishLibraryStorage', [
        'updateEngSubCategory'
    ]),

    goEngList(id,name) {
      this.updateEngSubCategory({id:id , name: name});
      this.$router.push({ name : 'englishLibrarySub' });
    },
  },
};
</script>

<style></style>
