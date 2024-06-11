<template>
  <div class="notice faq">
    <div class="table-top">
      <div class="dropdown-wrap">
        <div class="dropdown full-select">
          <!--  TODO: 디폴트는 전체         -->
          <v-select label="cdVlNm"
                    placeholder="전체"
                    :options="objectItem"
                    v-model="formData.selectedObject"
                    :reduce="objectItem => objectItem.cdVl">
            <template #open-indicator="{ attributes }">
              <span v-bind="attributes"><img src="@/assets/img/launcher/mypage/mp_ico_down.png" alt="arrow"></span>
            </template>
          </v-select>
        </div>
      </div>
      <div class="input-wrap">
        <div class="title-wrap inputArea">
          <input type="text" name="title" class="input inputTitle" autocomplete="off" @input="activeInputClear($event)" placeholder="제목 검색" v-model="formData.textTitle">
          <div class="input-sub" >
            <!-- TODO: show 추가하면 활성화 -->
            <button class="btn btn-clear" @click="clickClear($event)"></button>
          </div>
        </div>
      </div>
      <button class="btn btn-01-mp" @click="getSearchList()">검색</button>
    </div>
    <div class="table-wrap">
      <table>
        <tr>
          <th class="number">번호</th>
          <th class="div">구분</th>
          <th class="detail">제목</th>
        </tr>
        <tr v-for="(item, index) in tableData" :key="item">
          <td class="number">{{ total - ((formData.page-1)*limit) - index }}</td>
          <td class="div">{{ item.fqnaTypeName }}</td>
          <td class="detail"><router-link :to="{ name: 'faqView', params: { id: item.id } , query:{ name: readingClubQuery } }">{{ item.fqnaTitle }} </router-link></td>
        </tr>
        <tr v-for="(item, index) in addTableData[0]" :key="item">
          <td class="number">{{ addTotal - ((formData.addPage-1)*limit) - index }}</td>
          <td class="div">{{ item.fqnaTypeName }}</td>
          <td class="detail"><router-link :to="{ name: 'faqView', params: { id: item.id }, query:{ name: readingClubQuery } }">{{ item.fqnaTitle }} </router-link></td>
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
import mypageFactory from '@/api/mypage-factory';

const faqCode = mypageFactory.get('faqCode');
let addPage = 1;

export default {
  name: '',
  data() {
    return {
      formData: {
        selectedObject: null,
        textTitle: '',
        page: 1,
        addPage: 2,
      },
      total: '',
      addTotal: '',
      limit: 15, //

      objectItem: [
        {
          cdVl: null,
          cdVlNm: '전체',
        },
        {
          cdVl: '1',
          cdVlNm: '회원정보',
        },
        {
          cdVl: '2',
          cdVlNm: '학습',
        },
        {
          cdVl: '3',
          cdVlNm: '결제',
        },
        {
          cdVl: '4',
          cdVlNm: '학습기기',
        },
        {
          cdVl: '5',
          cdVlNm: '기타',
        }
      ],
      tableTitle: ['번호', '구분', '제목'],
      tableData: [],
      addTableData: [],
      readingClubQuery:null
    }
  },
  created() {
    this.resetAddListData();
    this.readingClubQuery = this.$route.query.name
    this.getList();
  },
  mounted() {
    this.hideKeyboard();
  },
  methods: {
    activeInputClear(event) {
      const parentWrap = event.target.closest('.inputArea');
      const icon = parentWrap.querySelector('.btn-clear');
      icon.classList.add('show');

      if (event.target.value == '') {
        icon.classList.remove('show');
      }
    },
    clickClear(event) {
      const parentWrap = event.target.closest('.inputArea');
      const icon = parentWrap.querySelector('.btn-clear');

      if (parentWrap.querySelector('input').classList.contains('inputTitle')) {
        this.formData.textTitle = '';
      }

      icon.classList.remove('show');
    },
    // 리스트 api 연동해서 가져오기
    getData(data, isAdd) {
      // 더보기 버튼 초기에 보여지게 설정
      let addListBtn = document.querySelector('.addListBtn');
      if (addListBtn != null) {
        addListBtn.style.display = "block";
      }

      const list = faqCode.getList(data);
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
        fqnaTypeCd : this.formData.selectedObject,
        fqnaTitle : this.formData.textTitle,
        fqnaProdDiv: this.readingClubQuery ? 'R' : 'V'
      }
      this.getData(data, false);
    },
    // 검색 리스트 가져오기
    getSearchList() {
      this.resetAddListData();

      const data = {
        page : 1,
        pageSize : this.limit,
        fqnaTypeCd : this.formData.selectedObject,
        fqnaTitle : this.formData.textTitle,
        fqnaProdDiv: this.readingClubQuery ? 'R' : 'V'
      }
      this.getData(data, false);
    },
    // 더보기 버튼 클릭시 리스트 추가하기
    addList() {
      addPage++;

      const data = {
        page : addPage,
        pageSize : this.limit,
        fqnaTypeCd : this.formData.selectedObject,
        fqnaTitle : this.formData.textTitle,
        fqnaProdDiv: this.readingClubQuery ? 'R' : 'V'
      }
      this.getData(data, true);
    },
    resetAddListData() {
      this.addTableData = [];
      this.addTotal = '';
      addPage = 1;
    },
    hideKeyboard() {
      const input = document.querySelector('.vs__selected-options .vs__search');
      input.setAttribute('inputmode','none');
      input.setAttribute('readonly','readonly');
    },
  }
}
</script>

<style>
</style>