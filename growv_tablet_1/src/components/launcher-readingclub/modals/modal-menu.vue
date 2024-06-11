<template>
  <div class="modal-allmenu">
    <div class="sub-gnb">
      <div class="sub-gnb-left">
        <button type="button" @click="closePopup" class="btn-back"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
      </div>
      <h1>슈퍼리딩 전체 메뉴</h1>
    </div>
    <div class="content-scroll-area">
      <div class="side-wrap">
        <div class="side-area">
          <div class="modal-menu-wrap menu-kor-lib">
            <h2 class="menu-tit"><router-link :to="{name:'koreanLibraryDevelopment' ,query : { menu : true}}"><img src="@/assets/img/launcher-readingclub/common/menu/menu_title_han_lib.webp" alt="한글 도서관"></router-link></h2>
            <dl class="rounded-tit-list">
              <dt class="list-tit type-blue"><router-link :to="{name:'koreanLibraryDevelopment', query : { menu : true}}" class="item">영역별</router-link></dt>
              <dd class="list-item">
                <ul class="border-bot-list col-list col-2">
                  <li><a class="item" @click="goKorPage('1','언어 발달','develop')">언어 발달</a></li>
                  <li><a class="item" @click="goKorPage('2','인지 발달','develop')">인지 발달</a></li>
                  <li><a class="item" @click="goKorPage('3','정서 발달','develop')">정서 발달</a></li>
                  <li><a class="item" @click="goKorPage('5','창의사고력','develop')">창의사고력</a></li>
                  <li><a class="item" @click="goKorPage('4','사회성 발달','develop')">사회성 발달</a></li>
                </ul>
              </dd>
              <dt class="list-tit type-blue"><router-link :to="{name:'koreanLibraryKind' ,query : { menu : true}}" class="item">갈래별</router-link></dt>
              <dd class="list-item">
                <ul class="border-bot-list col-list col-2">
                  <li><a class="item" @click="goKorPage('7','전래·명작','kind')">전래 ∙ 명작</a></li>
                  <li><a class="item" @click="goKorPage('5','예술·문화','kind')">예술 ∙ 문화</a></li>
                  <li><a class="item" @click="goKorPage('3','사회·경제','kind')">사회 ∙ 경제</a></li>
                  <li><a class="item" @click="goKorPage('1','과학·환경','kind')">과학 ∙ 환경</a></li>
                  <li><a class="item" @click="goKorPage('4','역사·인물','kind')">역사 ∙ 인물</a></li>
                  <li><a class="item" @click="goKorPage('2','교양·학습','kind')">교양 ∙ 학습</a></li>
                  <li><a class="item" @click="goKorPage('6','인성·생활','kind')">인성 ∙ 생활</a></li>
                </ul>
              </dd>
            </dl>
            <ul class="rounded-tit-list col-list col-2">
              <!--연령별은 추후 오픈예정-->
