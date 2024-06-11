<template>
  <!-- V스캔 쇼핑몰 : 장바구니 -->
  <div class="vscan-search-cart">
    <div class="sub-gnb">
      <h1>V스캔 전용몰 도서 장바구니</h1>
      <div class="sub-gnb-right small black">
        <button type="button" class="btn-close" @click="goBack"></button>
      </div>
    </div>
    <div class="contents col-list col-2">
      <form>
        <div class="form-header">
          <div class="form-side-area">
            <div class="input-circle-chk border-bd-gray">
              <input type="checkbox" id="agree" v-model="isAllCheck" @change="toggleAllCheck">
              <label for="agree">전체 선택</label>
            </div>
            <small class="desc">장바구니 상품은 최대 60일간 보관됩니다.</small>
          </div>
          <div class="form-side-area flex-content-end flex-items-center" v-if="cartData && cartData.length > 0">
            <div class="pagination">
              <span class="current">
                {{ totalCheck }}
              </span>
              <i>/</i>
              <span class="total">
                {{ cartData.length }}
              </span>
            </div>
            <button type="button" class="btn-box-rounded size-mid type-gray btn-select-delete"
                    @click="deleteSeletedCart">선택 삭제
            </button>
          </div>
        </div>
        <div class="content-scroll-area">
          <template v-if="cartData && cartData.length > 0">
            <fieldset v-for="(item, index) in cartData" class="form-content" :key="item">
              <div class="input-circle-chk border-bd-gray">
                <input type="checkbox" :id="`cartItem${index}`" v-model="cartCheckbox[index]" @change="changeCheck"
                       :disabled="checkSoldOutBook(item.item)">
                <label :for="`cartItem${index}`"></label>
              </div>
              <div class="cart-item-thumb">
                <img :src="item.item.url" :alt="item.item.name">
              </div>
              <div class="item-mid-area">
                <div class="cart-item-name txt-ellipsis multi-line-2">
                  {{ setName(item.item) }}
                </div>
                <div class="price-wrap size-middle" v-if="!(item.item.soldOut === 1 || item.item.soldOut === 2 || item.item.sales === 2)">
                  <div class="price-item"><p>{{insertDotNumber(item.item.price)}}<span>원</span></p><small class="original">{{ item.item.price !== item.item.netPrice ?  insertDotNumber(item.item.netPrice)+'원':'' }}</small></div>
                  <div class="price-item purple" v-if="item.item.avalPoint > 0 && item.item.lastPrice > 0">
                    <p>{{insertDotNumber(item.item.lastPrice)}}<span>원</span></p><small class="percent">포인트 적용가</small><p>{{ item.item.discountPercent + item.item.pointPercent}}%</p>
                  </div>
                </div>
              </div>
              <div class="item-end-area">
                <div class="input-control-group">
                  <div class="input-quantity-group">
                    <input type="button" value="-" class="btn-minus" data-field="quantity" @click="minus(index)"
                           :disabled="checkSoldOutBook(item.item)">
                    <input type="number" max=""
                           :value="checkSoldOutBook(item.item) ? 0 : item.item.quan"
                           name="quantity" class="input-current-num" readonly>
                    <input type="button" value="+" class="btn-plus" data-field="quantity" @click="plus(index)"
                           :disabled="checkSoldOutBook(item.item)">
                  </div>
                  <button type="button" class="btn-box-rounded size-small btn-val-edit"
                          @click="modifyCart(item.item,index)" :disabled="checkSoldOutBook(item.item)">수정
                  </button>
                </div>
                <button type="button" class="btn-item-delete" @click="deleteCart(item.item,index)"><i class="ico"></i>
                </button>
              </div>
            </fieldset>
          </template>
          <!-- TODO : 장바구니에 담긴 상품 없는 경우 노출 -->
          <div class="no-data" v-if="!isList">
            <span>장바구니에 담긴 상품이 없습니다.</span>
          </div>
        </div>
      </form>
      <div class="payment-info">
        <div class="info-wrap">
          <div class="info-header">결제 정보</div>
          <ul class="row-list row-2 info-contents">
            <li>
              <div class="title gray">결제 예정 금액</div>
              <div class="price">{{insertDotNumber(totalPrice.nonDisCountPrice)}}<span>원</span></div>
            </li>
            <li>
              <div class="title purple">포인트 적용 시</div>
              <div class="price">{{insertDotNumber(totalPrice.discountPrice)}}<span>원</span></div>
            </li>
          </ul>
          <div class="info-text"><img src="@/assets/img/launcher-readingclub/common/icons/ico_arrow_down_mall.webp" alt=""><p>구매하기로 최종 가격을 확인해 주세요.</p></div>
        </div>
        <!-- 기존 알림톡 보내기 => 구매하기 버튼으로 변경 -->
        <button type="button" class="btn-box-rounded size-mall btn-buy static" @click="goAlarmTalk"><!-- has-shadow-inset -->
          구매하기
        </button>
      </div>
      <!-- 문구 제거 -->
      <ul class="dot-list d-none">
        <li>[슈퍼리딩] 홈페이지 전용몰 장바구니와 연동됩니다.</li>
        <li><strong>V스캔 제공 여부</strong>는 상품별로 상이합니다. 홈페이지에서 확인해 주세요.</li>
        <li>모바일 웹 [슈퍼리딩]으로 접속하시거나, 알림톡을 보내면 주문이 가능합니다.</li>
      </ul>
      <alarmModal :propsData="{isAlarmPopup}" @closePopup="closeAlarmPopup"/>
    </div>
  </div>
