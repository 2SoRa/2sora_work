const complimentPopupMixin = {
  data() {
    return {
      completedInfo : { // 칭찬팝업 관련
        isComplimentModal: false,
        engBookCnt: 0, //영어책 개수
        korBookCnt: 0, //한글책 개수
        readEngCnt: 0, //완독 영어책
        readKorCnt: 0, //완독 힌글책
        isRead:0,
      },
    }
  },
  methods:{
    checkReadBook(res ) {
      this.completedInfo.engBookCnt = res.items.filter(item => item.bookDiv === 'E').length;
      this.completedInfo.korBookCnt = res.items.filter(item => item.bookDiv === 'K').length;

      this.completedInfo.readEngCnt = res.items.filter(item => item.bookDiv === 'E' && item.isRead).length;
      this.completedInfo.readKorCnt = res.items.filter(item => item.bookDiv === 'K' && item.isRead).length;

      this.completedInfo.isRead = res.items.filter(item => item.isRead).length;
    },
    openComplimentPopup() {
      console.log(this.viewerInfo.modalData)
      //뷰어 완료 후 체크하기
      if(this.viewerInfo.modalData.info.isRead) {
        //하루에 한 번만 체크해야 됨 => 완료횟수와 같으면 책 읽어도 return 시키기
        // if(this.completedInfo.engBookCnt + this.completedInfo.korBookCnt === this.completedInfo.isRead) return;
        console.log( this.completedInfo.isRead)
        if(this.viewerInfo.modalData.item.bookDiv === 'K') {
          this.completedInfo.readKorCnt++;
          if(this.completedInfo.readKorCnt === this.completedInfo.korBookCnt)  return this.completedInfo.isComplimentModal = true;
        }

        if(this.viewerInfo.modalData.item.bookDiv === 'E') {
          this.completedInfo.readEngCnt++;
          if(this.completedInfo.readEngCnt === this.completedInfo.engBookCnt) return this.completedInfo.isComplimentModal = true;
        }
      }
    },
  }
};

export default complimentPopupMixin
