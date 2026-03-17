import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { PermisoImportacionBiologicaState, PermisoImportacionBiologicaStore} from './permiso-importacion-biologica.store';


@Injectable({ providedIn: 'root' })
export class PermisoImportacionBiologicaQuery extends Query<PermisoImportacionBiologicaState> {
  selectedEstado$ = this.select((state) => state.selectedEstado);
  selectedClave$ = this.select((state) => state.setClave);
  selectedBanco$ = this.select((state) => state.setBanco);
  selectedClaveDeReferncia$ = this.select((state)=>state.setClaveDeReferncia)
  selectedCadenaDeLaDependencia$ = this.select((state)=>state.setCadenaDeLaDependencia)
  selectedLlaveDePago$=this.select((state)=>state.setLlaveDePago)
  selectedFechaDePago$=this.select((state)=>state.setFechaDePago)
  selectedImporteDePago$ = this.select((state)=>state.setImporteDePago)
  selectSolicitud$ = this.select((state) => {
    return state;
  });
  constructor(private tramiteStore: PermisoImportacionBiologicaStore) {
    super(tramiteStore);
  }
}
