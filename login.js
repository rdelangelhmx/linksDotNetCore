'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PagesLoginCtrl
 * @description
 * # PagesLoginCtrl
 * Controller of the minovateApp
 */
app.controller('LoginCtrl', function ($rootScope, $scope, $timeout, $state, $cookies, $http, uhttp,$resource) {

    $scope.credenciales = true;
    var voUsuario = $cookies.getObject('INTRANET_Usuario');
    // Si ya esta logueado mandar a inicio
    if (voUsuario){
        $state.go('app.inicio');
    }

    $scope.validar = false;
    $scope.not_pass = true;
    $scope.loading = false;
    $scope.message = 'Seleccione Sistema';

    $scope.cargarSistema = function (poDatos) {
        $cookies.putObject('IDUsro', poDatos.id_usuario);
        $scope.loading = true;
        $scope.message = 'Ingresando a Intranet';
        $timeout(function () {
            $scope.loading = false;
            if ($scope.LastState.name == '') {
                $state.go('app.inicio');
            } else {
                $state.go($scope.LastState, $scope.LastParams);
            }
        }, 5000);
    }

//    function login_intv3(usuario, pass) {
//        uhttp({
//            method: 'POST',
//            url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_Login_INTV3',
//            data: util.objectToQs({
//                usr: usuario,
//                pas: pass,
//                IDUsro: 0,
//                uhttp: true,
//                array: true,
//                replace: false
//            }),
//            onSuccess: function (response) {
//                var datos = response.data;
//                $scope.not_pass = false;
//                $cookies.putObject('INTRANET_Usuario', datos);
//                IDUsuario = datos[0].id_usuario;
//                Usuario = datos[0].usuario;
//                Email_Usuario = datos[0].email;
//                Nombre_Usuario = datos[0].nombre;
//                $rootScope.IDUsuario = datos[0].id_usuario;
//                $rootScope.puesto = datos[0].puesto;
//                $rootScope.departamento = datos[0].departamento;
//                $rootScope.Usuario = datos[0].usuario;
//                $rootScope.Email_Usuario = datos[0].email;
//                $rootScope.Email_Usuario = datos[0].email;
//                $rootScope.Nombre_Usuario = {nombre: datos[0].nombre, paterno: datos[0].paterno, materno: datos[0].materno};
//                $scope.cargarSistema(datos);
//            },
//            onError: function (data) {
//                $scope.validar = true;
//            }
//        });
//    }

    $scope.login = function () {
        if (($scope.password != undefined && $scope.password != '' && typeof $scope.password != 'undefined') && ($scope.password != undefined && $scope.password != '' && typeof $scope.password != 'undefined')) {
            var pass = $scope.password;
//            uhttp({
//                method: 'POST',
//                url: '/phpcode/Encriptacion.php?ps=' + pass,
//                onSuccess: function (response) {
//                    login_intv3($scope.usuario, response.data);
//                }
//            });

            /*$http.post('http://dev.componentes.fmf.mx/phpcode/Acceso.php',{
                u: $scope.usuario,
                p: pass
            }).then(data => {
                console.log('Todo super chigon');
            }, err => {
                console.log('Pues no estuvo chingon $http');
                console.log(err);
            });*/
            $resource('http://10.2.14.140:1101/auth/signin',{},{
                login: {
                    method: 'POST',
                    data: '',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            }).login({
                u: pass,
                p: $scope.usuario
            }).$promise.then(data => {
                console.log('Todo super chigon');
				var datos = data;
                    $scope.not_pass = false;
                    $cookies.putObject('INTRANET_Usuario', datos);
                    IDUsuario = datos.id_usuario;
                    Usuario = datos.usuario;
                    Email_Usuario = datos.email;
                    Nombre_Usuario = datos.nombre;
                    $rootScope.IDUsuario = datos.id_usuario;
                    $rootScope.puesto = datos.puesto;
                    $rootScope.departamento = datos.departamento;
                    $rootScope.Usuario = datos.usuario;
                    $rootScope.Email_Usuario = datos.email;
                    $rootScope.Email_Usuario = datos.email;
                    $rootScope.Nombre_Usuario = {nombre: datos.nombre, paterno: datos.paterno, materno: datos.materno};
                    $scope.cargarSistema(datos);
            }).catch(err => {
                console.log('Pues no estuvo chingon $resource');
                console.log(err);
            });
            /*uhttp({
                method: 'POST',
                url: 'http://dev.componentes.fmf.mx/phpcode/Acceso.php?p=' + pass + '&u=' + $scope.usuario,
                onSuccess: function (response) {
                    var datos = response.datos;
                    $scope.not_pass = false;
                    $cookies.putObject('INTRANET_Usuario', datos);
                    IDUsuario = datos.id_usuario;
                    Usuario = datos.usuario;
                    Email_Usuario = datos.email;
                    Nombre_Usuario = datos.nombre;
                    $rootScope.IDUsuario = datos.id_usuario;
                    $rootScope.puesto = datos.puesto;
                    $rootScope.departamento = datos.departamento;
                    $rootScope.Usuario = datos.usuario;
                    $rootScope.Email_Usuario = datos.email;
                    $rootScope.Email_Usuario = datos.email;
                    $rootScope.Nombre_Usuario = {nombre: datos.nombre, paterno: datos.paterno, materno: datos.materno};
                    $scope.cargarSistema(datos);
                },
                onError: function (data) {
                    $scope.validar = true;
                }
            });*/
			
			
        } else {
            $scope.credenciales = false;
            $timeout(function () {
                $scope.credenciales = true;
            }, 1000);
        }

    };
});