<!--              <li class="list-tit type-blue"><router-link :to="{name:'koreanLibraryAge'}" class="item">연령별</router-link></li>-->
<!--              <li class="list-tit type-blue"><router-link :to="{name:'koreanLibraryPublisher' ,query : { menu : true}} " class="item">출판사별</router-link></li>-->
              <li class="list-tit type-blue"><router-link :to="{name:'koreanLibraryKeyword' ,query : { menu : true}}" class="item">키워드별</router-link></li>
              <li class="list-tit type-blue"><router-link :to="{name:'koreanLibrarySearch' ,query : { menu : true}}" class="item">한글책 찾기</router-link></li>
            </ul>
          </div>
          <div class="modal-menu-wrap menu-jaram">
            <h2 class="menu-tit"><router-link :to="{name:'myTreeMain',query : { menu : true}}"><img src="@/assets/img/launcher-readingclub/common/menu/menu_title_jaram.webp" alt="나의 자람나무"></router-link></h2>
            <ul class="border-bot-list col-list col-2">
              <li><router-link :to="{name:'myTreeMain' ,query : { menu : true}}" class="item border-none">올해의 숲지도</router-link></li>
              <li><router-link :to="{path : `/my-tree/` + year + `/` + month  ,query : { menu : true}}" class="item border-none">이달의 자람나무</router-link></li>
            </ul>
          </div>
        </div>
        <div class="side-area">
          <div class="modal-menu-wrap menu-eng-lib">
            <h2 class="menu-tit"><router-link :to="{name:'englishLibraryStep' ,query : { menu : true}}"><img src="@/assets/img/launcher-readingclub/common/menu/menu_title_eng_lib.webp" alt="영어 도서관"></router-link></h2>
            <dl class="rounded-tit-list">
              <dt class="list-tit type-purple"><router-link :to="{name:'englishLibraryStep' ,query : { menu : true}}" class="item">단계별</router-link></dt>
              <dd class="list-item">
                <ul class="border-bot-list col-list col-2">
                  <li><a class="item" @click="goEngList(0,'Basic','step')">Basic</a></li>
                  <li><a class="item" @click="goEngList(1,'Intermediate','step')">Intermediate</a></li>
                  <li><a class="item" @click="goEngList(2,'Advanced','step')">Advanced</a></li>
                </ul>
              </dd>
            </dl>
            <dl class="rounded-tit-list">
              <dt class="list-tit type-purple"><router-link :to="{name:'englishLibraryTheme' ,query : { menu : true} }" class="item">테마별</router-link></dt>
              <dd class="list-item">
                <ul class="border-bot-list col-list col-2">
                  <li><a class="item" @click="goEngList(3,'신체와 건강','theme')">신체와 건강</a></li>
                  <li><a class="item" @click="goEngList(2,'명작 이야기','theme')">명작 이야기</a></li>
                  <li><a class="item" @click="goEngList(4,'역사와 사회','theme')">역사와 사회</a></li>
                  <li><a class="item" @click="goEngList(5,'예술과 문화','theme')">예술과 문화</a></li>
                  <li><a class="item" @click="goEngList(6,'자연과 과학','theme')">자연과 과학</a></li>
                  <li><a class="item" @click="goEngList(1,'감정과 생활','theme')">감정과 생활</a></li>
                </ul>
              </dd>
            </dl>
            <ul class="rounded-tit-list col-list col-2">
              <li class="list-tit type-purple"><router-link :to="{name:'englishLibraryKeyword' ,query : { menu : true} }" class="item">키워드별</router-link></li>
              <li class="list-tit type-purple"><router-link :to="{name:'englishLibraryPublisher' ,query : { menu : true}}" class="item">출판사별</router-link></li>
              <li class="list-tit type-purple"><router-link :to="{name: 'englishLibrarySub', query: { name: 'motionBook', menu : true } }" class="item">모션북 모아보기</router-link></li>
              <li class="list-tit type-purple"><router-link :to="{name: 'englishLibrarySearch' ,query : { menu : true}}" class="item">영어책 찾기</router-link></li>
            </ul>
          </div>
          <div class="modal-menu-wrap menu-superbook">
            <h2 class="menu-tit"><router-link :to="{name:'mysuperbookWeek' ,query : { menu : true}}"><img src="@/assets/img/launcher-readingclub/common/menu/menu_title_mybook.webp" alt="마이슈퍼북"></router-link></h2>
            <ul class="border-bot-list col-list col-2">
              <li><router-link :to="{name:'mysuperbookWeek' ,query : { menu : true}}" class="item border-none">주간 리포트</router-link></li>
              <li><router-link :to="{name:'mysuperbookMonth' ,query : { menu : true}}" class="item border-none">월간 리포트</router-link></li>
            </ul>
          </div>
        </div>
        <div class="side-area">
          <div class="modal-menu-wrap menu-my-lib">
            <h2 class="menu-tit"><router-link :to="{name:'myLibraryTodayBook' ,query : { menu : true}}"><img src="@/assets/img/launcher-readingclub/common/menu/menu_title_mylib.webp" alt="내 도서관"></router-link></h2>
            <ul class="border-bot-list col-list col-2">
              <li><router-link :to="{name:'myLibraryTodayBook' ,query : { menu : true}}" class="item">오늘의 책</router-link></li>
              <li><router-link :to="{name:'myLibraryStorage' ,query : { menu : true}}" class="item">보관함</router-link></li>
              <li><router-link :to="{name:'myLibraryVscan' ,query : { menu : true}}" class="item border-none">V스캔 구매한 책</router-link></li>
            </ul>
          </div>
          <div class="modal-menu-wrap size-half menu-superpick">
            <h2 class="menu-tit"><router-link :to="{ name : 'superpickMain' ,query : { menu : true} }"><img src="@/assets/img/launcher-readingclub/common/menu/menu_title_superpick.webp" alt="슈퍼픽"></router-link></h2>
          </div>
          <div class="modal-menu-wrap size-half menu-vscan-camera">
            <h2 class="menu-tit" @click="openAppVscan"><img src="@/assets/img/launcher-readingclub/common/menu/menu_title_vscan.webp" alt="V스캔 카메라"></h2>
          </div>
          <div class="modal-menu-wrap menu-superbook">
            <h2 class="menu-tit"><router-link :to="{name:'searchForm'}"><img src="@/assets/img/launcher-readingclub/common/menu/menu_title_mall.webp" alt="전용몰 도서 찾기"></router-link></h2>
            <ul class="border-bot-list col-list col-2">
              <li><router-link :to="{name:'searchList' , params: {lang: 'kor', active: 0, subactive: 0}}" class="item">한글 도서몰</router-link></li>
              <li><router-link :to="{name:'searchList' , params: {lang: 'eng', active: 0, subactive: 0}}" class="item">영어 도서몰</router-link></li>
              <li><router-link :to="{name:'searchForm' ,query : { menu : true}}" class="item border-none">도서 검색</router-link></li>
              <li><router-link :to="{name:'searchCart' ,query : { menu : true}}" class="item border-none">장바구니</router-link></li>
            </ul>
          </div>
          <div class="modal-menu-wrap menu-my-page">
            <h2 class="menu-tit"><router-link :to="{name:'GrowingTree',query : { menu : true}}"><img src="@/assets/img/launcher-readingclub/common/menu/menu_title_mypage.webp" alt="마이페이지"></router-link></h2>
            <ul class="border-bot-list col-list col-2">
              <li><router-link :to="{name:'readingStatusAttend' ,query : { menu : true}}" class="item">출석부</router-link></li>
              <li><router-link :to="{name:'ShoppingPoint' ,query : { menu : true}}" class="item">쇼핑몰 포인트 내역</router-link></li>
              <li><router-link :to="{name:'readingStatusActiveCalendar' ,query : { menu : true}}" class="item">독서 활동</router-link></li>
              <li><router-link :to="{name:'StudySupportNotice' ,query:{name:'readingClub', menu : true}}" class="item">학습 지원</router-link></li>
              <li><router-link :to="{name:'GrowingTree' ,query : { menu : true}}" class="item border-none">자람나무 내역</router-link></li>
              <li><router-link :to="{name:'MemberInfoMain' ,query : { menu : true}}" class="item border-none">회원 정보 수정</router-link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {mapMutations} from "vuex";

