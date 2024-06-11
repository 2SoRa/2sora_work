<template>
  <!-- 한글도서관 : 영역별 -->
  <ul class="col-list develop col-5">
    <li v-for="(item) in categoryData" :key="item">
      <button type="button" @click="goKorList(item.id, item.name)" :class="item.class"></button>
    </li>
  </ul>
</template>
<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      categoryData : [
        {
          id : '2',
          name : '언어 발달',
          class : 'language'
        },
        {
          id : '3',
          name : '인지 발달',
          class : 'recognition'
        },
        {
          id : '4',
          name : '정서 발달',
          class : 'emotion'
        },
        {
          id : '1',
          name : '사회성 발달',
          class : 'sociality'
        },
        {
          id : '5',
          name : '창의사고력',
          class : 'creativity'
        }
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