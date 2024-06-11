import mainBookAPI from "@/api/reading-club/main-contents/mainBook-api";
import myLibraryApi from "@/api/reading-club/my-library/myLibrary-api";
import superPickApi from "@/api/reading-club/superpick/superpick-api";
import attendApi from "@/api/reading-club/reading-status/attend-api";
import readingActivityApi from "@/api/reading-club/reading-status/readingActivity-api";
import koreanLibraryApi from "@/api/reading-club/korean-library/korean-library";
import natureApi from "@/api/reading-club/nature/nature-api";
import myTreeApi from "@/api/reading-club/my-tree/mytree-api";
import englishLibraryApi from "@/api/reading-club/english-library/english-library";
import storageCommonApi from "@/api/reading-club/common/storage";
import myPageShoppingApi from "@/api/reading-club/mypage/myPage"
import mySuperBookApi from "@/api/reading-club/my-superbook/mysuperbook-api"
import viewerApi from "@/api/reading-club/common/viewer";
import gateApi from "@/api/reading-club/common/gate";
import consultApi from "@/api/launcher-consult/launcerConsult";
import searchApi from '@/api/reading-club/vscan-search/vscan-search-api'

const repositories = {
    mainBook: mainBookAPI,
    myLibrary: myLibraryApi,
    superPick: superPickApi,
    readingAttend : attendApi,
    readingActivity: readingActivityApi,
    koreanLibrary: koreanLibraryApi,
    nature : natureApi,
    myTree : myTreeApi,
    englishLibrary: englishLibraryApi,
    storageCommon: storageCommonApi,
    mypage: myPageShoppingApi,
    mySuperBook : mySuperBookApi,
    viewer: viewerApi,
    gate: gateApi,
    consult: consultApi,
    vscanSearch : searchApi
}
export default {
    get: (name) => repositories[name],
}