var request = require("request");
var env = require("./env");
var fs = require("fs");
var travisConfig = fs.readFileSync("./.travis.yml","utf8");
var travisConfigEncoded = new Buffer(travisConfig).toString('base64')
console.log(travisConfigEncoded);

var urlSuffix = function(){
 return "access_token=" + env.token;
}

var repositories = function(callback, repos, next){
  var repos = repos || []
  var suffix = urlSuffix();
  if(next){
    suffix += "&page=" + next
  }
  request("https://api.github.com/users/ga-wdi-lessons/repos?" + suffix, {
    headers: {
      "User-Agent":"travisify"
    }
  },function(err, res, body){
    JSON.parse(body).forEach(function(repo){
      repos.push(repo);
    })
    var next;
    try{
      next = res.headers.link.match(/<(.*)>; rel="next"/);
      if( next ){
	next = next[1].split('&page=')[1]
      }
    } catch (e) {
      next = undefined
    }
    if(next){
      repositories(callback, repos, next);
    } else {
      callback(repos);
    }
  })
}

repositories(function(repos){
  for(var i = 0; i < repos.length; i++){
    var url = repos[i].url + "/contents/.travis.yml?" + urlSuffix();
    console.log(url)
    request({
      method: "PUT",
      uri: url,
      headers: {
        "User-Agent":"travisify"
      },
      json: {
        message: "add .travis.yml",
        content: travisConfigEncoded
      }
    }, function(err, res, body){
    })
  }
})