export default {
  data() {
    return{
      year:'',
      month:'',
    }
  },
  mounted() {
    this.getToday()
  },
  methods : {
    ...mapMutations('koreanLibraryStorage', [
      'updateKorSubCategory',
      'updateKorCategory'
    ]),
    ...mapMutations('englishLibraryStorage', [
      'updateEngSubCategory',
      'updateEngCategory'
    ]),
    closePopup() {
      this.$emit('closePopup');
    },
    goKorPage(id,name,type) {
      this.updateKorSubCategory({ id : id, name : name });
      this.updateKorCategory(type)
      this.$router.push({ name : 'koreanLibrarySub', query : { menu : true} });
    },
    goEngList(id,name,type) {
      this.updateEngSubCategory({id:id , name: name});
      this.updateEngCategory(type)
      this.$router.push({ name : 'englishLibrarySub', query : { menu : true} });
    },
    getToday() {
      let date = new Date();
      let txt = (date.getMonth() + 1) + '';
      if (txt.length < 2) {
        txt = '0' + txt;
      }
      this.year = date.getFullYear();
      this.month = txt;
    },
    openAppVscan(rc) {
      const userAgent = navigator.userAgent;
      if (userAgent === 'SuperV-Launcher') {
        // eslint-disable-next-line
        GrowvLauncherBridge.startVScan(rc)
      }
    },
  }
}
</script>