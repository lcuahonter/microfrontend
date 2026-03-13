import { CamState } from "../estados/cam-certificado.store";
import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { camCertificadoStore } from "../estados/cam-certificado.store";

/**
 * @descripcion
 * Query para gestionar el estado del certificado CAM.
 */
@Injectable({ providedIn: 'root' })
export class camCertificadoQuery extends Query<CamState> {
  /**
   * @descripcion
   * Observable que selecciona el estado completo del certificado.
   */
  selectCam$ = this.select((state) => {
    return state;
  });

  /**
   * @descripcion
   * Observable que selecciona la tabla de mercancías del estado.
   */
  selectmercanciaTabla$ = this.select((state) => {
    return state.mercanciaTabla;
  });

  /**
   * @descripcion
   * Observable que selecciona los datos del formulario de certificado.
   */
  formCertificado$ = this.select((state) => {
    return state.formCertificado;
  });

  /**
   * @descripcion
   * Observable que selecciona los datos del formulario de datos del certificado.
   */
  formDatosCertificado$ = this.select((state) => {
    return state.formDatosCertificado;
  });

  /**
   * @descripcion
   * Observable que selecciona los datos del formulario de destinatario.
   */
  selectFormDatosDelDestinatario$ = this.select((state) => {
    return state.formDatosDelDestinatario;
  });

  /**
   * @descripcion
   * Observable que selecciona el formulario de destinatario.
   */
  selectFormDestinatario$ = this.select((state) => {
    return state.formDestinatario;
  });

  /**
   * @descripcion
   * Observable que selecciona el grupo representativo del estado.
   */
  selectGrupoRepresentativo$ = this.select((state) => {
    return state.grupoRepresentativo;
  });

  /**
   * @descripcion
   * Constructor que inyecta el almacén `camCertificadoStore`.
   * @param store - Instancia de `camCertificadoStore`.
   */
  constructor(protected override store: camCertificadoStore) {
    super(store);
  }
}