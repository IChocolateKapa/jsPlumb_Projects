/**
 * Created by Echo on 2016/1/5.
 */

var jsPmbUtil = {

    initNode: function(instance, el) {

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
        d.style.left = x + "px";
        d.style.top = y + "px";
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
        $("#container").empty();
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

        instance.setZoom(zoom);
    },

    MouseWheelHandler: function (e, instance) {

        var isNext = eventUtil.getScrollDirection(e),
            curZoom = instance.getZoom(),
            self = this;

        console.log("before zooming, curZoom is : ", instance.getZoom());

        /*不能再缩小了...要不看不见了*/
        if (curZoom < 0.1) {
            return;
        }
        if (isNext) {//[curZoom, curZoom]
            self.setContainerZoom(curZoom - 0.1, instance, curZoom, $("#container")[0]);
        } else {
            self.setContainerZoom(curZoom + 0.1, instance, curZoom, $("#container")[0]);
        }

        console.log("after zooming, curZoom is : ", instance.getZoom());
    }
}