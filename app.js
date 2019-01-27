'use strict';

const Hapi=require('hapi');
require('./mongoose/connect_db');

// Create a server with a host and port
let corsConfig = {
        "maxAge": 86400,
        "headers": ["Accept", "Authorization", "Content-Type", "If-None-Match","cross-origin"],
        "additionalHeaders": [],
        "exposedHeaders": ["WWW-Authenticate", "Server-Authorization"],
        "additionalExposedHeaders": [],
        "credentials": true,
        "origin" : ["*"],
    };

const server=Hapi.server({
    host:'127.0.0.1',
    port:8001,
    routes: { cors: corsConfig }
});

const options = {
    ops: false,
    reporters: {
        myConsoleReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' }]
        }, {
            module: 'good-console'
        }, 'stdout'],
        myFileReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ ops: '*' }]
        }, {
            module: 'good-squeeze',
            name: 'SafeJson'
        }, {
            module: 'good-file',
            args: ['./log/awesome.log']
        }],
        myHTTPReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ error: '*' }]
        }, {
            module: 'good-http',
            args: ['http://127.0.0.1:8001', {
                wreck: {
                    headers: { 'x-api-key': 12345 }
                }
            }]
        }]
    }
};

// Start the server
async function start() {

    await server.register(require('hapi-auth-bearer-token'));
    server.auth.strategy('simple', 'bearer-access-token', {
        //allowQueryToken: true,              // optional, false by default
        validate: require('./service/validate').validateFunc
    });

    //注册插件
    await server.register([
        {
            plugin: require('good'),
            options
        },
        require('inert'),   
        require('vision'),
        {
            plugin: require('hapi-swagger'),
            options:{
                info: {
                    title: 'Test API Documentation',
                    description: 'This is a sample example of API documentation.'
                },
                documentationPath:"/doc"
            }
        },
        require('hapi-auto-route')
    ]).catch((err)=>{
        throw err;
        console.log('插件出错')
    });

    


    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
}

start();