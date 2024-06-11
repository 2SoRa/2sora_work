<template>
  <div class="modal-vscan">
    <vscanCheckModal v-if="propsData.vscanInfo.isModal && type === 'check'" @closeVscanPopup="closeVscanPopup"></vscanCheckModal>
    <vscanRescanModal v-if="propsData.vscanInfo.isModal && type === 'rescan'" @closeVscanPopup="closeVscanPopup"></vscanRescanModal>
    <vscanFailModal v-if="propsData.vscanInfo.isModal && type === 'fail'" @closeVscanPopup="closeVscanPopup"></vscanFailModal>
  </div>
</template>

<script>
import vscanCheckModal from "@/components/launcher-readingclub/modals/parts/vscan-check-modal.vue";
import vscanFailModal from "@/components/launcher-readingclub/modals/parts/vscan-fail-modal.vue";
import vscanRescanModal from "@/components/launcher-readingclub/modals/parts/vscan-rescan-modal.vue";

export default {
  props : {
    propsData: {
      vscanInfo : Object,
    },
  },
  computed : {
    type() {
      return this.propsData.vscanInfo.modalData;
    }
  },
  components: {
    vscanCheckModal,
    vscanRescanModal,
    vscanFailModal
  },
  methods: {
    closeVscanPopup() {
      this.$emit('closeVscanPopup');
    }
  }
}
</script>