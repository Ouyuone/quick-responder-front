<template>
    <view class="uni-inline-item uni-column">
        <form @submit="formSubmit">
            <view>
                <view>显示课程地址/时间</view>
                <switch  name="courseTimeAndAdress"/>
            </view>
            <view>
                <view>上课时间提醒</view>
                <switch @change="switchChange" name="courseTimeWarnchange"/>
            </view>

            <view class="uni-form-item qr-radio">
                <radio-group name="courseTimeWarn" style="transform:scale(0.9)">
                    <label>
                        <radio value="15" :disabled="courseTimeWarnchange" /><text :class="{disable:courseTimeWarnchange}">提前15分钟</text>
                    </label>
                    <label>
                        <radio value="30" :disabled="courseTimeWarnchange" /><text :class="{disable:courseTimeWarnchange}">提前30分钟</text>
                    </label>
                    <label>
                        <radio value="30" :disabled="courseTimeWarnchange" /><text :class="{disable:courseTimeWarnchange}">自定义<input class="uni-input" placeholder="输入时间比如：40" :disabled="courseTimeWarnchange"></text>
                    </label>
                </radio-group>

            </view>
            <view>
                <view>分数计算为乘法</view>
                <switch   name="score"/>
            </view>
        </form>
    </view>
</template>

<script>
    export default {
        name: "setting",
        data(){
            return{
                courseTimeWarnchange:true
            }
        },
        onLoad() {

        },
        onShow() {

        },
        methods: {
            switchChange: function (e) {
                console.log('switch1 发生 change 事件，携带值为', e.target.value)
                let value=e.target.value;
                if(!value){

                }
                this.courseTimeWarnchange = !value
            }
        }
    }
</script>

<style scoped>
    form{
        padding: 20rpx  ;
    }
    form view{
        display: flex;
        justify-content: space-between;
        font-size: 48rpx;
    }
    .qr-radio radio-group{
        display: flex;
        flex-direction: column;
    }
    .disable{
        color:grey;
    }

</style>