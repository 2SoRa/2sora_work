<template>
  <!-- 한글도서관 : 연령별 -->
  <ul class="col-list col-2 age">
    <li v-for="(item) in categoryData" :key="item">
      <button type="button" @click="goKorList(item)"></button>
    </li>
  </ul>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      categoryData : ['3','4','5','6']
    }
  },
  methods:{
    ...mapMutations('koreanLibraryStorage', [
      'updateKorSubCategory'
    ]),
    goKorList(name) {
      this.updateKorSubCategory({ id : 'bookAgeCd', name : name });
      this.$router.push({ name : 'koreanLibrarySub' });
    }
  }
}
</script>