<template>
  <!-- 한글도서관 : 키워드별 -->
  <ul class="col-list content-scroll-area col-6 keyword">
    <li v-for="item in categoryData" :key="item">
      <button type="button" @click="goKorList(item.keywordId, item.keywordNm)">
        <img :src="item.thumbUrl + '?v=' + new Date().getTime()"  :alt="item.keywordNm">
      </button>
    </li>
  </ul>
</template>

<!--<button type="button" v-for="item in categoryData" :key="item" @click="goKorList(item.keywordId, item.keywordNm)">-->
<!--<img :src="item.thumbUrl + '?v=' + new Date().getTime()"  :alt="item.keywordNm">-->
<!--</button>-->
<script>
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import { mapMutations } from "vuex";

const koreanLibraryApi = readingClubFactory.get('koreanLibrary')
export default {
  data() {
    return {
      categoryData: [],
    }
  },
  created() {
    this.getKorKeywords();
  },
  methods:{
    ...mapMutations('koreanLibraryStorage', [
      'updateKorSubCategory'
    ]),
    /* 등록된 키워드 가져오기 */
    getKorKeywords() {
      const keywordData = koreanLibraryApi.getKorKeywords();
      keywordData.then((res) => {
        if (res.status === 200) this.categoryData = res.data.data;
      }).catch((err) => { console.log(err) })
    },
    goKorList(id, name) {
      this.updateKorSubCategory({ id : id, name : name });
      this.$router.push({ name : 'koreanLibrarySub' });
    }
  }
}
</script>

<style>
</style>