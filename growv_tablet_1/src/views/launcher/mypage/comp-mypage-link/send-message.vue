<template>
  <div class="mypage-link message">
    <div class="gnb">
      <button class="back"></button>
      <h1 class="title">쪽지 보내기</h1>
    </div>
    <div class="mypage-content">
      <div class="content">
        <ul>
          <li class="mb0">
            <p class="form-title">유형</p>
            <div class="form-content div-radio">
              <div class="radio-wrap">
                <label class="radio">질문하기
                  <input type="radio" name="div">
                  <span class="radio-check"></span>
                </label>
                <label class="radio">진도 변경
                  <input type="radio" name="div">
                  <span class="radio-check"></span>
                </label>
                <label class="radio">추가시간표
                  <input type="radio" name="div">
                  <span class="radio-check"></span>
                </label>
              </div>
              <p class="info"><span class="essential"></span> 필수항목</p>
            </div>
          </li>
          <li>
            <p class="form-title">제목<span class="essential"></span></p>
            <!-- TODO: 오류시 error 추가  -->
            <div class="form-content">
              <div class="input-area">
                <input type="text" maxlength="50" placeholder="제목을 입력해 주세요. (50자 이내)">
              </div>
              <p class="info-sub">제목을 입력해 주세요.</p>
            </div>
          </li>
          <li class="align">
            <p class="form-title">내용<span class="essential"></span></p>
            <!-- TODO: 오류시 error 추가  -->
            <div class="form-content">
              <div class="input-area textarea">
                <textarea placeholder="내용을 입력해 주세요. (4,000자 이내)"></textarea>
              </div>
              <p class="info-sub">내용을 입력해 주세요.</p>
            <!-- TODO: 글자 입력시 카운팅 되어야함 -->
              <p><span>0</span>/4000</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="btn-wrap btn-wrap-01">
        <button class="btn btn-type-02-sec gray">
          <router-link :to="{ name: 'MessageReceive'}">취소</router-link>
        </button>
        <button class="btn btn-type-02-sec disable">보내기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
}
</script>

<style>
@import url('@/assets/css/launcher/common.css');
@import url('@/assets/css/launcher/layout.css');
@import url('@/assets/css/launcher/mypage/mypage-link.css');
</style>