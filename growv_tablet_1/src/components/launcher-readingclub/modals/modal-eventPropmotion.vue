<template>
  <!-- TODO : 프로모션 안내 팝업 -->
  <div class="modal-mall-promotion"> <!--  -->
    <div class="whole-modal">
      <div class="whole-modal-dim"></div>
      <div class="whole-modal-content week-event">
        <div class="contents">
          <button type="button" class="close type-alpha" @click="closePromotion"></button>

          <button type="button" class="link-mall" @click="goEventPageTab()"></button>
      </div>
        <!-- 5일간 다시 보지 않기 체크박스 -->
        <div class="input-circle-chk border-bd-gray">
          <input type="checkbox" id="cartItem2" v-model="noPopup"><label for="cartItem2">오늘 하루 안보기</label>
        </div>
      </div>
    </div>
  </div>
</template>

 <script>
 export default {
   data() {
     return {
       noPopup: false
     }
   },
   methods:{
     closePromotion() {
       this.$emit('closePromotion',this.noPopup);
     },
     goEventPageTab() {
       //TODO : 영어 도서몰 > 영어이벤트
       this.currentLanguage = 'eng';
       this.currentActive = 3;
       this.currentActiveSub = 0;

       this.$router.push({
         name:'searchList',
         params:{
           lang: this.currentLanguage,
           active: this.currentActive,
           subactive: this.currentActiveSub
         },
       })
     }
   }
 }
 </script>