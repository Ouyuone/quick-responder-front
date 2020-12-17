<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style >
    @import './common/uni.css';
	/*每个页面公共css */
    @font-face {
        font-family: "hwxk";
        /*src: url("/static/font/hwxk.ttf");*/
        src: url("http://localhost:8080/static/font/hwxk.ttf");
    }
    body{
        background: #0A98D5;
        font-family: hwxk;
    }
</style>
