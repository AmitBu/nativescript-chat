var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var viewModule = require("ui/core/view");
var observableModule = require("data/observable");
var messageListModel = require("../../shared/view-models/chat-model");
var messageList = new messageListModel({});

var pageData = new observableModule.Observable({
    messageList: messageList,
    newMessage: ""
});

exports.loaded = function(args) {
    var page = args.object;

    page.bindingContext = pageData;

    messageList.init();
};

exports.addMessage = function() {
    console.log("sadasd");
    messageList.addMessage(pageData.get("newMessage"));
};