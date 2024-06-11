<template>
  <div class="library eng" :class="{'sub-main' : currentEngCategory === 'step', 'sub-main theme' : currentEngCategory === 'theme'}">
    <div class="sub-gnb">
      <div class="sub-gnb-left">
        <button type="button" class="btn-back"><router-link :to="{ name: 'ReadingClubMainView' }"></router-link></button>
      </div>
      <h1>영어 도서관</h1>
      <div class="sub-gnb-right">
        <button type="button" class="btn-close"><router-link :to="{ name: 'ReadingClubMainView' }"></router-link></button>
      </div>
    </div>
      <div class="contents">
        <!--  내가 읽은 영어 책-->
        <div class="reading-total">
          <!--  모션북 모아보기 -->
          <button type="button" class="motion-link">
            <router-link :to="{ name: 'englishLibrarySub', query: { name: 'motionBook' } }"></router-link>
          </button>
          <ul>
            <!--    v스캔-->
            <li>{{vScanCount}}권</li>
            <!--    온라인책-->
            <li>{{onlineCount}}권</li>
          </ul>
          <!--  TODO: 안내팝업 페이지 연결 필요 -->
          <button type="button" class="btn-info"><router-link :to="{name: 'viewBridgeKind' ,query:{path:'guide-library-eng'}}"></router-link></button>
        </div>
        <div class="condition">
          <div class="search-wrap">
            <span v-if="currentEngCategory !== 'step'" class="bubble-bg"></span>
            <ul class="condition-list">
              <li v-for="(item, index) in categoryData" :class="[{ active: currentEngCategory === item.id }, item.id]" :key="index">
                <router-link :to="{ name : item.router }">
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
            <button type="button" class="book-search">
              <router-link :to="{ name : 'englishLibrarySearch' }">책검색</router-link>
            </button>
          </div>
        </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import readingClubFactory from "@/api/reading-club/readingClub-factory";

const englishLibraryApi = readingClubFactory.get('englishLibrary')

export default {
  data() {
    return {
      isActive: "",
      currentEngCategory: "",
      vScanCount: 0,
      onlineCount:0,
      selLevel:0,
      categoryData : [
        {
          id : 'step',
          name : '단계별',
          router : 'englishLibraryStep'
        },
        {
          id : 'theme',
          name : '테마별',
          router : 'englishLibraryTheme'
        },
        {
          id : 'keyword',
          name : '키워드별',
          router : 'englishLibraryKeyword'
        },
        {
          id : 'pub',
          name : '출판사별',
          router : 'englishLibraryPublisher'
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.studentId = this.userInfo.info.studentId;
    this.setCurrentCategory();
    this.getBookCount();
  },
  watch: {
    $route() {
      this.setCurrentCategory();
    },
  },
  methods: {
    ...mapMutations('englishLibraryStorage', [
        'updateEngCategory',
        'updateSelLevel'
    ]),
    setCurrentCategory() {
      const categoryName = this.$route.name;
      switch (categoryName) {
        case "englishLibraryStep":
          this.currentEngCategory = "step";
          break;
        case "englishLibraryTheme":
          this.currentEngCategory = "theme";
          break;
        case "englishLibraryKeyword":
          this.currentEngCategory = "keyword";
          break;
        case "englishLibraryPublisher":
          this.currentEngCategory = "pub";
          break;
      }
      this.updateEngCategory(this.currentEngCategory);
    },
    getBookCount() {
      const bookCount = englishLibraryApi.getEngReadCount(this.studentId);
      bookCount.then((res) => {
        this.vScanCount = res.data.data.vscanCnt;
        this.onlineCount = res.data.data.readCnt;
        this.selLevel = res.data.data.selStep;
        this.updateSelLevel(this.selLevel);
      }).catch((error) => {
        console.log(error)
      })

    }
  },
};
</script>

<style></style>
