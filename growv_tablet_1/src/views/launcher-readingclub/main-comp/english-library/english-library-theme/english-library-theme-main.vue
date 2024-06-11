<template>
  <!-- 영어도서관 : 테마별-->
  <ul class="col-list col-3 theme">
    <li v-for="item in themeData" :key="item">
      <button type="button" @click="goEngList(item.id,item.name)"></button>
    </li>
  </ul>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      themeData:[
        {
          id:3,
          name:'신체와 건강',
        },
        {
          id:2,
          name:'명작 이야기',
        },
        {
          id:4,
          name:'역사와 사회',
        },
        {
          id:5,
          name:'예술과 문화',
        },
        {
          id:6,
          name:'자연과 과학'
        },
        // {
        //   id:6,
        //   name:'일상 생활',
        // },
        {
          id:1,
          name:'감정과 생활',
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
