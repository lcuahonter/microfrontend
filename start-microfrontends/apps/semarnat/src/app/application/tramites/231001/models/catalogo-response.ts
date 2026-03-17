import { CatalogosResponse } from '@libs/shared/data-access-user/src';

export type SimpleCatalogoResponse<T> = Pick<
  CatalogosResponse,
  'codigo' | 'mensaje'
> & { datos: T };

export interface ImmexResponse {
  id_prog_autorizado: number;
  num_folio_tramite: string;
  id_tipo_persona: number;
  idTipoPersona: string;
  is_persona_moral: boolean | null;
  razon_social: string;
  nombre: string | null;
}
