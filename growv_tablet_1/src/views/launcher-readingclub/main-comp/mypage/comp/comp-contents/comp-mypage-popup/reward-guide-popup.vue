<template>
  <!-- TODO : 툴팁 노출 상태에서 브라우저 화면 클릭했을 때 closePopup 실행되어야 함 -->
  <div
    v-if="propsData.rewardShowModal"
    @close="closePopup"
    @click.self="closePopup"
    class="popup-tooltip"
  >
    <ul class="dot-list">
      <li class="list-item">성공한 미션에 따라 1개씩 적립이 돼요. (월 최대 50개, 이월 불가)</li>
      <li class="list-item">출석 미션 : 3일, 5일, 10일, 15일, 20일 출석에 성공하면 1개씩 적립돼요.</li>
      <li class="list-item">일반 미션 : 매일 출석하거나, 책을 읽으면 1개씩 적립돼요. <br>같은 책은 여러번 읽어도 월 1개만 적립돼요. <br>(월마다 초기화)</li>
    </ul>

    <button type="button" @click="closePopup" class="btn-close text-blind">닫기</button>
  </div>
</template>

<script>
export default {
  props: {
    propsData: {
      rewardShowModal: Boolean,
    },
  },

  data() {
    return {};
  },

  methods: {
    closePopup() {
      this.$emit("closeRewardModal");
    },
  },
};
</script>

<style></style>
