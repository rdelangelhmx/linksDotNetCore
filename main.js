'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the minovateApp
 */
app
  .controller('MainCtrl', function ($rootScope, $scope, $location, $cookies, $http, $translate) {

    $rootScope.Verifica_Login = function(){
        var voUsuario = $cookies.getObject('INTRANET_Usuario');
        console.log('Verifica login');
        if(!voUsuario){
           $location.url('/login');
        } else{
          IDUsuario = voUsuario.id_usuario;
          Usuario = voUsuario.usuario;
          Email_Usuario = voUsuario.email;
          Nombre_Usuario = voUsuario.nombre;
          $rootScope.IDUsuario = voUsuario.id_usuario;;
          $rootScope.Usuario = voUsuario.usuario;
          $rootScope.Email_Usuario = voUsuario.email;
          $rootScope.Nombre_Usuario = {nombre: voUsuario.nombre, paterno: voUsuario.paterno, materno: voUsuario.materno};
//          IDUsuario = voUsuario[0].id_usuario;
//          Usuario = voUsuario[0].usuario;
//          Email_Usuario = voUsuario[0].email;
//          Nombre_Usuario = voUsuario[0].nombre;
//          $rootScope.IDUsuario = voUsuario[0].id_usuario;;
//          $rootScope.Usuario = voUsuario[0].usuario;
//          $rootScope.Email_Usuario = voUsuario[0].email;
//          $rootScope.Nombre_Usuario = {nombre: voUsuario[0].nombre, paterno: voUsuario[0].paterno, materno: voUsuario[0].materno};
        }
    }

    $rootScope.Verifica_Login();

    
    

    $scope.logout = function(){

        $cookies.remove('INTRANET_Usuario');
        $location.url('/login');
    }

    $scope.Ver_Aviso = function(){
      if($scope.main.aviso)
        $scope.main.aviso = false;
      else
        $scope.main.aviso = true;
    }

    $scope.Close_Aviso = function(){
      $scope.main.aviso = false;
    }

    $rootScope.main = {
      title: 'INTRANET',
      settings: {
        navbarHeaderColor: 'scheme-greensea',
        sidebarColor: 'scheme-light',
        brandingColor: 'scheme-greensea',
        activeColor: 'default-scheme-color',
        headerFixed: true,
        asideFixed: true,
        rightbarShow: false
      },
      aviso : false
    };

  });
