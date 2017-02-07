var restify = require('restify');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var config = require('config');
var request = require('request');
var jwt = require('restify-jwt');
var secret = require('dvp-common/Authentication/Secret.js');
var authorization = require('dvp-common/Authentication/Authorization.js');
var format = require("stringformat");
var port = config.Host.port || 3000;
var host = config.Host.vdomain || 'localhost';

var dccaClient = require("./Client");


process.on('uncaughtException',function(err){
    logger.log("UNCAUGHT EXCEPTION");
    logger.log(err.stack);
});

var server = restify.createServer({
    name: "DVP Diameter Client API Service"
});




server.pre(restify.pre.userAgentConnection());
server.use(restify.bodyParser({ mapParams: false }));

restify.CORS.ALLOW_HEADERS.push('authorization');
server.use(restify.CORS());
server.use(restify.fullResponse());

server.use(jwt({secret: secret.Secret}));

var msg = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');


var token = format("Bearer {0}",config.Services.accessToken);
//////////////////////////////Cloud API/////////////////////////////////////////////////////


server.post('/DVP/API/:version/dcca/checkbalance',authorization({resource:"billing", action:"write"}), dccaClient.checkBalance);
server.post('/DVP/API/:version/dcca/billcall',authorization({resource:"billing", action:"write"}), dccaClient.sendReq);
server.post('/DVP/API/:version/dcca/endcall',authorization({resource:"billing", action:"write"}), dccaClient.endCall);



server.listen(port, function () {

    logger.info("DVP-DCCA Client.main Server %s listening at %s", server.name, server.url);


    //console.log('%s listening at %s', server.name, server.url);
});