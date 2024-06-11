<template>
<div class="info-content modify">
  <div class="title">
    <p><span class="dotbadge"></span>학부모 정보</p>
    <p class="info"><span class="essential"></span> 필수항목</p>
  </div>
  <ul class="form">
    <li>
      <p class="form-title">아이디(이메일) <span class="essential"></span></p>
      <div class="form-content">
        <div class="input-wrap">
          <div class="wrap id-wrap">
            <input type="text" class="input disable" :value="info.parentLoginId">
          </div>
        </div>
      </div>
    </li>
    <li>
      <p class="form-title">비밀번호</p>
      <div class="form-content">
        <div class="input-wrap">
          <div class="wrap password-wrap">
            <input type="password" class="input disable" value="....">
          </div>
        </div>
        <button class="btn btn-03-mp" @click="openPwModiPopup">비밀번호 변경</button>
      </div>
    </li>
    <li>
    <p class="form-title">학부모 이름 <span class="essential"></span></p>
    <div class="form-content">
      <div class="input-wrap">
        <div class="wrap name-wrap">
          <input type="text" class="input disable" :value="info.parentNm">
        </div>
      </div>
    </div>
  </li>
    <li>
    <p class="form-title">생년월일 <span class="essential"></span></p>
    <div class="form-content">
      <div class="input-wrap">
        <div class="wrap birth-wrap">
          <input type="text" class="input disable" :value="info.parentBirthdate">
        </div>
      </div>
    </div>
  </li>
    <li>
    <p class="form-title">휴대폰 번호 <span class="essential"></span></p>
    <div class="form-content">
      <div class="input-wrap">
        <div class="wrap phone-wrap">
          <input type="tel" class="input disable" :value="info.mdnNo">
        </div>
      </div>
      <button class="btn btn-type-05" @click="openPhoneModiPopup">변경</button>
    </div>
  </li>
  <li>
    <p class="form-title">전화번호</p>
    <div class="form-content">
      <div class="input-wrap">
        <div class="wrap phone-wrap">
          <input type="tel" class="input" v-model="formData.phoneNo" placeholder="전화번호 (-없이 숫자만 입력)" @input="checkNumber($event)">
        </div>
      </div>
    </div>
  </li>
  <li class="address">
    <p class="form-title">주소 <span class="essential"></span></p>
    <div class="form-content addressWrap">
      <div class="input-wrap">
        <div class="wrap phone-wrap">
          <input type="text" disabled class="input inputZipcode" v-model="formData.zipcode" @click="openAddressSearchDialog">
          <input type="text" disabled class="input inputAdr1" v-model="formData.adr1">
          <input type="text" class="input inputAdr2" v-model="formData.adr2">
        </div>
        <p class="info-sub">상세주소를 입력해 주세요.</p>
      </div>
      <button class="btn btn-type-05" @click="openAddressSearchDialog">우편번호</button>
    </div>
  </li>
  </ul>

  <div class="title">
    <p><span class="dotbadge"></span>자녀 정보</p>
  </div>
  <ul class="form">
    <li>
      <p class="form-title">자녀이름 <span class="essential"></span></p>
      <div class="form-content">
        <div class="input-wrap">
          <div class="wrap name-wrap">
            <input type="text" class="input disable" :value="info.studentNm">
          </div>
        </div>
      </div>
    </li>
    <li>
      <p class="form-title">생년월일 <span class="essential"></span></p>
      <div class="form-content">
        <div class="input-wrap">
          <div class="wrap birth-wrap">
            <input type="text" class="input disable" :value="info.birthdate">
          </div>
        </div>
      </div>
    </li>
    <li>
      <p class="form-title">성별 <span class="essential"></span></p>
      <div class="form-content radio genderWrap">
        <div class="radio-wrap">
          <label class="radio">남자
            <input type="radio" name="gender" value="M" v-model="formData.genderDiv" :checked="formData.genderDiv == 'M'">
            <span class="radio-check"></span>
          </label>
          <label class="radio">여자
            <input type="radio" name="gender" value="F" v-model="formData.genderDiv" :checked="formData.genderDiv == 'F'">
            <span class="radio-check"></span>
          </label>
        </div>
        <p class="info-sub">성별을 선택해 주세요.</p>
      </div>
    </li>
  </ul>
  <div class="btn-wrap btn-wrap-01">
    <button class="btn btn-02-mp gray" @click="openCancelPopup()">취소</button>
    <!-- TODO: disable 비활성화 -->
    <button class="btn btn-02-mp btnModi" @click="updateInfo()">수정</button>
  </div>
</div>
  <div id="post-layer">
    <img src="//t1.daumcdn.net/postcode/resource/images/close.png" id="btnCloseLayer" @click="closeDaumPostcode()" alt="닫기 버튼">
  </div>
  <pwModiModal :propsData="{pwModiShowModal, info}" @closePopup="closePwModiPopup"></pwModiModal>
  <phoneModiModal :propsData="{phoneModiShowModal, info}" @closePopup="closePhoneModiPopup" @refreshInfo="getUserInfo"></phoneModiModal>
  <modiConfirmModal :propsData="{modiConfirmShowModal, message}" @closePopup="closeModiConfirmPopup"></modiConfirmModal>
  <cancelModal :propsData="{cancelShowModal}" @closePopup="closeCancelPopup"></cancelModal>
</template>

<script>
import pwModiModal from '../../comp-contents/comp-mypage-popup/password-modify-popup'
import phoneModiModal from '../../comp-contents/comp-mypage-popup/phone-modify-popup'
import modiConfirmModal from '../../comp-contents/comp-mypage-popup/info-modi-confirm-popup'
import cancelModal from '../../comp-contents/comp-mypage-popup/info-cancel-popup'
import mypageFactory from '@/api/mypage-factory';

