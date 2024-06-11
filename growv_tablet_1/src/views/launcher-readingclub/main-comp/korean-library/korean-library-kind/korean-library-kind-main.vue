<template>
  <!-- 한글도서관 : 갈래별 -->
  <div class="col-list kind">
    <li v-for="(item, index) in categoryData" :key="index" :class="item.class">
      <button type="button" @click="goKorList(item.id, item.name)"></button>
    </li>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      categoryData : [
        {
          id : '1',
          name : '과학·환경',
          class : 'science',
        },
        {
          id : '7',
          name : '전래·명작',
          class : 'traditional',
        },
        {
          id : '3',
          name : '사회·경제',
          class : 'social',
        },
        {
          id : '2',
          name : '교양·학습',
          class : 'refinement',
        },
        {
          id : '6',
          name : '인성·생활',
          class : 'personality',
        },
        {
          id : '5',
          name : '예술·문화',
          class : 'art',
        },
        {
          id : '4',
          name : '역사·인물',
          class : 'history',
        },
        //   원래순서
        // {
        //   id : '7',
        //   name : '전래·명작',
        //   class : 'traditional',
        // },
        // {
        //   id : '3',
        //   name : '사회·경제',
        //   class : 'social',
        // },
        // {
        //   id : '1',
        //   name : '과학·환경',
        //   class : 'science',
        // },
        // {
        //   id : '5',
        //   name : '예술·문화',
        //   class : 'art',
        // },
        // {
        //   id : '4',
        //   name : '역사·인물',
        //   class : 'history',
        // },
        // {
        //   id : '2',
        //   name : '교양·학습',
        //   class : 'refinement',
        // },
        // {
        //   id : '6',
        //   name : '인성·생활',
        //   class : 'personality',
        // },
      ]
    }
  },
  methods:{
    ...mapMutations('koreanLibraryStorage', [
        'updateKorSubCategory'
    ]),
    goKorList(id, name) {
      this.updateKorSubCategory({ id : id, name : name });
      this.$router.push({ name : 'koreanLibrarySub' });
    }
  }
}
</script>