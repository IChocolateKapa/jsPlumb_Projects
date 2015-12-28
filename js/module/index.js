/**
 * Created by Echo on 2015/12/28.
 */

$(function () {
    $("#main_wrap_left a").draggable({
        addClasses: true,
        appendTo: "#container",
//               helper: "clone"
    });
    $("#container").droppable({
        accept: "#main_wrap_left a"
    });
});

jsPlumb.ready(function () {
    var left_instance = jsPlumb.getInstance("main_wrap_left");
    left_instance.draggable("main_wrap_left a");
})