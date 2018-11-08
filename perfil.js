'use strict';

/*
 * @ngdoc function
 * @name minovateApp.controller:cumpleaniosCtrl
 * @description
 * # cumpleaniosCtrl
 * Controller of the minovateApp
 */

app.controller('perfilCtrl',['$scope','uhttp','$timeout','$rootScope','$cookies','$stateParams','toastr','toastrConfig','$filter','uiCalendarConfig','$uibModal','$location','$state',
    function(scope,uhttp,$timeout,$rootScope,$cookies,$stateParams,toastr,toastrConfig,$filter,uiCalendarConfig,$uibModal,$location,$state){

        scope.usuario = $cookies.getObject('INTRANET_Usuario');
        scope.pop = { opened : false }
        
        scope.perfil = {};
        scope.perfil.informacion = {};
        scope.perfil.social = {};
        scope.perfil.seguridad = {};
        scope.perfil.habilidades = [];
        scope.perfil.habilidades_tags = [];
        scope.perfil.equipo_trabajo = [];
        
        scope.edicion = true;
        if($stateParams.id != scope.usuario.id_usuario){
            scope.edicion = false;
        }

        scope.LstdPais = [];
        scope.LstdEstados = [];
        scope.LstdMunicipios = [];
        scope.LstdUbicacion = [];
        scope.LstdHbld = [];
        scope.LstdTipoSngr = [];

        scope.LstdArea = [];
        scope.LstdPsto = [];
        scope.buscar_nombre = '';

        scope.dsblEstd = true;
        scope.dsblCdad = true;

        /* CONFIGURACIÓN DATEPICKER */

        scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            'class': 'datepicker'
        };

        scope.formats = ['dd/MM/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        scope.format = scope.formats[1];


        /* INICIALIZACION DEL MODULO */
        inicializa();


        function inicializa(){
            get_paises();
            get_ubicacion();
            get_tipo_sangre();
            get_catalogo_habilidades();

            $timeout(function() {
                obtener_informacion($stateParams.id);
                obtener_informacion_perfil($stateParams.id);
                obtener_habilidades($stateParams.id);
            }, 3000);
        }

        function get_paises(){
            uhttp({
                method: 'POST',
                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_GetPaises&uhttp=true',
                onSuccess: function(response){
                    if(response.status == 'ok'){
                        scope.LstdPais = response.data;
                    }
                }
            });
        }

        function get_ubicacion(){
            uhttp({
                method: 'POST',
                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_GetUbicacion&uhttp=true',
                onSuccess: function(response){
                    if(response.status == 'ok'){
                        scope.LstdUbicacion = response.data;
                    }
                }
            });
        }

        function get_estado(est){
            uhttp({
                method: 'POST',
                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_GetEstados&uhttp=true',
                onSuccess: function(response){  
                    if(response.status == 'ok'){
                        scope.LstdEstados = response.data;

                        var contador = 1;

                        /* Estado */
                        var estado = 0;
                        angular.forEach(scope.LstdEstados, function(value,key){
                            if(value.id == est){
                                estado = contador;
                                return estado;
                            }else{
                                contador += 1;
                            }
                        });

                        scope.perfil.informacion.estado = scope.LstdEstados['ELEMENTO'+estado];

                        scope.dsblEstd = false;
                    }
                }
            });
        }

        function get_ciudad(estd, city){
            uhttp({
                method: 'POST',
                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_GetMunicipios',
                data: utilNumbers.objectToQs({
                    estd : estd,
                    uhttp: true
                }),
                onSuccess: function(response){
                    if(response.status == 'ok'){
                        scope.LstdMunicipios = response.data;

                        var contador = 1;

                        /* Ciudad */
                        var ciudad = 0;
                        angular.forEach(scope.LstdMunicipios, function(value,key){
                            if(value.id == city){
                                ciudad = contador;
                                return ciudad;
                            }else{
                                contador += 1;
                            }
                        });

                        scope.perfil.informacion.ciudad = scope.LstdMunicipios['ELEMENTO'+ciudad];

                        scope.dsblCdad = false;
                    }
                }
            });
        }

        scope.get_estados = function(id_pais){
            
            if(id_pais == '126'){
                uhttp({
                    method: 'POST',
                    url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_GetEstados&uhttp=true',
                    onSuccess: function(response){  
                        if(response.status == 'ok'){
                            scope.LstdEstados = response.data;
                            scope.dsblEstd = false;
                        }
                    }
                });
            }else{
                scope.dsblEstd = true;
                scope.dsblCdad = true;
                $('.ip-cdad').removeClass('error-validate');
                $('.ip-edo').removeClass('error-validate');
                scope.perfil.informacion.estado.id = 0;
                scope.perfil.informacion.ciudad.id = 0;
            }
        }

        scope.get_ciudades = function(estd){
            uhttp({
                method: 'POST',
                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_GetMunicipios',
                data: utilNumbers.objectToQs({
                    estd : estd,
                    uhttp: true
                }),
                onSuccess: function(response){
                    if(response.status == 'ok'){
                        scope.LstdMunicipios = response.data;
                        scope.dsblCdad = false;
                    }
                }
            });
        }

        scope.load_src = function(query){
            var result = $filter('filter')(scope.LstdHbld, {text: query});
            return result;
        }

        function get_catalogo_habilidades(){
            uhttp({
                method: 'POST',
                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_GetHabilidades&uhttp=true',
                onSuccess: function(response){
                    if(response.status == 'ok'){
                        angular.forEach(response.data, function(value){
                            var txt = {};
                            txt.text = value.descripcion;
                            scope.LstdHbld.push(txt);
                        });
                    }
                }
            });
        }

        function get_tipo_sangre(){
            uhttp({
                method: 'POST',
                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_GetTipoSangre&uhttp=true',
                onSuccess: function(response){
                    if(response.status == 'ok'){
                        scope.LstdTipoSngr = response.data;
                    }
                }
            });
        }


        function obtener_informacion(id){
            scope.perfil.informacion.fecha_ingreso = {};

            uhttp({
                method: 'POST',
                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_Perfil',
                data: utilNumbers.objectToQs({
                    op: 1,
                    // us: scope.usuario.id_usuario,
                    us: id,
                    uhttp: true
                }),
                onSuccess: function(response){
                    if(response.status == 'ok'){
                        var fecha_ingreso = response.data['ELEMENTO1'].fecha_alta.split('/');

                        scope.perfil.informacion.nombre = response.data['ELEMENTO1'].nombre;
                        scope.perfil.informacion.apellido_paterno = response.data['ELEMENTO1'].apellido_paterno;
                        scope.perfil.informacion.apellido_materno = response.data['ELEMENTO1'].apellido_materno;
                        scope.perfil.informacion.puesto = response.data['ELEMENTO1'].puesto;
                        scope.perfil.informacion.departamento = response.data['ELEMENTO1'].departamento;

                        scope.perfil.informacion.fecha_ingreso.dia = fecha_ingreso[0];
                        scope.perfil.informacion.fecha_ingreso.mes_abrv = f_mes_abrv_letra(parseInt(fecha_ingreso[1]));
                        scope.perfil.informacion.fecha_ingreso.anio_abrv = fecha_ingreso[2].substring(2);

                        scope.perfil.accion = response.data['ELEMENTO1'].tb_perfil;
                    }
                }
            });
        }

        function obtener_informacion_perfil(id){
            uhttp({
                method: 'POST',
                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_Perfil',
                data: utilNumbers.objectToQs({
                    op: 0,
                    // us: scope.usuario.id_usuario,
                    us: id,
                    uhttp: true
                }),
                onSuccess: function(response){
                    
                    if(response.status == 'ok'){
                        
                        if(response.data['ELEMENTO1'].id_pais == '126'){
                            get_ciudad(response.data['ELEMENTO1'].id_estado, response.data['ELEMENTO1'].id_ciudad);
                            get_estado(response.data['ELEMENTO1'].id_estado);
                        }

                        scope.perfil.informacion.id_perfil = response.data['ELEMENTO1'].id_perfil;
                        scope.perfil.informacion.id_usuario = response.data['ELEMENTO1'].id_usuario;

                        var fn = response.data['ELEMENTO1'].fecha_nacimiento.split('-');
                        scope.perfil.informacion.fecha_nacimiento = new Date(fn[0], fn[1]-1,fn[2]);

                        scope.perfil.informacion.fchNac = {};
                        scope.perfil.informacion.fchNac.dia = fn[2];
                        scope.perfil.informacion.fchNac.mes_abrv = f_mes_abrv_letra(parseInt(fn[1]));
                        scope.perfil.informacion.fchNac.anio_abrv = fn[0].substring(2);

                        scope.perfil.informacion.direccion = response.data['ELEMENTO1'].direccion;
                        scope.perfil.informacion.id_ciudad = response.data['ELEMENTO1'].id_ciudad;
                        scope.perfil.informacion.id_estado = response.data['ELEMENTO1'].id_estado;
                        scope.perfil.informacion.id_pais = response.data['ELEMENTO1'].id_pais;
                        scope.perfil.informacion.codigo_postal = response.data['ELEMENTO1'].codigo_postal;
                        scope.perfil.informacion.correo = response.data['ELEMENTO1'].correo;
                        scope.perfil.informacion.celular = response.data['ELEMENTO1'].celular;
                        scope.perfil.informacion.extension = response.data['ELEMENTO1'].extension;
                        scope.perfil.informacion.marcacion_corta = response.data['ELEMENTO1'].marcacion_corta;

                        scope.perfil.informacion.acerca_de_mi = decodeURIComponent(escape(response.data['ELEMENTO1'].acerca_de_mi));
                        scope.perfil.informacion.educacion = decodeURIComponent(escape(response.data['ELEMENTO1'].estudios));
                        scope.perfil.informacion.ubicacion = response.data['ELEMENTO1'].ubicacion;
                        scope.perfil.informacion.ubicacion_descripcion = response.data['ELEMENTO1'].ubicacion_descripcion;
                        scope.perfil.informacion.tipo_sangre = response.data['ELEMENTO1'].tipo_sangre;
                        scope.perfil.informacion.tipo_sangre_descripcion = response.data['ELEMENTO1'].tipo_sangre_descripcion;
                        scope.perfil.informacion.sitio_web = response.data['ELEMENTO1'].sitio_web;

                        scope.perfil.social.twitter = response.data['ELEMENTO1'].twitter;
                        scope.perfil.social.facebook = response.data['ELEMENTO1'].facebook;
                        scope.perfil.social.google_plus = response.data['ELEMENTO1'].google;
                        scope.perfil.social.linkedin = response.data['ELEMENTO1'].linkedin;
                        scope.perfil.social.pinterest = response.data['ELEMENTO1'].pinterest;
                        scope.perfil.social.snapchat = response.data['ELEMENTO1'].snapchat;

                        scope.perfil.informacion.dias_vacaciones = '3';

                        var contador = 1;

                        /* Pais */
                        var pais = 0;
                        angular.forEach(scope.LstdPais, function(value,key){
                            if(value.id == response.data['ELEMENTO1'].id_pais){
                                pais = contador;
                                return pais;
                            }else{
                                contador += 1;
                            }
                        });

                        scope.perfil.informacion.pais = scope.LstdPais['ELEMENTO'+pais];

                        contador = 1;

                        /* ubicación */
                        var ubcc = 0;
                        angular.forEach(scope.LstdUbicacion, function(value,key){
                            if(value.id == response.data['ELEMENTO1'].ubicacion){
                                ubcc = contador;
                                return ubcc;
                            }else{
                                contador += 1;
                            }
                        });

                        scope.perfil.informacion.ubicacion = scope.LstdUbicacion['ELEMENTO'+ubcc];

                        contador = 1;

                        /* tipo de sangre */
                        var tpsngr = 0;
                        angular.forEach(scope.LstdTipoSngr, function(value,key){
                            if(value.id == response.data['ELEMENTO1'].tipo_sangre){
                                tpsngr = contador;
                                return tpsngr;
                            }else{
                                contador += 1;
                            }
                        });

                        scope.perfil.informacion.tipo_sangre = scope.LstdTipoSngr['ELEMENTO'+tpsngr];


                        if(scope.perfil.informacion.id_perfil != undefined){ obtener_equipo_trabajo(scope.perfil.informacion.id_perfil); }

                    }
                },
                onError: function(){
                    scope.perfil.social.twitter = ' ';
                    scope.perfil.social.facebook = ' ';
                    scope.perfil.social.google_plus = ' ';
                    scope.perfil.social.linkedin = ' ';
                    scope.perfil.social.pinterest = ' ';
                    scope.perfil.social.snapchat = ' ';
                }
            });
        }

        function obtener_equipo_trabajo(id){
            scope.perfil.equipo_trabajo = [];

            uhttp({
                method: 'POST',
                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_Equipo_Trabajo',
                data: util.objectToQs({
                    prfl : scope.perfil.informacion.id_perfil,
                    uhttp: true,
                    array: true
                }),
                onSuccess: function(response){
                    if(response.status == 'ok'){
                        scope.perfil.equipo_trabajo = response.data;
                    }
                }
            });
        }

        function obtener_habilidades(id){
            scope.perfil.habilidades = [];
            scope.perfil.habilidades_tags = [];

            uhttp({
                method: 'POST',
                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_Habilidades',
                data: utilNumbers.objectToQs({
                    // us : scope.usuario.id_usuario,
                    us: id,
                    uhttp: true,
                }),
                onSuccess: function(response){
                    if(response.status == 'ok'){
                        scope.perfil.habilidades = response.data;

                        angular.forEach(response.data, function(value){
                            var txt = {};
                            txt.text = value.descripcion;
                            scope.perfil.habilidades_tags.push(txt);
                        });
                    }                    
                },
                onError: function(){ scope.perfil.habilidades = []; }
            });
        }



        /* ************* ACTUALIZAR INFORMACION PERSONAL ******************** */

        scope.updt_info = function(validForm){

            if(!validForm) {
                var toast = toastr['error']('<center><h4>No está permitido adicionar Habilidades.</h4></center>', '<center><h4><strong>ERROR</strong></h4></center>', {
                    iconClass: 'toast-error bg-error'
                });
                openedToasts.push(toast);
                return;
            }
            
            if(valida_info()){
                var pais, estado, ciudad, ubicacion, sangre;

                if(scope.perfil.informacion.pais != undefined){ pais = scope.perfil.informacion.pais.id; }
                if(scope.perfil.informacion.estado != undefined){ estado = scope.perfil.informacion.estado.id; }
                if(scope.perfil.informacion.ciudad != undefined){ ciudad = scope.perfil.informacion.ciudad.id; }
                if(scope.perfil.informacion.ubicacion != undefined){ ubicacion = scope.perfil.informacion.ubicacion.id; }
                if(scope.perfil.informacion.tipo_sangre != undefined){ sangre = scope.perfil.informacion.tipo_sangre.id; }

                var fecha = $filter('date')(scope.perfil.informacion.fecha_nacimiento, 'yyyy-MM-dd');  

                uhttp({
                    method: 'POST',
                    url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_UPSERT_infoGral',
                    data: utilNumbers.objectToQs({
                        op   : scope.perfil.accion,
                        drcn : scope.perfil.informacion.direccion,
                        pais : pais,
                        edo  : estado,
                        cudd : ciudad,
                        crro : scope.perfil.informacion.correo,
                        cp   : scope.perfil.informacion.codigo_postal,
                        cllr : ConvertAcentos(scope.perfil.informacion.celular),
                        extn : scope.perfil.informacion.extension,
                        mcort: scope.perfil.informacion.marcacion_corta,
                        estd : ConvertAcentos(scope.perfil.informacion.educacion),
                        ubcc : ubicacion,
                        tpsn : sangre,
                        fnac : fecha,
                        acmi : ConvertAcentos(scope.perfil.informacion.acerca_de_mi),
                        us   : scope.usuario.id_usuario,
                        uhttp: true
                    }),
                    onSuccess: function(response){
                        if(response.status == 'ok'){
                            if(scope.perfil.accion == 0){ scope.perfil.informacion.id_perfil = response.data['ELEMENTO1'].computed; }
                            var toast = toastr['success']('<center><h4>La información se guardo correctamente.</h4></center>', '<center><h4><strong>Actualización - Información Personal</strong></h4></center>', {
                                iconClass: 'toast-success bg-success'
                            });
                            openedToasts.push(toast);

                            if(scope.perfil.informacion.id_perfil != undefined){ guarda_habilidades(); }

                            $timeout(function() {
                                obtener_informacion($stateParams.id);
                                obtener_informacion_perfil($stateParams.id);
                                obtener_equipo_trabajo(scope.perfil.informacion.id_perfil);
                                obtener_habilidades($stateParams.id);
                            }, 3000);
                        }
                    },
                    onError: function(){
                        var toast = toastr['error']('<center><h4>Ocurrio un error al guardar la información. Intentalo más tarde.</h4></center>', '<center><h4><strong>Actualización - Información Personal</strong></h4></center>', {
                            iconClass: 'toast-error bg-error'
                        });
                        openedToasts.push(toast);
                    }
                });
            }else{
                var toast = toastr['error']('<center><h4>Ingresa los campos necesarios.</h4></center>', '<center><h4><strong>Información Personal</strong></h4></center>', {
                    iconClass: 'toast-error bg-error'
                });
                openedToasts.push(toast);
            }
        }

        function valida_info(){
            var res = true;

            if(scope.perfil.informacion.fecha_nacimiento == undefined || scope.perfil.informacion.fecha_nacimiento == ''){ $('.ip-fchn').addClass('error-validate'); res = false; }
            if(scope.perfil.informacion.direccion == undefined || scope.perfil.informacion.direccion == ''){ $('.ip-drcc').addClass('error-validate'); res = false; }
            if(scope.perfil.informacion.ciudad == undefined || scope.perfil.informacion.ciudad == ''){ $('.ip-cdad').addClass('error-validate'); res = false; }
            if(scope.perfil.informacion.estado == undefined || scope.perfil.informacion.estado == ''){ $('.ip-edo').addClass('error-validate'); res = false; }
            if(scope.perfil.informacion.pais == undefined || scope.perfil.informacion.pais == ''){ $('.ip-pais').addClass('error-validate'); res = false; }
            if(scope.perfil.informacion.codigo_postal == undefined || scope.perfil.informacion.codigo_postal == ''){ $('.ip-copo').addClass('error-validate'); res = false; }
            if(scope.perfil.informacion.correo == undefined || scope.perfil.informacion.correo == ''){ $('.ip-mail').addClass('error-validate'); res = false; }
            if(scope.perfil.informacion.celular == undefined || scope.perfil.informacion.celular == ''){ $('.ip-cllr').addClass('error-validate'); res = false; }
            if(scope.perfil.informacion.tipo_sangre == undefined || scope.perfil.informacion.tipo_sangre == ''){ $('.ip-tisa').addClass('error-validate'); res = false; }
            if(scope.perfil.informacion.ubicacion == undefined || scope.perfil.informacion.ubicacion == ''){ $('.ip-ubcc').addClass('error-validate'); res = false; }

            return res;
        }

        scope.clr_err = function(index){
            
            switch(index){
                case 1: 
                    $('.ip-fchn').removeClass('error-validate');
                    break;
                case 2: 
                    $('.ip-drcc').removeClass('error-validate');
                    break;
                case 3: 
                    $('.ip-cdad').removeClass('error-validate');
                    break;
                case 4: 
                    $('.ip-edo').removeClass('error-validate');
                    break;
                case 5: 
                    $('.ip-pais').removeClass('error-validate');
                    break;
                case 6: 
                    $('.ip-copo').removeClass('error-validate');
                    break;
                case 7: 
                    $('.ip-mail').removeClass('error-validate');
                    break;
                case 8: 
                    $('.ip-cllr').removeClass('error-validate');
                    break;
                case 9: 
                    $('.ip-tisa').removeClass('error-validate');
                    break;
                case 10: 
                    $('.ip-ubcc').removeClass('error-validate');
                    break;
            }
        }


        /* **************** GUARDA HABILIDADES ******************** */

        function guarda_habilidades(){
            /* Buscamos las habilidades que faltan en la Base de Datos */
            angular.forEach(scope.perfil.habilidades_tags, function(value){
                var coincide;
                angular.forEach(scope.perfil.habilidades, function(v){
                    if(value.text == v.descripcion){ coincide = true; }
                });

                if(!coincide){ upsert_habilidades(1,value.text); }
            });

            /* Buscamos las habilidades que ya no esten en BD */
            angular.forEach(scope.perfil.habilidades, function(value){
                var coincide;
                angular.forEach(scope.perfil.habilidades_tags, function(v){
                    if(value.descripcion == v.text){ coincide = true; }
                });

                if(!coincide){ upsert_habilidades(0,value.descripcion); }
            });
        }

        function upsert_habilidades(option, texto){
            uhttp({
                method: 'POST',
                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_UPSERT_Habilidades',
                data: utilNumbers.objectToQs({
                    op   : option,
                    hab  : ConvertAcentosToAscii(texto),
                    prfl : scope.perfil.informacion.id_perfil,
                    us   : scope.usuario.id_usuario,
                    uhttp: true
                }),
                onSuccess: function(response){
                    if(response.status == 'ok'){
                        scope.error_habilidades = false;
                    }
                },
                onError: function(){
                    scope.error_habilidades = true;
                }
            });
        }


        /* ************* ACTUALIZAR INFORMACION SOCIAL ******************** */

        scope.updt_social = function(){
            if(scope.perfil.accion != '0'){
                uhttp({
                    method: 'POST',
                    url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_UPDT_social',
                    data: utilNumbers.objectToQs({
                        fcbk : scope.perfil.social.facebook,
                        twtr : scope.perfil.social.twitter,
                        gglp : scope.perfil.social.google_plus,
                        lnkd : scope.perfil.social.linkedin,
                        pntr : scope.perfil.social.pinterest,
                        snpc : scope.perfil.social.snapchat,
                        sweb : scope.perfil.informacion.sitio_web,
                        us   : scope.usuario.id_usuario,
                        uhttp: true
                    }),
                    onSuccess: function(response){
                        if(response.status == 'ok'){
                            var toast = toastr['success']('<center><h4>La información se guardo correctamente</h4></center>', '<center><h4><strong>Actualización - Configuración Social</strong></h4></center>', {
                                iconClass: 'toast-success bg-success'
                            });
                            openedToasts.push(toast);

                            obtener_informacion($stateParams.id);
                        }
                    },
                    onError: function(){
                        var toast = toastr['error']('<center><h4>Ocurrio un error al guardar la información. Intentalo más tarde.</h4></center>', '<center><h4><strong>Actualización - Configuración Social</strong></h4></center>', {
                            iconClass: 'toast-error bg-error'
                        });
                        openedToasts.push(toast);
                    }
                });
            }else{
                var toast = toastr['error']('<center><h4>Primero debe ingresar la Información Personal.</h4></center>', '<center><h4><strong>Configuración Social</strong></h4></center>', {
                    iconClass: 'toast-error bg-error'
                });
                openedToasts.push(toast);
            }
        }


        /* ************* ACTUALIZAR INFORMACION SEGURIDAD ******************** */

        scope.updt_seguridad = function(){
            if(scope.perfil.informacion.id_perfil != undefined){
                /* Si escribieron algo en el campo de nuevo password */
                if(scope.perfil.seguridad.nuevo_password != '' && scope.perfil.seguridad.nuevo_password != undefined){
                    /* la contraseña tiene mas de 8 caracteres */
                    if(scope.perfil.seguridad.nuevo_password.length >= 8){
                        /* comprueba nueva contraseña y confirmacion de contraseña */
                        if(scope.perfil.seguridad.nuevo_password === scope.perfil.seguridad.confirma_password){
                            /* todo es correcto - actualiza la contraseña, guarda info visibilidad y notificaciones */
//                            uhttp({
//                                method: 'POST',
//                                url: '/phpcode/Encriptacion.php?ps=' + scope.perfil.seguridad.nuevo_password,
//                                onSuccess: function(response){
                                    // scope.encripta_pass = response.data;
                                    guarda_seguridad();
//                                }
//                            });
                        }else{
                            /* las contraseñas no coinciden */
                            var toast = toastr['error']('<center><h4>Las contraseñas no coinciden.</h4></center>', '<center><h4><strong>Configuración de Privacidad</strong></h4></center>', {
                                iconClass: 'toast-error bg-error'
                            });
                            openedToasts.push(toast);
                        }
                    }else{
                        /* la contraseña tiene menos de 8 caracteres */
                        var toast = toastr['error']('<center><h4>La longitud minima de la contraseña es de 8 caracteres.</h4></center>', '<center><h4><strong>Configuración de Privacidad</strong></h4></center>', {
                            iconClass: 'toast-error bg-error'
                        });
                        openedToasts.push(toast);
                    }
                }else{
                    /* el campo nuevo password esta vacio - guarda info visibilidad y notificaciones */
                    // console.log('id perfil: ',scope.perfil.informacion.id_perfil);
                    var toast = toastr['success']('<center><h4>Notificaciones y Visibilidad del Perfil actualizadas correctamente.</h4></center>', '<center><h4><strong>Actualización - Configuración de Privacidad</strong></h4></center>', {
                        iconClass: 'toast-success bg-success'
                    });
                    openedToasts.push(toast);
                }
            }else{
                var toast = toastr['error']('<center><h4>Primero debe ingresar la Información Personal.</h4></center>', '<center><h4><strong>Configuración de Privacidad</strong></h4></center>', {
                    iconClass: 'toast-error bg-error'
                });
                openedToasts.push(toast);
            }
        }

//        function guarda_seguridad(pass_crypt){
//            uhttp({
//                method: 'POST',
//                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_UPSERT_Privacidad',
//                data: util.objectToQs({
//                    usr  : scope.usuario.usuario,
//                    pass : pass_crypt,
//                    prfl : scope.perfil.informacion.id_perfil,
//                    uscr : scope.usuario.id_usuario,
//                    uhttp: true
//                }),
//                onSuccess: function(response){
//                    if(response.status == 'ok'){
//                        scope.perfil.seguridad.nuevo_password = undefined;
//                        scope.perfil.seguridad.confirma_password = undefined;
//                        // var toast = toastr['success']('<center><h4>Contraseña actualizada correctamente.</h4></center>', '<center><h4><strong>Actualización - Configuración de Privacidad</strong></h4></center>', {
//                        //     // iconClass: 'toast-success bg-success'
//                        // });
//
//                        // $timeout(function() {
//                        confirmacion('Tienes que volver a iniciar tu sesion con la nueva contraseña.','logout');
//                        // }, 2000);
//                    }
//                }
//            });
//        }

        /*
     * Modified by ailopez on 29/06/17.
     * Function para actualizar o crear los datos de acceso a la Intranet
     * @method guarda_seguridad
     */
    function guarda_seguridad() {
            var data = {usr: scope.usuario.usuario, pass: scope.perfil.seguridad.nuevo_password, prfl: scope.perfil.informacion.id_perfil, idUsuario: scope.usuario.id_usuario};
            uhttp({
                method: 'POST',
                url: '/phpcode/ActualizaAcceso.php',
                data: util.objectToQs(data),
                onSuccess: function (response) {
                    if (response.status == 'ok') {
                        scope.perfil.seguridad.nuevo_password = scope.perfil.seguridad.confirma_password = '';
                        notification("success", response.msg, "Éxito", "greensea", toastr);
                        $timeout(function () {
                            confirmacion('Tienes que volver a iniciar tu sesion con la nueva contraseña.', 'logout');
                        }, 500);
                        confirmacion('Tienes que volver a iniciar tu sesion con la nueva contraseña.', 'logout');
                    } else {
                        notification("error", response.status, "Error", "bg-danger", toastr);
                    }
                }
            });
        }
    /* ************* GUARDAR INFORMACION SEGURIDAD ******************** */


        /* ******************* EQUIPO DE TRABAJO ******************* */

        scope.edit_eqTrabajo = function(){
            open_modal('vistas/EquipoTrabajo.html','lg');
        }


        function logout(){
            $cookies.remove('INTRANET_Usuario');
            $location.url('/login');
        }


        /* Funciones Angular (scope) */

        scope.open = function($event){
            $event.preventDefault();
            $event.stopPropagation();
            
            scope.pop.opened = true;            
        };
        
        scope.elimina_integrante = function(id){
            // console.log(id)
            uhttp({
                method: 'POST',
                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_UPSERT_EquipoTrabajo',
                data: util.objectToQs({
                    prfl : scope.perfil.informacion.id_perfil,
                    empl : id,
                    op   : 0,
                    usr  : scope.usuario.id_usuario,
                    uhttp: true,
                    array: true
                }),
                onSuccess: function(response){
                    console.log('del eq tr', response);
                    if(response.status == 'ok'){
                        if(response.data[0].computed == 'empleado no registrado'){
                            var toast = toastr['error']('<center><h4>Usuario no registrado en la Intranet</h4></center>', '<center><h4><strong>Equipo de Trabajo</strong></h4></center>', {
                                iconClass: 'toast-error bg-error'
                            });
                            openedToasts.push(toast);
                        }else{
                            obtener_equipo_trabajo(scope.perfil.informacion.id_perfil);
                        }
                    }
                }
            });
        }
        
        scope.consulta_integrante = function(id_us){
            // console.log(id)
            $state.go('app.perfil', { id : id_us });
        }

        scope.dtllSocl = function(url){
            window.open(url, '_blank');
        }



        /* Ventanas modales */
        function open_modal(template,size){
            scope.modal = $uibModal.open({
                templateUrl: template + '?Rnd=' + Math.random(),
                size: size,
                backdrop: 'static',
                controller: 'eqpoTrbj',
                backdropClass: 'splash splash-ef-12',
                windowClass: 'splash splash-ef-12 col-md-12 row',
                scope: scope
            });
        }

        scope.cerrar = function(){ scope.modal.dismiss('cancel'); obtener_equipo_trabajo(scope.perfil.informacion.id_perfil); }

        /* Ventana de Confirmacion */
        function confirmacion(mensaje,toDo){
            scope.mensaje = mensaje;
            scope.toDo = toDo;
            scope.modalConfirmacion = $uibModal.open({
                templateUrl: 'vistas/Confirmacion.html?Rnd=' + Math.random(),
                size: 'md',
                backdrop: 'static',
                backdropClass: 'splash splash-ef-12',
                windowClass: 'splash splash-ef-12 col-md-12 row',
                scope: scope
            });
        }

        scope.cierra_confirmacion = function (){ scope.modalConfirmacion.dismiss('cancel'); }

        scope.aceptar = function(){ eval(scope.toDo+'()'); }

        /* Convertir acentos en ascii */
        function ConvertAcentos(texto){          
            var cnvrTxt = String(texto);
            cnvrTxt = cnvrTxt.replace(/á/g, '\u00E1');
            cnvrTxt = cnvrTxt.replace(/é/g, '\u00E9');
            cnvrTxt = cnvrTxt.replace(/í/g, '\u00ED');
            cnvrTxt = cnvrTxt.replace(/ó/g, '\u00F3');
            cnvrTxt = cnvrTxt.replace(/ú/g, '\u00FA');
            // Mayusculas
            cnvrTxt = cnvrTxt.replace(/Á/g, '\u00C1');
            cnvrTxt = cnvrTxt.replace(/É/g, '\u00C9');
            cnvrTxt = cnvrTxt.replace(/Í/g, '\u00CD');
            cnvrTxt = cnvrTxt.replace(/Ó/g, '\u00D3');
            cnvrTxt = cnvrTxt.replace(/Ú/g, '\u00DA');
            return cnvrTxt;
        }

    }
]);