const userInfoCode = mypageFactory.get('userInfoCode');

export default {
  name: "modify-info",
  props: ['id'],
  data() {
    return {
      pwModiShowModal: false,
      phoneModiShowModal: false,
      modiConfirmShowModal: false,
      cancelShowModal: false,
      message: '',

      info: {},
      formData: {
        phoneNo: '',
        zipcode: '',
        adr1: '',
        adr2: '',
        genderDiv: '',
      }
    }
  },
  components: {
    pwModiModal,
    phoneModiModal,
    modiConfirmModal,
    cancelModal,
  },
  watch: {
    'formData.adr2'() {
      if (this.formData.adr2.length > 0) {
        const addressWrap = document.querySelector('.addressWrap');
        addressWrap.classList.remove('error');
      }
    },
    'formData.genderDiv'() {
      if (this.formData.genderDiv != null) {
        const genderWrap = document.querySelector('.genderWrap');
        genderWrap.classList.remove('error');
      }
    }
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      const info = userInfoCode.getUserInfo(this.id); // TODO: this.id, test: 4

      info.then((res) => {
        const result = res.data;
        if (result.code === '200') {
          this.info = result.data;

          this.formData.phoneNo = this.info.phoneNo;
          this.formData.zipcode = this.info.zipcode;
          this.formData.adr1 = this.info.adr1;
          this.formData.adr2 = this.info.adr2;
          this.formData.genderDiv = this.info.genderDiv;

          this.formData.parentId = this.info.parentId;
          this.formData.parentMdnNo = this.info.mdnNo;
          this.formData.studentId = this.info.studentId;
        }
      }).catch((error) => {
        console.log(error);
        alert(error.response.data.message);
      });
    },
    updateInfo() {
      if (this.formData.adr2.length == 0) {
        const addressWrap = document.querySelector('.addressWrap');
        addressWrap.classList.add('error');
        return;
      }
      if (this.formData.genderDiv == null || this.formData.genderDiv.length == 0) {
        const genderWrap = document.querySelector('.genderWrap');
        genderWrap.classList.add('error');
        return;
      }

      const data = {
        parentId: this.info.parentId,
        parentPhoneNo: this.formData.phoneNo,
        zipcode: this.formData.zipcode,
        adr1: this.formData.adr1,
        adr2: this.formData.adr2,
        studentId: this.info.studentId,
        genderDiv: this.formData.genderDiv,
      }

      const detail = userInfoCode.updateUserInfo(data);

      detail.then((res) => {
        if (res.status == 200) {
          this.message = res.data.data.message;
          this.openModiConfirmPopup();
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    checkNumber(event) {
      const numPattern = /^[0-9]+$/;

      if (!numPattern.test(event.target.value) && event.target.value.length > 0) {
        event.target.value = event.target.value.substring(0, event.target.value.length - 1);
      }

      this.formData.phoneNo = event.target.value;
    },
    // 우편번호 찾기
    /*openAddressSearchDialog() {
      // eslint-disable-next-line no-undef
      new daum.Postcode({
        oncomplete: (data) => {
          var fullAddr = '';
          var extraAddr = '';
          this.formData.zipcode = data.zonecode;
          if (data.userSelectedType === 'R') {
            fullAddr = data.roadAddress;
            if (data.bname !== '') {
              extraAddr += data.bname;
            }
            if (data.buildingName !== '') {
              extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }

            fullAddr += (extraAddr !== '' ? '(' + extraAddr + ')' : '');
          } else {
            fullAddr = data.jibunAddress;
          }

          this.formData.adr1 = fullAddr;
          this.formData.adr2 = '';
        }
      }).open();
    },*/
    // 우편번호 찾기 레이어 테스트 (디바이스에서 위의 코드는 안됨), TODO: 태블릿 테스트 필요
    openAddressSearchDialog() {
      const postLayer = document.getElementById('post-layer');

      // eslint-disable-next-line no-undef
      new daum.Postcode({
        oncomplete: (data) => {
          var fullAddr = '';
          var extraAddr = '';
          if (data.userSelectedType === 'R') {
            fullAddr = data.roadAddress;
            if (data.bname !== '') {
              extraAddr += data.bname;
            }
            if (data.buildingName !== '') {
              extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }

            fullAddr += (extraAddr !== '' ? '(' + extraAddr + ')' : '');
          } else {
            fullAddr = data.jibunAddress;
          }

          this.formData.zipcode = data.zonecode;
          this.formData.adr1 = fullAddr;
          this.formData.adr2 = '';

          // iframe을 넣은 element를 안보이게 한다.
          // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
          postLayer.classList.remove('show');
        },
        width : '100%',
        height : '100%',
        maxSuggestItems : 5
      }).embed(postLayer);
      // iframe을 넣은 element를 보이게 한다.
      postLayer.classList.add('show');
    },
    closeDaumPostcode() {
      const postLayer = document.getElementById('post-layer');
      postLayer.classList.remove('show');
    },

    // 상세 팝업 열기
    openPwModiPopup() {
      this.pwModiShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 상세 팝업 닫기
    closePwModiPopup() {
      this.pwModiShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 일반모드 팝업 열기
    openPhoneModiPopup() {
      this.phoneModiShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 일반모드 팝업 닫기
    closePhoneModiPopup() {
      this.phoneModiShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 수정확인 팝업 열기
    openModiConfirmPopup() {
      this.modiConfirmShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 수정확인 팝업 닫기
    closeModiConfirmPopup() {
      this.modiConfirmShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 취소 팝업 열기
    openCancelPopup() {
      this.cancelShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 취소 팝업 닫기
    closeCancelPopup() {
      this.cancelShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
  }
}
</script>

<style scoped>
/* @import url('@/assets/css/launcher/mypage/mypage.css');*/
</style>