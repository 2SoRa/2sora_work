<template>
  <div class="notice consult">
    <div class="table-top">
      <button class="btn inquire"><router-link :to="{ name: 'consultWrite' , query:{ name: readingClubQuery } }"></router-link></button>
    </div>
    <div class="table-wrap">
      <table>
        <tr>
          <th class="status">답변</th>
          <th class="div">구분</th>
          <th class="detail">내용</th>
          <th class="date">날짜</th>
        </tr>
        <tr v-for="item in tableData" :key="item">
          <td class="status">
            <img v-if="item.inquireAnswerStateDiv === 'W'" src="@/assets/img/launcher/mypage/mp_value_wait.png" alt="no-read">
            <img v-else-if="item.inquireAnswerStateDiv === 'P'" src="@/assets/img/launcher/mypage/mp_value_ing.png" alt="read">
            <img v-else-if="item.inquireAnswerStateDiv === 'C'" src="@/assets/img/launcher/mypage/mp_value_finish.png" alt="reply">
          </td>
          <td class="div">{{ item.inquireTypeName }}</td>
          <td class="detail"><router-link :to="{ name: 'consultView', params: { id: item.id } , query:{name: readingClubQuery }}">{{ item.inquireCt }} </router-link></td>
          <td class="date">{{ item.regDtm }}</td>
        </tr>
        <tr v-for="item in addTableData[0]" :key="item">
          <td class="status">
            <img v-if="item.inquireAnswerStateDiv === 'W'" src="@/assets/img/launcher/mypage/mp_value_wait.png" alt="no-read">
            <img v-else-if="item.inquireAnswerStateDiv === 'P'" src="@/assets/img/launcher/mypage/mp_value_ing.png" alt="read">
            <img v-else-if="item.inquireAnswerStateDiv === 'C'" src="@/assets/img/launcher/mypage/mp_value_finish.png" alt="reply">
          </td>
          <td class="div">{{ item.inquireTypeName }}</td>
          <td class="detail"><router-link :to="{ name: 'consultView', params: { id: item.id }, query:{name: readingClubQuery }}">{{ item.inquireCt }} </router-link></td>
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
          <img src="@/assets/img/launcher/mypage/mp_cha_nothing.png" alt="no-list">
          <p>등록된 내용이 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import mypageFactory from '@/api/mypage-factory';

const consultCode = mypageFactory.get('consultCode');
let addPage = 1;

export default {
  name: '',
  data() {
    return {
      formData: {
        page: 1,
        addPage: 2,
      },
      total: '',
      addTotal: '',
      limit: 15,
      tableData: [],
      addTableData: [],
      readingClubQuery:''
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.resetAddListData();
    this.getList();
    this.readingClubQuery = this.$route.query.name
  },
  methods: {
    // 리스트 api 연동해서 가져오기
    getData(data, isAdd) {
      // 더보기 버튼 초기에 보여지게 설정
      let addListBtn = document.querySelector('.addListBtn');
      if (addListBtn != null) {
        addListBtn.style.display = "block";
      }

      const list = consultCode.getList(data);
      list.then((res) => {
        if (res.status == 200) {
          if (!isAdd) { // 처음 붙일 리스트
            const data = res.data.data;
            this.tableData = data.content;
            this.total = data.totalElements;
          } else {
            // 추가로 붙일 리스트 (더보기)
            const data = res.data.data;
            if (data.content.length == 0) {
              return;
            }
            if (this.addTableData.length == 0) {
              this.addTableData.push(data.content);
            } else {
              data.content.forEach((el) => {
                this.addTableData[0].push(el);
              });
            }
            if (data.content.length < this.limit || (this.total == (this.tableData.length + this.addTableData[0].length))) { // 더보기 버튼 : 들어온 리스트가 15개 미만일 때 안보이게 설정
              addListBtn.style.display = "none";
            }
            this.addTotal = data.totalElements;
          }
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    // 전체 리스트 가져오기
    getList() {
      const data = {
        page : 1,
        pageSize : this.limit,
        regId: this.userInfo.info.studentId,
      }
      this.getData(data, false);
    },
    // 검색 리스트 가져오기
    getSearchList() {
      this.resetAddListData();

      const data = {
        page : 1,
        pageSize : this.limit,
        regId: this.userInfo.info.studentId,
      }
      this.getData(data, false);
    },
    // 더보기 버튼 클릭시 리스트 추가하기
    addList() {
      addPage++;

      const data = {
        page : addPage,
        pageSize : this.limit,
        regId: this.userInfo.info.studentId,
      }
      this.getData(data, true);
    },
    resetAddListData() {
      this.addTableData = [];
      this.addTotal = '';
      addPage = 1;
    },
  }
}
</script>

<style>
</style>