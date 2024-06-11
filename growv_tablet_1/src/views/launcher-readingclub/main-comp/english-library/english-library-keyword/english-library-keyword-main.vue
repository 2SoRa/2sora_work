<template>
  <!-- 한글도서관 : 키워드별 -->
  <ul class="col-list content-scroll-area col-6 keyword">
    <li v-for="item in keyWordData" :key="item" >
      <button type="button" @click="goEngList(item.keywordId, item.keywordNm)">
        <img :src="item.thumbUrl" :alt="item.keywordNm">
      </button>
    </li>
  </ul>
</template>

<script>
import { mapMutations } from "vuex";
import readingClubFactory from "@/api/reading-club/readingClub-factory";

const englishLibraryApi = readingClubFactory.get('englishLibrary')
export default {
  data() {
    return {
      keyWordData:[]
    };
  },
  created() {
    this.getEngKeyword();
  },
  methods: {
    ...mapMutations('englishLibraryStorage', [
      'updateEngSubCategory',
    ]),
    getEngKeyword() {
      const keywordList = englishLibraryApi.getKEngKeywords();
      keywordList.then((res) => {
        this.keyWordData = res.data.data
      }).catch((error) => {
        console.log(error)
      })
    },
    goEngList(id,name) {
      this.updateEngSubCategory({id:id , name: name});
      this.$router.push({ name : 'englishLibrarySub' });
    },
  },
};
</script>

<style></style>
