Vue.component('tabla_detalle_seguimiento', {
    props: ['datos_seguimiento'],
    template: `<table id='tabla_detalle_seguimiento' class='mdl-data-table mdl-js-data-table' style='width: 100%; border:0;'>
    <thead>                                                                                          
    <tr>
      <th>Codigo</th>
      <th>Nombre</th>
      <th>Meta</th>
      <th>Venta</th>
      <th>Saldo</th>
      <th>Progreso</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="dato in datos_seguimiento">
    <td>{{dato.codigo}}</td>
    <td style="white-space: initial;">{{dato.nombre}}</td>
    <td>{{ Math.round(dato.meta)}}</td>
    <td>{{ dato.venta}}</td>
    <td>{{ Math.round(dato.venta - dato.meta)}}</td>
    <td><div class="redondeado_progreso" style="background-color:#dadbd6; height: 20px; width: 100%;">
    <div class="redondeado_progreso" style="height:20px; text-align:center;" v-bind:style="{'background-color' : color_barra_progreso(dato.venta, dato.meta)
    ,width:((dato.venta/dato.meta*100) > 100) ? '100%': (dato.meta != 0) ? (dato.venta/dato.meta*100)+'%' : 0+'%'}"><label style="color: white;">{{ (dato.meta > 0) ? ((dato.venta/dato.meta)*100).toFixed(2) : 0 }}%</label></div></div>
    </td>
    </tr>
    </tbody>
    </table>`,
    methods: {
        color_barra_progreso: function(venta, meta) {
            if(venta >= meta){
                return "#1dbfc9";
            } else {
                return "#ff4d4d";
            }
        }
    }
});

function filtrarRegistros(datos, palabra) {
    if(palabra == "") {
        return datos;
    } else {
    //palabra = palabra.toUpperCase();
    return datos.filter(function(valor){
        var validacion = false;
        console.log(palabra);
        console.log(valor.nombre.search(palabra));
        if(valor.nombre.search(palabra) > -1 || valor.codigo.toString().search(palabra) > -1){
            validacion = true;
        }
        return validacion;
    });
    }
 };