app.controller('eqpoTrbj', ['$scope','uhttp','toastr','toastrConfig',
    function(scope,uhttp,toastr,toastrConfig){

        inicializa();

        function inicializa(){
            obtener_area();
            obtener_puestos();
        }

        function obtener_area(){
          uhttp({
            method: 'POST',
            url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_GetArea&uhttp=true',
            onSuccess: function(response){
              
              if(response.status == 'ok'){

                angular.forEach(response.data, function (v,k){
                  var vaOpt = {};
                  vaOpt = {
                    id : v.ID,
                    descripcion : v.DESCRIPCION
                  }
                  scope.LstdArea.push(vaOpt);
                });
              }
              
            }
          });
        }

        function obtener_puestos(){
          uhttp({
            method: 'POST',
            url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_GetPuesto&uhttp=true',
            onSuccess: function(response){
              
              if(response.status == 'ok'){

                angular.forEach(response.data, function (v,k){
                  var vaOpt = {};
                  vaOpt = {
                    id : v.ID,
                    descripcion : v.DESCRIPCION
                  }
                  scope.LstdPsto.push(vaOpt);
                });
              }

            }
          });
        }

        /* BUSCAR EMPLEADOS */
        scope.buscar = function(){

            scope.LstdEqTrbj = [];
            var nombre;
            
            if(scope.buscar_nombre != undefined){ nombre = ConvertAcentosToAscii(scope.buscar_nombre); }else{ nombre = ''; }
            
            if(nombre == ''){ 
                var toast = toastr['error']('<center><h4>Ingrese el texto de su busqueda</h4></center>', '<center><h4><strong>Busqueda Equipo de Trabajo</strong></h4></center>', {
                    iconClass: 'toast-error bg-error'
                });
                openedToasts.push(toast);
            }
            else if(nombre == '@'){
                var toast = toastr['error']('<center><h4>Ingrese una cuenta de correo electrónico válida.</h4></center>', '<center><h4><strong>Busqueda Equipo de Trabajo</strong></h4></center>', {
                    iconClass: 'toast-error bg-error'
                });
                openedToasts.push(toast);
            }else{
                
                uhttp({
                  method: 'POST',
                  url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_BsqdEqpoTrbj',
                  data: util.objectToQs({
                    nmbr : nombre,
                    prfl : scope.perfil.informacion.id_perfil,
                    id_us : scope.usuario.id_usuario,
                    uhttp: true,
                    array: true
                  }),
                  onSuccess: function(response){
                    console.log(response);
                    if(response.status == 'ok'){
                      scope.LstdEqTrbj = response.data;
                    }
                    
                  }
                });
            }

        }


        /* AGREGAR A EQUIPO DE TRABAJO */
        scope.agrg_eqtrbj = function(id){
            // console.log('add id:',id);
            uhttp({
                method: 'POST',
                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_UPSERT_EquipoTrabajo',
                data: util.objectToQs({
                    prfl : scope.perfil.informacion.id_perfil,
                    empl : id,
                    op   : 1,
                    usr  : scope.usuario.id_usuario,
                    uhttp: true,
                    array: true
                }),
                onSuccess: function(response){
                    console.log('add eq tr', response);
                    if(response.status == 'ok'){
                        if(response.data[0].computed == 'empleado no registrado'){
                            var toast = toastr['error']('<center><h4>Usuario no registrado en la Intranet</h4></center>', '<center><h4><strong>Equipo de Trabajo</strong></h4></center>', {
                                iconClass: 'toast-error bg-error'
                            });
                            openedToasts.push(toast);
                        }else{
                            scope.buscar();
                        }
                    }
                }
            });
        }

        /* QUITAR DE EQUIPO DE TRABAJO */
        scope.qutr_eqtrbj = function(id){
            // console.log('quit id:',id);
            uhttp({
                method: 'POST',
                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_UPSERT_EquipoTrabajo',
                data: util.objectToQs({
                    prfl : scope.perfil.informacion.id_perfil,
                    empl : id,
                    op   : 0,
                    usr  : scope.usuario.id_usuario,
                    uhttp: true,
                    array: true
                }),
                onSuccess: function(response){
                    if(response.status == 'ok'){
                        if(response.data[0].computed == 'empleado no registrado'){
                            var toast = toastr['error']('<center><h4>Usuario no registrado en la Intranet</h4></center>', '<center><h4><strong>Equipo de Trabajo</strong></h4></center>', {
                                iconClass: 'toast-error bg-error'
                            });
                            openedToasts.push(toast);
                        }else{
                            scope.buscar();
                        }
                    }
                }
            });
        }


    }
]);