</template>
<script>
import {mapGetters} from "vuex";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import functionMixin from "@/common/mixin/functionMixin";
import numberMixin from "@/common/mixin/numberMixin";
import alarmModal from "@/components/launcher-readingclub/modals/modal-cartAlarm.vue"

import moment from "moment";

const searchApi = readingClubFactory.get('vscanSearch')

export default {
  mixins: [
    functionMixin,
    numberMixin
  ],
  components: {
    alarmModal
  },
  data() {
    return {
      // cartData : null,
      isList: true,
      totalCheck: 0,
      isAllCheck: false,
      cartCheckbox: [],
      originalData: [],
      cartData: null,
      historyData: {
        path: '',
        page: '',
        type: 0
      },
      soldOutBook: 0,
      isToast: false,
      totalPrice: {
        nonDisCountPrice: 0,
        discountPrice: 0
      },
      isAlarmPopup: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.getCartList();
    this.isAllCheck = true;
    this.historyData.page = this.$route.query.page;
    this.historyData.type = this.$route.query.type;
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.historyData.path = from.path;
    })
  },
  methods: {
    /* 장바구니 데이터 가져오기 */
    getCartList() {
      const params = {
        'accessToken': localStorage.getItem("accessToken")
      }
      const cartList = searchApi.getCartList(params);
      cartList.then((res) => {
        if (res.data.data.data && res.data.data.data.length > 0) {
          this.cartData = res.data.data.data;
          this.originalData = JSON.parse(JSON.stringify(this.cartData));
          this.setSoldOutBookId();
          this.setCheckbox();
        } else {
          this.isList = false;
        }
      })
    },
    //판매중지 책인지 여부 확인하기
    checkSoldOutBook(item) {
      return item.soldOut === 1 || item.soldOut === 2 || item.sales === 2
    },
    //판매 중지 책 id값 세팅
    setSoldOutBookId() {
      let deleted = this.cartData.filter((el) => el.item.soldOut === 1 || el.item.soldOut === 2 || el.item.sales === 2)
      this.soldOutBook = deleted.map(el => el.item.id);
    },
    /*품절 여부에 따른 책 제목 설정*/
    setName(item) {
      let soldOut = '';

      if (item.soldOut === 0 && item.sales !== 2) {
        soldOut = '';
      } else if (item.soldOut === 1 || item.soldOut === 2) {
        soldOut = item.soldOut === 1 ? '[품절]' : '[판매 예정]';
      } else if (item.sales === 2 && item.soldOut === 0) {
        soldOut = '[판매 중지]';
      }
      return `${soldOut} ${item.name}`
    },
    setTotalPrice() {
      this.totalPrice.nonDisCountPrice = 0;
      this.totalPrice.discountPrice = 0;
      
      this.cartCheckbox.map((el,index) => {
        if(el === true) {
          this.totalPrice.nonDisCountPrice += this.cartData[index].item.price *  this.cartData[index].item.quan;
          this.totalPrice.discountPrice += this.cartData[index].item.lastPrice * this.cartData[index].item.quan;
        }
        return;
      })
    },
    /* 장바구니 수정 */
    modifyCart(item, index) {
      // 더하기일 경우
      if (this.cartData[index].item.quan > this.originalData[index].item.quan) {
        const diff = this.cartData[index].item.quan - this.originalData[index].item.quan;
        this.addCart(item, diff);
      } else if (this.cartData[index].item.quan < this.originalData[index].item.quan) {
        // 빼기일 경우
        const diff = this.originalData[index].item.quan - this.cartData[index].item.quan;
        this.delCart(item, diff);
      }
    },
    // 장바구니 +
    addCart(item, diff) {
      const params = {
        'accessToken': localStorage.getItem("accessToken"),
        'id': item.id,
        'isCheck': 1,
        'quan': diff
      }
      const cartSave = searchApi.addCartItem(params);
      cartSave.then((res) => {
        if (res.data.data.code === 200) {
          this.$router.go(0);
        }
      })
    },
    /* 장바구니 - */
    delCart(item, diff) {
      let list = [];
      if (Array.isArray(item)) {
        item.forEach((i) => {
          list.push({
            "id": i.item.id,
            "isCheck": 0,
            'quan': i.item.quan
          })
        })
      } else {
        list.push({
          "id": item.id,
          "isCheck": 0,
          'quan': diff ? diff : item.quan
        })
      }
      const params = {
        'accessToken' : localStorage.getItem("accessToken"),
        'list' : list
      }
      const cartDelete = searchApi.deleteSetCartItem(params);
      cartDelete.then((res) => {
        if (res.data.data.code === 200 && diff) {
          this.$router.go(0);
        }
      })
    },
    // 수량 +
    plus(idx) {
      ++this.cartData[idx].item.quan;
      this.setTotalPrice();
    },
    // 수량 -
    minus(idx) {
      if (this.cartData[idx].item.quan > 1) {
        this.cartData[idx].item.quan--;
        this.setTotalPrice();
      }
    },
    // 선택 삭제
    deleteSeletedCart() {
      // 체크박스 된 idx 찾기
      let seletedIdx = [], deleteData = [];
      this.cartCheckbox.forEach((item, index) => {
        if (item) {
          seletedIdx.push(index);
        }
      });
      this.cartData = this.cartData.filter(function (value, index) {
        if (seletedIdx.indexOf(index) === -1) {
          return true;
        } else {
          deleteData.push(value);
          return false;
        }
      });
      this.delCart(deleteData);
      this.showToast('삭제되었습니다.');
      this.isAllCheck = false;
      this.setCheckbox();
      this.isEmpty();
    },
    isEmpty() {
      this.isList = this.cartData.length === 0 ? false : true;
    },
    // 장바구니 삭제
    deleteCart(item, index) {
      if (!this.flagToast) {
        this.delCart(item);
        if (this.soldOutBook.includes(item.id)) {
          this.soldOutBook = this.soldOutBook.filter(el => el !== item.id);
        }
        if (this.isAllCheck && this.totalCheck > 0) {
          this.totalCheck--;
        }
        this.cartData.splice(index, 1);
        this.showToast('삭제되었습니다.');
      }
      this.setCheckbox();
      this.isEmpty();
    },
    // 토스트팝업 완료
    toastComplete() {
      this.isToast = false;
    },
    // 알림톡 체크
    async goAlarmTalk() {
      // 장바구니 비었을 때
      if (!this.isList) {
        this.showToast('장바구니에 담긴 상품이 없습니다.');
        return false;
      }
      if (!this.isToast) {
        this.isToast = true;
        const today = moment(new Date()).format('YYYYMMDD');
        let alarmDates = JSON.parse(localStorage.getItem('lastAlarmTalk'));
        // 저장된 알림톡 발송 정보가 없을 경우
        if (!alarmDates) {
          const result = await this.chkAlarmTalk();
          if (result) {
            alarmDates = [
              {
                id: this.userInfo.info.studentId,
                date: today,
                count: 1
              }
            ]
            this.openAlarmPopup();
          } else {
            this.showToast('전송에 실패했습니다. 잠시 후 다시 이용해 주세요.')
          }
        } else {
          // 알림톡 전송 내역이 없는 아이디일 경우
          if (!alarmDates.some(item => item.id === this.userInfo.info.studentId)) {
            const result = await this.chkAlarmTalk();
            if (result) {
              alarmDates.push({
                id: this.userInfo.info.studentId,
                date: today,
                count: 1
              });
              this.openAlarmPopup();
            } else {
              this.showToast('전송에 실패했습니다. 잠시 후 다시 이용해 주세요.')
            }
          } else {
            // 알림톡 전송 내역이 있을 경우
            const idx = alarmDates.findIndex(item => item.id === this.userInfo.info.studentId);
            if (alarmDates[idx].date === today && alarmDates[idx].count === 3) {
              this.showToast('알림톡은 하루 최대 3회까지만 발송됩니다.');
            }
            if (alarmDates[idx].date === today && alarmDates[idx].count < 3) {
              const result = await this.chkAlarmTalk();
              if (result) {
                alarmDates[idx].count += 1;
                this.openAlarmPopup();
              } else {
                this.showToast('전송에 실패했습니다. 잠시 후 다시 이용해 주세요.')
              }
            }
            if (alarmDates[idx].date !== today) {
              const result = await this.chkAlarmTalk();
              if (result) {
                alarmDates[idx].date = today;
                alarmDates[idx].count = 1;
                this.openAlarmPopup();
              } else {
                this.showToast('전송에 실패했습니다. 잠시 후 다시 이용해 주세요.')
              }
            }
          }
        }
        localStorage.setItem('lastAlarmTalk', JSON.stringify(alarmDates));
      }
    },
    // 알림톡 보내기
    async chkAlarmTalk() {
      const params = {
        'accessToken': localStorage.getItem("accessToken")
      }
      const goAlarm = await searchApi.sendCartAlarm(params);
      return goAlarm.data.data.code === 200 ? true : false;
    },
    // 체크박스 세팅
    setCheckbox() {
      this.cartCheckbox = [];
      this.cartData.forEach(() => {
        this.cartCheckbox.push(false);
      })
      this.toggleAllCheck();
    },
    // 전체 선택시
    toggleAllCheck() {
      this.cartCheckbox.forEach((item, index) => {
        //판매 중지 책과 일치하는 책들은 false로 세팅하기
        if (this.soldOutBook.includes(this.cartData[index].item.id)) {
          this.cartCheckbox[index] = false;
        } else this.cartCheckbox[index] = this.isAllCheck;
      });
      this.changeCheck();
    },
    // 체크된 갯수 확인
    changeCheck() {
      this.totalCheck = this.cartCheckbox.filter(item => item === true).length;
      //판매 중지 책이 있을경우
      if (this.soldOutBook.length > 0) {
        //장바구니에 판매 중지 책만 있을 경우
        if (this.soldOutBook.length == this.cartData.length) {
          return this.isAllCheck = false;
        }
        if (this.totalCheck + this.soldOutBook.length === this.cartData.length) {
          this.isAllCheck = true;
        } else {
          this.isAllCheck = false;
        }
      }

      //판매 중지 책이 없을 경우
      if (this.soldOutBook.length === 0) {
        if(this.totalCheck === this.cartData.length) {
          this.isAllCheck = true;
        } else {
          this.isAllCheck = false;
        }
      }
      this.setTotalPrice();
    },
    // 알림톡 팝업
    openAlarmPopup(){
      this.isAlarmPopup = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    closeAlarmPopup() {
      this.isAlarmPopup = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 뒤로가기
    goBack() {
      this.$router.go(-1);
      return;
    }
  }
}
</script>