var app = new Vue({
    el: '#contenedor',
    data: {
        //Propiedad que contiene el listado de puntos o sucursales
        datos_seguimiento: [],
        datos_seguimiento_filtrado: [],//Aloja los puntos filtrados
        pagina:1, //Pagina actual
        numeroDePaginas:1, //Numero de paginas
        porPagina: 7, //El numero de registros que se muestran por pagina
        busqueda: "", //Propiedad enlazada con el campo de busqueda. Tiene un watcher para ejecutar la funcion de busqueda
        titulo_blateral_nivel1: "EMPRESA", //Titulo de la barra lateral en el nivel 1
        listado_blateral_nivel1: [],
        titulo_blateral_nivel2: "", //Titulo de la barra lateral al visualizar nivel 2
        listado_blateral_nivel2:[], //Listado de datos que se mostraran cuando se seleccione una zona
        codNiveles: [], //Listado de codigos de cada nivel que se está revisando (zona, area, etc)
        ventaNivel: 0, //Venta total del área o zona que se está visualizando
        metaNivel: 0, //Meta total del área o zona que se está visualizando
        datos: [ //Datos de cada zona, sus areas y puntos
            {codigo: "2001", nombre:"Zona 1", 
             areas: [
                {codigo:"4001", nombre:"Area 1", puntos :[
                    {codigo: "1001", nombre:"Punto 1", venta:45000, meta: 67000},
                    {codigo: "1002", nombre:"Punto 2", venta:45000, meta: 67000},
                    {codigo: "1003", nombre:"Punto 3", venta:45000, meta: 67000},
                    {codigo: "1004", nombre:"Punto 4", venta:45000, meta: 67000},
                    {codigo: "1005", nombre:"Punto 5", venta:45000, meta: 67000}
                ]},
                {codigo:"4002", nombre: "Area 2", puntos:[
                    {codigo: "1006", nombre:"Punto 6", venta:45000, meta: 67000},
                    {codigo: "1007", nombre:"Punto 7", venta:45000, meta: 67000},
                    {codigo: "1008", nombre:"Punto 8", venta:45000, meta: 67000},
                    {codigo: "1009", nombre:"Punto 9", venta:45000, meta: 67000},
                    {codigo: "1010", nombre:"Punto 10", venta:45000, meta: 67000}
                ]}
             ]
            },
            {codigo: "2002", nombre:"Zona 2",
            areas:[
                {codigo:"4003", nombre:"Area 3", puntos: [
                    {codigo: "1011", nombre:"Punto 11", venta:45000, meta: 67000},
                    {codigo: "1012", nombre:"Punto 12", venta:45000, meta: 67000},
                    {codigo: "1013", nombre:"Punto 13", venta:45000, meta: 67000}
                ]}
            ]
            },
            {codigo: "2003", nombre:"Zona 3", 
            areas:[
                {codigo:"4004", nombre: "Area 4", puntos: [
                    {codigo: "1014", nombre:"Punto 14", venta:45000, meta: 67000},
                    {codigo: "1015", nombre:"Punto 15", venta:45000, meta: 67000},
                    {codigo: "1016", nombre:"Punto 16", venta:45000, meta: 67000},
                ]},
                {codigo:"4005", nombre: "Area 5", puntos:[
                    {codigo: "1017", nombre:"Punto 17", venta:45000, meta: 67000},
                    {codigo: "1018", nombre:"Punto 18", venta:45000, meta: 67000},
                    {codigo: "1019", nombre:"Punto 19", venta:45000, meta: 67000},
                ]}
            ]
            },
            {codigo: "2004", nombre:"Zona 4", 
            areas: [
                {codigo:"4006", nombre: "Area 6", puntos: [
                    {codigo: "1020", nombre:"Punto 20", venta:45000, meta: 67000},
                    {codigo: "1021", nombre:"Punto 21", venta:45000, meta: 67000}
                ]},
                {codigo:"4007", nombre: "Area 7", puntos:[
                    {codigo: "1022", nombre:"Punto 22", venta:56000, meta: 69000},
                    {codigo: "1023", nombre:"Punto 23", venta:12450, meta: 45000},
                    {codigo: "1024", nombre:"Punto 24", venta:45000, meta: 67000},
                ]}
            ]
            }
        ]
    },
    methods: {
        establecer_datos: function(){
            let self = this;
            this.metaNivel = 0;
            this.ventaNivel = 0;
            if(this.listado_blateral_nivel1.length > 0){
                this.listado_blateral_nivel1.length = 0;
            }
            this.datos.forEach(function(elemento) {
                let venta = 0;
                let meta = 0;
                elemento.areas.forEach(function(area){
                    area.puntos.forEach(function(punto){
                        venta += punto.venta;
                        self.ventaNivel += punto.venta; 
                    });
                    area.puntos.forEach(function(punto){
                        meta += punto.meta; 
                        self.metaNivel += punto.meta;
                    });
                });
                
                self.datos_seguimiento.push({codigo:elemento.codigo, nombre:elemento.nombre, venta: venta, meta: meta});
                self.listado_blateral_nivel1.push({codigo: elemento.codigo, nombre: elemento.nombre});
            });
            
        },

        filtrar: function () {
            this.datos_seguimiento_filtrado = filtrarRegistros(this.datos_seguimiento, this.busqueda);
        },

        //Establecer paginas
        establecer_paginas: function () {
            this.pagina = 1;
            this.numeroDePaginas = Math.ceil(this.datos_seguimiento_filtrado.length/this.porPagina);
        },

        //Paginar datos
        paginar: function (datos_seguimiento) {
            let pagina = this.pagina;
            let porPagina = this.porPagina;
            let desde = (pagina * porPagina) - porPagina;
            let hasta = (pagina * porPagina);
            return datos_seguimiento.slice(desde, hasta);
        },

        obtener_listado_pornivel: function(titulo_blateral, volverAtras, codigoNivel) {
            let self = this;
            self.datos_seguimiento.length = 0;
            self.listado_blateral_nivel2.length = 0;
            this.metaNivel = 0;
            this.ventaNivel = 0;
            if(volverAtras == false){
                this.titulo_blateral_nivel2 = titulo_blateral;
                this.codNiveles.push(codigoNivel);
                let areas_zona;
                areas_zona = this.datos.find(elemento => elemento.codigo == codigoNivel).areas;
                //Obtener meta y venta para cada area de la zona
                areas_zona.forEach(function(area){
                    let venta = 0;
                    let meta = 0;
                    area.puntos.forEach(function(punto) {
                        venta += punto.venta;
                        meta += punto.meta;
                        self.ventaNivel += punto.venta;
                        self.metaNivel += punto.meta;
                    });
                    self.datos_seguimiento.push({codigo:area.codigo, nombre:area.nombre, venta:venta, meta:meta});
                });
                this.listado_blateral_nivel2 = this.datos_seguimiento.map(elemento => {
                    let nuevoObj = {};
                    nuevoObj.codigo = elemento.codigo;
                    nuevoObj.nombre = elemento.nombre;
                    return nuevoObj;
                });
                document.getElementById("cajadetalle_nivel_1").style.transform = 'translateX(calc(-100%))';
                document.getElementById("cajadetalle_nivel_2").style.transform = 'translateX(calc(-100%))';
            } else{
                this.codNiveles.pop();
                this.establecer_datos();
                document.getElementById("cajadetalle_nivel_1").style.transform = 'translateX(calc(0%))';
                document.getElementById("cajadetalle_nivel_2").style.transform = 'translateX(calc(0%))';
            }

        },

        obtener_listado_ultimo_nivel: function(codigoNivel) {
            let self = this;
            this.datos_seguimiento.length = 0;
            let puntos_area = this.datos.find(elemento => elemento.codigo == self.codNiveles[self.codNiveles.length-1]).areas.find(area => area.codigo == codigoNivel).puntos;
            puntos_area.forEach(punto => {
                self.datos_seguimiento.push({codigo: punto.codigo, nombre: punto.nombre, venta: punto.venta, meta: punto.meta});
            });
        }

    },

    created() {
        this.establecer_datos();
        this.filtrar();
        this.establecer_paginas();
    },

    watch: {
        busqueda: function () {
            this.filtrar();
            this.establecer_paginas();
            this.paginar(this.datos_seguimiento_filtrado);
        }
    },

    computed: {
        datos_seguimiento_mostrados() {
            return this.paginar(this.datos_seguimiento_filtrado);
        }
    }

});