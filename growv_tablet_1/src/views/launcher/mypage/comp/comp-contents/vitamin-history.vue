<template>
  <div class="content-main vitamin">
    <div class="main-area">
      <ul class="vitamin-view">
        <li class="emphasis">
          <p><img src="@/assets/img/launcher/mypage/mp_ico_vitamin.png" alt="vitamin">나의 비타민</p>
          <p class="point plus">{{ setNumberComma(statusData?.allVita) }}</p>
        </li>
        <li>
          <p>소멸 예정 비타민</p>
          <p class="point minus">{{ setNumberComma(statusData?.remVita) }}</p>
        </li>
      </ul>
      <div class="period-wrap">
        <input type="date"
               class="choice-data"
               :data-placeholder="formData.startDate"
               required
               v-model="formData.startDate">
        <span>~</span>
        <input type="date"
               class="choice-data"
               :data-placeholder="formData.endDate"
               required
               v-model="formData.endDate">
        <button class="btn btn-01-mp" @click="getSearchList()">조회</button>
      </div>
      <div class="table-top flex">
        <p class="info">
          비타민은 적립일 기준 1년 경과 후 익월 1일 자동 소멸됩니다. <br>
          서비스 종료, 회원 탈퇴시 보유한 비타민은 모두 소멸처리되오니 유의해주시기 바랍니다.
        </p>
        <button @click="openVitaminPopup">
          <img src="@/assets/img/launcher/mypage/mp_btn_vitamin_guide.png" alt="vitamin-list">
        </button>
      </div>
      <div class="table-wrap">
        <table>
          <tr>
            <th class="number">번호</th>
            <th class="div">구분</th>
            <th class="detail">상세내용</th>
            <th class="point">적립/사용</th>
            <th class="date">날짜</th>
          </tr>
          <tr v-for="(item, index) in tableData" :key="item">
            <td class="number">{{ total - ((formData.page-1)*limit) - index }}</td>
            <td class="div" v-if="item.vitaUseDiv == 'G'">적립</td>
            <td class="div" v-else-if="item.vitaUseDiv == 'U'">사용</td>
            <td class="div" v-else-if="item.vitaUseDiv == 'R'">소멸</td>
            <td class="detail">{{ item.vitaCt }}</td>
          <!-- TODO: 비타민 적립시 plus 사용시 minus 추가해주기           -->
            <td class="point" :class="[{ plus : item.vitaUseDiv == 'G' }, { minus: item.vitaUseDiv == 'U' }]">
              <span v-if="item.vitaUseDiv == 'G'">+</span>
              <span v-else-if="item.vitaUseDiv == 'U'">-</span>
              {{ item.vitaPoint }}
            </td>
            <td class="date">{{ item.regDtm }}</td>
          </tr>
          <tr v-for="(item, index) in addTableData[0]" :key="item">
            <td class="number">{{ addTotal - ((formData.addPage-1)*limit) - index }}</td>
            <td class="div" v-if="item.vitaUseDiv == 'G'">적립</td>
            <td class="div" v-else-if="item.vitaUseDiv == 'U'">사용</td>
            <td class="div" v-else-if="item.vitaUseDiv == 'R'">소멸</td>
            <td class="detail">{{ item.vitaCt }}</td>
            <!-- TODO: 비타민 적립시 plus 사용시 minus 추가해주기           -->
            <td class="point" :class="[{ plus : item.vitaUseDiv == 'G' }, { minus: item.vitaUseDiv == 'U' }]">
              <span v-if="item.vitaUseDiv == 'G'">+</span>
              <span v-else-if="item.vitaUseDiv == 'U'">-</span>
              {{ item.vitaPoint }}
            </td>
            <td class="date">{{ item.regDtm }}</td>
          </tr>
        </table>
        <!-- 더보기 -->
        <div v-if="this.total > limit" class="more-list addListBtn">
          <button @click="addList()">
            <img src="@/assets/img/launcher/mypage/mp_btn_txtbtn_more.png" alt="more">
          </button>
        </div>
        <!-- 내용 없을 경우 -->
        <div v-if="tableData.length == 0" class="no-list">
          <div class="no-list-content">
            <img src="@/assets/img/launcher/common/cha_pop_nothing_ev.webp" alt="no-list">
            <p>등록된 내용이 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <vitaminModal :propsData="{vitaminShowModal}" @closePopup="closeVitaminPopup"></vitaminModal>
  <confirmModal :propsData="{confirmShowModal, message}" @closePopup="closeConfirmPopup"></confirmModal>
</template>

<script>
import {mapGetters} from "vuex";
import vitaminModal from './comp-mypage-popup/vitamin-info-popup'
import confirmModal from '../comp-contents/comp-mypage-popup/confirm-popup'
import mypageFactory from '@/api/mypage-factory';

const vitaminCode = mypageFactory.get('vitaminCode');
let addPage = 1;

