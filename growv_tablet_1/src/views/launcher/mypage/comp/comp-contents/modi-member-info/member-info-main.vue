<template>
<div class="info-content">
  <div class="certify password">
    <div>
      <ul class="input-wrap">
        <li class="form-content">
          <div class="id-wrap">
            <input type="text" class="input disable" :value="userInfo.info.parentEmail">
          </div>
        </li>
        <!-- TODO: 오류시 error 추가       -->
        <li class="form-content formWrap">
          <div class="input-area password-wrap inputArea">
            <input type="password" class="input inputPw" placeholder="비밀번호를 입력해 주세요." @input="activeInputClear($event)" v-model="password">
            <!--  TODO: 입력시 나타나도록           -->
            <div class="input-sub">
              <!--  TODO: 각각 show 추가하면 활성화             -->
              <button class="btn hidden" :class="{ show: isShowPw }" @click="showPassword()"></button>
              <button class="btn-clear" @click="clickClear($event)"></button>
              <p class="check"></p>
            </div>
          </div>
<!--          <p class="input-sub">비밀번호를 입력해 주세요.</p>-->
          <p class="info-sub">비밀번호가 일치하지 않습니다. 다시 입력해 주세요.</p>
        </li>
      </ul>
      <div class="btn-wrap btn-wrap-01">
        <!-- TODO: disable클래스 비활성화 -->
        <button class="btn btn-02-mp disable btnCheck" @click="checkPw()">확인</button>
      </div>
    </div>
  </div>
  <div class="serial">
    <!-- TODO : span에 시리얼 넘버 -->
    S/N <span> {{ deviceNo }}</span>
  </div>
</div>
</template>

<script>
import {mapGetters} from "vuex";
import mypageFactory from '@/api/mypage-factory';

const userInfoCode = mypageFactory.get('userInfoCode');

export default {
  name: "member-info-main",
  created() {
    // 테블릿 기기시리얼번호 가져오기
    // eslint-disable-next-line
    this.deviceNo = getDeviceNo();
  },
  data() {
    return {
      password: '',
      isShowPw: false,
      deviceNo: null,
    }
  },
  watch: {
    'password'() {
      this.activeCheckBtn();
    },
  },
  computed: {
    ...mapGetters(['userInfo']),
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

      if (parentWrap.querySelector('input').classList.contains('inputPw')) {
        this.password = '';
      }

      icon.classList.remove('show');
      this.activeCheckBtn();
    },
    activeCheckBtn() {
      const btnCheck = document.querySelector('.btnCheck');
      const formWrap = document.querySelector('.formWrap');

      formWrap.classList.remove('error');

      if (this.password.length >= 4) {
        btnCheck.classList.remove('disable');
      } else {
        btnCheck.classList.add('disable');
      }
    },
    // 비밀번호 보여주기 여부
    showPassword() {
      this.isShowPw = !this.isShowPw;
      const inputPw = document.querySelector('.inputPw');
      if (this.isShowPw) {
        inputPw.type = 'text';
      } else {
        inputPw.type = 'password';
      }
    },
    // 비밀번호 체크
    checkPw() {
      const data = {
        loginId: this.userInfo.info.parentEmail,
        password: this.password
      }

      const list = userInfoCode.checkPassword(data);
      list.then((res) => {
        const result = res.data;
        if (result.code == '200') {
          if (result.data.checked) { // 비밀번호 맞을때
            this.$router.push({name: 'MemberInfoModify', params: { id: this.userInfo.info.studentId }});
          } else { // 비밀번호 틀릴때
            const formWrap = document.querySelector('.formWrap');
            formWrap.classList.add('error');
          }

        }
      }).catch((error) => {
        console.log(error)
      });
    },
  }
}
</script>

<style scoped>

</style>