/**
 * Service dialogflow POST ai/v1
 * 
 */
app.service("dialogflow", ['$http', '$q', function($http, $q){
  var accessToken = "bce85240c3f44faa985aca08bf669ab0";
  var baseUrl = "https://api.api.ai/v1/";
  
  this.data = {"query": "", "lang": "es", "sessionId": "somerandomthing"};
  
  this.send = function (){
    
    var defered = $q.defer();
    var promise = defered.promise;
    
    var headers = {"Content-Type": "application/json; charset=utf-8", 
                   "Authorization": ("Bearer " + accessToken)};
    
    $http({
	  "method": 'POST',
      "url": baseUrl + "query?v=20150910",
      "headers": headers,
      "data": this.data
    }).then(function successCallback(response){
		defered.resolve(response);
	},function errorCallback(response){
	    defered.reject(response);
	});
      
   	return promise;
  };
}]);

app.service("print", [function(){
  this.pLeft = function(message){
    $("#messages").append("<p><span class='bg-primary'>" + message + "</span></p>");
  };
  this.pRight = function(message){
    $("#messages").append("<p class='text-right'><span class='bg-success'>" + message + "</span></p>");
  };
  this.loader = {"show": function(){
    $(".loader").show();
  }, "hide": function(){
    $(".loader").hide();
  }};
}]);