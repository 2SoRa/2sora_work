<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              {{ this.title }}
<!--              <button class="modal-default-button" @click="$emit('close')"></button>-->
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              default body
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              default footer
            </slot>
          </div>
          
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    title: String,
  },
  mounted() {
    const input = document.querySelectorAll('.vs__selected-options .vs__search');
    input.forEach((el) => {
      el.setAttribute('inputmode','none');
      el.setAttribute('readonly','readonly');
    });
  },
}
</script>

<style scoped>
  @import url('@/assets/css/modal.css');
  @import url('@/assets/css/launcher/modal/modal-common.css');
</style>