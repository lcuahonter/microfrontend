
interface TratadosAcuerdos {
    paisBloque: string;
    tratadoAcuerdo: string;
    criterioDeOrigen: string;
    norma: string;
    otrasInstancias: string;
    juegosSurtidos: string;
}

export const CONFIGURACION_ACCIONISTAS = [
    {
        encabezado: 'País / Bloque',
        clave: (ele: TratadosAcuerdos): string => ele.paisBloque,
        orden: 1
    },
    {
        encabezado: 'Tratado / Acuerdo',
        clave: (ele: TratadosAcuerdos): string => ele.tratadoAcuerdo,
        orden: 2
    },
    {
        encabezado: 'Criterio de origen',
        clave: (ele: TratadosAcuerdos): string => ele.criterioDeOrigen,
        orden: 3
    },
    {
        encabezado: 'Norma',
        clave: (ele: TratadosAcuerdos): string => ele.norma,
        orden: 4
    },
    {
        encabezado: 'Otras instancias',
        clave: (ele: TratadosAcuerdos): string => ele.otrasInstancias,
        orden: 5
    },
    {
        encabezado: 'Juegos o surtidos',
        clave: (ele: TratadosAcuerdos): string => ele.juegosSurtidos,
        orden: 6
    }
]
    
