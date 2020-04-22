<template>
	 <web-view :src="url"></web-view> 
</template>

<script>
   export default {
          data() {
              return {
                  url: '',
              }
          },
          onLoad(e) {
              this.url = e.url;
			 
          }
      }
</script>

<style >
	
</style>