export default {
  data() {
    return {
      formData: {
        startDate: '',
        endDate: '',
        page: 1,
        addPage: 2,
      },
      total: '',
      addTotal: '',
      limit: 15,

      vitaminShowModal: false,
      confirmShowModal: false,
      message: '',

      tableTitle: ['번호', '구분', '상세내용', '적립/사용', '날짜'],
      tableData: [],
      addTableData: [],
      statusData: {},
    }
  },
  components: {
    vitaminModal,
    confirmModal,
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  watch: {
    'formData.startDate'(newValue, oldValue) {
      this.diffPeriodDate(newValue, oldValue, 'start');
    },
    'formData.endDate'(newValue, oldValue) {
      this.diffPeriodDate(newValue, oldValue, 'end');
    },
  },
  created() {
    this.resetAddListData();
    this.setSearchDate();
    this.getStatus();
    this.getList();
  },
  methods: {
    getData(data, isAdd) {
      // 더보기 버튼 초기에 보여지게 설정
      let addListBtn = document.querySelector('.addListBtn');
      if (addListBtn != null) {
        addListBtn.style.display = "block";
      }

      const list = vitaminCode.getHistoryVita(data);
      list.then((res) => {
        if (res.status == 200) {
          if (!isAdd) { // 처음 붙일 리스트
            const data = res.data.data;
            this.tableData  = data.result;
            this.total = data.totalCount;
          } else {
            // 추가로 붙일 리스트 (더보기)
            const data = res.data.data;
            if (data.result.length == 0) {
              return;
            }
            if (this.addTableData.length == 0) {
              this.addTableData.push(data.result);
            } else {
              data.result.forEach((el) => {
                this.addTableData[0].push(el);
              });
            }
            if (data.result.length < this.limit || (this.total == (this.tableData.length + this.addTableData[0].length))) { // 더보기 버튼 : 들어온 리스트가 15개 미만일 때 안보이게 설정
              addListBtn.style.display = "none";
            }
            this.addTotal = data.totalCount;
          }
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    // 전체 리스트 가져오기
    getList() {
      const data = {
        studentId : this.userInfo.info.studentId,
        pageSize : this.limit,
        pageIndex : 1,
        sdate : this.formData.startDate,
        edate : this.formData.endDate
      }
      this.getData(data, false);
    },
    // 검색 리스트 가져오기
    getSearchList() {
      this.resetAddListData();

      const data = {
        studentId : this.userInfo.info.studentId,
        pageSize : this.limit,
        pageIndex : 1,
        sdate : this.formData.startDate,
        edate : this.formData.endDate
      }
      this.getData(data, false);
    },
    // 더보기 버튼 클릭시 리스트 추가하기
    addList() {
      addPage++;

      const data = {
        studentId : this.userInfo.info.studentId,
        pageIndex : addPage,
        pageSize : this.limit,
        sdate : this.formData.startDate,
        edate : this.formData.endDate
      }
      this.getData(data, true);
    },
    resetAddListData() {
      this.addTableData = [];
      this.addTotal = '';
      addPage = 1;
    },

    // 비타민 현황 가져오기
    getStatus() {
      const data = {
        studentId : this.userInfo.info.studentId,
      }

      const list = vitaminCode.statusInfoVita(data);
      list.then((res) => {
        if (res.status == 200) {
          const data = res.data.data;
          this.statusData = data;
        }
      }).catch((error) => {
        console.log(error)
      });
    },

    // 조회날짜 디폴트 설정
    setSearchDate() {
      const moment = require('moment');
      let today = moment().format('YYYY-MM-DD');
      let prevWeek = moment().subtract(7, 'd').format('YYYY-MM-DD');

      this.formData.endDate = today;
      this.formData.startDate = prevWeek;
    },

    // 1000단위 콤마 넣기
    setNumberComma(value) {
      const getValue = value;

      return getValue?.toLocaleString();
    },

    // 조회 시작날짜와 종료날짜 비교해서 시작날짜가 종료날짜보다 크면 선택 못하게 막기
    diffPeriodDate(newValue, oldValue, div) {
      const moment = require('moment');
      const startDate = moment(this.formData.startDate);
      const endDate = moment(this.formData.endDate);

      if (startDate.diff(endDate) > 0) {
        if (div == 'start') {
          this.formData.startDate = oldValue;
        } else {
          this.formData.endDate = oldValue;
        }
        this.message = '기간을 다시 설정해 주세요.';
        this.openConfirmPopup();
      }
    },

    // 비타민 팝업 열기
    openVitaminPopup() {
      this.vitaminShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 상세 팝업 닫기
    closeVitaminPopup() {
      this.vitaminShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },

    // 팝업
    // 알럿팝업 열기
    openConfirmPopup() {
      this.confirmShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    //  알럿팝업 닫기
    closeConfirmPopup() {
      this.confirmShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
  }
}
</script>

<style>
</style>