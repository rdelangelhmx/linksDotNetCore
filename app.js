'use strict';

/**
 * @ngdoc overview
 * @name minovateApp
 * @description
 * # minovateApp
 *
 * Main module of the application.
 */

/*jshint -W079 */
var app = angular.module('IntranetApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngMessages',
    'picardy.fontawesome',
    'ui.bootstrap',
    'ui.router',
    'ui.utils',
    'angular-loading-bar',
    'angular-momentjs',
    'FBAngular',
    'lazyModel',
    'toastr',
    'angularBootstrapNavTree',
    'oc.lazyLoad',
    'ui.select',
    'angularFileUpload',
    'datatables',
    'datatables.bootstrap',
    'datatables.colreorder',
    'datatables.colvis',
    'datatables.tabletools',
    'datatables.scroller',
    'datatables.columnfilter',
    'ngTable',
    'ui.calendar',
    'ui.tree',
    'ngTagsInput',
    'pascalprecht.translate',
    'ngMaterial',
    'localytics.directives',
    'union_http',
    'modals',
    'URLFinderService',
    'summernote',
    'countTo',
    'angular-flot',
    'easypiechart',
    'angular.morris',
    'ngLoadScript',
    'mgcrea.ngStrap',
    'datatables.fixedheader', 'datatables.fixedcolumns',
    'dndLists',
    'sipres',
    'chart.js',
    'ui.grid',
    'ui.grid.pinning',
    'ui.grid.exporter'
]);

app.run(['$rootScope', '$state', '$stateParams', '$location', '$urlRouter', function ($rootScope, $state, $stateParams, $location, $urlRouter) {
        $rootScope.$on('$locationChangeSuccess', function (evt) {
            evt.preventDefault();
            $location.url($location.path().replace(/\~2F/g, '/')).replace();
            $rootScope.$path = $location.path();

            

        });

        $rootScope.stateParams = [];
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;


        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, from, fromParams) {

           $rootScope.$path = toParams.path;

        });
        

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, from, fromParams) {
            $rootScope.LastState = from;
            $rootScope.LastParams = fromParams;

            event.targetScope.$watch('$viewContentLoaded', function () {

                angular.element('html, body, #content').animate({scrollTop: 0}, 200);

                setTimeout(function () {
                    angular.element('#wrap').css('visibility', 'visible');

                    if (!angular.element('.dropdown').hasClass('open')) {
                        angular.element('.dropdown').find('>ul').slideUp();
                    }
                }, 200);
            });
            $rootScope.containerClass = toState.containerClass;
        });

        $state.go("app");
    }])

        .config(['$cookiesProvider', function ($cookiesProvider) {
                $cookiesProvider.defaults.path = '/';
                $cookiesProvider.defaults.secure = false;
            }])

        .config(['uiSelectConfig', function (uiSelectConfig) {
                uiSelectConfig.theme = 'bootstrap';
            }])

