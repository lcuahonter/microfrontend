import { PartidasDeLaMercanciaModelo } from "../models/partidas-de-la-mercancia.model";

/**
 * Convierte un string CSV a un arreglo de objetos JSON del modelo PartidasDeLaMercanciaModelo.
 * @param csv El string CSV a convertir.
 * @returns Un arreglo de objetos JSON.
 */
export function archivoCSVTOJSON(csv: string): PartidasDeLaMercanciaModelo[] {
    const LINES = csv.split('\n').filter(line => line.trim() !== '');

    const JSON_ARRAY = LINES.map((line, index) => {
        const [CANTIDAD, FRACCION, DESCRIPCION, TOTAL] = line.split('|');

        return {
            id: index.toString(),
            cantidad: CANTIDAD.toString(),
            unidadDeMedida: "",
            fraccionFrancelaria: FRACCION,
            descripcion: DESCRIPCION?.trim(),
            precioUnitarioUSD: "",
            totalUSD: TOTAL.toString(),
            fraccionTigiePartidasDeLaMercancia: "",
            fraccionDescripcionPartidasDeLaMercancia: "",
        };
    });

    return JSON_ARRAY;
}
