<template>
  <Modal v-if="propsData.certifyShowModal" @close="closePopup">
    <template v-slot:body>
      <!--  TODO: 임시 스타일     -->
      <div class="modal-04 password">
        <div class="content">
          <ul class="input-wrap">
            <!-- TODO: class="error"  추가시 컬러 변경 및 텍스트 나타남 -->
            <li class="">
              <div>
                <input type="password" placeholder="현재 비밀번호 (숫자4자리)">
                <div class="input-sub">
                  <button class="btn-clear"></button>
                </div>
              </div>
              <p class="txt-info">
                <span class="error">현재 비밀번호가 일치하지 않습니다. 다시 입력해주세요.</span>
              </p>
            </li>
            <li class="">
              <div>
                <input type="password" placeholder="변경할 비밀번호 (숫자4자리)">
                <div class="input-sub">
                  <button class="btn-clear"></button>
                </div>
              </div>
            </li>
            <li class="">
              <div>
                <input type="password" placeholder="변경할 비밀번호 확인">
                <div class="input-sub">
                  <button class="btn-clear"></button>
                </div>
              </div>
              <p class="txt-info">
                <span class="error">변경할 비밀번호가 일치하지 않습니다. 다시 입력해주세요.</span>
              </p>
            </li>
          </ul>
        </div>
          <div class="btn-wrap">
            <!-- TODO: disable 지우면 활성화 -->
            <p class="btn btn-type-03-sec disable" @click="closePopup()">확인</p>
          </div>
      </div>
    </template>
    <template v-slot:footer>
      <div></div>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/modal';

export default {
  props: {
    propsData: {
      certifyShowModal: Boolean,
    },
  },
  data() {
    return {
      // title: '학부모 인증 비밀번호 변경',
      title: '인증',
    }
  },
  components: {
    Modal,
  },
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
  },
}
</script>

<style>
</style>