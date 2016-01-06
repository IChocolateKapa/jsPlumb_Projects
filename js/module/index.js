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
    $("#container").on("mousewheel DOMMouseScroll", function (e) {
        eventUtil.stopPropagation(e);
        jsPmbUtil.MouseWheelHandler(e, instance);
    });


    // bind click listener; delete connections on click
    instance.bind("click", function (conn) {
        /*删除连接*/
        instance.detach(conn);
        var event = window.event;
        event.preventDefault();
        event.stopPropagation();
    });
    /**
     * 双击删除连接， 但是这样会触发双击 增加节点 的事件， 即使阻止冒泡，也没有解决
     * 暂时解决办法是： 给连接绑单击事件， 不与最上层容器的双击事件冒泡冲突
     * 故下面这段先注释掉
     * */
    /*instance.bind("dblclick", function (conn) {
        /!*删除连接*!/
        instance.detach(conn);
        var event = window.event;
        event.preventDefault();
        event.stopPropagation();
    });*/

    // bind beforeDetach interceptor: will be fired when the click handler above calls detach, and the user
    // will be prompted to confirm deletion.
    instance.bind("beforeDetach", function (conn) {
        /*var ret = confirm("Delete connection?");
        var event = window.event;
        event.preventDefault();
        event.stopPropagation();
        return ret;*/
        return true
    });


    /*双击添加新节点*/
    jsPlumb.on(container, "dblclick", function(e) {
        jsPmbUtil.addNode(instance, e.offsetX, e.offsetY);
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

        var event = window.event;
        event.preventDefault();
        event.stopPropagation();
    });



    jsPlumb.fire("jsPlumbDemoLoaded", instance);


    $("#dragRect").draggable(/*{
        'containment': 'parent'
    }*/)

});



