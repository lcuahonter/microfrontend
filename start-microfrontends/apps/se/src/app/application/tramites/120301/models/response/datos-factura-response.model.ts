import { AsociacionFacturaExpedicionResponse } from "./facturas-tpl-asociada-response.model";
import { FacturaTotalUnidadResponse } from "./facturas-tpl-unidad-total-response.model";

export interface FacturasTplAsociadaResponse {
    facturas_asociadas: AsociacionFacturaExpedicionResponse
    resultado_equivalencia: FacturaTotalUnidadResponse
}
