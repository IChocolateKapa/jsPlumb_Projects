<style>
    #edt{
        position: relative;
        width: 200px;
        height: 60px;
        text-align: center;
        background: white;

    }
    #edt span{
        display: inline-block;
        width: 100%;
        height: 40px;
    }
    .reName{
        display: none;
        width: 90%;
        height: 40px;
        line-height: 40px;
        background: white;
        color: #333;
        border: 1px solid #ebebeb;
        outline: none;
        position: absolute;
        left: 5%;
        font-size: 16px;
        text-align: center;
        top: 13px;
        border-radius: 5px;
    }
</style>

<template>
    <div id="edt">
        <span>{{name}}</span>
        <input type="text" class="reName" v-model="name" value="{{name}}"/>
    </div>
</template>

<script>
    var vm = new Vue({
        el: 'edt',
        data: {
            name: '原始姓名'
        }
    })
</script>