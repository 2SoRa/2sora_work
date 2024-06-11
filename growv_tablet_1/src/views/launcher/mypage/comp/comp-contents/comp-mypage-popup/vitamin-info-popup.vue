<template>
  <div>
    <Modal v-if="propsData.vitaminShowModal" title="">
      <template v-slot:body>
        <div class="modal-full vitamin-pop">
          <h1 class="title">
            <button class="modal-default-button" @click="closePopup()"></button>
          </h1>
          <div class="pop-content">
            <div class="vitamin-table-wrap">
              <table>
                <tr>
                  <td class="table-title">일일학습</td>
                  <td class="table-content">오늘의학습 강의 완료 시</td>
                  <td class="table-vitamin"><p>10</p></td>
                </tr>
                <tr>
                  <td class="table-title" rowspan="4">자율학습</td>
                  <td class="table-content">한글 학습 완료 시(일 최대 5강)</td>
                  <td class="table-vitamin"><p>5</p></td>
                </tr>
                <tr>
                  <td class="table-content">영어 학습 완료 시(일 최대 5강)</td>
                  <td class="table-vitamin"><p>5</p></td>
                </tr>
                <tr>
                  <td class="table-content">수학 학습 완료 시(일 최대 5강)</td>
                  <td class="table-vitamin"><p>5</p></td>
                </tr>
                <tr>
                  <td class="table-content">특별학습 완료 시(일 최대 5강)</td>
                  <td class="table-vitamin"><p>5</p></td>
                </tr>
                <tr>
                  <td class="table-title">출석</td>
                  <td class="table-content">출석완료(월~일)</td>
                  <td class="table-vitamin"><p>10</p></td>
                </tr>
                <tr>
                  <td class="table-title" rowspan="2">도서관</td>
                  <td class="table-content">한글 도서관 : 1권 완독 시(일 최대 5권)</td>
                  <td class="table-vitamin"><p>5</p></td>
                </tr>
                <tr>
                  <td class="table-content">영어 도서관 : 1권 완독 시(일 최대 5권)</td>
                  <td class="table-vitamin"><p>5</p></td>
                </tr>
                <tr>
                  <td class="table-title">슈퍼V 브레인</td>
                  <td class="table-content">영역별 레벨 달성 시</td>
                  <td class="table-vitamin"><p>5</p></td>
                </tr>
                <tr>
                  <td class="table-title">화상 클래스</td>
                  <td class="table-content">출석 시</td>
                  <td class="table-vitamin"><p>50</p></td>
                </tr>
                <tr>
                  <td class="table-title">회원가입</td>
                  <td class="table-content">회원가입 완료 시 / 무료체험 대상은 태블릿 로그인 시</td>
                  <td class="table-vitamin"><p>100</p></td>
                </tr>
                <tr>
                  <td class="table-title">생일</td>
                  <td class="table-content">생일(1년에 1회 지급)</td>
                  <td class="table-vitamin"><p>500</p></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div></div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/modal';

export default {
  props: {
    propsData: {
      vitaminShowModal: Boolean,
    },
  },
  data() {
    return {
      title: '비타민 리스트 안내',
      tableTitle: ['일일학습', '자율학습', '출석', '콘텐츠', '화상수업', '회원가입', '생일']
    }
  },
  components: {
    Modal,
  },
  computed: {
  },
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
  }
}
</script>

<style>
  @import url('@/assets/css/launcher/modal/mypage.css');
</style>