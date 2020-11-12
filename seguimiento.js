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
    <td>{{ formato_numero(Math.round(dato.meta))}}</td>
    <td>{{ formato_numero(dato.venta)}}</td>
    <td>{{ formato_numero(Math.round(dato.venta - dato.meta))}}</td>
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
        },
        formato_numero: function(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
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
        datos_seguimiento: [
            {codigo: "1001", nombre:"Punto 1", venta:45000, meta: 67000},
            {codigo: "1002", nombre:"Punto 2", venta:45000, meta: 67000},
            {codigo: "1003", nombre:"Punto 3", venta:45000, meta: 67000},
            {codigo: "1004", nombre:"Punto 4", venta:45000, meta: 67000},
            {codigo: "1005", nombre:"Punto 5", venta:45000, meta: 67000},
            {codigo: "1006", nombre:"Punto 6", venta:45000, meta: 67000},
            {codigo: "1007", nombre:"Punto 7", venta:45000, meta: 67000},
            {codigo: "1008", nombre:"Punto 8", venta:45000, meta: 67000},
            {codigo: "1009", nombre:"Punto 9", venta:45000, meta: 67000},
            {codigo: "1010", nombre:"Punto 10", venta:45000, meta: 67000},
            {codigo: "1011", nombre:"Punto 11", venta:45000, meta: 67000},
            {codigo: "1012", nombre:"Punto 12", venta:45000, meta: 67000},
            {codigo: "1013", nombre:"Punto 13", venta:45000, meta: 67000},
            {codigo: "1014", nombre:"Punto 14", venta:45000, meta: 67000},
            {codigo: "1015", nombre:"Punto 15", venta:45000, meta: 67000},
            {codigo: "1016", nombre:"Punto 16", venta:45000, meta: 67000},
            {codigo: "1017", nombre:"Punto 17", venta:45000, meta: 67000},
            {codigo: "1018", nombre:"Punto 18", venta:45000, meta: 67000},
            {codigo: "1019", nombre:"Punto 19", venta:45000, meta: 67000},
            {codigo: "1020", nombre:"Punto 20", venta:45000, meta: 67000},
            {codigo: "1021", nombre:"Punto 21", venta:45000, meta: 67000}
        ],
        datos_seguimiento_filtrado: [],
        pagina:1,
        numeroDePaginas:1,
        porPagina: 7,
        busqueda: ""
    },
    methods: {
        formato_numero: function(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
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
        }

    },

    created() {
        this.filtrar();
        this.establecer_paginas();
        //this.paginar(this.datos_seguimiento_filtrado);
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
