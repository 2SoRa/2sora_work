<template>
  <div>
    <Modal v-if="propsData.adShowModal" @close="closePopup" >
      <template v-slot:body>
        <div class="modal-full policy-pop advertisement">
          <h1 class="title"><button class="modal-default-button" @click="closePopup"></button></h1>
          <div class="content">
            <div>
              <div class="txt-wrap">
                <dl>
                  <dt>
                    <div class="stit">상품 및 서비스 안내, 이벤트 및 혜택 제공 정보에 대한 전화, 문자 등 수신 동의</div>
                  </dt>
                  <dd>
                    <div class="tbl-item-wrap">
                      <table>
                        <tbody><tr>
                          <th>이용목적</th>
                          <th>보유 및 이용기간</th>
                        </tr>
                        <tr>
                          <td>전화, 문자, 이메일을 이용한 상품 및 서비스 안내, 이벤트 및 혜택 정보 전달</td>
                          <td>동의철회 또는 회원 탈퇴 시 즉시 파기</td>
                        </tr>
                        </tbody></table>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div>
        </div>
      </template>
    </Modal>
  </div>
</template>


<script>
import Modal from '@/components/modal';

export default {
  props: {
    propsData: {
      adModal: Boolean,
    },
  },
  data() {
    return {
      title: '',
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

<style scoped>
@import url('@/assets/css/launcher/modal/auth-modal.css');
</style>