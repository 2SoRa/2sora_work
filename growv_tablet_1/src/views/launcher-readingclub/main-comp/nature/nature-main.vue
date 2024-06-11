<template>
  <!-- 자연 관찰 -->
  <div class="library">
    <div class="sub-gnb">
      <div class="sub-gnb-left">
        <button type="button" class="btn-back"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
      </div>
      <h1>자연 관찰</h1>
      <div class="sub-gnb-right">
        <button type="button" class="search">
          <router-link :to="{ name : 'natureSearch' }" style="color:#000 !important;font-size:20px">검색하기</router-link>
        </button>
        <button type="button" class="btn-close"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
      </div>
    </div>
    <!-- 자연관찰 카테고리 -->
    <div>
      <button type="button" v-for="item in categoryData" :key="item" :class="{ active : currentCategory === item.id }" @click="toggleCategory(item.id)" style="font-size:30px">
        <span>
          [{{ item.name }}]
        </span>
      </button>
    </div>
    <!-- 자연관찰 목록 -->
    <div class="library sub">
      <div class="book-list-wrap content-scroll-area">
        <div class="row-group">
          <ul class="book-list" v-if="bookListData && bookListData.length > 0">
            <li v-for="(item, index) in bookListData" :key="item" class="list-item">
              <div class="thumb-wrap">
                <span class="sta-book check-read" v-if="item.isRead"></span>
                <div class="thumbnail">
                  <img :src="item.thumbUrl" :alt="item.bookId">
                </div>
                <div class="thumb-info">
                  <div class="book-kind">
                    <span :class="{show : item.isMotionBook}" class="motion-book">모션북</span>
                    <span :class="{show : item.isEbook}" class="e-book">이북</span>
                  </div>
                  <button class="save" @click="toggleStorage(index, item.bookId, item.isStorage)" :class="{ 'save-off' : !item.isStorage }"></button> <!-- 담기 &빼기 -->
                </div>
                <div class="view"></div>
              </div>
              <div class="tag-wrap shadow-box">
                <div class="tag">
                  <img src="@/assets/img/launcher-readingclub/library/kor/ico_tag_sociality.webp" alt="사회성" class="tag-item">
                  <img src="@/assets/img/launcher-readingclub/library/kor/ico_tag_emotion.webp" alt="정서" class="tag-item">
                  <!--
                  <img src="@/assets/img/launcher-readingclub/library/kor/ico_tag_recognition.webp" alt="창의사고" class="tag-item">
                  <img src="@/assets/img/launcher-readingclub/library/kor/ico_tag_creativity.webp" alt="인지" class="tag-item">
                  <img src="@/assets/img/launcher-readingclub/library/kor/ico_tag_language.webp" alt="언어" class="tag-item">
                  -->
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import functionMixin from "@/common/mixin/functionMixin";

const natureApi = readingClubFactory.get('nature');
export default {
  mixins : [ functionMixin ],
  data() {
    return {
      studentId : '',
      currentCategory : '',
      categoryData : [
        {
          id : '',
          name : '전체'
        },
        {
          id : '3',
          name : '동물'
        },
        {
          id : '4',
          name : '식물'
        },
        {
          id : '5',
          name : '곤충'
        },
        {
          id : '6',
          name : '자연과 생활'
        }
      ],
      bookListData : null
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.studentId = this.userInfo.info.studentId;
  },
  mounted() {
    this.getNatureList();
  },
  methods : {
    getNatureList() {
      const params = {
        bookCateId : this.currentCategory,
        studentId : this.studentId,
        pageSize : 10,
        pageIndex : 1
      }
      const natureData = natureApi.getNatureList(params);
      natureData.then((res) => {
        if (res.status === 200) this.bookListData = res.data.data.items;
      }).catch((err) => { console.log(err) })
    },
    toggleCategory(id) {
      this.currentCategory = id;
      this.getNatureList();
    }
  }
}
</script>

<style scoped>
  button.active {background:#0080cc}
</style>