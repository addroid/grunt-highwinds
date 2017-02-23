/*
 * grunt-highwinds
 * http://addroid.com
 *
 * Copyright (c) 2016 Brian Robinson
 * Licensed under the MIT license.
 */

'use strict';

var https = require('https');
var url = require('url');
var querystring = require('querystring');
var extend = require('extend');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('highwinds', 'Grunt plugin for highwinds CDN', function() {
    // Merge task-specific and/or target-specific options with these defaults.


    var options = this.options({
      host: "cdn.example.org", //your Highwinds CDN hostname
			accountId: "n7XXXXk5", //your Highwinds account id
	    protocol: 'http:', //http: or https:, (defaults to http:)
      auth: { //Highwinds username & password.
	      username: "",
	      password: ""
      },
      rootPath: '' //use this to chop incoming origin paths
    });

    for(var i in this.data.options){
      options[i] = this.data.options[i];
    }
    // if(this.data.host){
    //   options.host = this.data.host
    // }

		var done = this.async();

		var urlList = this.files.reduce(function(a,f){
      return a.concat(f.orig.src.map(function(it){
        var pn = options.rootPath.length > 0 ? it.substr(options.rootPath.length) : it;
        return {"url":url.format({
          protocol:options.protocol,
          host:options.host,
          pathname:pn
        })};
      }));
		},[]);

		var _hw_req = function(opts, postData, callback){
			var defaults = {
			  host: 'striketracker.highwinds.com',
			  path: '',
			  method: 'POST',
			  headers: {}
			};
			var http_opts = extend(true, defaults, opts);

			var req = https.request(http_opts, function(res){
			  var resp_data = '';
			  //var contentType = res.getHeader('Content-Type');
			  var contentType = res.headers['content-type'];
				grunt.log.writeln("Response Content-Type: "+(contentType).cyan);
			  res.on('data', function (chunk) {
			    resp_data += chunk.toString('utf-8');
			  });
			  res.on('end',function(){
				  var output = resp_data;
				  if(contentType=='application/json'){
					  output = JSON.parse(resp_data);
					}
				  callback(null, output);
				});
			});
			req.on('error', function(e){
			  grunt.log.error(e);
				callback(e);
			});
			req.write(postData);
			req.end();
		}

		var _hw_auth = function(callback){



			//var auth_line = 'username='+options.auth.username+'&password='+options.auth.password+'&grant_type=password';
			var auth_line = querystring.stringify({
				username:options.auth.username,
				password:options.auth.password,
				grant_type:"password"
			});

			var req_opts = {
				path: '/auth/token',
			  headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': Buffer.byteLength(auth_line)
			  }
			};

			_hw_req(req_opts, auth_line, function(err,obj){
				grunt.log.writeln("Authorized as: "+(obj.access_token).cyan);
			  //obj.access_token
			  //obj.token_type
			  //obj.expires_in
			  //obj.refresh_token
			  //obj.user_agent
			  //obj.application
			  //obj.ip
		    callback(null, obj);
			});

		}


		var _hw_purge = function(auth, urlList, callback){

			var json_params = {"list":urlList};
			var post_body = JSON.stringify(json_params);

			var post_opts = {
				path: '/api/accounts/'+options.accountId+'/purge',
			  headers: {
				  'Authorization': 'Bearer '+auth.access_token, //+'|STAGE:Write-only',
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(post_body)
			  }
			};

			//grunt.log.writeln("PURGE REQUEST: ", post_body.blue);
			_hw_req(post_opts, post_body, callback);

		}


		_hw_auth(function(err, auth){
			//grunt.log.writeln('>>> [hw] AUTH: '+ JSON.stringify(auth));
			_hw_purge(auth, urlList, function(err,result){
				if(err){ grunt.log.error('Highwinds error: '+ err); }
        urlList.forEach(function(it){
          grunt.log.writeln("Purged: "+ (it.url).green);
        })
				grunt.log.writeln(('Purge ID '+ JSON.stringify(result.id)).green);
				done();
			});
		});


  });

};
