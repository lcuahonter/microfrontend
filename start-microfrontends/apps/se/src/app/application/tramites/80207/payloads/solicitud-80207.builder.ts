import { DomicilioPayload, PlantasDireccionModelo, Tramite80207State } from '../modelos/subfabricante.model';
import { buildPlantasSubmanufactureras, mapPlantaToDomicilio } from '../servicios/servicios-subfabricante.service';
import { GUARDAR_PAYLOAD_80207 } from './guardar-payload-80207.base';
import plantasSubmanufactureras from '@libs/shared/theme/assets/json/shared/plantas-submanufactureras.json';

// Extract the type from the base payload
type PlantaSubmanufactureraPayload = typeof GUARDAR_PAYLOAD_80207.plantasSubmanufactureras[0];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlantaBase = any;
const PLANTAS_SUBMANUFACTURERAS_BASE: PlantaBase[] = plantasSubmanufactureras as PlantaBase[];
export type Solicitud80207Payload = typeof GUARDAR_PAYLOAD_80207 & {
  domicilio: DomicilioPayload;
  id_solicitud?: number;
  plantasSubmanufactureras: PlantaSubmanufactureraPayload[]; 
};


// Choose the primary plant for domicilio mapping (first in store.plantas)
function pickPrimaryPlanta(plantas?: PlantasDireccionModelo[]): PlantasDireccionModelo | undefined {
  return (plantas && plantas.length > 0) ? plantas[0] : undefined;
}
export function buildSolicitud80207Payload(state: Tramite80207State): Solicitud80207Payload {
  
  const PRIMARYPLANTA = pickPrimaryPlanta(state.plantas);
  const DOMICILIO = mapPlantaToDomicilio(PRIMARYPLANTA);
  const PLANTAS_SUBMANUFACTURERAS = buildPlantasSubmanufactureras(state.plantas, PLANTAS_SUBMANUFACTURERAS_BASE) as PlantaSubmanufactureraPayload[];


  return {
    ...GUARDAR_PAYLOAD_80207,
    id_solicitud: state.idSolicitud ?? (GUARDAR_PAYLOAD_80207).id_solicitud,
    domicilio: DOMICILIO,
    plantasSubmanufactureras: PLANTAS_SUBMANUFACTURERAS
  };
}
