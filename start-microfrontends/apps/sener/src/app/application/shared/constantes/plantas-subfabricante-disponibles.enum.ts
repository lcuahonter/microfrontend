import { PlantasSubfabricante } from "../models/empresas-subfabricanta.model";


export const SUBFABRICANTE_DISPONIBLES_PLANTAS_TABLA_CONFIGURACION = 
    [
        {
          encabezado: 'Calle',
          clave: (ele: PlantasSubfabricante) :string=> ele.calle ,
          orden: 1
        },
        {
          encabezado: 'Num.exterior', 
          clave: (ele: PlantasSubfabricante) :number=> ele.numExterior, 
          orden: 2,
        },
        {
          encabezado: 'Num.interior', 
          clave: (ele: PlantasSubfabricante):number => ele.numInterior, 
          orden: 3, 
        },
        {
          encabezado: 'Código postal', // Título de la columna
          clave: (ele: PlantasSubfabricante):number => ele.codigoPostal, // Función que devuelve el valor de la columna para cada fila
          orden: 4, 
        },
        {
          encabezado:'Colonia',// Título de la columna
          clave: (ele: PlantasSubfabricante):string => ele.colonia, // Función que devuelve el valor de la columna para cada fila
          orden: 5, // Orden de la columna en la tabla
        },
      ];

      export const SUBFABRICANTE_SELECCIONADAS_PLANTAS_TABLA_CONFIGURACION = 
      [
          {
            encabezado: 'Calle',
            clave: (ele: PlantasSubfabricante):string => ele.calle ,
            orden: 1
          },
          {
            encabezado: 'Num.exterior', 
            clave: (ele: PlantasSubfabricante):number => ele.numExterior, 
            orden: 2,
          },
          {
            encabezado: 'Num.interior', 
            clave: (ele: PlantasSubfabricante):number => ele.numInterior, 
            orden: 3, 
          },
          {
            encabezado: 'Código postal', // Título de la columna
            clave: (ele: PlantasSubfabricante):number => ele.codigoPostal, // Función que devuelve el valor de la columna para cada fila
            orden: 4, 
          },
          {
            encabezado:'Localidad',// Título de la columna
            clave: (ele: PlantasSubfabricante):string => ele.colonia, // Función que devuelve el valor de la columna para cada fila
            orden: 5, // Orden de la columna en la tabla
          },
        ];