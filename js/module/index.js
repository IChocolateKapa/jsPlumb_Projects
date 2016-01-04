/**
 * Created by Echo on 2015/12/28.
 */

/*$(function () {
    $(".left_block").draggable({
        appendTo: "#container",
        helper: "clone",
        zIndex: 10000,
        opacity: 0.8,
        start: function (event, ui) {
            //$("#container").animate({"background-color": "salmon"}, 500);
        },
        drag: function (event , ui) {
            var t = event.pageY,
                l = event.pageX,
                ss = "top: " + t + ", left: " + l;

            $("#panel").html(ss);
            //$("#container").animate({"background-color": "salmon !important"}, 100);
        }
    });
    $("#container").droppable({
        //activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ".left_block",
        drop: function(event, ui) {
            var $Item =  ui.draggable;
            var $itemClone = $Item.clone();

            var t = event.offset().top;
            var l = event.offset().left;
            console.log(t, "  ", l);
            $("#container").append($itemClone);
            $itemClone.css({
                "top": t,
                "left": l
            }).fadeIn(100);
        }
    });
});*/


jsPlumb.ready(function () {

    var container = document.getElementById("container");

    // setup some defaults for jsPlumb.
    var instance = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 2}],
        Connector:"Bezier",//StateMachine
        HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2 },
        ConnectionOverlays: [
            [ "Arrow", {
                location: .9,
                id: "arrow",
                length: 14,
                foldback: 0.8
            } ],
            /*[ "Label", { label: "FOO", id: "label", cssClass: "aLabel" }]*/
        ],
        Container: "container"
    });


    //
    // initialise element as connection targets and source.
    //
    var initNode = function(el) {

        // initialise draggable elements.
        instance.draggable(el, {
            "containment": "parent"
        });

        /*Echo Added*/
        //instance.setSourceEnabled(el);

        /**
         * let's take a quick look at the parameter 'filter', here is its definition:
         * Specifying drag source area
         * Configuring an element to be an entire Connection source using makeSource means that the element cannot itself be draggable.
         * There would be no way for jsPlumb to distinguish between the user attempting to drag the element and attempting to drag a Connection from the element.
         * To handle this there is the filter parameter.
         *
         * To sum up, 如果一个节点作为连接起点，想要从任意地方都能拖出连接， 是不可能的，要么，这个source节点本身不可拖动，
         * 要么， 通过filter 属性指定 从这个节点里某个位置拖连接线。
         * */

        instance.makeSource(el, {
            filter: ".stateName",//从epdiv中作为拖动连接起点
            anchor: "Continuous",
            connectorStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 },
            connectionType:"basic",
            //endpoint:["Dot", {radius: 3, cssClass:"small-blue"}],
            extract:{
                "action":"the-action"
            },
            maxConnections: -1,
            onMaxConnections: function (info, e) {
                alert("Maximum connections (" + info.maxConnections + ") reached");
            }
        });

        instance.makeTarget(el, {
            dropOptions: { hoverClass: "dragHover" },
            anchor: "Continuous",
            allowLoopback: true,
            endpoint:["Dot", {radius: 3, cssClass:"small-blue"}]
        });


        /**
         * 给新添加的节点绑定 点击 事件
         * */
        instance.on(el, "click", function (event) {
            //注意在建立连接完成时也会触发这个事件
            console.log(event.target);
        });
        /**
         * 给新添加的节点添加绑定事件
         * */
        instance.on(el, "dblclick", function (event) {
            //注意在建立连接完成时也会触发这个事件
            console.log(event.target);
            var ret = confirm("确实要删除这个节点吗？");
            if (ret) {
                /*节点删除*/
                instance.remove(el);
            }
            /*阻止冒泡和默认行为*/
            event.stopPropagation();
            event.preventDefault();
        });

        // this is not part of the core demo functionality;
        // it is a means for the Toolkit edition's wrapped
        // version of this demo to find out about new nodes being added.
        instance.fire("jsPlumbDemoNodeAdded", el);
    };


    var newNode = function(x, y, name, mid, w, h) {
        var d = document.createElement("div");
        var id = mid || jsPlumbUtil.uuid();
        d.className = "w";
        d.id = id;
        var selfName = name || id.substring(0, 7);
        var state = "<input type='text' placeholder='输入节点名称' class='stateName' value='" + selfName + "'/>";
        $(state).focus();
        d.innerHTML =  "<div class=\"ep\">" + state + "</div>";
        d.style.left = x + "px";
        d.style.top = y + "px";
        instance.getContainer().appendChild(d);
        initNode(d);
        return d;
    };

    /**
     * Task 1: 双击节点时改名字，或者增加备注 --easy
     * */

    /**
     * Task 2: 缩略图的展示 --hard
     * */


    /**
     * Task 3: 右键菜单 --middle
     * */


    /**
     * Task 4: 保存 位置， 大小，-easy 缩放级别 -middle
     * */



    /**
     * Echo Added -- begin -- 2015.12.29
     * 要实现元素的拖动， 必须该元素的定位是absolute, 并且其父元素是relative定位
     * 不谈， 即使设置了draggable方法， 元素也是没有拖动反应的
     * */

    /**
     * Echo Added -- begin -- 2015.12.29 : add Jquery ui method into jsPlumb.ready
     * */

    $(".main_wrap_left .left_block").draggable({
        appendTo: "#container",
        helper: "clone",
        zIndex: 10000,
        opacity: 0.8,
        start: function (event, ui) {
        },
        drag: function (event , ui) {
            var t = event.pageY,
                l = event.pageX,
                ss = "top: " + t + ", left: " + l;
            $("#panel").html(ss);
        }
    });
    $("#container").droppable({
        hoverClass: "hover-class-test",
        accept: ".left_block",
        drop: function(event, ui) {

            var $Item =  ui.draggable;
            var $itemClone = $Item.clone();

            var t = event.pageY - event.offsetY,
                l = event.pageX - event.offsetX - $(".main_wrap_left").width();

            $itemClone.css({"top": t, "left": l}).appendTo($("#container"));

            initNode($itemClone);
        }
    });

    /**
     * Echo Added -- end -- 2015.12.29 : add Jquery ui method into jsPlumb.ready
     * */




    /**
     * Set Zoom -- begin 2015.12.30
     * */

    window.setZoom = function(zoom, instance, transformOrigin, el) {
        transformOrigin = transformOrigin || [ 0.5, 0.5 ];
        instance = instance || jsPlumb;
        el = el || instance.getContainer();
        var p = [ "webkit", "moz", "ms", "o" ],
            s = "scale(" + zoom + ")",
            oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

        for (var i = 0; i < p.length; i++) {
            el.style[p[i] + "Transform"] = s;
            el.style[p[i] + "TransformOrigin"] = oString;
        }

        el.style["transform"] = s;
        el.style["transformOrigin"] = oString;

        instance.setZoom(zoom);
    };

    /**
     * Set Zoom -- begin 2015.12.30
     * */





    /**
     * save this gragh 2015.12.30. -- begin --
     * */

    $("#save_gragh").click(function () {


        /*获取所有节点*/
        var nodeList = jsPlumb.getSelector(".w");
        console.log("nodeList: ", nodeList);
        for (var i = 0; i < nodeList.length; i++) {
            var elHeight = nodeList[i].offsetHeight,
                elWidth = nodeList[i].offsetWidth,
                elTop = nodeList[i].offsetTop,
                elLeft = nodeList[i].offsetLeft,
                id = nodeList[i].id,
                text = nodeList[i].textContent,
                elProps = {};

            elProps = {
                width: elWidth,
                height: elHeight,
                top: elTop,
                left: elLeft,
                id: id,
                text: text
            };
            //nodeBasket.addItem(nodeList[i]);
            nodeBasket.addItem(elProps);
        }
        console.log(nodeBasket.getItems());



        //获取所有连接
        var connectionList = instance.getConnections();
        for (var j = 0; j < connectionList.length; j++) {
            var conn = {
                source: connectionList[j].source.id,
                target: connectionList[j].target.id
            };
            //connectionBasket.addItem(connectionList[j]);
            connectionBasket.addItem(conn);
        }
        console.log(connectionBasket.getItems());


        /*暂时先清空*/
        var sampleHtml = '<div class="left_block" id="sample">'
                            + '<a href="javascript:void(0)">Sample</a>'
                        + '</div>';

        $(sampleHtml).appendTo($(".main_wrap_left")).css({'top': 200, 'left': 0});
        $("#container").empty();

    });

    //reload
    //$(".main_wrap_left").on(".left_block#sample", "click", function () {
    $("#test").click(function () {
        var nodes = nodeBasket.getItems(),
            lists = connectionBasket.getItems();
        for (var i = 0; i < nodes.length; i++){
            var newCreated = newNode(nodes[i].left, nodes[i].top, nodes[i].text, nodes[i].id, nodes[i].width, nodes[i].height);
            initNode(newCreated);
        }
        for (var j = 0; j < lists.length; j++) {
            jsPlumb.connect({
                source: lists[j].source,
                target: lists[j].target,
                newConnection:true,
                paintStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 },
                endpoint:["Dot", {radius: 3, cssClass:"small-blue"}],
                anchor: "Continuous",
                overlays: [
                    [ "Arrow", {
                        location: .9,
                        id: "arrow",
                        length: 14,
                        foldback: 0.8
                    }],
                ]
            });
        }


        nodeBasket.empty();
        connectionBasket.empty();
    });


    /**
     * save this gragh 2015.12.30. -- end --
     * */



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
        var ret = confirm("Delete connection?");

        var event = window.event;
        event.preventDefault();
        event.stopPropagation();

        return ret;
    });


    /*双击添加新节点*/
    jsPlumb.on(container, "dblclick", function(e) {
        newNode(e.offsetX, e.offsetY);
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



});
