/**
 * Created by Echo on 2015/12/28.
 */


jsPlumb.ready(function () {

    var container = document.getElementById("container");

    // setup some defaults for jsPlumb.
    var instance = jsPmbUtil.getInstance();


    /*拖拽初始化*/
    jsPmbUtil.initDragDropElements(instance);


    /**
     * Task 2: 缩略图的展示 --hard
     * */


    /**
     * Task 3: 右键菜单 --middle
     * */


    /**
     * save this gragh 2015.12.30. --
     * */
    $("#save_gragh").click(function () {
        jsPmbUtil.saveGragh(instance);
    });

    //reload stupid enough...
    $(".main_wrap_left").on("click", ".left_block#sample", function () {
        jsPmbUtil.reloadGragh(instance);
    });


    /*在容器中需要取消鼠标滚轮的事件冒泡*/
    /*$("#container").on("mousewheel DOMMouseScroll", function (e) {
        eventUtil.stopPropagation(e);
        jsPmbUtil.MouseWheelHandler(e, instance);
    });*/


    // bind click listener; delete connections on click
    instance.bind("click", function (conn) {
        /*删除连接*/
        instance.detach(conn);
        eventUtil.stopPropagation();
        eventUtil.preventDefault();
    });

    //bind before drop event
    /*instance.bind("beforeDrop", function (info) {
        console.log("beforeDrop, info is: ", info);
        var ret = confirm("确定建立连接？");
        return ret;
    });*/

    //bind connection listener..
    /*instance.bind("connection", function (info) {
        alert("connection info is : ", info);
    })*/

    // bind right-click listener;
   /* instance.bind("contextmenu", function (conn) {
        /!*删除连接*!/
        alert("right click on connection: ", conn);
        eventUtil.stopPropagation();
        eventUtil.preventDefault();
    });*/
    /**
     * 双击删除连接， 但是这样会触发双击 增加节点 的事件， 即使阻止冒泡，也没有解决
     * 暂时解决办法是： 给连接绑单击事件， 不与最上层容器的双击事件冒泡冲突
     * 故下面这段先注释掉
     * */
    /*instance.bind("dblclick", function (conn) {
        /!*删除连接*!/
        instance.detach(conn);
        eventUtil.stopPropagation();
        eventUtil.preventDefault();
    });*/

    // bind beforeDetach interceptor: will be fired when the click handler above calls detach, and the user
    // will be prompted to confirm deletion.
    instance.bind("beforeDetach", function (conn) {
        var ret = confirm("Delete connection?");
        eventUtil.stopPropagation();
        eventUtil.preventDefault();
        return ret;
        //return true
    });


    /*双击添加新节点*/
    jsPlumb.on(container, "dblclick", function (e) {
        jsPmbUtil.addNode(instance, {
            'left': e.offsetX,
            'top': e.offsetY
        });
    });





    //设置连接完成时，响应的事件
    /*instance.bind("beforeDrop", function (conn) {
        //alert("hahah");
    });*/

    //设置连接完成时，响应的事件
    instance.bind("connectionDragStop", function (conn) {
        //conn是当前的具体连接， 能够获取连接的source target
        console.log("drag Done!");
        console.log("conn ： ", conn);
        //console.log("uuid of conn is : ", conn.getUuids());

        eventUtil.preventDefault();
        eventUtil.stopPropagation();
    });


    //jsPlumb.fire("jsPlumbDemoLoaded", instance);

    var orgPosX, orgPosY, elePosX, elePosY;
    $("#dragRect").draggable({
        start: function (event) {
            orgPosX = event.pageX;
            orgPosY = event.pageY;

            elePosX = $("#canvas").position().left;
            elePosY = $("#canvas").position().top;

            console.log("拖动起始点坐标是： (", orgPosX, ", ", orgPosY, ")");

        },
        drag: function (event , ui) {

            console.log("拖动过程中能不能记起起始点坐标是： (", orgPosX, ", ", orgPosY, ")");

            var realPosY = event.pageY,
                realPosX = event.pageX;

            var moveX = realPosX - orgPosX,
                moveY = realPosY - orgPosY;

            var curZoom = instance.getZoom();

            console.log("实时移动的距离是：moveX=", moveX,  ", moveY=", moveY);



            var disX = elePosX - moveX/scale,
                disY = elePosY - moveY/scale;

            /**
             * transformOrigin非常重要非常重要非常重要
             * */
            $("#canvas").css({
                "transform": "translate(" + disX + "px, " + disY + "px) scale(" + curZoom + ")",
                "-webkit-transform": "translate(" + disX + "px, " + disY + "px) scale(" + curZoom + ")",
                "-moz-transform": "translate(" + disX + "px, " + disY + "px) scale(" + curZoom + ")",
                "-ms-transform": "translate(" + disX + "px, " + disY + "px) scale(" + curZoom + ")",
                "transformOrigin": "left top",
                "-webkit-transformOrigin": "left top",
                "-moz-transformOrigin": "left top",
                "-ms-transformOrigin": "left top"
            });

        }
    })

});

$(function () {
    document.oncontextmenu = function() {return false;};

    $("#container").mousedown(function(e){

        var event = eventUtil.getEvent(e);
        var ret;
        if(event.button == 2) {

            console.log('Right mouse button!');

            var curPosX = event.pageX,
                curPosY = event.pageY;

            $(".flyRect").fadeIn(500)
                        .animate({
                            'top': curPosY + "px",
                            'left': curPosX + "px"
                        });

            ret = false;
        } else {
            ret = true;
        }
        eventUtil.preventDefault(e);
        return ret;
    });

    $(document).click(function () {
        $(".flyRect").fadeOut(500);
    })
})

