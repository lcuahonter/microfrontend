import { RouterModule, Routes } from '@angular/router'; // Importa las clases necesarias para configurar las rutas.
import { NgModule } from '@angular/core'; // Importa el decorador NgModule para definir un módulo de Angular.

import { DatosMonumentoComponent } from './component/datos-monumentos/datos-monumentos.component'; // Importa el componente para gestionar los datos de los monumentos.
import { ElementoAnadidasComponent } from './component/elemento-anadidos/elemento-anadidos.component'; // Importa el componente para gestionar los elementos añadidos.
import { PermisoDeExportacionComponent } from './pages/permiso-de-exportacion/permiso-de-exportacion.component'; // Importa el componente principal de la página de permisos de exportación.

const ROUTES: Routes = [
  {
    path: 'permiso', // Ruta para la página principal de permisos de exportación.
    component: PermisoDeExportacionComponent, // Componente asociado a la ruta.
  },
  {
    path: 'datos-monumento', // Ruta para gestionar los datos de los monumentos.
    component: DatosMonumentoComponent, // Componente asociado a la ruta.
  },
  {
    path: 'elemento', // Ruta para gestionar los elementos añadidos.
    component: ElementoAnadidasComponent, // Componente asociado a la ruta.
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)], // Importa las rutas configuradas como rutas hijas.
  exports: [RouterModule], // Exporta el módulo de rutas para que esté disponible en otros módulos.
})
export class PermisoDeExportacionRoutingModule { }
