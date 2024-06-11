<template>
  <div class="receive-message">
    <div class="table-top">
      <div>
        <button class="btn send-message">
          <router-link :to="{ name: 'SendMessage' }"></router-link>
        </button>
        <img src="@/assets/img/launcher/mypage/mp_ico_message_3.png" alt="message-status">
      </div>
      <div class="">
        <div class="check-all">
          <label class="checkbox">전체선택
            <input type="checkbox">
            <span class="checkmark"></span>
          </label>
        </div>
        <button class="btn btn-delete"><img src="@/assets/img/launcher/mypage/mp_btn_type_03_n_g.png" alt="delete"></button>
      </div>
    </div>

    <div class="table-wrap">
      <table>
        <tr>
          <th v-for="item in tableTitle" :key="item">{{ item }}</th>
        </tr>
        <tr v-for="item in tableData" :key="item">
          <td class="number">{{ item.id }}</td>
          <td class="div">
            <img v-if="item.status === 'noRead'" src="@/assets/img/launcher/mypage/mp_ico_message_no.png" alt="no-read">
            <img v-else-if="item.status === 'read'" src="@/assets/img/launcher/mypage/mp_ico_message_ok.png" alt="no-read">
            <img v-else-if="item.status === 'reply'" src="@/assets/img/launcher/mypage/mp_ico_message_reply.png" alt="no-read">
          </td>
          <td class="detail">
            <router-link :to="{ name: 'MessageReceived' }">{{ item.title }}</router-link>
          </td>
          <td class="name">{{ item.name }}</td>
          <td class="date">{{ item.date }}</td>
          <td class="check">
            <label class="checkbox">
              <input type="checkbox" v-model="item.isCheck">
              <span class="checkmark"></span>
            </label>
          </td>
        </tr>
      </table>
      <!-- TODO: 더 불러오는 조건 필요     -->
      <div v-if="tableMoreData > 0" class="more-list">
        <button>
          <img src="@/assets/img/launcher/mypage/mp_btn_txtbtn_more.png" alt="more">
        </button>
      </div>
      <!-- TODO: 테이블 내 데이터가 없을 때 보여주기 임시로 넣어줌. -->
      <div v-if="tableList == 0" class="no-list">
        <div class="nolist-content">
          <img src="@/assets/img/launcher/mypage/mp_cha_nothing.png" alt="no-list">
          <p>받은 쪽지가 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '받은 쪽지함',
  data() {
    return {
      tableTitle: ['번호', '상태', '제목', '보낸사람', '날짜', '선택'],
      tableData: [
        {
          id: '1',
          status: 'noRead',
          title: '받은 쪽지함의 내용',
          name: '슈퍼V 선생님',
          date: '2022.11.11 19:00',
          isCheck: false,
        },
        {
          id: '1',
          status: 'read',
          title: '2022년 8월 비타민 안내 비타민 안내 비타민 안내 비타민 안내비타민 안내 비타민 안내비타민 안내 비타민 안내비타민 안내 비타민 안내',
          name: '슈퍼V 선생님',
          date: '2022.11.11 19:00',
          isCheck: false,
        },
        {
          id: '1',
          status: 'reply',
          title: '2022년 8월 비타민 안내 비타민 안내 비타민 안내 비타민 안내',
          name: '슈퍼V 선생님',
          date: '2022.11.11 19:00',
          isCheck: false,
        }
      ],
      tableList: '1',
      //  TODO: 더 불러오는 조건 필요
      tableMoreData: '1'
    }
  },
  methods: {
  }
}
</script>

<style>
</style>