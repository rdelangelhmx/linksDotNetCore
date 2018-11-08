'use strict';

/*
 * @ngdoc function
 * @name minovateApp.controller:cumpleaniosCtrl
 * @description
 * # cumpleaniosCtrl
 * Controller of the minovateApp
 */

app.controller('cumpleaniosCtrl',['$scope','uhttp','$timeout',
    function(scope,uhttp,$timeout){
        var intentos = 0;
        scope.hoy = new Date();
        
        trae_cumpleanieros();
        
        trae_datos();
        
        function trae_datos(){
            $.ajax({
                method: 'GET',
                type:'json',
                url: '/phpcode/LeerJSON.php?json=clima',
                success: function(response){
                    if(response.query.count == 0){
                        if(intentos < 5){
                            $timeout(function() {
                                trae_datos();
                            },1000);
                        }
                        intentos = intentos + 1;
                    }else if(response.query.count == 1){
                        scope.muestraClima = true
                        scope.climaAlMomento = response.query.results.channel.item.condition
                        scope.climaAlMomento.icono = revisa_icono(scope.climaAlMomento.code)
                        scope.clima = response.query.results.channel.item.forecast;
                        ordena_iconos();
                    }
                },error: function(){
                    if(intentos < 5){
                        $timeout(function() {
                            trae_datos();
                        },1000);
                    }
                    intentos = intentos + 1;
                }
            });
        }
        
        function ordena_iconos(){
            angular.forEach(scope.clima,function(item){
                item.date = new Date(item.date);
                item.icono = revisa_icono(item.code)
            })
        }
        
        function trae_cumpleanieros(){
            var temp = [];
            uhttp({
                method: 'POST',
                url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_Cumpleanios&uhttp=true&array=true&mes='+new Date().getMonth(),
                onSuccess: function(response){
                    if(response.status == 'ok'){
                        scope.cumpleanieros = response.data;
                        pinta_cumpleanios();
                    }
                }
            });
        }
        
        function pinta_cumpleanios(){
            var total = 0;
            var html = "";
            
            html += '<div class="row" >';
            
            for(var i = 0; i < scope.cumpleanieros.length; i++){
                if(parseInt(scope.cumpleanieros[i].Dia) == new Date().getDate()){

                    if (total %2 == 0) {
                    html += '<div class="col-md-12 p-allCumple" >';
                    } else {
                    html += '<div class="col-md-12 p-allCumple" >';
                    }
                    html +=     '<div class="col-md-2">';
                    // html +=         '<span><img src="http://selecciones.femexfut.org.mx/webservices/fotopersonal_clave.aspx?id='+scope.cumpleanieros[i].CLAV_DEM+'" class="img-circle size-50x50"></span>';
                    html +=         '<span><img ng-error="images/SINFOTO_PERSONAL.png" src="images/FotosPersonalIntranet/'+scope.cumpleanieros[i].CLAV_DEM+'.jpg" class="img-circle size-50x50"></span>';
                    html +=     '</div>';
                    html +=     '<div class="col-md-7">';
                    html +=         '<div class="col-md-12">';
                    html +=             '<h5><strong style="color: #9C9C9C;">'+scope.cumpleanieros[i].Nombre+'</strong></h5>';
                    html +=         '</div>';
                    html +=         '<div class="col-md-12">';
                    html +=             '<h6 style="color: #9C9C9C;">'+scope.cumpleanieros[i].Puesto+'</h6>';
                    html +=         '</div>';
                    html +=     '</div>';
                    html +=     '<div class="col-md-3" style="padding-left:0px; padding-right:0px;">';

                    // <a class="icon icon-blue transparent icon-ef-1 icon-ef-1a"><i class="fa fa-map-marker"></i></a>


                    if(scope.cumpleanieros[i].Email != '' && scope.cumpleanieros[i].Email != ' '){
                        html +=         '<div class="col-md-12" style="padding-right:0px; margin-bottom:20px;" >';
                        html +=             '<span><a class="text-black icon icon-danger icon-ef-1 icon-ef-1a" href="mailto:'+scope.cumpleanieros[i].Email+'?Subject=¡Felicidades!" target="_blank"><i class="fa fa-birthday-cake text-white" ></i>&nbsp;&nbsp;</a></span>';
                        html +=         '</div>';
                        // html +=         '<div class="col-md-12" style="padding-right:0px;">';
                        // html +=             '<span style="font-size: 10px; color: #9C9C9C;"><strong>Enviar Felicitacion</strong></span>';
                        // html +=         '</div>';
                        // html +=         '<span><a class="c_black" href="mailto:'+scope.cumpleanieros[i].Email+'?Subject=¡Felicidades!"><i class="fa fa-birthday-cake c_black" ></i>&nbsp;&nbsp;<br/><span style="font-size: 10px; color: #9C9C9C;"><strong>Enviar Felicitacion</strong></span></span>';
                    }
                    html +=     '</div>';
                    html += '</div>';

                    if (total %2 == 0) {
                    html += '<div class="col-md-12 b-bottom" style="padding-bottom: -2px;">';
                    html += '</div>';
                    } else {
                    html += '<div class="col-md-12 b-bottom" style="padding-bottom: -2px;">';
                    html += '</div>';
                    }
                    total++;
                }
            }
            
            html += '</div>';
            if(total > 0){
                $('#cumpleanieros').html(html)
            }else{
                $('#cumpleanieros').html('<center><h3>Sin Información</h3></center>');
            }
            
        }
        
        function revisa_icono(icono){
            var text = "";
            switch (parseInt(icono)){
                case 0:
                    text = 'wi-tornado';
                break;
                case 1: case 2:
                    text = 'wi-hurricane';
                break;
                case 3: case 4: case 37: case 38: case 39: case 45:
                    text = 'wi-thunderstorm';
                break;
                case 5: case 6:
                    text = 'wi-rain-mix';
                break;
                case 7: case 8: case 14: case 16: case 41: case 42: case 43: case 46:
                    text = 'wi-snow';
                break;
                case 9: case 10: case 11: case 12: case 40: case 47:
                    text = 'wi-showers';
                break;
                case 13:
                    text = 'wi-snowflake-cold';
                break;
                case 13: case 17: case 18: case 35:
                    text = 'wi-sleet';
                break;
                case 19: case 21:
                    text = 'wi-dust';
                break;
                case 20:
                    text = 'wi-fog';
                break;
                case 22:
                    text = 'wi-smoke';
                break;
                case 23: case 24:
                    text = 'wi-windy';
                break;
                case 25: case 26:
                    text = 'wi-cloudy';
                break;
                case 27:
                    text = 'wi-night-cloudy-high';
                break;
                case 28:
                    text = 'wi-day-cloudy-high';
                break;
                case 29:
                    text = 'wi-night-partly-cloudy';
                break;
                case 30:
                    text = 'wi-day-cloudy';
                break;
                case 31: case 33:
                    text = 'wi-night-clear';
                break;
                case 32: case 34:
                    text = 'wi-day-sunny';
                break;
                case 36:
                    text = 'wi-hot';
                break;
                case 44:
                    text = 'wi-hot';
                break;
            }
            return text;
        }
    }
])





