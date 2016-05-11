var config = require("../../shared/config");
var observableArrayModule = require("data/observable-array");
var firebase = require("nativescript-plugin-firebase");
var moment = require("moment");

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
    var table = '/chat';
    items = items || {};

    // You can add properties to observables on creation
    var viewModel = new observableArrayModule.ObservableArray(items);
    viewModel.indexOf = indexOf;

    viewModel.load = function() {
        var onChildEvent = function(result) {
            var matches = [];
            matches.push(result);

            if (result.type === "ChildAdded") {
                if (result.value.message && viewModel.indexOf(result) === -1) {
                    viewModel.unshift({
                        message: result.value.message,
                        user: result.value.user,
                        date: result.value.date,
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

    viewModel.addMessage = function(message, user) {
        return firebase.push(
            table, {
                'message': message,
                'user': user,
                'date': moment().format('DD/MM, hh:mm')
            }
        ).then(function(item) {
                console.log("message added");
            },function(error) {
                console.log(error);
            })
    };

    viewModel.deleteMessage = function(index) {
        var id = viewModel.getItem(index).id;
        return firebase.remove(table + "/" + id);
    };


    return viewModel;
}

module.exports = Chat;