//angular-language
        .config(['$translateProvider', function ($translateProvider) {
                $translateProvider.useStaticFilesLoader({
                    prefix: '/languages/',
                    suffix: '.txt'
                });
                $translateProvider.useLocalStorage();
                $translateProvider.preferredLanguage('es');
                $translateProvider.useSanitizeValueStrategy(null);
            }])


        .config(function ($controllerProvider, $stateProvider, $urlRouterProvider, $locationProvider, $provide) {

            app.gadgetIntranetFMF = $controllerProvider.register;


            $stateProvider
                    .state('app', {
                        views: {
                            'header': {templateUrl: "vistas/header.html"},
                            'nav': {templateUrl: "vistas/nav.html"},
                            '': {templateUrl: "vistas/inicio.html"}

                        },
                        resolve: {
                            plugins: ['$ocLazyLoad', function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/modulos/vendor/datatables/datatables.bootstrap.min.css',
                                        '/modulos/vendor/datatables/datatables.bootstrap.min.css',
                                    ]);
                                }]
                        }
                    })
                    //dashboard
                    .state('app.inicio', {
                        url: '/',
                        views: {'cumpleanios': {
                                templateUrl: "vistas/cumpleanios.html",
                                controller: "cumpleaniosCtrl"
                            },
                            'directorio': {
                                templateUrl: "vistas/directorio.html",
                                controller: "DirectorioCtrl"
                            },
                            'encuesta': {
                                templateUrl: "vistas/encuesta.html",
                                controller: "encuestaCtrl"
                            },
                            'calendario': {
                                templateUrl: "vistas/calendario.html",
                                controller: "calendarioCtrl"
                            },
                            'beneficios': {
                                templateUrl: "vistas/beneficios.html",
                                controller: "SliderBeneficios"
                            }

                        },
                        onEnter: function ($state, $rootScope) {
                            $rootScope.Verifica_Login();
                        }

                    })
                    .state('app.perfil', {
                        url: '/Perfil/:id',
                        controller: 'perfilCtrl',
                        templateUrl: 'vistas/perfil.html',
                        onEnter: function ($state, $rootScope) {
                            $rootScope.Verifica_Login();
                        }

                    })

                    //Login
                    .state('login', {
                        url: '/login',
                        controller: 'LoginCtrl',
                        templateUrl: 'vistas/login.html'
                    })
                    // Cumpleaños
                    .state('cumpleanios', {
                        url: '/cumpleanios',
                        controller: 'cumpleaniosCtrl',
                        templateUrl: 'vistas/cumpleanios.html'
                    })

                    .state('app.intranet', {
                        url: '/intranet',
                        controller: 'intranetCtrl',
                        templateUrl: 'vistas/intranet.html',
                        params: {
                            externo: null
                        }
                    })

                    .state('app.path', {
                        url: '/FMF/*path',
                        controllerAs: 'vm',
                        params: {
                            controller: null,
                            filtro: null
                        },
                        templateProvider: ['$templateFactory', '$stateParams', '$timeout', 'URLFinderService', function ($templateFactory, $stateParams, $timeout, URLFinderService) {
                                var url = 'componentes/views/' + $stateParams.path + '.html?r=' + Math.floor(Math.random() * 1000);
                                return $templateFactory.fromUrl(url);
                            }],
                        resolve: {

                            controller: ['$rootScope', '$q', '$http', '$stateParams', '$timeout', 'URLFinderService', 'Filtro', function ($rootScope, $q, $http, $stateParams, $timeout, URLFinderService, Filtro) {

                                    if (!$rootScope.stateParams[$stateParams.path.replace(/\//g, '')]) {
                                        $rootScope.stateParams[$stateParams.path.replace(/\//g, '')] = $stateParams;
                                        if ($stateParams.controller)
                                            $rootScope.stateParams[$stateParams.path.replace(/\//g, '')].loaded = $stateParams.controller;
                                        else
                                            $rootScope.stateParams[$stateParams.path.replace(/\//g, '')].loaded = URLFinderService.generateControllerName($stateParams.path);
                                    }

                                    var defer = $q.defer();
                                    var url = 'componentes/controllers/' + $stateParams.path + '.js?r=' + Math.floor(Math.random() * 1000);
                                    Filtro.set($stateParams.filtro);
                                    $http.get(url).success(function (data, status, headers, config) {
                                        eval(data);
                                        defer.resolve();
                                    }).error(function (data, status, headers, config) {
                                        defer.reject(status);
                                    });
                                    return defer.promise;

                                    
                                }]
                        },
                        controllerProvider: ['$rootScope', '$stateParams', 'URLFinderService','Filtro', function ($rootScope, $stateParams, URLFinderService, Filtro) {

                                var vsController = '';

                                if ($rootScope.stateParams[$stateParams.path.replace(/\//g, '')]) {
                                    vsController = $rootScope.stateParams[$stateParams.path.replace(/\//g, '')].loaded;
                                }

                                if (!vsController) {
                                    if ($stateParams.controller)
                                        vsController = $stateParams.controller;
                                    else
                                        vsController = URLFinderService.generateControllerName($stateParams.path);
                                }

                                return vsController;

                            }],
                        onEnter: function ($state, $rootScope, $stateParams) {
                            $rootScope.Verifica_Login();
                        }
                    });
        });

var ctrlName = undefined;

function f_getNameCntr(psController) {
    
        var injector = angular.element(document.querySelector("#minovate")).injector();
        var rootscope = injector.get("$rootScope");
        
        var vsRuta = rootscope.$path;
        var truePath = vsRuta;

        if(vsRuta.search('/FMF/') >= 0)
            truePath = vsRuta.split('/FMF/')[1];

        if (psController)
            ctrlName = psController;
        else{
            var URLFinderService = injector.get("URLFinderService");
            ctrlName = URLFinderService.generateControllerName(truePath);
        }

        return ctrlName;
        
   
}

/*
 * Convierte un texto en minusculas con letras Capitales
 */
app.filter('capitalize', function () {
    return function (input) {
        var res = '';
        var palabras = input.split(' ');
        for (var i = 0; i < palabras.length; i++) {
            res += palabras[i].substring(0, 1).toUpperCase() + palabras[i].substring(1).toLowerCase() + ' ';
        }
        return res;
    }
});




/*Load Script*/
(function (ng) {
    'use strict';

    var app = ng.module('ngLoadScript', []);

    app.directive('script', function () {
        return {
            restrict: 'E',
            scope: false,
            link: function (scope, elem, attr) {
                if (attr.type == 'text/javascript-lazy') {
                    var code = elem.text();
                    var f = new Function(code);
                    f();
                }
            }
        };
    });
}(angular));

function loadjscssfile(filename, filetype) {
    if (filetype == "js") {
        // if filename is a external JavaScript file
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", filename);
    } else if (filetype == "css") {
        //if filename is an external CSS file
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref != "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }
}

//Obtiene el Nombre del Mes
/*
 * PARAMS:
 mes => Indica el Mes 
 js  => Indica si el Mes es Normal o en Formato JavaScript
 */
function f_mes_letra(mes, js) {
    if (js) {
        mes = parseInt(mes) + 1;
    }
    var meses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    return meses[mes];
}

/* Función para obtener el mes abreviado */
function f_mes_abrv_letra(mes) {
    var meses = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return meses[mes];
}

//Notificaciones
function notification(type, msg, title, clr, toastr) {
    var toast = toastr[type]('<center><h4>' + msg + '</h4></center>', '<center><h4><strong>' + title + '</strong></h4></center>', {
        iconClass: 'toast-' + type + ' bg-' + clr
    });
    openedToasts.push(toast);
}

/* Convertir acentos en ascii */
function ConvertAcentosToAscii(texto) {
    var cnvrTxt = String(texto);
    cnvrTxt = cnvrTxt.replace(/á/g, 'a'); //&#225;
    cnvrTxt = cnvrTxt.replace(/é/g, 'e'); //&#233;
    cnvrTxt = cnvrTxt.replace(/í/g, 'i'); //&#237;
    cnvrTxt = cnvrTxt.replace(/ó/g, 'o'); //&#243;
    cnvrTxt = cnvrTxt.replace(/ú/g, 'u'); //&#250;
    // Mayusculas
    cnvrTxt = cnvrTxt.replace(/Á/g, 'A'); //&#193;
    cnvrTxt = cnvrTxt.replace(/É/g, 'E'); //&#201;
    cnvrTxt = cnvrTxt.replace(/Í/g, 'I'); //&#205;
    cnvrTxt = cnvrTxt.replace(/Ó/g, 'O'); //&#211;
    cnvrTxt = cnvrTxt.replace(/Ú/g, 'U'); //&#218;
    return cnvrTxt;
}

/* Capitalizar texto */
function capitalizeJS(input) {
    var res = '';
    var palabras = input.split(' ');
    for (var i = 0; i < palabras.length; i++) {
        res += palabras[i].substring(0, 1).toUpperCase() + palabras[i].substring(1).toLowerCase() + ' ';
    }
    return res;
}

app.filter('firstWord', function () {
    return function (data) {
        if (!data)
            return data;
        data = data.split(' ');
        return data[0];
    };
});

app.filter('twoDigits', function () {
    return function (number) {
        var formattedNumber = ("0" + number).slice(-2);
        return formattedNumber;
    };
});

app.filter('truncate', function() {
    return function(text, length, end) {
        if (text !== undefined && text !== "") {
            if (isNaN(length))
                length = 10;
            if (end === undefined)
                end = "...";
            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length - end.length) + end;
            }
        } else {
            return "";
        }
    };
});