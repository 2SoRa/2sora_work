<template>
  <!-- 탑 버튼 -->
  <button type="button" class="btn-top" :class="{ show : isTopButton }" @click="moveScrollTop"></button>
</template>

<script>
export default {
  data() {
    return {
      isTopButton : false,
    }
  },
  mounted() {
    this.toggleTopButton();
  },
  methods : {
    moveScrollTop() {
      document.querySelector('.content-scroll-area').scrollTo({top: 0, behavior: 'smooth'});
    },
    toggleTopButton() {
      const contents = document.querySelector('.content-scroll-area');
      contents.addEventListener('scroll', () => {
        const currentScrollPosition = contents.pageYOffset || contents.scrollTop
        if (currentScrollPosition > 60) {
          this.isTopButton = true;
        } else {
          this.isTopButton = false;
        }
      })
    }
  }
}
</script>