import { Routes } from '@angular/router';
import { REGISTRO_GUIAS_ROUTES } from './registro-guias.routes.constants';
import { RegistroGuiasPage } from './pages/registro-guias/registro-guias.page';
import { CommodityDetailsFormComponent } from './components/forms/commodity-details-form/commodity-details-form.component';
import { FeeDetailsFormComponent } from './components/forms/fee-details-form/fee-details-form.component';
import { PersonsFormComponent } from './components/forms/persons-form/persons-form.component';
import { TransportDetailsFormComponent } from './components/forms/transport-details-form/transport-details-form.component';
import { OtherContactFormComponent } from './components/forms/other-contact-form/other-contact-form.component';
import { TypeCargoFormComponent } from './components/forms/type-cargo-form/type-cargo-form.component';
import { MasterGuidesFormComponent } from './components/forms/master-guides-form/master-guides-form.component';
import { SequenceMerchandiseDetailsComponent } from './components/forms/sequence-merchandise-details.component/sequence-merchandise-details-form.component';

export const registroGuiasRoutes: Routes = [
  {
    path: '',
    component: RegistroGuiasPage,
  },
  {
    path: REGISTRO_GUIAS_ROUTES.DETALLE_MERCANCIA,
    component: CommodityDetailsFormComponent,
  },
  {
    path: REGISTRO_GUIAS_ROUTES.DETALLE_TARIFA,
    component: FeeDetailsFormComponent,
  },
  {
    path: REGISTRO_GUIAS_ROUTES.PERSONAS,
    component: PersonsFormComponent,
  },
  {
    path: REGISTRO_GUIAS_ROUTES.DETALLE_TRANSPORTE,
    component: TransportDetailsFormComponent,
  },
  {
    path: REGISTRO_GUIAS_ROUTES.OTRO_CONTACTO,
    component: OtherContactFormComponent,
  },
  {
    path: REGISTRO_GUIAS_ROUTES.TIPO_CARGA,
    component: TypeCargoFormComponent,
  },
  {
    path: REGISTRO_GUIAS_ROUTES.GUIAS_MASTER,
    component: MasterGuidesFormComponent,
  },
  {
    path: REGISTRO_GUIAS_ROUTES.DETALLE_MERCANCIA_SECUENCIA,
    component: SequenceMerchandiseDetailsComponent,
  },
];

export default registroGuiasRoutes;
