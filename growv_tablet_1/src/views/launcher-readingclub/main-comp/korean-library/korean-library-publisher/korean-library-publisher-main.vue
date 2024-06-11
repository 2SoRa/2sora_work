<template>
  <!-- 한글도서관 : 출판사별 -->
  <ul class="col-list content-scroll-area col-5 pub">
    <li v-for="item in categoryData" :key="item">
      <button type="button" @click="goKorList(item.keywordId, item.keywordNm)">
        <span v-if="!item.thumbUrl">{{ item.keywordNm }}</span>
        <img v-else :src="item.thumbUrl + '?v=' + new Date().getTime()" :alt="item.keywordNm">
      </button>
    </li>
  </ul>
</template>

<script>
import { mapMutations } from "vuex";
import readingClubFactory from "@/api/reading-club/readingClub-factory";

const koreanLibraryApi = readingClubFactory.get('koreanLibrary')
export default {
  data() {
    return {
      categoryData: [
      ],
    }
  },
  created() {
    this.getKorPublisher();
  },
  methods:{
    ...mapMutations('koreanLibraryStorage', [
      'updateKorSubCategory'
    ]),
    getKorPublisher() {
      const publisherData = koreanLibraryApi.getKorPublisher();
      publisherData.then((res) => {
        if (res.status === 200) this.categoryData = res.data.data;
      }).catch((err) => { console.log(err) })
    },
    goKorList(id, name) {
      this.updateKorSubCategory({ id : id, name : name });
      this.$router.push({ name : 'koreanLibrarySub' });
    }
  }}
</script>