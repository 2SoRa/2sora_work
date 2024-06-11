<template>
  <div class="superpick">
    <div class="sub-gnb">
      <div class="sub-gnb-right">
        <button type="button" class="btn-info"><router-link :to="{name: 'viewBridgeKind' ,query:{path:'guide-superpick'}}"><span></span>슈퍼픽 안내</router-link></button>
        <button type="button" class="btn-close"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
      </div>
    </div>
    <div class="drop-guide">
      <div class="dropdown-wrap flex-content-end">
        <div class="dropdown">
          <v-select
            label="monthTitle"
            placeholder="나의 슈퍼픽 다시보기"
            v-model="selectedId"
            :options="monthData"
            :reduce="monthData => monthData.pickSubjectId"
            @option:selected="getSuperPickDetail">
            <template #open-indicator="{ attributes }">
              <span v-bind="attributes">
                <img src="@/assets/img/launcher-readingclub/common/icons/ico_dropdown_arr_down.webp" alt="arrow">
              </span>
            </template>
          </v-select>
        </div>
      </div>
      <p><img src="@/assets/img/launcher-readingclub/guide/txt_superpick.webp" alt="드롭다운 안내"></p>
    </div>
    <div class="background" :style="{ backgroundImage : 'url(' + this.templateData.background + ')'}"></div>
    <div class="list-wrap">
      <div :class="`template${this.templateData.templateNumber}`">
        <ul>
          <li v-for="(item, index) in templateData.list" :key="item" :class="{ complete : item.isRead }">
            <span class="check"></span>
            <button type="button"
                    @click="mixin_openBook({ 'path' : 'P', 'entry' : 'SuperPick', 'index' : `${index}` }, item)">
              도서 뷰어 실행
            </button>
          </li>
        </ul>
      </div>
    </div>
    <!-- Audio -->
    <div class="final" v-if="isFinal" @click="isFinal = false">
      <div>
        <div class="sub-gnb pos-absolute">
          <!-- 슈퍼픽 완독 축하 화면 닫기 -->
          <div class="sub-gnb-right">
            <button type="button" class="btn-close" @click="isFinal = false"></button>
          </div>
        </div>
        <img src="@/assets/img/launcher-readingclub/gif/Superpick_neo.gif" alt="완독완료 축하">
      </div>
      <audio ref="audio" style="position:absolute;opacity:0">
        <source src="https://cdnfiles.superv.com/narration/Superpick_Na_001.mp3" type="audio/mp3">
      </audio>
    </div>
    <viewerModal :propsData="{ viewerInfo }" @openBookRun="openBookRun" @openViewerPopup="openViewerPopup" @closeViewerPopup="closeViewerPopup"></viewerModal>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import viewerModal from "@/components/launcher-readingclub/modals/model-viewer.vue";
import viewerMixin from "@/common/mixin/viewerMixin";

const superPickApi = readingClubFactory.get('superPick')
export default {
  name: 'SuperPick',
  mixins : [ viewerMixin ],
  components: {
    viewerModal
  },
  data() {
    return {
      viewerInfo : {
        isModal : false,
        modalType : 'type',
        modalData : {}
      },
      studentId: null,
      templateData: {
        id : null,
        background: '',
        templateNumber: 0,
        list: null,
      },
      monthData: [],
      selectedId: null,
      trueLength : 0,
      isFinal : false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.studentId = this.userInfo.info.studentId;
    this.getSuperPickMain();
    this.getSuperPickMonth();
  },
  mounted() {
    this.hideKeyboard();
  },
  methods: {
    /* 슈퍼픽 메인 */
    getSuperPickMain() {
      const getMainData = superPickApi.getSuperPickMain(this.studentId);
      getMainData.then((res) => {
        if (res.status === 200) {
          this.templateData.id = res.data.data.pickInfo.pickSubjectId;
          this.templateData.background = res.data.data.pickInfo.imageFilePath;
          this.templateData.templateNumber = res.data.data.pickInfo.imageFileTemplate;
          this.templateData.list = res.data.data.pickInfo.contentInfos;
          this.trueLength = this.templateData.list.filter(item => item.isRead).length;
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    /* 과월호 목록 */
    getSuperPickMonth() {
      const getMonthData = superPickApi.getSuperPickMonth(this.studentId);
      getMonthData.then((res) => {
        if (res.status === 200) this.monthData = res.data.data;
      }).catch((err) => {
        console.log(err)
      })
    },
    /* 과월호 보기 */
    getSuperPickDetail() {
      const getDetailData = superPickApi.getSuperPickDetail(this.studentId, this.selectedId);
      getDetailData.then((res) => {
        if (res.status === 200) {
          this.templateData.id = res.data.data.pickSubjectId;
          this.templateData.background = res.data.data.imageFilePath;
          this.templateData.templateNumber = res.data.data.imageFileTemplate;
          this.templateData.list = res.data.data.contentInfos;
          this.trueLength = this.templateData.list.filter(item => item.isRead).length;
        }
        this.getSuperPickMonth();

      }).catch((err) => {
        console.log(err)
      })
    },
    // 최종 완료 체크
    viewFinalComplete() {
      this.trueLength++;
      const result = this.templateData.list.every(item => item.isRead);
      if (this.trueLength === 5 && result) {
        this.isFinal = true;
        this.$refs.audio.play();
        setTimeout(() => {
          this.isFinal = false;
          this.trueLength = 5;
        },8000);
      }
    },
    openBookRun(type) {
      this.mixin_openBookRun(type);
    },
    openViewerPopup(info, item, type) {
      this.viewerInfo.modalData.info = info;
      this.viewerInfo.modalData.item = item;
      this.viewerInfo.modalType = type;
      this.viewerInfo.isModal = true;
    },
    closeViewerPopup(onlyClose) {
      this.viewerInfo.isModal = false;
      this.templateData.list[this.viewerInfo.modalData.info.index].isRead = this.viewerInfo.modalData.info.isRead;
      if (!onlyClose) {
        this.viewFinalComplete();
      }
    },
    hideKeyboard() {
      const input = document.querySelector('.vs__selected-options .vs__search');
      input.setAttribute('inputmode', 'none');
      input.setAttribute('readonly', 'readonly');
    },
  }
}
</script>