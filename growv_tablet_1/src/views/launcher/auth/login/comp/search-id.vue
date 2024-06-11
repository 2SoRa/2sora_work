<template>
  <div class="search">
    <div class="search-area">
      <div class="search-title">
        <p class="title">아이디 찾기</p>
        <p class="content">회원가입 시 <span>등록한 정보</span>를 입력해 주세요.</p>
      </div>
      <ul class="input-wrap">
        <li>
          <div class="name-wrap">
            <input type="text" id="name" class="input" autocomplete="off" placeholder="학부모이름 (한글 10자, 영문 20자 까지)" require
                   ref="firstInput"
                   v-model="name" @input="activeInputClear($event, 'name'), activeCheckBtn()">
            <div class="input-sub">
              <button class="btn btn-clear" @click="clickClear($event,'name')"></button>
            </div>
          </div>
        </li>
        <li>
          <div class="mobileNo-wrap">
            <input type="text" id="tel" class="input" autocomplete="off" placeholder="휴대폰 번호 (숫자만 입력)" require
                   v-model="mobileNo" maxlength="11"
                   @input="activeInputClear($event, 'mobileNo'), activeCheckBtn(), typedInput($event)">
            <div class="input-sub">
              <button class="btn btn-clear" @click="clickClear($event,'mobileNo')"></button>
            </div>
          </div>
        </li>
      </ul>
      <div class="btn-wrap">
        <button class="btn btn-410 gray">
          <router-link :to="{ name:'loginMain' }">이전</router-link>
        </button>
          <button class="btn btn-410 checkBtn disable" @click="searchUserInfo()">확인</button>
      </div>
    </div>
    <div class="footer search-footer">
        <p>고객센터<span class="call">1533-1777</span></p>
        <div>
          <p></p>
          <p>평일<span>10:00 ~ 19:00</span></p>
          <p>점심시간<span>12:00 ~ 13:00</span></p>
          <p>주말/공휴일<span>휴무</span></p>
        </div>
    </div>
  </div>

  <alertModal :propsData="{alertShowModal, message}" @closePopup="closeAlertPopup"></alertModal>
</template>

<script>
import {searchId} from "@/api/auth/auth-api"

import alertModal from './comp-login-popup/search-id-confirm-popup'

export default {
  name: "searchId",
  data() {
    return {
      name: '',
      mobileNo: '',
      alertShowModal: false,
      message: '',
    }
  },
  components: {
    alertModal,
  },
  methods: {
    activeCheckBtn() {
      const checkBtn = document.querySelector('.checkBtn');
      if (this.name !== '' && this.mobileNo.length >= 10) {
        checkBtn.classList.remove('disable')
      } else {
        this.disabledCheckBtn();
      }
    },
    disabledCheckBtn() {
      const checkBtn = document.querySelector('.checkBtn');
      checkBtn.classList.add('disable');
    },
    activeInputClear(event, div) {

      const parentWrap = event.target.closest('.' + div + '-wrap');
      const icon = parentWrap.querySelectorAll('.btn-clear');

      icon.forEach((el) => {
        if (!el.classList.contains('show')) {
          el.classList.add('show');
        }
      });
    },
    clickClear(event, div) {
      if (div === 'name') {
        this.name = '';
      } else if (div === 'mobileNo') {
        this.mobileNo = '';
      }

      const parentWrap = event.target.closest('.' + div + '-wrap');
      const icon = parentWrap.querySelectorAll('.btn-clear');

      icon.forEach((el) => {
        if (el.classList.contains('show')) {
          el.classList.remove('show');
        }
      });

      this.disabledCheckBtn();
    },
    searchUserInfo() {
      if(!this.name){
        alert("학부모 이름을 입력해 주세요.");
        return;
      }

      if(!this.mobileNo){
        alert("휴대폰 번호를 입력해 주세요.");
        return;
      }
      const params = {
        name: this.name,
        mdnNo: this.mobileNo
      }

      searchId(params).then((res) => {
        const result = res.data;
        if (result.code === '200') {
          // this.$router.push({name: 'searchIdSuccess', params: {name: result.data.name, loginId: result.data.loginId, regDt: result.data.regDt}});
          if(result.data.name && result.data.loginId){
            this.$router.push({
              name: 'searchIdSuccess',
              query: {name: result.data.name, loginId: result.data.loginId, regDt: result.data.regDt}
            });
          }else{
            this.message = '일치하는 회원정보가 없습니다. 정확한 정보를 입력해 주세요';
            this.openAlertPopup();
          }
        } else {
          this.message = '일치하는 회원정보가 없습니다. 정확한 정보를 입력해 주세요';
          this.openAlertPopup();
        }
      }).catch((error) => {
        console.log("error =", error);
        const errorData = error.response.data;
        alert(errorData.message);
      });
    },
    typedInput(event) {
      event.target.value = event.target.value.replace(/[^0-9]/g,'');
    },
    // 알럿팝업 열기
    openAlertPopup() {
      this.alertShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    //  알럿팝업 닫기
    closeAlertPopup() {
      this.alertShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
  },
}
</script>

<style scoped>
</style>