var config = require("../../shared/config");
var observableArrayModule = require("data/observable-array");
var firebase = require("nativescript-plugin-firebase");

function indexOf(item) {
    var match = -1;
    this.forEach(function(loopItem, index) {
        if (loopItem.id === item.key) {
            match = index;
        }
    });
    return match;
}

function Chat(items) {
    items = items || {};

    // You can add properties to observables on creation
    var viewModel = new observableArrayModule.ObservableArray(items);
    viewModel.indexOf = indexOf;

    viewModel.load = function() {
        var onChildEvent = function(result) {
            var matches = [];
            matches.push(result);

            if (result.type === "ChildAdded") {
                if (result.value.message) {
                    viewModel.push({
                        message: result.value.message,
                        user: result.value.user,
                        id: result.key
                    });
                }
            }

            else if (result.type === "ChildRemoved") {

                matches.forEach(function(match) {
                    var index = viewModel.indexOf(match);
                    viewModel.splice(index, 1);
                });

            }
            //console.log(JSON.stringify(viewModel.get("messageList")));
        };


        firebase.addChildEventListener(onChildEvent, "/chat");
    };

    viewModel.init = function(){
        firebase.init({
            url: config.apiUrl
        }).then(
            function (instance) {
                console.log("firebase.init done");
                viewModel.load();
            },
            function (error) {
                console.log("firebase.init error: " + error);
            }
        );
    };

    viewModel.addMessage = function(message) {
        console.log("msg: " + message);
        return firebase.push(
            '/chat', {
                'message': message,
                'user': "Amit"
            }
        ).then(function(item) {
                console.log("message added");
            },function(error) {
                console.log(error);
            })
    };

    viewModel.getMessages = function() {
        return firebase.get("/chat").then(function(result) {

        })
    };



    return viewModel;
}

module.exports = Chat;