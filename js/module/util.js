/**
 * Created by Echo on 2016/1/5.
 */


var jsPmbUtil = {

    getInstance: function () {
        var instance = jsPlumb.getInstance({
            Endpoint: ["Dot", {radius: 2}],
            Connector: "Bezier",//StateMachine
            HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2},
            ConnectionOverlays: [
                [ "Arrow", {
                    location: .9,
                    id: "arrow",
                    length: 14,
                    foldback: 0.8
                } ]
                /*[ "Label", { label: "FOO", id: "label", cssClass: "aLabel" }]*/
            ],
            Container: canvasID
        });

        return instance;
    },

    initNode: function(instance, el) {

        var self = this;

        // initialise draggable elements.
        instance.draggable(el/*, {
            "containment": "parent"
        }*/);

        /*Echo Added*/
        //instance.setSourceEnabled(el);

        /**
         * let's take a quick look at the parameter 'filter', here is its definition:
         * Specifying drag source area
         * Configuring an element to be an entire Connection source using makeSource means that the element cannot itself be draggable.
         * There would be no way for jsPlumb to distinguish between the user attempting to drag the element and attempting to drag a Connection from the element.
         * To handle this there is the filter parameter.
         *
         * To sum up, 如果一个节点作为可拖动的连接起点，想要从任意地方都能拖出连接， 是不可能的，要么，这个source节点本身不可拖动，
         * 要么， 通过filter 属性指定 从这个节点里某个位置拖连接线。当然你可以把这个节点的样式设置的不那么明显
         * */

        instance.makeSource(el, {
            filter: ".stateName",//从epdiv中作为拖动连接起点
            anchor: "Continuous",
            connectorStyle: {strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4},
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
            allowLoopback: false,//true
            endpoint: ["Dot", {radius: 3, cssClass:"small-blue"}]
        });


        /**
         * 给新添加的节点绑定 点击 事件
         * */
        instance.on(el, "click", function (event) {
            //注意在建立连接完成时也会触发这个事件
            console.log("click node target: ", eventUtil.getTarget(event));
        });
        /**
         * 给新添加的节点添加绑定事件
         * */
        instance.on(el, "dblclick", function (event) {
            //注意在建立连接完成时也会触发这个事件
            //console.log(event.target);
            console.log("dblclick node target: ", eventUtil.getTarget(event));
            var ret = confirm("确实要删除这个节点吗？");
            if (ret) {
                /*节点删除*/
                instance.remove(el);
            }
            /*阻止冒泡和默认行为*/
            eventUtil.stopPropagation();
            eventUtil.preventDefault();
        });

        // this is not part of the core demo functionality;
        // it is a means for the Toolkit edition's wrapped
        // version of this demo to find out about new nodes being added.
        //instance.fire("jsPlumbDemoNodeAdded", el);


        self.addRectToMap(el);
    },

    addNode: function (instance, x, y, name, mid, w, h) {
        var d = document.createElement("div");
        var id = mid || jsPlumbUtil.uuid();
        d.className = "w";
        d.id = id;
        var selfName = name || id.substring(0, 7);
        var state = "<input type='text' placeholder='输入节点名称' class='stateName' value='" + selfName + "'/>";
        $(state).focus();
        $(state).keyup(function(e) {
            if (e.keyCode === 13) {
                console.log("this.value: ", this.value);
                $(this).parent().text(this.value);
            }
        });
        d.innerHTML =  "<div class=\"ep\">" + state + "</div>";

        /*获取此时canvas距离container的位移*/
        var posY = $("#canvas").position().top,
            posX = $("#canvas").position().left;

        d.style.left = x - posX + "px";
        d.style.top = y - posY + "px";
        instance.getContainer().appendChild(d);
        this.initNode(instance, d);
        return d;
    },

    getAllNodes: function (instance) {
            /*获取所有节点*/
            var nodeList = instance.getSelector(".w");
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
            return this;
        },

    getAllConnections: function (instance) {
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
        return this;
    },

    removeAllConnections: function (instance) {
        instance.detachEveryConnection();
        return this;
    },

    removeAllNodes: function (instance) {

        var allNodes = instance.getSelector(".w"),
            leng = allNodes.length;

        for (var k = 0; k < leng; k++) {
            instance.remove(allNodes[k]);
        }

        return this;
    },

    saveGragh: function (instance) {
        /*获取所有节点  连接*/
        this.getAllNodes(instance)
            .getAllConnections(instance);

        var sampleHtml = '<div class="left_block" id="sample">'
                            + '<a href="javascript:void(0)">Sample</a>'
                        + '</div>';

        $(sampleHtml).appendTo($(".main_wrap_left")).css({'top': 200, 'left': 0});

        /*清空图表实例中链接和节点*/
        this.removeAllConnections(instance)
            .removeAllNodes(instance);

        /*暂时先清空*/
        $canvas.empty();
        console.log("in saving lists.length : ", connectionBasket.getItems().length);

    },

    reloadGragh: function (instance) {
        var nodes = nodeBasket.getItems(),
            links = connectionBasket.getItems();

        console.log("nodes.length : ", nodes.length);
        for (var i = 0; i < nodes.length; i++){
            var newCreated = this.addNode(instance, nodes[i].left, nodes[i].top, nodes[i].text, nodes[i].id, nodes[i].width, nodes[i].height);
            this.initNode(instance, newCreated);
        }


        console.log("lists.length : ", links.length);
        for (var j = 0; j < links.length; j++) {
            instance.connect({
                source: links[j].source,
                target: links[j].target,
                //newConnection: true,
                paintStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 },
                endpoint: ["Dot", {radius: 3, cssClass:"small-blue"}],
                anchor: "Continuous",
                connector:"Bezier",
                overlays: [
                    ["Arrow", {
                        location: .9,
                        id: "arrow",
                        length: 14,
                        foldback: 0.8
                    }]
                ],
            });
        }


        nodeBasket.empty();
        connectionBasket.empty();
    },

    //设置缩放等级
    setContainerZoom: function (zoom, instance, transformOrigin, el) {

        console.log("before zoom, position.left: ", $("#canvas").position().left,  " position.top: ", $("#canvas").position().top)

        var transformOrigin = transformOrigin || [ 0.5, 0.5],
            instance = instance || jsPlumb,
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

        instance.setZoom(zoom, true);

        console.log("after zoom, position.left: ", $("#canvas").position().left,  " position.top: ", $("#canvas").position().top)

        this.updateMiniMap(instance, el, [transformOrigin[0], transformOrigin[1]]);
        //this.updateMiniMap(instance, el, [1-transformOrigin[0], 1-transformOrigin[1]]);

    },

    MouseWheelHandler: function (e, instance) {

        var isNext = eventUtil.getScrollDirection(e),
            curZoom = instance.getZoom(),
            self = this;

        var event = eventUtil.getEvent(e);

        var relativeX = event.pageX - $("#container").offset().left,
            relativeY = event.pageY - $("#container").offset().top;
/*        var relativeX = event.pageX - $("#canvas").offset().left,
            relativeY = event.pageY = $("#canvas").offset().top;*/

        var perX = relativeX * curZoom / $("#canvas").width() * curZoom,
            perY = relativeY / $("#canvas").height();
        //var perX = relativeX * curZoom,
        //    perY = relativeY * curZoom;
        //var perX = relativeX / $("#canvas").width()*curZoom,
        //    perY = relativeY / $("#canvas").height()*curZoom;
        //var perX = 1 - relativeX / $("#canvas").width(),
        //    perY = 1 - relativeY / $("#canvas").height();



        console.log("before zooming, curZoom is : ", instance.getZoom());

        console.log("perX, perY: ", perX, ", ", perY);
        /*不能再缩小了...要不看不见了*/
        if (curZoom < 0.1) {
            return;
        }
        if (isNext) {//[curZoom, curZoom]
            self.setContainerZoom(curZoom - 0.1, instance, [perX, perY], $canvas[0]);
        } else {
            self.setContainerZoom(curZoom + 0.1, instance, [perX, perY], $canvas[0]);
        }

        console.log("after zooming, curZoom is : ", instance.getZoom());
    },



    /**
     * Echo Added -- begin -- 2015.12.29
     * 要实现元素的拖动， 必须该元素的定位是absolute, 并且其父元素是relative定位
     * 不谈， 即使设置了draggable方法， 元素也是没有拖动反应的
     * */
    /**
     * Echo Added -- begin -- 2015.12.29 : add Jquery ui method into jsPlumb.ready
     * */
    initDragDropElements: function (instance) {

        var self = this;

        //鼠标左键按住 拖动整个画面的这个功能， 不必要。 因为， 有了miniMap
        $canvas.draggable();
        //同时， 要给container加上mousemove的事件监听
        


        $(".main_wrap_left .left_block").draggable({
            appendTo: "#"+canvasID,
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
        $("#canvas").droppable({
            hoverClass: "hover-class-test",
            accept: ".left_block",
            drop: function(event, ui) {

                var $Item =  ui.draggable;
                var $itemClone = $Item.clone().addClass("w");

                var t = event.pageY - event.offsetY,
                    l = event.pageX - event.offsetX - $(".main_wrap_left").width();

                $itemClone.css({"top": t, "left": l}).appendTo($("#canvas"));

                self.initNode(instance, $itemClone);
            }
        });
        $("#container").droppable({
            hoverClass: "hover-class-test",
            accept: ".left_block",
            drop: function(event, ui) {

                var $Item =  ui.draggable;
                var $itemClone = $Item.clone().addClass("w");

                //var t = event.offsetY,
                //    l = event.offsetX;
                /*如果容器有所拖动的话， 要减去容器与外层容器的位移量*/
                var t = event.pageY - event.offsetY - $("#canvas").position().top,
                    l = event.pageX - event.offsetX - $(".main_wrap_left").width() - $("#canvas").position().left;

                //要获取当前canvas的位置与container的距离

                $itemClone.css({"top": t, "left": l}).appendTo($("#canvas"));

                self.initNode(instance, $itemClone);
            }
        });

        $("#container").on('mousedown', function (e) {
            var curZoom = instance.getZoom();
            var event = eventUtil.getEvent(e),
                orgPosX = event.pageX,
                orgPosY = event.pageY;

            //记下初始元素位置
            //bug: zoom后元素的位置不稳定
            //fix: zoom transformOrigin不正确， 修改为 "left top"即可
            var elePosX = $("#canvas").position().left,
                elePosY = $("#canvas").position().top;

            console.log("onmousedown, elePosX: ",  elePosX, ",  elePosY", elePosY);

            $("#container").on('mousemove', function (e) {
                var event2 = eventUtil.getEvent(e),
                    curPosX = event2.pageX,
                    curPosY = event2.pageY;


                //var moveX = (elePosX + (curPosX - orgPosX)) * curZoom,
                //    moveY = (elePosY + (curPosY - orgPosY)) * curZoom;
                var moveX = curPosX - orgPosX,
                    moveY = curPosY - orgPosY,
                    disX = elePosX + moveX,
                    disY = elePosY + moveY;


                //console.log("moveX=", moveX,  ", moveY=", moveY);

                /**
                 * transformOrigin非常重要非常重要非常重要
                 * */
                $("#canvas").css({
                    "transform": "translate(" + disX + "px, " + disY + "px) scale(" + curZoom + ")",
                    "-webkit-transform": "translate(" + disX + "px, " + disY + "px) scale(" + curZoom + ")",
                    "-moz-transform": "translate(" + disX + "px, " + disY + "px) scale(" + curZoom + ")",
                    "-ms-transform": "translate(" + disX + "px, " + disY + "px) scale(" + curZoom + ")",
                    "transform-origin": "left top",
                    "-webkit-transform-origin": "left top",
                    "-moz-transform-origin": "left top",
                    "-ms-transform-origin": "left top"
                });

                //miniMap的拖块也要相应位移
                var rectPosX = $("#dragRect").position().left,
                    rectPosY = $("#dragRect").position().top,
                    curelePosX = $("#canvas").position().left,
                    curelePosY = $("#canvas").position().top,
                    //disXScale = rectPosX + moveX,
                    //disYScale = rectPosY + moveY;
                    //disXScale = disX*scale,
                    //disYScale = disY*scale;
                    disXScale = -curelePosX*scale,
                    disYScale = -curelePosX*scale;
                    //disXScale = rectPosX - moveX*scale,
                    //disYScale = rectPosY - moveY*scale;

                console.log("disXScale=",disXScale, ", disYScale=", disYScale);

                /*$("#dragRect").css({
                    "transform": "translate(-" + disXScale + "px, -" + disYScale + "px)",
                    "-webkit-transform": "translate(-" + disXScale + "px, -" + disYScale + "px)",
                    "-moz-transform": "translate(-" + disXScale + "px, " + disYScale + "px)",
                    "-ms-transform": "translate(-" + disXScale + "px, -" + disYScale + "px)",
                });*/

                /*$("#dragRect").css({
                    "top": disYScale + "px",
                    "left": disXScale + "px"
                })*/

            });

            $("#container").on('mouseup',function (e) {
                $("#container").off('mousemove');
            });
        });

    },
    /**
     * 更新miniMap
     * 根据当前缩放级别，设置miniMap的相应缩放
     * 1. 要按比例，需要canvas的宽高知道后， 根据比例生成一个miniMap的组件， 不然组件位置无法控制
     * */
    updateMiniMap: function (instance, ele, transformOrigin, isNew) {


        console.log("in miniMap, transformOrigin: ", transformOrigin)
        var curZoom = instance.getZoom();
        var transOrg = transformOrigin || [0.5, 0.5];
        var oString = (transOrg[0] * 100) + "% " + (transOrg[1] * 100) + "%";

        console.log("oString: ", oString);

        var setZ = 1/curZoom;

        $("#dragRect").css({
            "transform": "scale("+setZ+")",
            "-webkit-transform": "scale("+setZ+")",
            "-moz-transform": "scale("+setZ+")",
            "ms-transform": "scale("+setZ+")",
            "transform-origin": oString,
            "-webkit-transform-origin": oString,
            "-moz-transform-origin": oString,
            "-ms-transform-origin": oString,
        })
    },

    addRectToMap: function (el) {
        var eleH = $(el).height(),
            eleW = $(el).width(),
            elPosX = $(el).position().left,
            elPosY = $(el).position().top;

        var newRect = "<div class='rect'></div>";
        $(newRect).css({
            'position': 'absolute',
            'width': eleW * scale + "px",
            'height': eleH * scale + "px",
            'top': elPosY * scale + "px",
            'left': elPosX * scale + "px"
        }).appendTo($("#mapPanel"));

    }



}