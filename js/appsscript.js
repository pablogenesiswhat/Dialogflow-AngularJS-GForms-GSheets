"use strict";

var app = angular.module("app", []);

app.service("appsscript", ['$http', '$q', function($http, $q)
{
  	// Url del proyecto de Google Apps Script
	const base = "https://script.google.com/macros/s/AKfycbyq1d2w0k1hbidxrvX8u8CXHb-UhLmQTbxPZddM8M6MyRfN5Jod/exec";
  	var parseBase = "";
	this.params = [];
  
    this.GAS = {"idForm": "", "idSheet": ""};
  
  	/**
     *  Function action()
     *  Envia por GET a la url base
     *
     *	@return promise
     */
    this.get = function()
    {
        
    	var defered = $q.defer();
    	var promise = defered.promise;
      	var headers = {"Content-Type": "application/json; charset=utf-8"}; 
    	
      	parseBase = base + ((this.params == 0) ? "": this.parseParams());
      	
    	$http({
	      "method": 'GET',
    	  "url": parseBase,
          "headers": headers
    	}).then(function successCallback(response){
			defered.resolve(response);
		},function errorCallback(response){
			defered.reject(response);
	    });
        
    	return promise;
  	};
  	
  	/**
     *  Function parseParams()
     *  Convierte el arreglo this.param[] a cadena de texto para enviar datos por GET
     *
     *	@return tmp String
     */
  	this.parseParams = function(){
      var tmp = "?";
      var end = this.params.length -1;
      
      for(var i = 0; end >= i; i++){
        
        if(end > i)
        	tmp += this.params[i] + "&";
        else if(end == i)
          tmp += this.params[i];
      }
      
      return tmp;
    };
  
  	/**
     *  Function objToStr(obj)
     *  Convierte un arreglo contenedor de JSON's a cadena y lo almecena en el arreglo this.params[]
     *
     *	@param obj array [JSON, JSON]
     */
  	this.objToStr = function(obj){
      var tmp = "";
      var end = obj.length;
      this.params = [];
    
      for(var i = 0; end > i; i++){
        tmp = obj[i].name + "=" + obj[i].value;
        this.params.push(tmp);
      }
    }
    
    /**
     *  Function twoDigits(num -> Integer)
     *  Convierte un entero de un digito a cadena de dos digitos
     *
     *	@param Integer num
     *  @return String
     */
    this.twoDigits = function(num){
      var tmp = "";
      num = String(num);
      
      if(num.length == 1)
        tmp = String("0" + num);
      else
        tmp = String(num);
      
      return tmp;
    }
}]);



