import readingClubFactory from "@/api/reading-club/readingClub-factory";
import {mapGetters} from "vuex";

const saveStorageApi = readingClubFactory.get('storageCommon');
const functionMixin = {
  data() {
    return {
      flagToast : false
    }
  },
  computed : {
    ...mapGetters('readingStorage',['getIsEnglishMember'])
  },
  methods:{
    toggleStorage(idx, id, is, isEng){
      if (isEng && !this.getIsEnglishMember) { return }
      let storeResult = '';
      if (!this.flagToast) {
        this.flagToast = true;
        if (is) {
          storeResult = saveStorageApi.deleteStorage({studentId: this.studentId, bookId: id});
        } else {
          storeResult = saveStorageApi.saveStorage({studentId: this.studentId, bookId: id});
        }
        storeResult.then((res) => {
          if (res.data.data.bookStorageUid || res.data.data.rows) {
            this.bookListData[idx].isStorage = !this.bookListData[idx].isStorage;
            if (!is) {
              this.showToastSimple('보관함에 담았어요!');
            } else {
              this.flagToast = false;
            }
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    showToastSimple(text) {
      let toastDiv = document.createElement('div');
      toastDiv.classList.add('reading-toast');
      toastDiv.innerHTML = `<span>${text}</span>`;
      document.body.append(toastDiv);
      setTimeout(() => {
        toastDiv.classList.add('show');
        setTimeout(() => {
          this.flagToast = false;
          toastDiv.remove();
        }, 1500);
      }, 10);
    },
    showToast(text) {
      if (!this.flagToast) {
        this.flagToast = true;
        let toastDiv = document.createElement('div');
        toastDiv.classList.add('reading-toast');
        toastDiv.innerHTML = `<span>${text}</span>`;
        document.body.append(toastDiv);
        setTimeout(() => {
          toastDiv.classList.add('show');
          setTimeout(() => {
            this.flagToast = false;
            toastDiv.remove();
            if (this.toastComplete !== undefined) {
              this.toastComplete();
            }
          }, 1500);
        }, 10);
      }
    }
  }
}
export default functionMixin