
app.controller("ctrlMain", ["$scope", "appsscript", "dialogflow", "print", function($scope, appsscript, dialogflow, print){
  
  $scope.form = null;
  $scope.response = [];
  $scope.limit = 0;
  $scope.text = {"value": ""};
  $scope.index = 0;
  
  dialogflow.data.query = "init";
  dialogflow.send().then(function(r){
    print.loader.hide();
    print.pLeft(r.data.result.fulfillment.speech);
    $scope.scroll("#scroll");
  }).catch(function(e){
    console.log(e);
  });
  
  /**
   * Function getForm()
   * Extraccione de los datos de Google Forms dependiendo del id 
   */
  $scope.getForm = function(){
    print.loader.show();
    appsscript.params.push("formId=" + appsscript.GAS.idForm);
    
    appsscript.get().then(function(r){
      print.loader.hide();
      var tmp = r.data.form;
      print.pLeft(r.data.form[0].title);
      print.pLeft(r.data.form[0].value);
      $scope.scroll("#scroll");
      tmp.shift();
      $scope.form = tmp;
      $scope.limit = tmp.length;
      print.pLeft($scope.form[$scope.index].title);
      $scope.scroll("#scroll");
      
    }).catch(function(e){
      print.loader.show();
      dialogflow.data.query = "Formulario invalido";
      
      dialogflow.send().then(function(r){
        console.log(r);
        print.loader.hide();
        print.pLeft(r.data.result.fulfillment.speech);
        $scope.scroll("#scroll");
      }).catch(function(e){
        console.log(e);
      });
    });
  };
  
  /**
   *
   */
  $scope.next = function(response){
    $scope.response.push({"name": "val" + $scope.index, "value": response});
    $scope.index++;
    $scope.text.value = "";
    
    print.pRight(response);
    $scope.scroll("#scroll");
    
    if($scope.index == $scope.limit)
      $scope.sendForm();
    else{
      print.pLeft($scope.form[$scope.index].title);
      $scope.scroll("#scroll");
    }
    
  };
  
  /**
   * Function sendForm()
   * 
   * Envia las respuestas del cuestionario a la google sheets asociada al formulario
   */
  $scope.sendForm = function(){
    print.loader.show();
    $scope.response.push({"name": "limit", "value": $scope.limit});
    
    appsscript.objToStr($scope.response);
    appsscript.params.push("formId=" + appsscript.GAS.idForm);
    appsscript.params.push("sheetId=" + appsscript.GAS.idSheet);
    
    appsscript.get().then(function(r){
      
      dialogflow.data.query = "Fincuestionario";
      dialogflow.send().then(function(r){
        print.loader.hide();
      	print.pLeft(r.data.result.fulfillment.speech);
		$scope.scroll("#scroll");
        $scope.resetForm();
        console.log(r);
	  }).catch(function(e){
		console.log(e);
      });
      
    }).catch(function(e){
      print.loader.show();
      dialogflow.data.query = "FallaAlmacenamiento";
      dialogflow.send().then(function(r){
        print.loader.hide();
        print.pLeft(r.data.result.fulfillment.speech);
        $scope.scroll("#scroll");
      }).catch(function(e){
        console.log(e);
      });
      
    });
  };
  
  /**
   * function sendDialog()
   * 
   * Interaccion con dialogflow
   */
  $scope.sendDialog = function(){
    print.loader.show();
    dialogflow.data.query = $scope.text.value;
    print.pRight($scope.text.value);
    $scope.scroll("#scroll");
    
    dialogflow.send().then(function(r){
      console.log(r);
      $scope.text.value = "";
      var speech = r.data.result.fulfillment.speech;
      if(!$scope.getID(speech)){
        print.loader.hide();
        print.pLeft(speech);
        $scope.scroll("#scroll");
      }
    }).catch(function(e){
      console.log(e);
    });
  };
  
  /**
   * function getID()
   * verifica si existe un id para lanzar el formulario correspondiente
   */
  $scope.getID = function(speech){
    var tmp = speech.split("&&");
    if(tmp.length === 2){
      appsscript.GAS.idForm = tmp[0];
      appsscript.GAS.idSheet = tmp[1];
      $scope.getForm();
      return true;
    }
    else
      return false;
  };
    
  /**
   * Function resetForm()
   *
   * Restaura los parametros de almacenamiento de las respuestas del formulario de google 
   */
  $scope.resetForm = function(){
    $scope.form = null;
    $scope.response = [];
    $scope.limit = 0;
    $scope.text.value = "";
    $scope.index = 0;
    appsscript.params = [];
  };
    /**
	 * Efecto animado scroll desplazamiento dependiendo de un id 
	 * 
	 * @param {String} destiny
	 * @returns {null}
	 */
    $scope.scroll = function (destiny)
    {
      $("html,body").animate({ scrollTop : $(destiny).offset().top  }, 500 );
	};
  
    $scope.type = function(val){
      return (typeof(val) !== "undefined") ? true : false;
    };
}]);
