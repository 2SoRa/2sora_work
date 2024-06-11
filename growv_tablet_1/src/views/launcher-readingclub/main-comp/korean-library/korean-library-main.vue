<template>
  <!-- 한글 도서관 메인 -->
  <div class="library" :class="{'sub-main' : currentKorCategory === 'kind'}">
    <div class="sub-gnb">
      <div class="sub-gnb-left">
        <button type="button" class="btn-back"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
      </div>
      <h1>한글 도서관</h1>
      <div class="sub-gnb-right">
        <button type="button" class="btn-close"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
      </div>
    </div>
    <div class="contents">
      <!-- 내가 읽은 한글 책 수량 정보 -->
      <div class="reading-total">
        <ul>
          <li>{{ insertDotNumber(totalVscan) }}권</li>
          <li>{{ insertDotNumber(totalEbook) }}권</li>
        </ul>
        <!--  TODO: 안내팝업 페이지 연결 필요 -->
        <button type="button" class="btn-info"><router-link :to="{name: 'viewBridgeKind' ,query:{path:'guide-library'}}"></router-link></button>
      </div>
      <!-- 국문 도서관 탭 -->
      <div class="condition">
        <div class="search-wrap">
          <span v-if="currentKorCategory !== 'kind'" class="bubble-bg"></span>
<!--  TODO : 연령삭제        -->
<!--          <ul class="condition-list">-->
<!--            <li v-for="(item, index) in categoryData" :class="[{ active: currentKorCategory === item.id }, item.id]" :key="index">-->
<!--              <router-link :to="{ name : item.router }">-->
<!--                {{ item.name }}-->
<!--              </router-link>-->
<!--            </li>-->
<!--          </ul>-->
          <ul class="sub-menu-category-wrap no-pub">
            <li v-for="(item, index) in categoryData" :class="[{ active: currentKorCategory === item.id }, item.id]" :key="index">
              <router-link :to="{ name: item.router}">
                {{ item.name }}
              </router-link>
            </li>
          </ul>
          <button type="button" class="book-search">
            <router-link :to="{ name : 'koreanLibrarySearch' }">책검색</router-link>
          </button>
        </div>
      </div>
      <p class="keyword-info" v-show="currentKorCategory === 'keyword'">흥미 위주로 선정된 키워드의 책입니다. 더 많은 책은 책 검색을 통해 만나보세요.</p>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import numberMixin from '@/common/mixin/numberMixin';
import readingClubFactory from "@/api/reading-club/readingClub-factory";

const koreanLibraryApi = readingClubFactory.get('koreanLibrary')
export default {
  mixins : [ numberMixin ],
  data () {
    return {
      studentId : null,
      totalVscan : 0,
      totalEbook : 0,
      currentKorCategory: '',
      categoryData : [
        {
          id : 'develop',
          name : '영역별',
          router : 'koreanLibraryDevelopment'
        },
        {
          id : 'kind',
          name : '갈래별',
          router : 'koreanLibraryKind'
        },
        {
          id : 'keyword',
          name : '키워드별',
          router : 'koreanLibraryKeyword'
        },
        //   TODO: 추후에 다시 원복
        // {
        //   id : 'age',
        //   name : '연령별',
        //   router : 'koreanLibraryAge'
        // },
        // {
        //   id : 'pub',
        //   name : '출판사별',
        //   router : 'koreanLibraryPublisher'
        // }
      ]
    }
  },
  computed : {
    ...mapGetters(['userInfo'])
  },
  watch: {
    '$route'() {
      this.setCurrentCategory();
    },
  },
  created() {
    this.studentId = this.userInfo.info.studentId;
    this.setCurrentCategory();
    this.getKorReadCount();
  },
  methods: {
    ...mapMutations('koreanLibraryStorage', [
      'updateKorCategory',
      'updateAge'
    ]),
    /* 한글도서관 책 카운트 */
    getKorReadCount() {
      const countData = koreanLibraryApi.getKorReadCount(this.studentId);
      countData.then((res) => {
        if (res.status === 200) {
          this.totalEbook = res.data.data.readCnt;
          this.totalVscan = res.data.data.vscanCnt
          this.updateAge(res.data.data.studentAge);
        }
      }).catch((err) => { console.log(err) })
    },
    setCurrentCategory() {
      const categoryName = this.$route.name;
      switch(categoryName) {
        case 'koreanLibraryKind' :
          this.currentKorCategory = 'kind';
          break;
        case 'koreanLibraryDevelopment' :
          this.currentKorCategory = 'develop';
          break;
        case 'koreanLibraryKeyword' :
          this.currentKorCategory = 'keyword';
          break;
        case 'koreanLibraryAge' :
          this.currentKorCategory = 'age';
          break;
        case 'koreanLibraryPublisher' :
          this.currentKorCategory = 'pub';
          break;
      }
      this.updateKorCategory(this.currentKorCategory);
    }
  }
}
</script>