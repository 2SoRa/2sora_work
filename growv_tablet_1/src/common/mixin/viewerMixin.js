/* eslint-disable */
import moment from 'moment';
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import store from "@/store";
import { mapGetters } from "vuex";

let openBookInfo = null, openBookItem = null, kindBook = '';
const viewerMixin = {
  mounted() {
    window.$vm = this;
  },
  computed : {
    ...mapGetters('readingStorage',['getIsEnglishMember'])
  },
  methods : {
    mixin_openBook(info, item) {
      if (!this.getIsEnglishMember && info.path !== 'S' && item.bookDiv === 'E') {
        this.showToast('영어책은 이용할 수 없어요.');
        return;
      }
      // 뷰어 유입 정보 + 책 정보 담기
      openBookInfo = info;
      openBookItem = item;
      // 현재 개월, 무료책, 모션북+이북 존재 여부 확인
      openBookItem.isAge = moment(new Date()).diff(moment(this.$store.getters.userInfo.info.birthdate), 'months');
      openBookItem.isFree = 'free';
      openBookItem.isWhatRead = info.motion ? false : (item.isMotionBook && item.isEbook);
      //학습현황에서 진입 여부
      openBookItem.isCalender = info.isCalender === 'Y' ? true : false ;
      // 책 종류 확인 팝업
      if ((openBookInfo.path !== 'T' && openBookInfo.path !== 'S') && openBookItem.isWhatRead) {
        this.openViewerPopup(openBookInfo, openBookItem, 'type');
      }else {
        // 뷰어 실행
        this.mixin_openBookRun();
      }
    },
    /* 뷰어 실행 */
    mixin_openBookRun(type) {
      // 특정 버전으로 열기
      if (type) {
        openBookInfo.isKind = type;
        kindBook = type;
      } else {
        // openBookItem.isEbook && openBookItem.fileInfo.ebUrl => 모션북이지만 이북으로 표시 되어 있고 뷰어 오픈시에는 모션북으로 오픈
        kindBook = (openBookItem.isMotionBook ) || (!openBookItem.isMotionBook && openBookItem.isEbook && openBookItem.fileInfo.ebUrl === '')  ? 'motionBook' : (openBookItem.isEbook) ? 'eBook' : 'audioBook';
        // kindBook = openBookItem.isMotionBook ? 'motionBook' : (openBookItem.isEbook) ? 'eBook' : 'audioBook';
      }
      // 다시 읽기용 - 기오픈되었던 책 종류 저장
      if (openBookInfo.isKind && openBookInfo.isKind !== 'py') {
        kindBook = openBookInfo.isKind;
      }
      // 진입경로가 V스캔 + 런처일 경우 읽기 모드 확인
      if (navigator.userAgent === 'SuperV-Launcher' && openBookInfo['path'] === 'S' && type !== 'py') {
        this.mixin_vScanMode();
      } else {
        this.mixin_intent();
      }
    },
    /* 뷰어 실행 */
    mixin_intent() {
      const token = localStorage.getItem("accessToken"),
        studentId = this.$store.getters.userInfo.info.studentId;
      let languageType = 'KoreanEnglish';
      if (navigator.userAgent === 'SuperV-Launcher') {
        languageType = GrowvLauncherBridge.getVScanMotionBookLanguage();
      }
      switch (kindBook) {
        case 'motionBook' :
          openBookInfo['type'] = 1;
          location.href = `intent:#Intent;package=com.mackerly.growv.viewer;scheme=growv-viewer;S.authToken=${token};i.studentId=${studentId};S.callbackParameter=${JSON.stringify(openBookInfo)};S.group=${openBookItem.fileInfo.moGroupId};S.bookId=${openBookItem.bookId};S.contentId=${openBookItem.fileInfo.moId};S.subject=${openBookItem.bookDiv === 'K' ? 'Korean' : 'English' };i.commonFileVersion=${openBookItem.fileInfo.moComVer};S.commonFileUrl=${encodeURIComponent(openBookItem.fileInfo.moComUrl)};i.serviceFileVersion=${openBookItem.fileInfo.moVer};S.serviceFileUrl=${encodeURIComponent(openBookItem.fileInfo.moUrl)};S.product=superReading;B.freeControl=false;S.entryPoint=${openBookInfo.entry};S.motionBookLanguage=${languageType};S.dayOfTodayBook=${openBookItem.bookVerDiv === 'D1' ? '1' : '2'};end`;
          break;
        case 'eBook' :
          openBookInfo['type'] = 2;
          location.href = `intent:#Intent;package=com.mackerly.growv.ebook;scheme=growv-ebook-viewer;S.authToken=${token};i.studentId=${studentId};S.callbackParameter=${JSON.stringify(openBookInfo)};S.group=-5;S.bookId=${openBookItem.bookId};S.contentId=${openBookItem.fileInfo.ebId};i.serviceFileVersion=${openBookItem.fileInfo.ebVer};S.serviceFileUrl=${encodeURIComponent(openBookItem.fileInfo.ebUrl)};B.freeControl=false;S.product=SuperReading;end`;
          break;
        case 'audioBook' :
          openBookInfo['type'] = 3;
          if (navigator.userAgent === 'SuperV-Launcher') {
            GrowvLauncherBridge.playAudioBook(openBookItem.bookNm, openBookItem.thumbUrl, openBookItem.fileInfo.auUrl, openBookItem.fileInfo.auVer)
            // V스캔 구매 + 오디오북일시 메인 이동 처리
            if (openBookInfo.isBuy && openBookInfo.isBuy === 'Y' && openBookInfo.isCalenderVscan !== 'Y') {
              window.$vm.$router.replace({name: 'ReadingClubMainView'});
            }
          }
          break;
        case 'py' :
          openBookInfo['type'] = 4;
          location.href = `intent:#Intent;package=com.mackerly.growv.viewer;scheme=growv-viewer;S.authToken=${token};i.studentId=${studentId};S.callbackParameter=${JSON.stringify(openBookInfo)};S.group=${openBookItem.fileInfo.pyGroupId};S.bookId=${openBookItem.bookId};S.contentId=${openBookItem.fileInfo.pyId};S.subject=Korean;i.commonFileVersion=${openBookItem.fileInfo.pyComVer};S.commonFileUrl=${encodeURIComponent(openBookItem.fileInfo.pyComUrl)};i.serviceFileVersion=${openBookItem.fileInfo.pyVer};S.serviceFileUrl=${encodeURIComponent(openBookItem.fileInfo.pyUrl)};S.product=superReading;B.freeControl=false;S.entryPoint=KoreanLibrary;S.motionBookLanguage=English;S.dayOfTodayBook=1;end`;
          break;
      }
    },
    /* 뷰어 완료 */
    mixin_viewComplete(param, result) {
      // 뷰어 결과 저장
      if(openBookInfo['type'] !== 4) openBookInfo.isRead = result;
      // 독서 활동인 경우 결과값 입력 제외
      if (openBookInfo['type'] !== 4) {
        const info = JSON.parse(param);
        const params = {
          studentId: this.$store.getters.userInfo.info.studentId,
          bookGopath: info.path,
          bookVerDiv: openBookItem.bookVerDiv ? openBookItem.bookVerDiv : null,
          studyViewerCd: info.type,
          isComplete: result ? 'Y' : 'N',
          isRefresh : info.isRefresh === 'N' ? 'N' : ''
        }
        const viewerApi = readingClubFactory.get('viewer');
        const viewerData = viewerApi.viewComplete(openBookItem.bookId, params);
        viewerData.then((res) => {
          if (res.data.data.result === 1) {
            const data = res.data.data;
            //미완강 + 오늘의 책 + 학습현황, 중도이탈시 => 독서 상세 api호출
            if(!result && info.path === 'T' && openBookItem.isCalender ){
              return this.getCalenderDetail();
            }
            // 완강 + 오늘의 책 + 할당된 오늘의 책 + 미완강일 때
            if (result && info.path === 'T' && data.isToday && !openBookItem.isRead) {
              openBookItem.isRead = true;
              return;
            }
            // 완강 + 기존 미완강 + 오늘의책이 아닐 때
            if (result && !openBookItem.isRead && info.path !== 'T') {
              openBookItem.isRead = true;
              return;
            }
          }
        }).catch((err) => {
          console.log(err)
        });
      }
      // V스캔 + 이탈일 때 메인
      if (openBookInfo.isBuy && openBookInfo.isBuy === 'Y' && !result &&  openBookInfo.isCalenderVscan !== 'Y') {
        this.$router.replace({name:'ReadingClubMainView'});
        return;
      }
      // 완강 or 독서활동이 아닌 경우에만 팝업 노출
      if (result && openBookInfo['type'] !== 4) {
        this.mixin_viewModal(param, result);
        return;
      }
      // 미완강 + 독서 활동 이탈인 경우
      if (!result && openBookInfo['type'] === 4) {
        this.closeViewerPopup();
      }
    },
    /* 뷰어 완료 후 팝업 실행 */
    mixin_viewModal(param, result) {
      const info = JSON.parse(param);
      // 레포트 팝업
      if (result && !openBookItem.isRead && openBookItem.bookDiv === 'K') {
        openBookItem.isEndReport = true;
        this.mixin_insertModalData('report');
        return;
      }
      // 독서활동을 끝내고 왔을 경우
      if (openBookInfo['type'] === 4) {
        openBookItem.isEndPy = true;
        this.mixin_insertModalData('re');
        return;
      }
      // 독서활동 팝업 (36개월 이상, 독서활동 존재시, 오늘의책,V스캔 유입시, 최초 독서활동 유입
      if (openBookItem.isAge >= 36 && openBookItem.isPy && (openBookInfo.path === 'T' || openBookInfo.path === 'S') && !openBookItem.isEndPy) {
        this.mixin_insertModalData('py');
        return;
      }
      // 기본 다시 읽기 노출
      this.mixin_insertModalData('re');
    },
    /* 모달 데이터 삽입 */
    mixin_insertModalData(type) {
      this.viewerInfo.modalData.info = openBookInfo;
      this.viewerInfo.modalData.item = openBookItem;
      this.viewerInfo.modalType = type;
      this.viewerInfo.isModal = true;
    },
    /* V스캔 전용 실행 */
    mixin_vScanMode() {
      const vScanType = GrowvLauncherBridge.getVScanReadingMode();
      // 설정 도서가 모션북일 경우
      if (vScanType === 'MotionBook') {
        kindBook = openBookItem.isMotionBook ? 'motionBook' : (openBookItem.isEbook) ? 'eBook' : 'audioBook';
      }
      // 설정 도서가 이북일 경우
      if (vScanType === 'Ebook') {
        kindBook = openBookItem.isEbook ? 'eBook' : (openBookItem.isMotionBook) ? 'motionBook' : 'audioBook';
      }
      // 설정 도서가 오디오북일 경우
      if (vScanType === 'AudioBook') {
        kindBook = openBookItem.fileInfo.auUrl ? 'audioBook' : (openBookItem.isMotionBook) ? 'motionBook' : 'eBook';
      }
      this.mixin_intent();
    }
  }
}
export default viewerMixin;

window.AppHandler = {
  onKeyboardVisibilityChanged() {},
  onStart() {},
  onResume() {
    // 출석 체크
    store.dispatch('attendStorage/setAttend');
  },
  onPause() {},
  onStop() {},
  onViewerResult(param, result) {
    const info = JSON.parse(param);

    if (!info.isFree || info.isFree !== '1') {
      window.$vm.mixin_viewComplete(param, result);
    }
  }
}