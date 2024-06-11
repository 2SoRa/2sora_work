import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
// 스터디
import scheduleStorage from "@/store/launcher/schedule-index";
import userInfoStorage from "@/store/modules/userInfo";
import superBoxStorage from "@/store/launcher/superbox-index";
import mystorageStorage from "@/store/launcher/mystorage-index";

// 리딩클럽
import koreanLibraryStorage from "@/store/launcher-readingclub/korean-library-index";
import readingStatusStorage from "@/store/launcher-readingclub/reading-status-index";
import englishLibraryStorage from "@/store/launcher-readingclub/english-library-index";
import vscanStorage from "@/store/launcher-readingclub/vscan-index";
import readingStorage from "@/store/launcher-readingclub/reading-index";
export default createStore({
  modules: {
    scheduleStorage,
    userInfoStorage,
    superBoxStorage,
    mystorageStorage,
    koreanLibraryStorage,
    readingStatusStorage,
    englishLibraryStorage,
    vscanStorage,
    readingStorage,
    // userProductStorage
  },
  plugins: [
    createPersistedState({
      paths: [
        "scheduleStorage",
        "userInfoStorage",
        "superBoxStorage",
        "mystorageStorage",
        "koreanLibraryStorage",
        "englishLibraryStorage",
        "vscanStorage",
        "readingStorage",
      ],
    }),
  ],
});
