import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { REMOTE_ROUTES } from './remote-entry/entry.routes';

/**
 * Módulo principal de la aplicación privados para integración con Module Federation.
 * Este módulo es necesario para que el dashboard (shell) pueda cargar
 * la aplicación como un NgModule tradicional.
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(REMOTE_ROUTES)
  ],
  exports: [RouterModule],
  providers: [
    provideHttpClient()
  ]
})
export class AppPrivadosModule {}

