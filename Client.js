'use strict';

var diameter = require('diameter');
const avp = require('diameter-avp-object');
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var config = require('config');

var relayRealm = 'example.com';
var relayHost = config.Services.relayServiceHost;
var relayPort = config.Services.relayServicePort;

var callTable = [];

var options = {
    beforeAnyMessage: diameter.logMessage,
    afterAnyMessage: diameter.logMessage,
    port: relayPort,
    host: relayHost
};

function checkBalance(req, res, next){


    var company =req.user.company;
    var tenant = req.user.tenant;
    var provider = req.body.provider;

    var socket = diameter.createConnection(options, function() {
        var connection = socket.diameterConnection;
        var request = connection.createRequest('Diameter Common Messages', 'Capabilities-Exchange');
        request.body = request.body.concat([
            [ 'Origin-Host', 'localhost' ],
            [ 'Origin-Realm', 'com' ],
            [ 'Vendor-Id', 'VOXBONE' ],
            [ 'Origin-State-Id', 219081 ],
            [ 'Supported-Vendor-Id', 10415 ],
            [ 'Auth-Application-Id', 'Diameter Credit Control' ]
        ]);
        connection.sendRequest(request).then(function(response) {
            const avpObj = avp.toObject(response.body);
            //Session Request Sample
            if(avpObj.resultCode=='DIAMETER_SUCCESS'){

                var userinfo = {
                    company : company,
                    tenant : tenant,
                    user : req.user.iss,
                    to : req.body.to,
                    from : req.body.from,
                    provider :provider,
                    csid : req.body.csid
                };

                console.log(userinfo)

                var request = connection.createRequest('Diameter Common Messages', 'Credit-Control');
                request.body = request.body.concat([
                    [ 'Origin-Host', 'localhost' ],
                    [ 'Origin-Realm', 'com' ],
                    [ 'Vendor-Id', 'VOXBONE' ],
                    [ 'CC-Request-Type' , 'EVENT_REQUEST'],
                    [ 'Auth-Application-Id', 'Diameter Credit Control' ],
                    [ 'Requested-Action' , 'PRICE_ENQUIRY' ],
                    ['Currency-Code','USD'],
                    ['Subscription-Id', [ ['Subscription-Id-Type','END_USER_IMSI'],['Subscription-Id-Data', JSON.stringify(userinfo)]]]

                ]);
                connection.sendRequest(request).then(function(response) {
                    const avpObj = avp.toObject(response.body);

                    if(avpObj.resultCode=='DIAMETER_SUCCESS'){
                        console.log(avpObj.resultCode);

                        var obj = {csid : req.body.csid, socket : socket};
                        var jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", true, {dsid : avpObj.sessionId , message : "Granted Units"});
                        res.end(jsonString);
                    }
                    else{
                        var jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", false, {dsid : avpObj.sessionId , message : "Granted Units retrival faliure"});
                        res.end(jsonString);
                    }


                });

            }


        }, function(error) {
            console.log('Error sending request: ' + error);
        });

        socket.on('error', function(err) {
            console.log(err);
        });

    });
}

function sendReq(req,res,next){

    var company =req.user.company;
    var tenant = req.user.tenant;
    var provider = req.body.provider;
    var user = req.user.iss;
    var to = req.body.to;
    var from = req.body.from;


    var socket = diameter.createConnection(options, function() {

        var connection = socket.diameterConnection;

        var request = connection.createRequest('Diameter Common Messages', 'Capabilities-Exchange');
        request.body = request.body.concat([
            [ 'Origin-Host', 'localhost' ],
            [ 'Origin-Realm', 'com' ],
            [ 'Vendor-Id', 'VOXBONE' ],
            [ 'Origin-State-Id', 219081 ],
            [ 'Supported-Vendor-Id', 10415 ],
            [ 'Auth-Application-Id', 'Diameter Credit Control' ]
        ]);
        connection.sendRequest(request).then(function(response) {
            const avpObj = avp.toObject(response.body);



            //Session Request Sample
            if(avpObj.resultCode=='DIAMETER_SUCCESS'){

                var userinfo = {
                    company : company,
                    tenant : tenant,
                    to : to,
                    user : user,
                    from : from,
                    provider : provider,
                    csid : req.body.csid

                };

                var request = connection.createRequest('Diameter Common Messages', 'Credit-Control');


                const avpObj = avp.toObject(response.body);


                console.log(avpObj.resultCode);
                request.body = request.body.concat([
                    [ 'Origin-Host', 'localhost' ],
                    [ 'Origin-Realm', 'com' ],
                    [ 'Vendor-Id', 'VOXBONE' ],
                    [ 'CC-Request-Type' , 'EVENT_REQUEST'],
                    [ 'Auth-Application-Id', 'Diameter Credit Control' ],
                    [ 'Requested-Action' , 'CHECK_BALANCE' ],
                    [ 'Currency-Code','USD'],
                    ['Subscription-Id', [ ['Subscription-Id-Type','END_USER_IMSI'],['Subscription-Id-Data', JSON.stringify(userinfo)]]]
                ]);

                //var jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", true, {dsid : avpObj.sessionId , message : "successfully started billing"});
                //res.end(jsonString);
                //console.log(request);
                connection.sendRequest(request).then(function(response) {
                    const avpObj = avp.toObject(response.body);
                    if(avpObj.resultCode=='DIAMETER_SUCCESS' || avpObj.resultCode[1]== 'DIAMETER_SUCCESS'){
                        var jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", true, {dsid : avpObj.sessionId , message : "successfully started billing"});
                        res.end(jsonString);


                    }
                    else if (avpObj.resultCode[1]== 'DIAMETER_RESOURCES_EXCEEDED'){
                        jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", false, {dsid : avpObj.sessionId , message : "insufficent credit"});
                        res.end(jsonString);
                    }
                    else{
                        jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", false, {dsid : avpObj.sessionId , message : "Error"});
                        res.end(jsonString);
                    }

                });

            }


        }, function(error) {
            console.log('Error sending request: ' + error);
        });

    });

}

