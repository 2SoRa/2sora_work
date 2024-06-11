import readingClubFactory from "@/api/reading-club/readingClub-factory";
import store from "@/store"
import moment from "moment/moment";
const mainBook = readingClubFactory.get('mainBook');
const userProductApi =readingClubFactory.get('gate');
const readingStore = {
  namespaced: true,
  state: {
    isAllMenu: false,
    isEnglishMember : false
  },
  getters: {
    getAllMenu(state) {
      return state.isAllMenu;
    },
    getIsEnglishMember(state) {
      return state.isEnglishMember
    }
  },
  mutations: {
    setAllMenu(state, menu) {
      state.isAllMenu = menu;
    },
    setIsEnglish(state, iseng) {
      state.isEnglishMember = iseng;
    },
  },
  actions: {
    async setAttend({ commit }) {
      const params = {
        "student_id" : store.state.userInfoStorage.userInfo.studentId
      }
      const userType = userProductApi.getUserProduct(params);
      userType.then((res) => {
        if (res.data.data.redirectUrl) {
          location.href = res.data.data.redirectUrl;
          return;
        }
        const readingIdx = res.data.data.userProducts.findIndex(item => item.name === 'superReading'),
          readingEngIdx = res.data.data.userProducts.findIndex(item => item.name === 'superReadingEng');
        if (readingIdx > -1) { attendChk(); }
        if (readingEngIdx > -1) {
          commit('setIsEnglish',true)
        } else {
          commit('setIsEnglish',false)
        }
      })
      function attendChk() {
        const today = moment(new Date()).format('YYYYMMDD');
        let attendDates = JSON.parse(localStorage.getItem('lastAttend'))
        // 출석 정보가 없을 경우
        if (!attendDates) {
          attendDates = [
            {
              id: store.state.userInfoStorage.userInfo.studentId,
              date: moment(new Date()).format('YYYYMMDD'),
            }
          ]
          congraturations();
        } else {
          // 등록된 아이디가 없을 경우
          if (!attendDates.some(item => item.id === store.state.userInfoStorage.userInfo.studentId)) {
            attendDates.push({
              id: store.state.userInfoStorage.userInfo.studentId,
              date: today
            });
            congraturations();
          } else {
            // 등록된 아이디가 있을 경우
            const idx = attendDates.findIndex(item => item.id === store.state.userInfoStorage.userInfo.studentId);
            if (attendDates[idx].date !== today) {
              attendDates[idx].date = today;
              congraturations();
            }
          }
        }
        localStorage.setItem('lastAttend', JSON.stringify(attendDates));
      }
      async function congraturations() {
        const res = await mainBook.setAttend({studentId: store.state.userInfoStorage.userInfo.studentId});
        if (res.data.data > 0) {
          const message = {
            'attend': '<div class="whole-modal modal-attend" onClick="this.remove(window.$vm?.openEventPopup())"><div class="whole-modal-dim"></div><div class="whole-modal-content"><div class="attend"></div><button type="button" class="close"></button></div></div>',
            'birthday': '<div class="whole-modal modal-birthday" onClick="this.remove(window.$vm?.openEventPopup()))"><div class="whole-modal-dim"></div><div class="whole-modal-content"><div class="attend"></div><button type="button" class="close"></button></div></div>'
          }

          let div = document.createElement('div');
          div.innerHTML = message.attend;
          document.body.append(div);
        }
      }
    },
  }
}

export default readingStore;