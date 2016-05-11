var config = require("../../shared/config");
var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var viewModule = require("ui/core/view");
var observableModule = require("data/observable");
//var UserViewModel = require("../../shared/view-models/user-view-model");
//var firebase = require("nativescript-plugin-firebase");

var viewModel = new observableModule.Observable({
    username: ""
});

exports.loaded = function(args) {
    var page = args.object;

    page.bindingContext = viewModel;
};

exports.addUser = function() {
    if (viewModel.get("username")) {
        config.username = viewModel.get("username");
        frameModule.topmost().navigate("views/chat/chat");
    }
};