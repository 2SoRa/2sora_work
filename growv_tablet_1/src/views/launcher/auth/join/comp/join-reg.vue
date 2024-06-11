<template>
  <div class=" join-reg">
    <div class="content">
      <p class="content-title">슈퍼V 서비스를 원활하게 이용하기 위해 <span>회원가입</span>을 진행해주세요.</p>
      <ul class="input-wrap">
        <li>
          <p class="info"><span class="dotbadge"></span>학부모 정보</p>
          <div class="loginId-wrap">
            <input type="email" class="input" autocomplete="off" placeholder="아이디 (이메일)" require ref="firstInput"
                   v-model="loginId"
                   @input="activeInputClear($event, 'loginId'), activeCheckBtn()">
            <div class="input-sub">
              <button class="btn btn-clear" @click="clickClear($event,'loginId')"></button>
            </div>
          </div>
        </li>
        <li>
          <div class="password-wrap">
            <input type="password" class="input" autocomplete="off" placeholder="비밀번호 (영문, 숫자, 특수문자 중 2가지 이상 포함 8~18자)"
                   v-model="password"
                   @input="activeInputClear($event, 'password'), activeCheckBtn()">
            <div class="input-sub">
              <button class="btn hidden" @click="toggleEyeBtn($event, 'password')"></button>
              <button class="btn btn-clear" @click="clickClear($event,'password')"></button>
              <p class="check"></p>
            </div>
          </div>
        </li>
        <li>
          <div class="confirm-wrap">
            <input type="password" class="input" autocomplete="off" placeholder="비밀번호 재입력"
                   v-model="passwordConfirm"
                   @input="activeInputClear($event, 'confirm'), activeCheckBtn()">
            <div class="input-sub">
              <button class="btn hidden" @click="toggleEyeBtn($event, 'confirm')"></button>
              <button class="btn btn-clear" @click="clickClear($event,'confirm')"></button>
              <p class="check"></p>
            </div>
          </div>
        </li>
        <li>
          <div class="join-input input-select">
            <p>학부모 생년월일</p>
            <div class="dropdown-wrap">
              <div class="dropdown">
                <v-select
                    label="cdVlNm"
                    placeholder="년"
                    :options="parentYearItem"
                    v-model="selectedParentYear"
                    :reduce="parentYearItem => parentYearItem.cdVl">
                  <template #open-indicator="{ attributes }">
                    <span v-bind="attributes"><img src="@/assets/img/launcher/common/mp_ico_down.png"
                                                   alt="arrow"></span>
                  </template>
                </v-select>
              </div>
              <div class="dropdown">
                <v-select label="cdVlNm"
                          placeholder="월"
                          :options="monthItem"
                          v-model="selectedParentMonth"
                          :reduce="monthItem => monthItem.cdVl">
                  <template #open-indicator="{ attributes }">
                    <span v-bind="attributes"><img src="@/assets/img/launcher/common/mp_ico_down.png"
                                                   alt="arrow"></span>
                  </template>
                </v-select>
              </div>
              <div class="dropdown">
                <v-select label="cdVlNm"
                          placeholder="일"
                          :options="parentDayItem"
                          v-model="selectedParentDay"
                          :reduce="parentDayItem => parentDayItem.cdVl">
                  <template #open-indicator="{ attributes }">
                    <span v-bind="attributes"><img src="@/assets/img/launcher/common/mp_ico_down.png"
                                                   alt="arrow"></span>
                  </template>
                </v-select>
              </div>
            </div>
          </div>
        </li>
        <li>
          <p class="info"><span class="dotbadge"></span>자녀 정보</p>
          <div class="join-input">
            <input type="text" class="input disable disable-01" v-model="studentName" disabled>
          </div>
        </li>
        <!-- TODO: 자녀 생년월일 임시 제거, v-show=false 제거 -->
        <li v-show="false">
          <div class="join-input input-select">
            <p>자녀 생년월일</p>
            <div class="dropdown-wrap">
              <div class="dropdown">
                <v-select
                    label="cdVlNm"
                    placeholder="년"
                    :options="studentYearItem"
                    v-model="selectedStudentYear"
                    :reduce="studentYearItem => studentYearItem.cdVl">
                  <template #open-indicator="{ attributes }">
                    <span v-bind="attributes"><img src="@/assets/img/launcher/common/mp_ico_down.png"
                                                   alt="arrow"></span>
                  </template>
                </v-select>
              </div>
              <div class="dropdown">
                <v-select label="cdVlNm"
                          placeholder="월"
                          :options="studentMonthItem"
                          v-model="selectedStudentMonth"
                          :reduce="studentMonthItem => studentMonthItem.cdVl">
                  <template #open-indicator="{ attributes }">
                    <span v-bind="attributes"><img src="@/assets/img/launcher/common/mp_ico_down.png"
                                                   alt="arrow"></span>
                  </template>
                </v-select>
              </div>
              <div class="dropdown">
                <v-select label="cdVlNm"
                          placeholder="일"
                          :options="studentDayItem"
                          v-model="selectedStudentDay"
                          :reduce="studentDayItem => studentDayItem.cdVl">
                  <template #open-indicator="{ attributes }">
                    <span v-bind="attributes"><img src="@/assets/img/launcher/common/mp_ico_down.png"
                                                   alt="arrow"></span>
                  </template>
                </v-select>
              </div>
            </div>
          </div>
        </li>
        <!-- TODO: 자녀 생년월일 임시 제거, v-show=false 제거 -->
        <li v-show="false">
          <input type="text" class="input disable short-input" v-model="this.formData.age">
        </li>
      </ul>

      <div class="btn-wrap btn-wrap-01">
        <button class="btn btn-460 checkBtn disable" @click="goSignUp">회원가입</button>
      </div>
    </div>

    <alertModal :propsData="{alertShowModal, message}" @closePopup="closeAlertPopup"></alertModal>
  </div>
