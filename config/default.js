module.exports = {



    "DB": {
        "Type":"postgres",
        "User":"duouser",
        "Password":"DuoS123",
        "Port":5432,
        "Host":"localhost",
        "Database":"dvpdb"
    },


    "Redis":
    {
        "ip": "45.55.142.207",
        "port": 6389,
        "user": "duo",
        "password": "DuoS123"

    },


    "Security":
    {
        "ip" : "45.55.142.207",
        "port": 6389,
        "user": "duo",
        "password": "DuoS123"
    },


    "Host":
    {
        "vdomain": "localhost",
        "domain": "localhost",
        "port": "4555",
        "version": "1.0.0.0"
    },

    "LBServer" : {

        "ip": "localhost",
        "port": "3434"

    },

    "RabbitMQ":
    {
        "ip": "45.55.142.207",
        "port": 5672,
        "user": "admin",
        "password": "admin"
    },


    "Mongo":
    {
        "ip":"45.55.142.207",
        "port":"27017",
        "dbname":"dvpdb",
        "password":"DuoS123",
        "user":"duo"
},

    "Services" : {
        "accessToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdWtpdGhhIiwianRpIjoiYWEzOGRmZWYtNDFhOC00MWUyLTgwMzktOTJjZTY0YjM4ZDFmIiwic3ViIjoiNTZhOWU3NTlmYjA3MTkwN2EwMDAwMDAxMjVkOWU4MGI1YzdjNGY5ODQ2NmY5MjExNzk2ZWJmNDMiLCJleHAiOjE5MDIzODExMTgsInRlbmFudCI6LTEsImNvbXBhbnkiOi0xLCJzY29wZSI6W3sicmVzb3VyY2UiOiJhbGwiLCJhY3Rpb25zIjoiYWxsIn1dLCJpYXQiOjE0NzAzODExMTh9.Gmlu00Uj66Fzts-w6qEwNUz46XYGzE8wHUhAJOFtiRo",

        "userServiceHost": "userservice.app.veery.cloud",
        "userServicePort": "3637",
        "userServiceVersion": "1.0.0.0",
        "walletServiceHost": "walletservice.app.veery.cloud",
        "walletServicePort": "3333",
        "walletServiceVersion": "1.0.0.0",

        "relayServiceHost":"localhost" ,
        "relayServicePort": 3868


    }



};