import { RouterModule, Routes } from '@angular/router';
import { AcusePageComponent } from '@libs/shared/data-access-user/src';
import { Evaluar26030Component } from './shared/components/evaluar-26030/evalur/evaluar-26030.component';
import { NgModule } from '@angular/core';
import { RegistrarComponent } from './shared/components/evaluar-26030/registrar/registrar.component';
import { SeleccionTramiteComponent } from './seleccion-tramite/seleccion-tramite.component';

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'seleccion-tramite' },
  {
    path: 'seleccion-tramite',
    component: SeleccionTramiteComponent,
  },
  {
    path: 'dispositivos-medicos-laboratorio',
    loadChildren: () =>
      import(
        './tramites/260218/importacion-dispositivos-mediocos-laboratorio.module'
      ).then((m) => m.ImportacionDispositivosMedicosLaboratorioModule),
  },
  {
    path: 'modificacion-del-permiso-sanitario-de-importacion-de-insumos',
    loadChildren: () =>
      import(
        './tramites/260904/modificación-del-permiso-sanitario-de-importación-de-insumos.module'
      ).then(
        (m) => m.ModificaciónDelPermisoSanitarioDeImportaciónDeInsumosModule
      ),
  },
  {
    path: 'permiso-maquila',
    loadChildren: () =>
      import('./tramites/260212/permiso-maquila.module').then(
        (m) => m.PermisoMaquilaModule
      ),
  },
  {
    path: 'consumo-personal',
    loadChildren: () =>
      import('./tramites/260102/consumo-personal.module').then(
        (m) => m.ConsumoPersonalModule
      ),
  },
  {
    path: 'permiso-sanitario-importacion-medicamentos',
    loadChildren: () =>
      import(
        './tramites/260204/permiso-sanitario-importacion-medicamentos.module'
      ).then((m) => m.PermisoSanitarioImportacionMedicamentosModule),
  },
  {
    path: 'aviso-exportacion',
    loadChildren: () =>
      import('./tramites/260604/aviso-exportacion.module').then(
        (m) => m.AvisoExportacionModule
      ),
  },
  {
    path: 'modificación-del-permiso-sanitario-de-importación-de-insumos',
    loadChildren: () =>
      import(
        './tramites/260904/modificación-del-permiso-sanitario-de-importación-de-insumos.module'
      ).then(
        (m) => m.ModificaciónDelPermisoSanitarioDeImportaciónDeInsumosModule
      ),
  },
  {
    path: 'maquila-materias-primas',
    loadChildren: () =>
      import('./tramites/260206/maquila-materias-primas.module').then(
        (m) => m.MaquilaMateriasPrimasModule
      ),
  },
  {
    path: 'mod-permiso-importacion',
    loadChildren: () =>
      import('./tramites/260912/mod-permiso-importacion.module').then(
        (m) => m.ModPermisoImportacionModule
      ),
  },
  {
    path: 'permiso-plaguicidas',
    loadChildren: () =>
      import('./tramites/260501/permiso-plaguicidas-importacion.module').then(
        (m) => m.PermisoPlaguicidasImportacionModule
      ),
  },
  {
    path: 'permiso-sanitario',
    loadChildren: () =>
      import('./tramites/260211/permiso-sanitario.module').then(
        (m) => m.PermisoSanitarioModule
      ),
  },
  {
    path: 'importacion-psicotropicos',
    loadChildren: () =>
      import(
        './tramites/260303/certificados-licencias-permisos/certificados-licencias-permisos.module'
      ).then((m) => m.CertificadosLicenciasPermisosModule),
  },
  {
    path: 'importacion-dispositivos-medicos-uso',
    loadChildren: () =>
      import(
        './tramites/260214/importacion-dispositivos-medicos-uso.module'
      ).then((m) => m.ImportacionDispositivosMedicosUsoModule),
  },
  {
    path: 'permiso-sanitario-importacion',
    loadChildren: () =>
      import('./tramites/260215/permiso-sanitario-importacion.module').then(
        (m) => m.PermisoSanitarioImportacionModule
      ),
  },
  {
    path: 'permiso-certificados',
    loadChildren: () =>
      import('./tramites/260701/certificados/certificados.module').then(
        (m) => m.CertificadosModule
      ),
  },
  {
    path: 'permiso-importacion-biologica',
    loadChildren: () =>
      import('./tramites/260402/permiso-importacion-biologica.module').then(
        (m) => m.EntradaHumanaModule
      ),
  },
  {
    path: 'permiso-sanitario-medicos-uso-personal',
    loadChildren: () =>
      import(
        './tramites/260213/permiso-sanitario-medicos-uso-personal.module'
      ).then((m) => m.PermisoSanitarioMedicosUsoPersonalModule),
  },
  {
    path: 'permiso-sanitario-importacion-medicamentos-pruebas',
    loadChildren: () =>
      import(
        './tramites/260210/permiso-sanitario-importacion-medicamentos-pruebas.module'
      ).then((m) => m.PermisoSanitarioImportacionMedicamentosPruebasModule),
  },
  {
    path: 'aviso-de-modificacion-module',
    loadChildren: () =>
      import('./tramites/260605/pantallas.module').then(
        (m) => m.Pantallas260605Module
      ),
  },
  {
    path: 'importacion-productos',
    loadChildren: () =>
      import('./tramites/260101/importacion-productos.module').then(
        (m) => m.ServiciosExtraordinariosModule
      ),
  },
  {
    path: 'aviso-sanitario',
    loadChildren: () =>
      import('./tramites/260601/aviso-sanitario.module').then(
        (m) => m.AvisoSanitarioModule
      ),
  },

  {
    path: 'dispositivos-medicos-sin-registrar',
    loadChildren: () =>
      import(
        './tramites/260217/importacion-dispositivos-medicos-sin-registrar.module'
      ).then((m) => m.ImportacionDispositivosMedicosSinRegistrarModule),
  },

  {
    path: 'materias-primas-destinados',
    loadChildren: () =>
      import('./tramites/260205/materias-primas-destinados.module').then(
        (m) => m.MateriasPrimasDestinadosModule
      ),
  },
  {
    path: 'importacion-dispositivos-medicos-donacion',
    loadChildren: () =>
      import(
        './tramites/260216/importacion-dispositivos-medicos-donacion.module'
      ).then((m) => m.ImportacionDispositivosMedicosDonacionModule),
  },
  {
    path: 'consulta',
    loadChildren: () =>
      import('./tramites/260704/consulta.module').then((m) => m.ConsultaModule),
  },
  {
    path: 'modificacion-permiso-sanitario',
    loadChildren: () =>
      import('./tramites/260902/modificacion-permiso-sanitario.module').then(
        (m) => m.ModificacionPermisoSanitarioModule
      ),
  },

  {
    path: 'modificacion-al-permiso-sanitario',
    loadChildren: () =>
      import('./tramites/260910/permiso-sanitario.module').then(
        (m) => m.PermisoSanitarioModule
      ),
  },
  {
    path: 'territorio-nacional',
    loadChildren: () =>
      import('./tramites/260401/territorio-nacional-solicitude.module').then(
        (m) => m.TerritorioNacionalSolicitudeModule
      ),
  },
  {
    path: 'medicamentos-registro-sanitario',
    loadChildren: () =>
      import(
        './tramites/260203/permiso-sanitario-importacion-medicamentos.module'
      ).then((m) => m.PermisoSanitarioImportacion260203Module),
  },
  {
    path: 'solicitud-modificacion-permiso-salida-territorio',
    loadChildren: () =>
      import(
        './tramites/261401/solicitud-modificacion-permiso-salida-territorio.module'
      ).then((m) => m.SolicitudModificacionPermisoSalidaTerritorioModule),
  },
  {
    path: 'permiso-experimentales-plaguicidas',
    loadChildren: () =>
      import(
        './tramites/260503/permiso-experimentales-plaguicidas.module'
      ).then((m) => m.PermisoExperimentalesPlaguicidasModule),
  },
  {
    path: 'modificacion-de-dispositivos',
    loadChildren: () =>
      import('./tramites/260911/modificacion-de-dispositivos.module').then(
        (m) => m.ModificacionDeDispositivosModule
      ),
  },
  {
    path: 'retiros-cofepris',
    loadChildren: () =>
      import('./tramites/261702/retiros-cofepris.module').then(
        (m) => m.RetirosCofeprisModule
      ),
  },
  {
    path: 'aviso-de-importacion',
    loadChildren: () =>
      import('./tramites/260603/aviso-de-importacion.module').then(
        (m) => m.AvisoDeImportacionModule
      ),
  },
  {
    path: 'muestras-plaguicidas',
    loadChildren: () =>
      import('./tramites/260502/muestras-plaguicidas.module').then(
        (m) => m.MuestrasPlaguicidasModule
      ),
  },

  {
    path: 'modificacion-del-permiso',
    loadChildren: () =>
      import('./tramites/260913/modificacion-del-permiso.module').then(
        (m) => m.ModificacionDelPermisoModule
      ),
  },
  {
    path: 'medicamentos-destinados-uso',
    loadChildren: () =>
      import(
        './tramites/260208/importacion-medicamentos-destinados-uso.module'
      ).then((m) => m.ImportacionMedicamentosDestinadosUsoModule),
  },

  {
    path: 'importacion-materias-primas-estupefacientes',
    loadChildren: () =>
      import(
        './tramites/260301/certificados-licencias-permisos/certificados-licencias-permisos.module'
      ).then((m) => m.CertificadosLicenciasPermisosModule),
  },
  {
    path: 'solicitud-permiso',
    loadChildren: () =>
      import('./tramites/260703/solicitud-permiso.module').then(
        (m) => m.SolicitudPermisoModule
      ),
  },

  {
    path: 'importacion-destinados-donacio',
    loadChildren: () =>
      import('./tramites/260209/importacion-destinados-donacio.module').then(
        (m) => m.ImportacionDestinadosDonacioModule
      ),
  },

  {
    path: 'modificacion-permiso-sanitario-importacion-maquila',
    loadChildren: () =>
      import('./tramites/260906/modificacion-permiso-sanitario.module').then(
        (m) => m.ModificacionPermisoSanitarioModule
      ),
  },
  {
    path: 'permiso-de-importacion',
    loadChildren: () =>
      import('./tramites/260512/permiso-de-importacion.module').then(
        (m) => m.PermisoDeImportacionModule
      ),
  },

  {
    path: 'modificacion-permiso-sanitario-la-salud',
    loadChildren: () =>
      import(
        './tramites/260901/modificacion-permiso-sanitario-la-salud.module'
      ).then((m) => m.ModificacionPermisoSanitarioLaSaludModule),
  },
  {
    path: 'muestras-de-toxicos',
    loadChildren: () =>
      import('./tramites/260513/muestras-de-toxicos.module').then(
        (m) => m.MuestrasDeToxicosModule
      ),
  },
  {
    path: 'permiso-sujetos',
    loadChildren: () =>
      import('./tramites/260504/permiso-sujetos.module').then(
        (m) => m.PermisoSujetosModule
      ),
  },
  {
    path: 'permiso-importacion-calidad',
    loadChildren: () =>
      import('./tramites/260514/parmiso-importacion-calidad.module').then(
        (m) => m.ParmisoImportacionCalidadModule
      ),
  },

  {
    path: 'registrar-solicitud-mcp',
    loadChildren: () =>
      import('./tramites/260702/registrar-solicitud-mcp.module').then(
        (m) => m.RegistrarSolicitudMCPModule
      ),
  },
  {
    path: 'importacion-tratamientos-especiales',
    loadChildren: () =>
      import(
        './tramites/260207/importacion-tratamientos-especiales.module'
      ).then((m) => m.ImportacionTratamientosEspecialesModule),
  },
  {
    path: 'importacion-psicotropicos-poretorno',
    loadChildren: () =>
      import(
        './tramites/260201/importacion-psicotropicos-poretorno.module'
      ).then((m) => m.ImportacionPsicotropicosPoretornoModule),
  },

  {
    path: 'importacion-remedios-herbolarios',
    loadChildren: () =>
      import('./tramites/260219/importacion-destinados-donacio.module').then(
        (m) => m.ImportacionRemediosHerbolariosModule
      ),
  },

  {
    path: 'permiso-transformacion-maquila',
    loadChildren: () =>
      import('./tramites/260505/permiso-transformacion-maquila.module').then(
        (m) => m.PermisoTransformacionMaquilaModule
      ),
  },
  {
    path: 'actualizacion-importacion',
    loadChildren: () =>
      import(
        './tramites/260903/actualizacion-importacion-sanitaria.module'
      ).then((m) => m.ActualizacionImportacionSanitariaModule),
  },
  {
    path: 'permiso-sanitario-dispositivos-medicos',
    loadChildren: () =>
      import(
        './tramites/260915/permiso-sanitario-dispositivos-medicos.module'
      ).then((m) => m.PermisoSanitarioDispositivosMedicosModule),
  },
  {
    path: 'importacion-de-insumos',
    loadChildren: () =>
      import('./tramites/260914/enmienda-permiso-sanitario.module').then(
        (m) => m.EnmiendaPermisoSanitarioModule
      ),
  },
  {
    path: 'solicitud-modificacion-permiso-internacion',
    loadChildren: () =>
      import(
        './tramites/261402/solicitud-modificacion-permiso-internacion.module'
      ).then((m) => m.SolicitudModificacionPermisoInternacionModule),
  },
  {
    path: 'enmienda-permiso-sanitario',
    loadChildren: () =>
      import('./tramites/260905/enmienda-permiso-sanitario.module').then(
        (m) => m.EnmiendaPermisoSanitarioModule
      ),
  },
  {
    path: 'solicitud-modificacion',
    loadChildren: () =>
      import('./tramites/261101/datos-solicitude.module').then(
        (m) => m.DatosSolicitudeModule
      ),
  },
  {
    path: 'importar-suministros-medicos',
    loadChildren: () =>
      import('./tramites/260916/importar-suministros-medicos.module').then(
        (m) => m.ImportarSuministrosMedicosModule
      ),
  },
  {
    path: 'correccion-interna-de-la-cofepris',
    loadChildren: () =>
      import('./tramites/261601/correccion-interna-de-la-cofepris.module').then(
        (m) => m.CorreccionInternaDeLaCofeprisModule
      ),
  },

  {
    path: 'modificacion-permiso-importacion-medicamentos',
    loadChildren: () =>
      import(
        './tramites/261103/modificacion-permiso-importacion-medicamentos.module'
      ).then((m) => m.ModificacionPermisoImportacionModule),
  },
  {
    path: 'modificacion-permiso-meds-uso',
    loadChildren: () =>
      import('./tramites/260908/modificacion-permiso-meds-uso.module').then(
        (m) => m.ModificacionPermisoMedsUsoModule
      ),
  },
  {
    path: 'permiso-nutrientes',
    loadChildren: () =>
      import('./tramites/260508/permiso-nutrientes.module').then(
        (m) => m.PermisoNutrientesModule
      ),
  },

  {
    path: 'exportacion-medicamentos-contengan',
    loadChildren: () =>
      import(
        './tramites/260304/certificados-licencias-permisos/certificados-licencias-permisos.module'
      ).then((m) => m.CertificadosLicenciasPermisosModule),
  },

  {
    path: 'permiso-importacion-module',
    loadChildren: () =>
      import('./tramites/260917/permiso-importacion.module').then(
        (m) => m.PermisoImportacionModule
      ),
  },
  {
    path: 'modificacion-permiso-importacion-tratamientos',
    loadChildren: () =>
      import(
        './tramites/260907/modificacion-permiso-importacion-tratamientos.module'
      ).then((m) => m.ModificacionPermisoImportacionTratamientosModule),
  },
  {
    path: 'operacion-de-maquila-submaquila',
    loadChildren: () =>
      import('./tramites/260516/operacion-de-maquila-submaquila.module').then(
        (m) => m.OperacionDeMaquilaSubmaquilaModule
      ),
  },
  {
    path: 'exportacion-materias-primas-estupefacientes',
    loadChildren: () =>
      import(
        './tramites/260302/certificados-licencias-permisos/certificados-licencias-permisos.module'
      ).then((m) => m.CertificadosLicenciasPermisosModule),
  },
  {
    path: 'permiso-sanitario-productos',
    loadChildren: () =>
      import('./tramites/260104/permiso-sanitario-productos.module').then(
        (m) => m.PermisoSanitarioProductosModule
      ),
  },
  {
    path: 'modificacion-permiso-lab',
    loadChildren: () =>
      import('./tramites/260918/modificacion-permiso-lab.module').then(
        (m) => m.ModificacionPermisoLabModule
      ),
  },
  {
    path: 'sustancias-permitidas',
    loadChildren: () =>
      import('./tramites/260515/permit-de-substances.module').then(
        (m) => m.PermitDeSubstancesModule
      ),
  },
  {
    path: 'importacion-retorno-sanitario',
    loadChildren: () =>
      import('./tramites/260103/importacion-retorno-sanitario.module').then(
        (m) => m.ImportacionRetornoSanitarioModule
      ),
  },
  {
    path: 'importacion-materias-primas',
    loadChildren: () =>
      import('./tramites/260202/importacion-materias-primas.module').then(
        (m) => m.ImportacionMateriasPrimasModule
      ),
  },
  {
    path: 'importacion-plafest',
    loadChildren: () =>
      import('./tramites/260507/importacion-plafest.module').then(
        (m) => m.ImportacionPlafestModule
      ),
  },
  {
    path: 'medicamentos-donacion',
    loadChildren: () =>
      import('./tramites/260909/medicamentos-donacion.module').then(
        (m) => m.MedicamentosDonacionModule
      ),
  },

  {
    path: 'importar-de-remedios-herbals',
    loadChildren: () =>
      import('./tramites/260919/importar-de-remedios-herbals.module').then(
        (m) => m.ImportarDeRemediosHerbalsModule
      ),
  },
  {
    path: 'permiso-vegetales-nutrientes',
    loadChildren: () =>
      import('./tramites/260509/permiso-vegetales-nutrientes.module').then(
        (m) => m.PermisoVegetalesNutrientesModule
      ),
  },
  {
    path: 'permiso-nutrientes-exportacion',
    loadChildren: () =>
      import('./tramites/260511/permiso-nutrientes-exportacion.module').then(
        (m) => m.PermisoNutrientesExportacionModule
      ),
  },
  {
    path: 'permiso-pruebas-nutrientes',
    loadChildren: () =>
      import('./tramites/260510/permiso-pruebas-nutrientes.module').then(
        (m) => m.PermisoPruebasNutrientesModule
      ),
  },
  {
    path: 'evaluar',
    loadComponent: () =>
      import('./evaluar/evaluar.component').then((m) => m.EvaluarComponent),
  },
  {
    path: 'autorizar-dictamen',
    loadComponent: () =>
      import('./autorizar-dictamen/autorizar-dictamen.component').then((m) => m.AutorizarDictamenComponent),
  },
  {
    path: 'autorizar-requerimiento',
    loadComponent: () =>
      import('./autorizar-requerimiento/autorizar-requerimiento.component').then((m) => m.AutorizarRequerimientoComponent),
  },
  {
    path: 'autorizar',
    loadComponent: () =>
      import('./autorizar/autorizar.component').then(
        (m) => m.AutorizarComponent
      ),
  },
    {
    path: 'confirmar-notificacion',
    loadComponent: () =>
      import('./confirmar-notificacion/confirmar-notificacion.component').then((m) => m.ConfirmarNotificacionComponent),
  },
  {
    path: 'subsecuentes',
    loadComponent: () =>
      import(
        './subsecuentes/acuses-y-resoluciones-folio-del-tramite-detalles-contenedor/acuses-y-resoluciones-folio-del-tramite-detalles-contenedor.component'
      ).then(
        (m) => m.AcusesYResolucionesFolioDelTramiteDetallesContenedorComponent
      ),
  },
  {
    path: 'proceso-requerimiento',
    loadComponent: () =>
      import('./proceso-requerimiento/proceso-requerimiento.component').then(
        (m) => m.ProcesoRequerimientoComponent
      ),
  },
  {
    path: 'permiso-sanitario-productos',
    loadChildren: () =>
      import('./tramites/260104/permiso-sanitario-productos.module').then(
        (m) => m.PermisoSanitarioProductosModule
      ),
  },
  {
    path: 'modificacion-permiso-lab',
    loadChildren: () =>
      import('./tramites/260918/modificacion-permiso-lab.module').then(
        (m) => m.ModificacionPermisoLabModule
      )
  },
  {
    path: 'sustancias-permitidas',
    loadChildren: () =>
      import('./tramites/260515/permit-de-substances.module').then(
        (m) => m.PermitDeSubstancesModule
      )
  },
  {
    path: 'importacion-retorno-sanitario',
    loadChildren: () =>
      import('./tramites/260103/importacion-retorno-sanitario.module').then(
        (m) => m.ImportacionRetornoSanitarioModule
      ),
  },
  {
    path: 'importacion-plafest',
    loadChildren: () =>
      import('./tramites/260507/importacion-plafest.module').then(
        (m) => m.ImportacionPlafestModule
      ),
  },
  {
    path: 'medicamentos-donacion',
    loadChildren: () =>
      import('./tramites/260909/medicamentos-donacion.module').then(
        (m) => m.MedicamentosDonacionModule
      )
  },
  {
    path: 'importar-de-remedios-herbals',
    loadChildren: () =>
      import('./tramites/260919/importar-de-remedios-herbals.module').then(
        (m) => m.ImportarDeRemediosHerbalsModule
      ),
  },
  {
    path: 'permiso-vegetales-nutrientes',
    loadChildren: () =>
      import('./tramites/260509/permiso-vegetales-nutrientes.module').then(
        (m) => m.PermisoVegetalesNutrientesModule
      ),
  },
  {
    path: 'permiso-nutrientes-exportacion',
    loadChildren: () =>
      import('./tramites/260511/permiso-nutrientes-exportacion.module').then(
        (m) => m.PermisoNutrientesExportacionModule
      ),
  },
  {
    path: 'permiso-pruebas-nutrientes',
    loadChildren: () =>
      import('./tramites/260510/permiso-pruebas-nutrientes.module').then(
        (m) => m.PermisoPruebasNutrientesModule
      ),
  },
  {
    path: 'cancelacion-peticion',
    loadChildren: () =>
      import('./tramites/261701/cancelacion-peticion.module').then(
        (m) => m.CancelacionPeticionModule)
  },
  {
    path: 'verificar-dictamen',
    loadComponent: () =>
      import('./verificar-dictamen/verificar-dictamen.component').then((m) => m.VerificarDictamenComponent),
  },
  {
    path: 'detalle-v-dictamen',
    loadComponent: () =>
      import('./detalle-v-dictamen/detalle-v-dictamen.component').then((m) => m.DetalleVDictamenComponent),
  },
  {
    path: 'datos-generales-tramite',
    loadComponent: () =>
      import('./datos-generales-tramite/datos-generales-tramite.component').then((m) => m.DatosGeneralesTramiteComponent),
  },
  {
    path: 'acuse',
    component: AcusePageComponent,
  },
  {
    path: 'verificar-requerimiento',
    loadComponent: () =>
      import('./verificar-requerimiento/verificar-requerimiento.component').then((m) => m.VerificarRequerimientoComponent),
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
