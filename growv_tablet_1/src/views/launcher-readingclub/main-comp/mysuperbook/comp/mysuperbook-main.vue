<template>
  <!-- 마이슈퍼푹 -->
  <div class="my-superbook">
    <div class="sub-gnb">
      <div class="sub-gnb-left">
        <button type="button" class="btn-back"><router-link :to="{name: 'ReadingClubMainView'}"></router-link></button>
      </div>
      <h1>마이슈퍼북</h1>
      <div class="sub-gnb-right">
        <button type="button" class="btn-info"><router-link :to="{name: 'viewBridgeKind' ,query:{path:'guide-mysuperbook'}}"><span></span>마이슈퍼북 안내</router-link></button>
        <button type="button" class="btn-close"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
      </div>
    </div>
    <div class="contents">
      <div class="name-holder">
        <i class="ico ico-heart"></i>
        <span class="name">
          {{ studentName }}
        </span>
      </div>
      <ul class="tab-menu-list type-underline">
        <li class="list-item">
          <router-link :to="{ name : 'mysuperbookWeek' }" class="item-btn" replace>주간 리포트</router-link>
        </li>
        <li class="list-item">
          <router-link :to="{ name : 'mysuperbookMonth' }" class="item-btn"  replace>월간 리포트</router-link>
        </li>
      </ul>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(['userInfo']),
    studentName() {
      return this.userInfo.info.studentName;
    }
  }
}
</script>