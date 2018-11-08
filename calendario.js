
app.controller('calendarioCtrl',['$scope','uhttp','$compile', '$timeout',
    function ($scope, uhttp, $compile, $timeout){

      $scope.events = [];
      $scope.LstdCmplIntr = [];
      var count = 0;

      /*
        Events:
          icon -> icono que aparecerá en el calendario
          tipo -> identifica el tipo de evento para que se muestre una plantilla distinta en el popover
      */

      /* *********************************** CONFIG. CALENDAR *********************************** */

      $scope.uiConfig = {
        calendar:{
          height: 325,
          editable: false,
          // theme: true,
          // slotEventOverlap: true,
          header:{
            left: 'prev',
            center: 'title',
            right: 'next'
          },
          viewRender: function(view, element){
            
            var exstMesCumple = false;
            var exstMesPartido = false;
            var exstMesAviso = false;
            
            var date = $("#CmplClndr").fullCalendar('getDate');
            var month_int = date.getMonth();
            var anio_int = date.getFullYear();

            angular.forEach($scope.LstdCmplIntr[0], function(value){
              if(value.start.getMonth() == month_int && value.tipo == 'cumpleanios'){ exstMesCumple = true; }
              if(value.tipo == 'partido'){ exstMesPartido = true; }
              if(value.tipo == 'aviso'){ exstMesAviso = true; }
            });

            if(!exstMesPartido){ obtener_partidos(); }

            /* Si el mes de cumpleaños no existe */
            if(!exstMesCumple){ $timeout(function() { obtener_cumpleanios(month_int, anio_int); }, 3000); }
            
            // if(!exstMesAviso){ obtener_avisos(); }


            /**/
            // $timeout(function() {
            //   $('.prtd').each(function(){
            //     // console.log('lf: ',this.style.left);
            //     var lft = this.style.left.split('p');
            //     var n_lft = parseInt(lft[0]) + 25;
            //     this.style.left = n_lft+'px';
            //     // console.log('n lf: ',this.style.left);          
            //   });

            //   $('.cmpl').each(function(){
            //     // console.log(this.style.top);
            //     if(this.style.top == '103px'){ this.style.top = '79px'; }
            //     if(this.style.top == '163px'){ this.style.top = '139px'; }
            //     if(this.style.top == '187px'){ this.style.top = '139px'; }
            //     // if(this.style.top == '307px'){ this.style.top = '223px'; }
            //     if(this.style.top == '307px'){ this.style.top = '283px'; }
            //     if(this.style.top == '331px'){ this.style.top = '283px'; }
            //     if(this.style.top == '343px'){ this.style.top = '319px'; }
            //     // if(this.style.top == '307px'){ this.style.top = '367px'; }
            //     if(this.style.top == '427px'){ this.style.top = '403px'; }
            //   });

            //   $('.fc-week').each(function(){
            //     // console.log(this);
            //     // this.style.width = '74px';
            //     this.style.height = '60px !important';
            //   });
            // }, 10000);
            
          },
          eventRender: function(event, element){
            // count = count + 1;
            // console.log(count)
            eval('$scope.popup' + event.id);

            var html = '';
            var htmlInn = event.icon;
            eval('$scope.popup' + event.id + ' = $scope.f_verDetalle(event, \'<i class="fa fa-birthday-cake"></i>\')');

            var pop = 'uib-popover-html="popup' +  event.id + '" popover-placement="left" popover-trigger="mouseenter" ';
            html += '<div ' + pop + ' >' + htmlInn + '</div>';/*class="text-center" outsideClick*/

                       
            element.find('.fc-event-inner').addClass('clndr-evnts');
            element.find('.fc-widget-content').css('height', '78px');
            // console.log($('.fc-event').position());
            // var pos = $('.fc-event').position();

            // if(event.tipo == 'partido'){
            //   element.find('.fc-event-inner').addClass('prtd');
            // }else{
            //   element.find('.fc-event-inner').addClass('cmpl');
            // }
            
            // element.find('.popover-content').css('width','200px');

            element.find('.fc-event-inner').html($compile(html)($scope)); 

          }
          // ,eventAfterAllRender: function(view){
          //   $('.fc-event-container').each(function(){
          //     console.log('pos: ',$('.fc-event').position());
          //     console.log('top: ',$('.fc-event').css('top'));
          //   });
          // }
          // ,
          // dayRender: function(date, cell){
          //   var evntDay = new Array();
          //   var dt = new Date(date);
          //   // console.log('date', dt);

          //   var events = $("#CmplClndr").fullCalendar('clientEvents');
          //   console.log(events);
          //   // angular.forEach(events, function(value){
          //   //   console.log('de: ', value);
          //   // });

          //   // console.log(date + ' - ' + evntDay);
          // }
        }
      };

      /* *************************************** POPOVER *************************************** */

      /* Función que despliega el popover */
      $scope.f_verDetalle = function(e,titulo){
        
        var html = '';

        /* Evento - Cumpleaños */
        if(e.tipo == 'cumpleanios'){

          html += '<div class="col-md-12 p-0 text-left pp-panel" >';

          angular.forEach(e.cumple, function(value){
            
            html += ' <div class="col-md-12 p-0"><strong>' + value.nombre + '</strong></div>';
            html += ' <div class="col-md-12 p-0">' + value.puesto + '</div>';
            html += ' <div class="col-md-12 p-0 text-greensea">' + value.correo + '</div>';
            html += ' <div class="col-md-12"><h4></h4></div>';
            
          });

          html += '</div>';

        }

        /* Evento - Partido Selección */
        if(e.tipo == 'partido'){

          html += '<div class="col-md-12 p-0 text-left pp-panel" >';

          angular.forEach(e.partido, function(value){

            html += ' <div class="col-md-12 p-0 text-center"><div class="col-md-5"><strong>' + value.nombre_local + '</strong></div><div class="col-md-2">vs</div><div class="col-md-5"><strong>' + value.nombre_visita + '</strong></div></div>';
            html += ' <div class="col-md-12 p-0 text-center"><div class="col-md-5"><img src="http://sisel.femexfut.org.mx/images/paises/logos/' + value.id_anterior_local + '.png" class="imgClndr" /></div><div class="col-md-2"></div><div class="col-md-5"><img src="http://sisel.femexfut.org.mx/images/paises/logos/' + value.id_anterior_visita + '.png" class="imgClndr" /></div></div>';
            html += ' <div class="col-md-12 p-0 text-center"><div class="col-md-5">' + value.goles_local + '</div><div class="col-md-2"></div><div class="col-md-5">' + value.goles_visita + '</div></div>';
            html += ' <div class="col-md-12 p-0"><i class="fa fa-flag"></i> ' + value.tipoEvento + '</div>';
            html += ' <div class="col-md-12 p-0"><i class="fa fa-trophy"></i> ' + value.nombreEvento + '</div>';
            html += ' <div class="col-md-12 p-0"><i class="fa fa-user"></i> ' + value.categoria + '</div>';
            html += ' <div class="col-md-12 p-0"><i class="fa fa-map-marker"></i> ' + value.estadio + '</div>';
            html += ' <div class="col-md-12 p-0 text-greensea"><i class="fa fa-clock-o"></i> ' + value.hora_partido + ' Hrs</div>';
            html += ' <div class="col-md-12"><h4></h4></div>';

          });

          html += '</div>';
        }

        if(e.tipo == 'aviso'){
          html += '<div class="col-md-12 p-0 text-left pp-panel" >';
          html += '     <div class="col-md-12 p-0 text-left">';
          html += '       <div class="col-md-12"><strong>Aviso Prueba</strong></div>';
          html += '     </div>';
          html += '</div>';
        }

        return html;
      }

      /* *********************************** CARGA EVENTOS *********************************** */

      $scope.LstdCmplIntr = [$scope.events];

      /* ************************************ CUMPLEAÑOS ************************************* */

      function obtener_cumpleanios(month_int, anio_int){
        var clndCmpl = [];

        uhttp({
          method: 'POST',
          url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_Cumpleanios',
          data: utilNumbers.objectToQs({
            mes : month_int,
            uhttp: true
          }),
          onSuccess: function(response){
            
            var dia, arrayLength = 0, count = 1;
            clndCmpl.cumple = [];
            
            angular.forEach(response.data, function(v){ arrayLength = arrayLength + 1; });
            
            if(response.status == 'ok'){
              
              angular.forEach(response.data, function(value){
                
                var info = {};
                var cumple = [];

                if(dia == undefined){
                  /* Guarda */
                  
                  // info.id = value.Dia;
                  info.id = value.NPER_PER;
                  info.title = '';
                  info.start = new Date(anio_int, month_int, value.Dia);
                  info.backgroundColor = '#3f4e62';
                  info.textColor = 'rgba(179,179,179,0.8)';
                  info.dia = value.Dia;
                  info.icon = '<i class="fa fa-birthday-cake"></i>';
                  info.tipo = 'cumpleanios';
                  info.className = 'cmpl';
                  info.cumple = [];

                  cumple.nombre = value.Nombre;
                  cumple.puesto = value.Puesto;
                  cumple.correo = value.Email;

                  info.cumple.push(cumple);

                  clndCmpl = info;

                  dia = value.Dia;

                }else if(dia == value.Dia){
                  /* Guarda sin Info */
                  
                  cumple.nombre = value.Nombre;
                  cumple.puesto = value.Puesto;
                  cumple.correo = value.Email;

                  clndCmpl.cumple.push(cumple);
                  dia = value.Dia;

                }else{
                  /* Inserta */
                  
                  $scope.events.push(clndCmpl);

                  clndCmpl = [];

                  // info.id = value.Dia;
                  info.id = value.NPER_PER;
                  info.title = '';
                  info.start = new Date(anio_int, month_int, value.Dia);
                  info.backgroundColor = '#3f4e62';
                  info.textColor = 'rgba(179,179,179,0.8)';
                  info.dia = value.Dia;
                  info.icon = '<i class="fa fa-birthday-cake"></i>';
                  info.tipo = 'cumpleanios';
                  info.className = 'cmpl';
                  info.cumple = [];

                  cumple.nombre = value.Nombre;
                  cumple.puesto = value.Puesto;
                  cumple.correo = value.Email;

                  info.cumple.push(cumple);

                  clndCmpl = info;

                  dia = value.Dia;

                }

                /* Inserta ultimo registro */
                if(count == arrayLength){ $scope.events.push(clndCmpl); }

                count = count + 1;

              }); // fin angular foreach

            } // fin if
            
          } // fin onsuccess

        }); // fin uhttp

      }


      /* ************************************ PARTIDOS *************************************** */

      function obtener_partidos(){
        
        var LstdPrtds = [];
        
        uhttp({
          method: 'POST',
          url: '/phpcode/EjecutaConsulta.php?sql=INTRANET_CLND_PrtdSlcc',
          data: utilNumbers.objectToQs({ uhttp: true }),
          onSuccess: function(response){
            
            var dia, arrayLength = 0, count = 1;
            LstdPrtds.partido = [];
            
            angular.forEach(response.data, function(v){ arrayLength = arrayLength + 1; });
            
            if(response.status == 'ok'){
              
              angular.forEach(response.data, function(value){
                
                var info = {};
                var prtd = [];

                if(dia == undefined){
                  /* Guarda */
                  
                  // info.id = value.Dia;
                  info.id = 'p'+value.id;
                  info.title = '';
                  info.start = new Date(value.fechaAnio, value.fechaMes - 1, value.fechaDia);
                  info.backgroundColor = '#3f4e62';
                  info.textColor = 'rgba(179,179,179,0.8)';
                  info.dia = value.fechaDia;
                  info.icon = '<i class="fa fa-soccer-ball-o"></i>';
                  info.tipo = 'partido';
                  info.className = 'prtd';
                  info.partido = [];

                  prtd.nombreEvento = value.nmbrEvnt;
                  prtd.tipoEvento = capitalizeJS(value.nmbrTpoEvnt);
                  prtd.categoria = value.nmbrCtgr;
                  prtd.equipo_local = value.idLocal;
                  prtd.id_anterior_local = value.id_anterior_local;
                  prtd.nombre_local = value.eqLocal;
                  prtd.equipo_visita = value.idVisita;
                  prtd.id_anterior_visita = value.id_anterior_visita;
                  prtd.nombre_visita = value.eqVisita;
                  prtd.hora_partido = value.hrPrtd;
                  prtd.hora_partido_local = value.hrPrtd_Lcl;
                  prtd.estadio = value.nmbrEstadio;
                  prtd.goles_local = value.goles_local;
                  prtd.goles_visita = value.goles_visita;

                  info.partido.push(prtd);

                  LstdPrtds = info;

                  dia = value.fechaDia;

                }else if(dia == value.fechaDia){
                  /* Guarda sin Info */
                  
                  prtd.nombreEvento = value.nmbrEvnt;
                  prtd.tipoEvento = capitalizeJS(value.nmbrTpoEvnt);
                  prtd.categoria = value.nmbrCtgr;
                  prtd.equipo_local = value.idLocal;
                  prtd.id_anterior_local = value.id_anterior_local;
                  prtd.nombre_local = value.eqLocal;
                  prtd.equipo_visita = value.idVisita;
                  prtd.id_anterior_visita = value.id_anterior_visita;
                  prtd.nombre_visita = value.eqVisita;
                  prtd.hora_partido = value.hrPrtd;
                  prtd.hora_partido_local = value.hrPrtd_Lcl;
                  prtd.estadio = value.nmbrEstadio;
                  prtd.goles_local = value.goles_local;
                  prtd.goles_visita = value.goles_visita;

                  LstdPrtds.partido.push(prtd);

                  dia = value.fechaDia;

                }else{
                  /* Inserta */
                  
                  $scope.events.push(LstdPrtds);

                  LstdPrtds = [];

                  // info.id = value.Dia;
                  info.id = 'p'+value.id;
                  info.title = '';
                  info.start = new Date(value.fechaAnio, value.fechaMes - 1, value.fechaDia);
                  info.backgroundColor = '#3f4e62';
                  info.textColor = 'rgba(179,179,179,0.8)';
                  info.dia = value.fechaDia;
                  info.icon = '<i class="fa fa-soccer-ball-o"></i>';
                  info.tipo = 'partido';
                  info.className = 'prtd';
                  info.partido = [];

                  prtd.nombreEvento = value.nmbrEvnt;
                  prtd.tipoEvento = capitalizeJS(value.nmbrTpoEvnt);
                  prtd.categoria = value.nmbrCtgr;
                  prtd.equipo_local = value.idLocal;
                  prtd.id_anterior_local = value.id_anterior_local;
                  prtd.nombre_local = value.eqLocal;
                  prtd.equipo_visita = value.idVisita;
                  prtd.id_anterior_visita = value.id_anterior_visita;
                  prtd.nombre_visita = value.eqVisita;
                  prtd.hora_partido = value.hrPrtd;
                  prtd.hora_partido_local = value.hrPrtd_Lcl;
                  prtd.estadio = value.nmbrEstadio;
                  prtd.goles_local = value.goles_local;
                  prtd.goles_visita = value.goles_visita;

                  info.partido.push(prtd);

                  LstdPrtds = info;

                  dia = value.fechaDia;

                }

                /* Inserta ultimo registro */
                if(count == arrayLength){ $scope.events.push(LstdPrtds); }

                count = count + 1;

              }); // fin angular foreach

            } // fin if

          } // fin on success
        });

      }


      /* ************************************ AVISOS ***************************************** */

      function obtener_avisos(){
        var aviso = {
          id: 'avs01',
          title: '',
          icon: '<i class="fa fa-gears">',
          tipo: 'aviso',
          start: '2017-02-08',
          backgroundColor: '#3f4e62',
          textColor: 'rgba(179,179,179,0.8)'
        }

        $scope.events.push(aviso);
      }

      /* ************************************ FUNCIONES ************************************** */

      /* Función para obtener el mes en texto */
      function f_mes_abrv_letra(mes){
        var meses = ["","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
        return meses[mes];
      }
            

    }
]);