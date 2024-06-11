<template>
  <!-- 영어 도서관 : 출판사별 -->
  <ul class="col-list content-scroll-area col-4 pub">
    <li v-for="item in publisherData" :key="item">
      <button type="button" @click="goEngList(item.keywordId,item.keywordNm)">
       <span v-if="!item.thumbUrl">{{ item.keywordNm }}</span>
        <img v-else :src="item.thumbUrl + '?v=' + new Date().getTime()" class="img-obj-fit-fill">
      </button>
    </li>
  </ul>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import functionMixin from "@/common/mixin/functionMixin";

const englishLibraryApi = readingClubFactory.get('englishLibrary')
export default {
  mixins: [
    functionMixin
  ],
  data() {
    return {
      publisherData:[]
    };
  },
  created() {
    this.getEngPublisher();
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapGetters('readingStorage',['getIsEnglishMember'])
  },
  methods: {
    ...mapMutations('englishLibraryStorage', [
        'updateEngSubCategory'
    ]),
    getEngPublisher() {
      const publisherList = englishLibraryApi.getEngPublisher();
      publisherList.then((res) => {
        this.publisherData = res.data.data
      }).catch((error) => {
        console.log(error)
      })
    },
    goEngList(id,name) {
      //옥스포드 일 경우 옥스포트 앱 실행
      if(id === '5338'){
        if (!this.getIsEnglishMember) {
          this.showToast('영어책은 이용할 수 없어요.');
          return;
        }
        const token = localStorage.getItem("accessToken");
        const studentId = this.userInfo.info.studentId;
        location.href = `intent:#Intent;package=com.spindle.tapas.growv;i.student_id=${studentId};S.token=${token};end`
      } else {
        this.updateEngSubCategory({id: id, name: name});
        this.$router.push({name: 'englishLibrarySub'});
      }
      }
    },
};
</script>

<style></style>
