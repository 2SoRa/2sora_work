<template>
  <div class="modal-viewer">
    <viewerTypeModal v-if="propsData.viewerInfo.isModal && propsData.viewerInfo.modalType === 'type'" :propsData="{ viewerInfo }" @openViewerPopup="openViewerPopup" @closeViewerPopup="closeViewerPopup" @openBookRun="openBookRun"></viewerTypeModal>
    <viewerReadModal v-if="propsData.viewerInfo.isModal && propsData.viewerInfo.modalType === 're'" :propsData="{ viewerInfo }" @openViewerPopup="openViewerPopup" @closeViewerPopup="closeViewerPopup" @openBookRun="openBookRun"></viewerReadModal>
    <viewerPyModal v-if="propsData.viewerInfo.isModal && propsData.viewerInfo.modalType === 'py'"  :propsData="{ viewerInfo }" @openViewerPopup="openViewerPopup" @closeViewerPopup="closeViewerPopup" @openBookRun="openBookRun"></viewerPyModal>
    <viewerPyReModal v-if="propsData.viewerInfo.isModal && propsData.viewerInfo.modalType === 'pyre'"  :propsData="{ viewerInfo }" @openViewerPopup="openViewerPopup" @closeViewerPopup="closeViewerPopup" @openBookRun="openBookRun"></viewerPyReModal>
    <viewerReportModal v-if="propsData.viewerInfo.isModal && propsData.viewerInfo.modalType === 'report'" :propsData="{ viewerInfo }" @openViewerPopup="openViewerPopup" @closeViewerPopup="closeViewerPopup" @openBookRun="openBookRun"></viewerReportModal>
  </div>
</template>

<script>
import viewerTypeModal from "@/components/launcher-readingclub/modals/parts/viewer-type-modal.vue";
import viewerReadModal from "@/components/launcher-readingclub/modals/parts/viewer-read-modal.vue";
import viewerPyModal from "@/components/launcher-readingclub/modals/parts/viewer-py-modal.vue";
import viewerPyReModal from "@/components/launcher-readingclub/modals/parts/viewer-pyre-modal.vue";
import viewerReportModal from "@/components/launcher-readingclub/modals/parts/viewer-report-modal.vue";

export default {
  data() {
    return {
      viewerInfo : this.propsData.viewerInfo,
    }
  },
  props : {
    propsData: {
      viewerInfo : Object,
    }
  },
  components: {
    viewerTypeModal,
    viewerReadModal,
    viewerPyModal,
    viewerPyReModal,
    viewerReportModal,
  },
  methods: {
    openBookRun(type) {
      this.$emit('openBookRun',type);
    },
    openViewerPopup(info,item,type) {
      this.$emit('openViewerPopup',info,item,type);
    },
    closeViewerPopup(onlyClose = false) {
      this.$emit('closeViewerPopup', onlyClose);
    }
  }
}
</script>