// function pinta_cumpleanios(){
//             var total = 0;
//             var html = "";
//             html += '<div class="owl-carousel owl-theme" >';
//             for(var i = 0; i < scope.cumpleanieros.length; i++){
//                 if(parseInt(scope.cumpleanieros[i].Dia) == new Date().getDate()){
//                     html +=     '<div class="item bg-greensea-white">';
//                     html +=         '<div class="col-md-12 row">';
//                     html +=             '<div class="col-lg-2 col-md-2">';
//                     html +=                 '<img src="http://selecciones.femexfut.org.mx/webservices/fotopersonal_clave.aspx?id='+scope.cumpleanieros[i].CLAV_DEM+'" class="img-circle size-50x50">';
//                     html +=             '</div>';
//                     html +=             '<div class="col-lg-7 col-md-8 bg-greensea-white">';
//                     html +=                 '<h5><strong>'+scope.cumpleanieros[i].Nombre+'</strong></h5>';
//                     html +=                 '<h6>'+scope.cumpleanieros[i].Puesto+'</h6>';
//                     html +=             '</div>';
//                     html +=             '<div class="col-lg-3 col-md-2 text-center bg-greensea-white" style="padding-top:3px;">';
//                     if(scope.cumpleanieros[i].Email != '' && scope.cumpleanieros[i].Email != ' '){
//                         html +=                 '<span><a class="c_black" href="mailto:'+scope.cumpleanieros[i].Email+'?Subject=¡Felicidades!"><i class="fa fa-birthday-cake c_black" ></i>&nbsp;&nbsp;<br/>Felicitame</span>';
//                     }
//                     html +=             '</div>';
//                     html +=         '</div>';
//                     html +=     '</div>';
//                     total++;
//                 }
//             }

//             html += '</div>';
//             if(total > 0){
//                 $('#cumpleanieros').html(html)
//             }else{
//                 $('#cumpleanieros').html('<center><h3>Sin Información</h3></center>');
//             }
            
//             $timeout(function() {
//                 $('.owl-carousel').owlCarousel({
//                     loop:true,
//                     margin:1,
//                     dots:false,
//                     dotsEach:false,
//                     nav:false,
//                     items:1
//                 });
//             }, 500);
//         }


       // html +=     '<div class="item bg-greensea-white">';
                    // html +=         '<div class="col-md-12 row">';
                    // html +=             '<div class="col-lg-2 col-md-2">';
                    // html +=                 '<img src="http://selecciones.femexfut.org.mx/webservices/fotopersonal_clave.aspx?id='+scope.cumpleanieros[i].CLAV_DEM+'" class="img-circle size-50x50">';
                    // html +=             '</div>';
                    // html +=             '<div class="col-lg-7 col-md-8 bg-greensea-white">';
                    // html +=                 '<h5><strong>'+scope.cumpleanieros[i].Nombre+'</strong></h5>';
                    // html +=                 '<h6>'+scope.cumpleanieros[i].Puesto+'</h6>';
                    // html +=             '</div>';
                    // html +=             '<div class="col-lg-3 col-md-2 text-center bg-greensea-white" style="padding-top:3px;">';
                    // if(scope.cumpleanieros[i].Email != '' && scope.cumpleanieros[i].Email != ' '){
                    //     html +=                 '<span><a class="c_black" href="mailto:'+scope.cumpleanieros[i].Email+'?Subject=¡Felicidades!"><i class="fa fa-birthday-cake c_black" ></i>&nbsp;&nbsp;<br/>Felicitame</span>';
                    // }
                    // html +=             '</div>';
                    // html +=         '</div>';
                    // html +=     '</div>';