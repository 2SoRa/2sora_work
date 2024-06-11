<template>
  <!-- V스캔 : 콘텐츠 구매 안내 -->
  <div class="vscan-mode buy">
    <div class="sub-gnb">
      <h1>V스캔 콘텐츠 구매 안내</h1>
      <div class="sub-gnb-right">
        <button type="button" class="btn-close"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
      </div>
    </div>
    <div class="contents" v-if="currentBook.sbBooks.items[0].publisherEngId !== 5332">
      <h2 class="info-tit">
        <strong>슈퍼리딩 쇼핑몰</strong>에서 구매한 책이 아니에요.<br>
        V스캔으로 감상하려면 <strong>포인트로 구매</strong>할 수 있어요.
      </h2>
      <div class="info-btns-wrap">
        <div class="info-list-wrap">
          <ul class="info-list has-bot-bd">
            <li class="list-item-tit">
              {{ currentBook.sbBooks.items[0].bookNm }}
            </li>
          </ul>
          <ul class="info-list">
            <li class="list-item remain-point"><p>잔여 포인트<small>(<b>{{ userInfo.info.studentName }}</b> 학생 기준)</small>
            </p><em>{{ insertDotNumber(currentBook.pointRemaining) }}</em></li>
            <li class="list-item off-point"><p>차감 포인트</p><em v-if="currentBook.sbBooks.items[0].pointVl">
              {{ currentBook.sbBooks.items[0].bookDiv === 'E' ? '1,000' : '3,000' }}</em></li>
          </ul>
        </div>
        <p
          :class="['guide-txt', { 'sta-shortage' : currentBook.pointRemaining < currentBook.sbBooks.items[0].pointVl }]">
          {{
            currentBook.pointRemaining < currentBook.sbBooks.items[0].pointVl ? '포인트가 부족합니다.' : '학부모 인증 후 구매가 가능합니다.'
          }}
        </p>
        <div class="btn-wrap">
          <button type="button" class="btn-round-321 type-gray" @click="goMainPage"><span class="txt">닫기</span></button>
          <button type="button" class="btn-round-321 type-purple" @click="openAuthPopup"
                  :disabled="currentBook.pointRemaining < currentBook.sbBooks.items[0].pointVl">
            <span class="txt">학부모 인증</span>
          </button>
        </div>
      </div>
    </div>

    <!--TODO : 슈퍼리딩 전용몰 구매 책이 아닌 경우 노출-->
    <div class="contents" v-if="currentBook.sbBooks.items[0].publisherEngId === 5332">
      <h2 class="info-tit">
        <span>슈퍼리딩 전용몰에서 구매한 책이 아니에요.</span>
        <span>
          <strong>Penguin Random House 책은<br>
            슈퍼리딩 전용몰</strong>에서 구입한 책만 V스캔을 이용할 수 있어요.
        </span>
      </h2>
      <div class="info-book-wrap">
        <div class="img-wrap">
          <img src="@/assets/img/launcher-readingclub/dummy/temp_9.webp" alt="도서 썸네일">
        </div>
        <div class="btn-wrap">
          <button type="button" class="btn-round-321 type-gray" @click="goMainPage"><span class="txt">닫기</span></button>
        </div>
      </div>
    </div>
  </div>
  <AuthModal :propsData="{authShowModal}" @closePopup="closeAuthPopup"></AuthModal>
  <AuthBuyModal :propsData="{confirmShowModal}" @closePopup="closeAuthBuyPopup"></AuthBuyModal>
</template>
<script>
import {mapGetters} from "vuex";
import numberMixin from '@/common/mixin/numberMixin';
import AuthModal from '@/views/launcher-readingclub/main-comp/vscan/comp/vscan-auth-popup.vue';
import AuthBuyModal from '@/views/launcher-readingclub/main-comp/vscan/comp/vscan-auth-buy-popup.vue';

export default {
  mixins: [numberMixin],
  components: {
    AuthModal,
    AuthBuyModal
  },
  data() {
    return {
      authShowModal: false,
      confirmShowModal: false,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapGetters('vscanStorage', ['getVscanBookInfo']),
    currentBook() {
      return this.getVscanBookInfo;
    }
  },
  methods: {
    clickPopBtn() {
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 학부모 인증 팝업 열기 & 닫기
    openAuthPopup() {
      this.authShowModal = true;
      this.clickPopBtn();
    },
    closeAuthPopup() {
      this.authShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 구매 요청 팝업 열기 & 닫기
    openAuthBuyPopup() {
      this.confirmShowModal = true;
      this.clickPopBtn();
    },
    closeAuthBuyPopup() {
      this.confirmShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    goMainPage() {
      this.$router.replace({name: 'ReadingClubMainView'})
    }
  }
}
</script>

