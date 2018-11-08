'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the minovateApp
 */
app
  .controller('NavCtrl', function ($scope, $rootScope, $http, uhttp, $compile, $state, $timeout, $stateParams, $resource) {

    $scope.oneAtATime = false;

    $scope.status = {
      isFirstOpen: true,
      isSecondOpen: true,
      isThirdOpen: true
    };

  $scope.ShowMenu = 1;
  $scope.Menus = [];
  $scope.HTML = '';
  $scope.TitleMenu = '<i class="fa fa-bars" aria-hidden="true"></i> Bienvenido';
  //Init
 
  function f_get_Menu(){    

   /* uhttp({
      method: 'POST',
      data: utilNumbers.objectToQs({
          IDUsuario : IDUsuario,
          uhttp: true
      }),
      url: 'http://10.2.14.145/phpcode/EjecutaConsulta.php?sql=INTRANET_PrmsUsro',
      onSuccess: function(response) {                       
        f_ordena_menu(response.data);     
      }
    
    });  */
	
	$resource('http://10.2.14.140:1101/auth/permisos',{},{
                login: {
                    method: 'POST',
                    data: '',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            }).login({
                IDUsuario : IDUsuario
            }).$promise.then(data => {
                 f_ordena_menu(data.data);
            }).catch(err => {
                console.log('Pues no estuvo chingon $resource');
                console.log(err);
            });
	
  }
  f_get_Menu();

  function f_MenuRecursivo(pnIDPadre, psState){
    pnIDPadre = parseInt(pnIDPadre);

    var vsHTML = '';
    var vsRuta = '';
    var open = '';
    var block = 'none';
      for(var m = 0; m < $scope.Menus[pnIDPadre].length; m++){
          var menu = $scope.Menus[pnIDPadre][m];


            var state = psState + '/' + menu.state;
            state = state.replace(/\ \//g, '').trim();

            var re = new RegExp("^/" + (state).trim() + "/\w*");
            $rootScope.$path.replace(/\/FMF/, '')
            open = "";
            block = "";
            if(re.test($rootScope.$path.replace(/\/FMF/, ''))){ 
              open = "open";
              block = "block";
            }
          
          if(parseInt(menu.idTipoSistema) == 25)
            vsHTML += '<li ng-class="{\'active\': $state.includes(\'app.externo\', {externo: \'' + menu.state + '\'})}" class="' + open + '">';
          else
            vsHTML += '<li ng-class="{\'active\': $state.includes(\'app.path\', {path: \'' + state + '\'})}" class="' + open + '">';

          if($scope.Menus[menu.id]) {
             // console.log(menu.idTipoSistema)

            if(parseInt(menu.idTipoSistema) == 25)
              vsHTML += '    <a ui-href="app.externo" href="javascript:;" ng-click="f_AbreOldIntranet(\'' + menu.state + '\')">';
            else 
              vsHTML += '    <a href="javascript:;">';
          } else {


            if(parseInt(menu.idTipoSistema) == 25)
              vsHTML += '    <a ui-href="app.externo" href="javascript:;" ng-click="f_AbreOldIntranet(\'' + menu.state + '\')">';
            else
              vsHTML += '    <a ui-href="app.path" href="#/FMF/' + state + '" ng-click="f_AbreMenu($stateParams);">';
          }

          vsHTML += '         <fa name="' + menu.icono + '"></fa> <span>' + menu.nombre + '</span></a>';
          
          if($scope.Menus[menu.id] && menu.idTipoSistema != 25) { // Verificamos si tiene hijos
              vsHTML += '<ul style="display: ' + block +  ';">';
              vsHTML += f_MenuRecursivo(menu.id, state); // Recursion hacia los menus hijos
              vsHTML += '</ul>';
          }
          vsHTML += '</li>';
      }

      return vsHTML;
  }

  function f_ordena_menu(datos){
        var contenido = '';
        var ruta = '';

        //### Variables para saber si existe un menu que deba abrirse automaticamente, dependiendo del $state
        var auto = {open : false, nombre: '', id: 0, state: ''};
        //########################################

        $scope.Menus = [];
        angular.forEach(datos, function(value){

          if($scope.Menus[value.idMenuPadre] == undefined)
            $scope.Menus[value.idMenuPadre] = [];

          $scope.Menus[value.idMenuPadre].push(value); 

        });

        //Comenzar a construir el Menu
        //console.log($scope.Menus[0]);
        $scope.HTML += '<ul id="navigation" nav-collapse ripple>';
        
        for(var m = 0; m < $scope.Menus[0].length; m++){
          var menu = $scope.Menus[0][m];

          if(menu.state != '/'){ ruta = '/FMF/' }

          $scope.HTML += '<li >';

          // $scope.HTML += '    <a   ui-sref="app.inicio" ui-href="/"><fa name="' + menu.icono + '"></fa> <span>' + menu.nombre + '</span></a>';
          $scope.HTML += '    <a   ui-href="app.path" href="#' + ruta + menu.state + '"><fa name="' + menu.icono + '"></fa> <span>' + menu.nombre + '</span></a>';
          if($scope.Menus[menu.id]) { // Verificamos si tiene hijos
              $scope.HTML += '<ul>';
              if($('body').hasClass('sidebar-sm') || $('body').hasClass('sidebar-xs')){
                $scope.HTML += f_MenuRecursivo(menu.id, menu.state);
              } else {
                for(var w = 0; w < $scope.Menus[menu.id].length; w++){
                  var SubMenus = $scope.Menus[menu.id][w];
                  $scope.HTML += '<li ng-class="{\'open active\': $state.includes(\'app.path\', {path: \'' + SubMenus.statePadre + '/' + SubMenus.state + '\'})}">';
                  if($scope.Menus[SubMenus.id]) {
                    //Verificar si la ruta esta contenida en el state
                    if(((SubMenus.statePadre + SubMenus.state).trim()) != ''){ // Solo validar si tiene un state asociado;
                      var re = new RegExp("^" + (SubMenus.statePadre + '/' + SubMenus.state).trim() + "");
                      if(re.test($rootScope.$path.replace(/\/FMF/, '')))
                        auto = {open: true, nombre: SubMenus.nombre, id: SubMenus.id, state: SubMenus.state};
                    }

                    if(parseInt(SubMenus.idTipoSistema) == 25) 
                       $scope.HTML += '    <a ui-href="app.externo" href="javascript:;" ng-click="f_AbreOldIntranet(\'' + SubMenus.state + '\')">';  
                    else 
                      $scope.HTML += '    <a ui-href="app.path" href="javascript:;" ng-click="f_NuevoMenu(\'' + SubMenus.nombre + '\',' + SubMenus.id + ', \'' + SubMenus.state + '\');">';
                  } else {

                    if(parseInt(SubMenus.idTipoSistema) == 25) 
                      $scope.HTML += '    <a ui-href="app.externo" href="javascript:;" ng-click="f_AbreOldIntranet(\'' + SubMenus.state + '\');">';
                    else
                      $scope.HTML += '    <a ui-href="app.path" href="#/FMF/' + SubMenus.statePadre + '/' + SubMenus.state + '" ng-click="f_AbreMenu(\'' + SubMenus.nombre + '\');">';
                  }
                  $scope.HTML += '      <fa name="' + SubMenus.icono + '"></fa>';
                  $scope.HTML += '      <span>' + SubMenus.nombre + '</span>';
                  $scope.HTML += '    </a>';
                  if($scope.Menus[SubMenus.id]) {
                    $scope.HTML += '<ul></ul>';
                  }
                  $scope.HTML += '</li>';
                }
              }
              $scope.HTML += '</ul>';
          }
          $scope.HTML += '</li>';
        }
        $scope.HTML += '</ul>';

        angular.element("#MenuPortada").html($compile($scope.HTML)($scope));

        //if($('body').hasClass('sidebar-sm') || $('body').hasClass('sidebar-xs')){
          if(auto.open) // Abrir automaticamente el menu
            $scope.f_NuevoMenu(auto.nombre,auto.id, auto.state);
        //}
    }


    $scope.f_AbreOldIntranet = function(psState){

       $state.go('app.intranet', {externo: psState});
    }

    $scope.f_NuevoMenu = function(psDescripcionMenu, pnIDMenu, psState){
      $scope.TitleMenu = '<i class="fa fa-bars" aria-hidden="true"></i> ' + psDescripcionMenu;
      $scope.ShowMenu = 2;
      $scope.NewMenuHTML = '<span class="BtnReturn"><a href="javascript:;" ng-click="f_ReturnMenu();"><i class="fa fa-reply" aria-hidden="true"></i> Regresar</a></span>';
      $scope.NewMenuHTML += '<ul id="navigation" nav-collapse ripple>';
      $scope.NewMenuHTML += f_MenuRecursivo(pnIDMenu, psState);
      $scope.NewMenuHTML += '</ul>';
      angular.element("#MenuSistema").html($compile($scope.NewMenuHTML)($scope));
    }

    $scope.f_AbreMenu = function($stateParams){
      $stateParams.controller = null;
    }

    $scope.f_ReturnMenu = function(){
      $scope.TitleMenu = '<i class="fa fa-bars" aria-hidden="true"></i> Bienvenido';
      $scope.ShowMenu = 1;
      $scope.NewMenuHTML = '';
    }

    /* Ajuste de Menú Lateral */
    var ap = angular.element('.appWrapper');
    var ventana = angular.element(window);
    var width = ventana.width();

    if(width <= 768){ ap.addClass('sidebar-xs'); }

    if(width <= 1400 && width > 768){ ap.addClass('sidebar-sm')}

  });