</template>

<script>

import {mapGetters} from "vuex";
import {changeTempUser} from "@/api/auth/auth-api";
import alertModal from './comp-join-popup/join-confirm-popup'


export default {
  name: 'joinReg',
  components: {
    alertModal,
  },
  created() {
    if (!this.userInfo.info.parentId) {
      this.$router.push({name: 'loginMain'});
    }

    this.studentName = this.userInfo.info.studentName;
    if (this.$route.query.isServiceAgreed === undefined || this.$route.query.isPrivacyAgreed === undefined ||
        this.$route.query.isServiceAgreed === 'false' || this.$route.query.isPrivacyAgreed === 'false') {
      this.$router.push({name: 'joinGuide'});
    }

    this.formData.isServiceAgreed = this.$route.query.isServiceAgreed;
    this.formData.isPrivacyAgreed = this.$route.query.isPrivacyAgreed;
    this.formData.isMarketingAgreed = this.$route.query.isMarketingAgreed;

    this.setBirth();
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  data() {
    return {
      loginId: '',
      password: '',
      passwordConfirm: '',
      selectedParentYear: null,
      selectedParentMonth: null,
      selectedParentDay: null,
      selectedStudentYear: null,
      selectedStudentMonth: null,
      selectedStudentDay: null,
      alertShowModal: false,
      formData: {
        isServiceAgreed: false,
        isPrivacyAgreed: false,
        isMarketingAgreed: false,
        studentName: '',
        parentBirthDate: null,
        studentBirthDate: null,
        age: null
      },
      message: '',
      parentYearItem: [],
      studentYearItem: [],
      monthItem: [],
      studentMonthItem: [],
      parentDayItem: [],
      studentDayItem: [],
      selectParentYearItems: [],
      selectParentMonthItems: [],
      selectParentDayItems: [],
      selectStudentYearItems: [],
      selectStudentMonthItems: [],
      selectStudentDayItems: [],
      parentStartYYYY: 1950,
      parentStartAge: 19, /* 만 19세 */
      studentStartDate: null,
      studentEndDate: null
    }
  },
  watch: {
    'selectedParentYear'() {
      this.selectedParentMonth = null;
      this.selectedParentDay = null;

      this.activeCheckBtn();
    },
    'selectedParentMonth'() {
      this.selectedParentDay = null;
      this.lastDay = new Date(this.selectedParentYear, this.selectedParentMonth, 0).getDate();
      this.setParentDay();

      this.activeCheckBtn();
    },
    'selectedParentDay'() {
      if(this.selectedParentDay) {
        this.formData.parentBirthDate = this.selectedParentYear.toString()+ "-" + this.setMonthOrDate(this.selectedParentMonth.toString())+ "-" + this.setMonthOrDate(this.selectedParentDay.toString());
        // this.formData.parentBirthDate = new Date(this.selectedParentYear, this.selectedParentMonth, this.selectedParentDay);
      }else{
        this.formData.parentBirthDate = null;
      }

      this.activeCheckBtn();
    },
    'selectedStudentYear'() {
      this.selectedStudentMonth = null;
      this.selectedStudentDay = null;

      this.setStudentMonth();
    },
    'selectedStudentMonth'() {
      this.selectedStudentDay = null;
      this.lastDay = new Date(this.selectedStudentYear, this.selectedStudentMonth, 0).getDate();
      this.setStudentDay();
    },
    'selectedStudentDay'() {
      if(this.selectedStudentDay) {
        this.formData.studentBirthDate = this.selectedStudentYear.toString()+ "-" + this.setMonthOrDate(this.selectedStudentMonth.toString())+ "-" + this.setMonthOrDate(this.selectedStudentDay.toString());
        // TODO: 자녀 생년월일 임시 제거
        // this.formData.studentBirthDate = new Date(this.selectedStudentYear, this.selectedStudentMonth, this.selectedStudentDay);
        this.setAge();
      }else{
        this.formData.studentBirthDate = null;
      }
    },
  },
  methods: {
    setBirth() {
      const today = new Date();
      // 학생 생년월일 기준 34개월 ~ 84개월까지
      // 84개월전
      this.studentStartDate = new Date(today.getFullYear(), today.getMonth() - 84, today.getDate());
      // 34개월전
      this.studentEndDate = new Date(today.getFullYear(), today.getMonth() - 34, today.getDate());

      // 학보모 생년월이 기준 1950 ~ 20세기준 년도
      this.setParentYear(today);
      this.setMonth();

      this.setStudentYear();
      this.setStudentMonth();
    },
    goSignUp() {
      this.disabledCheckBtn();
      if(!this.loginId){
        this.message = '아이디를 입력해주세요.';
        this.openAlertPopup();
        return;
      }
      const id = this.loginId;
      //eslint-disable-next-line
      const id_reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+")){3,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!id_reg.test(id)) {
        this.message = '이메일 형식의 올바른 아이디를 입력해 주세요.';
        this.openAlertPopup();
        return;
      }

      if(!this.password){
        this.message = '비밀번호를 한 번 더 입력해주세요.';
        this.openAlertPopup();
        return;
      }

      if(!this.passwordConfirm){
        this.message = '비밀번호를 한 번 더 입력해주세요.';
        this.openAlertPopup();
        return;
      }

      // 비밀번호, 비밀번호 확인 체크
      if (this.password !== this.passwordConfirm) {
        this.message = '비밀번호가 일치하지 않습니다.';
        this.openAlertPopup();
        return;
      }

      // 영문+숫자 8자 이상 체크
      const pw_reg1 = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,50}$/; //영문,숫자
      // 특수문자 포함 6자 이상
      const pw_reg2_check1 = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,50}$/; //영문,특수문자
      const pw_reg2_check2 = /^(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{6,50}$/; //특수문자, 숫자
      if (!pw_reg1.test(this.password) && !(pw_reg2_check1.test(this.password) || pw_reg2_check2.test(this.password))) {
        this.message = '영문/숫자/특수문자 중 2가지 이상을 포함한 8~18자 여야 합니다.';
        this.openAlertPopup();
        return;
      }

      this.formData.parentBirthDate = this.selectedParentYear.toString()+ "-" + this.setMonthOrDate(this.selectedParentMonth.toString())+ "-" + this.setMonthOrDate(this.selectedParentDay.toString());
      // this.formData.studentBirthDate = this.selectedStudentYear.toString()+ "-" + this.setMonthOrDate(this.selectedStudentMonth.toString())+ "-" + this.setMonthOrDate(this.selectedStudentDay.toString());

      if(!this.formData.parentBirthDate){
        this.message = '학부모의 생년월일을 선택해주세요.';
        this.openAlertPopup();
        return;
      }

      // TODO: 자녀 생년월일 임시 제거
      /*if(!this.formData.studentBirthDate){
        this.message = '자녀의 생년월일을 선택해주세요.';
        this.openAlertPopup();
        return;
      }*/

      // 회원가입 버튼 클릭 카운트(한번 클릭시 비활성화 처리 - 중복클릭시 비타민이 중복지급되는 현상 발생 떄문)
      let clickCount = 0;
      clickCount++;
      let checkBtn = document.querySelector('.checkBtn');
      if (clickCount >= 1) {
        checkBtn.classList.add('disable');
      }

      const params = {
        parentId: this.userInfo.info.parentId,
        email: this.loginId,
        password: this.password,
        parentBirthDate: this.formData.parentBirthDate,
        stuId: this.userInfo.info.studentId,
        stuName: this.userInfo.info.studentName,
        stuBirthDate: this.formData.studentBirthDate,
        isServiceUseAgreed: this.formData.isServiceAgreed,
        isPrivacyAgreed: this.formData.isPrivacyAgreed,
        isMarketingReceiveAgreed: this.formData.isMarketingAgreed
      }

      changeTempUser(params).then((res) => {
        const result = res.data;
        if (result.code === '200') {
          this.$router.push({name: 'joinSuccess'})
        } else {
          if (result.code === '409') {
            this.message = result.message;
          } else {
            this.message = '회원가입에 실패했습니다.';
          }
          this.activeCheckBtn();
          this.openAlertPopup();
          return;
        }
      }).catch((error) => {
        console.log("error =", error);
        const errorData = error.response.data;
        alert(errorData.message);
        this.activeCheckBtn();
      });
    },
    activeCheckBtn() {
      const checkBtn = document.querySelector('.checkBtn');
      if (this.loginId && this.password && this.passwordConfirm && this.selectedParentYear && this.selectedParentMonth && this.selectedParentDay) {
        // && this.selectedParentYear && this.selectedParentMonth && this.selectedParentDay

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
      if (div === 'loginId') {
        this.loginId = '';
      } else if (div === 'password') {
        this.toggleEyeCloseBtn(event, div);
        this.password = '';
      } else if (div === 'confirm') {
        this.toggleEyeCloseBtn(event, div);
        this.passwordConfirm = '';
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
    toggleEyeCloseBtn(event, div) {
      const parentWrap = event.target.closest('.' + div + '-wrap');
      const input = parentWrap.querySelector('input');
      const icon = parentWrap.querySelectorAll('.hidden');

      // eye icon들 중 show클래스가 있으면 제거하고 없으면 추가
      icon.forEach((el) => {
        if (el.classList.contains('show')) {
          el.classList.remove('show');
          input.setAttribute('type', 'password');
        }
      });
    },
    toggleEyeBtn(event, div) {
      if (div === 'password' && !this.password) {
        return;
      } else if (div === 'confirm' && !this.passwordConfirm) {
        return;
      }

      const parentWrap = event.target.closest('.' + div + '-wrap');
      const input = parentWrap.querySelector('input');
      const icon = parentWrap.querySelectorAll('.hidden');

      // eye icon들 중 show클래스가 있으면 제거하고 없으면 추가
      icon.forEach((el) => {
        if (el.classList.contains('show')) {
          el.classList.remove('show');
          input.setAttribute('type', 'password');
        } else {
          el.classList.add('show');
          input.setAttribute('type', 'text');
        }
      });
    },
    closeAlertPopup() {
      this.alertShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 알럿팝업 열기
    openAlertPopup() {
      this.alertShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    setParentYear(today) {
      const allowStartYYYY = this.parentStartYYYY;
      const allowEndYYYY = today.getFullYear() - this.parentStartAge;
      // parent YYYY
      for (let i = allowEndYYYY; allowStartYYYY <= i; i--) {
        this.parentYearItem.push({cdVl: i, cdVlNm: i + '년'});
      }
    },
    setStudentYear() {
      // student YYYY
      for (let i = this.studentEndDate.getFullYear(); this.studentStartDate.getFullYear() <= i; i--) {
        this.studentYearItem.push({cdVl: i, cdVlNm: i + '년'});
      }
    },
    setMonth() {
      // Month
      for (let i = 1; i <= 12; i++) {
        this.monthItem.push({cdVl: i, cdVlNm: i + '월'});
      }
    },
    setStudentMonth() {
      this.studentMonthItem = [];

      let startMonth = '1';
      let endMonth = '12';
      if (this.selectedStudentYear === this.studentStartDate.getFullYear()) {
        startMonth = this.studentStartDate.getMonth() + 1;
      } else if (this.selectedStudentYear == this.studentEndDate.getFullYear()) {
        endMonth = this.studentEndDate.getMonth() + 1
      }

      // Month
      for (let i = startMonth; i <= endMonth; i++) {
        this.studentMonthItem.push({cdVl: i, cdVlNm: i + '월'});
      }
    },
    setParentDay() {
      this.parentDayItem = [];
      // day
      for (let i = 1; i <= this.lastDay; i++) {
        this.parentDayItem.push({cdVl: i, cdVlNm: i + '일'});
      }
    },
    setStudentDay() {
      this.studentDayItem = [];
      // day
      for (let i = 1; i <= this.lastDay; i++) {
        this.studentDayItem.push({cdVl: i, cdVlNm: i + '일'});
      }
    },
    setMonthOrDate(value){
      if(value.length == 1){
        value = "0"+value;
      }

      return value;
    },
    setAge(){
      const today = new Date();
      const birthDate = new Date(this.selectedStudentYear, this.selectedStudentMonth, this.selectedStudentDay);
      this.formData.age = today.getFullYear() - birthDate.getFullYear() + 1+"세";

    }

  },
  mounted() {
    const input = document.querySelectorAll('.vs__selected-options .vs__search');
    input.forEach((el) => {
      el.setAttribute('inputmode','none');
      el.setAttribute('readonly','readonly');
    });
  },
}
</script>

<style scoped>

</style>