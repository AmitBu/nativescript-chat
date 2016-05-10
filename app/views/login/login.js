var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var viewModule = require("ui/core/view");
var UserViewModel = require("../../shared/view-models/user-view-model");
var firebase = require("nativescript-plugin-firebase");
var user = new UserViewModel();

exports.loaded = function(args) {
    var page = args.object;

    page.bindingContext = user;

    user.init()
};

exports.shit = function() {
    firebase.init({
        url: 'https://barternet.firebaseio.com'
    }).then(
        function (instance) {
            console.log("firebase.init done");
        },
        function (error) {
            console.log("firebase.init error: " + error);
        }
    );
};


exports.register = function() {
    user.register()
        .then(function() {
            dialogsModule
                .alert("Your account was successfully created.")
                .then(function() {
                    frameModule.topmost().navigate("views/login/login");
                });
        }).catch(function(error) {
            dialogsModule.alert({
                message: error,
                okButtonText: "OK"
            });
        });
};