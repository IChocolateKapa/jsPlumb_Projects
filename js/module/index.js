/**
 * Created by Echo on 2015/12/28.
 */

/*$(function () {
    $("#main_wrap_left a").draggable({
        appendTo: "#container",
        helper: "clone",
        zIndex: 10000,
        opacity: 0.8,
        start: function (event, ui) {
            $("#container").animate({"background-color": "salmon"}, 500);
        },
        drag: function (event , ui) {
            var t = event.pageY,
                l = event.pageX,
                ss = "top: " + t + ", left: " + l;

            $("#panel").html(ss);
            $("#container").animate({"background-color": "salmon !important"}, 100);
        }
    });
    $("#container").droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: "#main_wrap_left a",
        drop: function( event, ui ) {
            console.log($(this));
            $("#container").append($(this));
        }
    });
});*/

jsPlumb.ready(function () {

    var left_instance = jsPlumb.getInstance("main_wrap_left");
    left_instance.draggable("main_wrap_left a");

    var container = document.getElementById("container");

    // setup some defaults for jsPlumb.
    var instance = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 2}],
        Connector:"StateMachine",
        HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2 },
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8
            } ],
            [ "Label", { label: "FOO", id: "label", cssClass: "aLabel" }]
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

        instance.makeSource(el, {
            filter: ".ep",
            anchor: "Continuous",
            connectorStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 },
            connectionType:"basic",
            extract:{
                "action":"the-action"
            },
            maxConnections: 2,
            onMaxConnections: function (info, e) {
                alert("Maximum connections (" + info.maxConnections + ") reached");
            }
        });

        instance.makeTarget(el, {
            dropOptions: { hoverClass: "dragHover" },
            anchor: "Continuous",
            allowLoopback: true
        });

        // this is not part of the core demo functionality; it is a means for the Toolkit edition's wrapped
        // version of this demo to find out about new nodes being added.
        //
        instance.fire("jsPlumbDemoNodeAdded", el);
    };


    var newNode = function(x, y) {
        var d = document.createElement("div");
        var id = jsPlumbUtil.uuid();
        d.className = "w";
        d.id = id;
        d.innerHTML = id.substring(0, 7) + "<div class=\"ep\"></div>";
        d.style.left = x + "px";
        d.style.top = y + "px";
        instance.getContainer().appendChild(d);
        initNode(d);
        return d;
    };


    jsPlumb.on(container, "dblclick", function(e) {
        newNode(e.offsetX, e.offsetY);
    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);


})