function endCall (req, res, next){

    var company =req.user.company;
    var tenant = req.user.tenant;
    var user = req.user.iss;
    var to = req.body.to;
    var from = req.body.from;

    var userinfo = {
        company : company,
        tenant : tenant,
        to : to,
        user : user,
        from : from,
        csid : req.body.csid

    };



    var socket = diameter.createConnection(options, function() {
        var connection = socket.diameterConnection;

        var request = connection.createRequest('Diameter Common Messages', 'Credit-Control');
        request.body = request.body.concat([
            //[ 'Session-Id', req.body.csid ],
            [ 'Origin-Host', 'localhost' ],
            [ 'Origin-Realm', 'com' ],
            [ 'Vendor-Id', 'VOXBONE' ],
            [ 'CC-Request-Type' , 'EVENT_REQUEST'],
            [ 'Requested-Action' , 'DIRECT_DEBITING' ],
            [ 'Auth-Application-Id', 'Diameter Credit Control' ],
            ['Subscription-Id', [ ['Subscription-Id-Type','END_USER_IMSI'],['Subscription-Id-Data', JSON.stringify(userinfo)]]]

        ]);

        //validate call session id, if session is closed send request
        connection.sendRequest(request).then(function(response) {
            const avpObj = avp.toObject(response.body);
            if(avpObj.resultCode=='DIAMETER_SUCCESS'){
                console.log(avpObj.resultCode);

                var jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", true, {csid : avpObj.sessionId , message : "successfully ended billing"});
                res.end(jsonString);

                //callTable[index].task.cancel();


            }
        });


    });


}





//Event Requst sample
/*if(avpObj.resultCode=='DIAMETER_SUCCESS'){
 var request = connection.createRequest('Diameter Common Messages', 'Credit-Control');
 request.body = request.body.concat([
 [ 'Origin-Host', 'localhost' ],
 [ 'Origin-Realm', 'com' ],
 [ 'Vendor-Id', 'VOXBONE' ],
 [ 'CC-Request-Type' , 'EVENT_REQUEST'],
 ['Rating-Group', [ ['to','94'] ,['from', '01'] ] ],
 [ 'Auth-Application-Id', 'Diameter Credit Control' ],
 [ 'Requested-Action' , 'PRICE_ENQUIRY' ],
 ['Currency-Code','USD']
 ]);
 connection.sendRequest(request).then(function(response) {
 const avpObj = avp.toObject(response.body);
 if(avpObj.resultCode=='DIAMETER_SUCCESS'){
 //console.log(avpObj.resultCode)
 request.body = request.body.concat([
 [ 'Origin-Host', 'localhost' ],
 [ 'Origin-Realm', 'com' ],
 [ 'Vendor-Id', 'VOXBONE' ],
 [ 'CC-Request-Type' , 'EVENT_REQUEST'],
 [ 'Rating-Group', [ ['to','94'] ,['from', '01'] ] ],
 [ 'Auth-Application-Id', 'Diameter Credit Control' ],
 [ 'Requested-Action' , 'CHECK_BALANCE' ],
 ['Currency-Code','USD']
 ]);
 connection.sendRequest(request).then(function(response) {
 const avpObj = avp.toObject(response.body);
 if(avpObj.resultCode=='DIAMETER_SUCCESS'){
 //console.log(avpObj.resultCode)
 request.body = request.body.concat([
 [ 'Origin-Host', 'localhost' ],
 [ 'Origin-Realm', 'com' ],
 [ 'Vendor-Id', 'VOXBONE' ],
 [ 'CC-Request-Type' , 'EVENT_REQUEST'],
 [ 'Rating-Group', [ ['to','94'] ,['from', '01'] ] ],
 [ 'Auth-Application-Id', 'Diameter Credit Control' ],
 [ 'Requested-Action' , 'DIRECT_DEBITING' ],
 [ 'Currency-Code','USD']
 ]);
 connection.sendRequest(request).then(function(response) {
 const avpObj = avp.toObject(response.body);
 if(avpObj.resultCode=='DIAMETER_SUCCESS'){
 console.log(avpObj.resultCode)
 }
 });
 }
 });
 }
 });
 }*/



exports.checkBalance = checkBalance;
exports.endCall = endCall;
exports.sendReq = sendReq;