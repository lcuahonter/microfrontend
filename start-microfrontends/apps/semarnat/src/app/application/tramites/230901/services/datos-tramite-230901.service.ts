import { HttpErrorResponse } from '@angular/common/http';

import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';

import { Catalogo } from '@libs/shared/data-access-user/src';

import { ApiTramite230902Service } from './api-tramite-230901.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UtilidadesService } from './utilidades.service';

@Injectable({
    providedIn: 'root'
})
export class DatosTramite230902Service {
    /** Inyeccion de dependencia para destruir la subscripcion */
    private destroyRef = inject(DestroyRef)
    /** Servico donde contiene las APis a consultar */
    private apiService = inject(ApiTramite230902Service)
    /* Utilidades a reutilizar dentro del tramite*/
    public utils = inject(UtilidadesService);
    /** Obtiene la consulta actual del tramite */
    public consultaState = this.utils.consultaState;

    /** Indica si el formulario está en modo solo lectura. */
    esFormularioSoloLectura = signal<boolean>(this.consultaState().readonly);


    constructor() {
        if (!this.esFormularioSoloLectura()) {
            this.getMovimientos()
            this.getRegimenes()
            this.getListaAduanas()
            this.getListaMovimientos()
            this.getListaFraccionesArancelarias()
            this.getListaClasificacionTaxonomica()
            this.getListaUnidadMedida()
            this.getListaPaises()
            this.getListaPaisesSinMexico()
            this.getListaEntidadesFederativas()
            this.getDatosPago()
            this.getListaBancos()
        }
    }

    /** Creacion de señales de todos los catalogos a utilizar */
    #getTipoMovimientos = signal<Catalogo[]>([])
    #getTipoRegimenes = signal<Catalogo[]>([])
    #getListaAduanas = signal<Catalogo[]>([])
    #getListaMovimientos = signal<Catalogo[]>([])
    #getListaFraccionesArancelarias = signal<Catalogo[]>([])
    #getListaClasificacionTaxonomica = signal<Catalogo[]>([])
    #getListaUnidadMedida = signal<Catalogo[]>([])
    #getListaPaises = signal<Catalogo[]>([])
    #getListaPaisesSinMexico = signal<Catalogo[]>([])
    #getListaEntidadesFederativas = signal<Catalogo[]>([])
    #getDatosPago = signal<Catalogo[]>([])
    #getListaBancos = signal<Catalogo[]>([])

    /** Creacion de señales computadas de todos los catalogos a utilizar */

    public tiposMovimientos = computed(() => this.#getTipoMovimientos())
    public tiposRegimenes = computed(() => this.#getTipoRegimenes())
    public listaAduanas = computed(() => this.#getListaAduanas())
    public listaAduanasDescripcion = computed(() => this.listaAduanas().map(item => item.descripcion))
    public listaMovimientos = computed(() => this.#getListaMovimientos())
    public listaMovimientosDescripcion = computed(() => this.listaMovimientos().map(item => item.descripcion))
    public listaFraccionesArancelarias = computed(() => this.#getListaFraccionesArancelarias())
    public listaClasificacionTaxonomica = computed(() => this.#getListaClasificacionTaxonomica())
    public listaUnidadMedida = computed(() => this.#getListaUnidadMedida())
    public listaPaises = computed(() => this.#getListaPaises())
    public listaPaisesSinMexico = computed(() => this.#getListaPaisesSinMexico())
    public listaEntidadesFederativas = computed(() => this.#getListaEntidadesFederativas())
    public datosPago = computed(() => this.#getDatosPago())
    public listaBancos = computed(() => this.#getListaBancos())


    /** Get Tipos de Movimientos */
    getMovimientos() {
        this.apiService.getMovimientos().subscribe({
            next: (response) => this.#getTipoMovimientos.set(response.datos),
            error: (err: HttpErrorResponse) => {
                // Espacio para controlar el error
                console.error('Error:', err)
            }
        })
    }

    /** Get Tipos de Regimenes */
    getRegimenes() {
        this.apiService.getRegimenes().subscribe({
            next: (response) => this.#getTipoRegimenes.set(response.datos),
            error: (err: HttpErrorResponse) => {
                // Espacio para controlar el error
                console.error('Error:', err)
            }
        })
    }

    /** Get Lista de Aduanas */
    getListaAduanas() {
        this.apiService.getListaAduanas().subscribe({
            next: (response) => this.#getListaAduanas.set(response.datos),
            error: (err: HttpErrorResponse) => {
                // Espacio para controlar el error
                console.error('Error:', err)
            }
        })
    }

    /** Get lista de Movimientos */
    getListaMovimientos() {
        this.apiService.getListaMovimientos().subscribe({
            next: (response) => this.#getListaMovimientos.set(response.datos),
            error: (err: HttpErrorResponse) => {
                // Espacio para controlar el error
                console.error('Error:', err)
            }
        })
    }

    /** Get lista de Fracciones Arancelarias */
    getListaFraccionesArancelarias() {
        this.apiService.getListaFraccionesArancelarias().subscribe({
            next: (response) => this.#getListaFraccionesArancelarias.set(response.datos),
            error: (err: HttpErrorResponse) => {
                // Espacio para controlar el error
                console.error('Error:', err)
            }
        })
    }

    /** Get lista de clasificacion taxonomica */
    getListaClasificacionTaxonomica() {
        this.apiService.getListaClasificacionTaxonomica().subscribe({
            next: (response) => this.#getListaClasificacionTaxonomica.set(response.datos),
            error: (err: HttpErrorResponse) => {
                // Espacio para controlar el error
                console.error('Error:', err)
            }
        })
    }

    /** Get lista de Unidades de Medida */
    getListaUnidadMedida() {
        this.apiService.getListaUnidadMedida().subscribe({
            next: (response) => this.#getListaUnidadMedida.set(response.datos),
            error: (err: HttpErrorResponse) => {
                // Espacio para controlar el error
                console.error('Error:', err)
            }
        })
    }

    /** Get lista de Paises */
    getListaPaises() {
        this.apiService.getListaPaises().subscribe({
            next: (response) => this.#getListaPaises.set(response.datos),
            error: (err: HttpErrorResponse) => {
                // Espacio para controlar el error
                console.error('Error:', err)
            }
        })
    }

    /** Get lista de Paises sin Mexico */
    getListaPaisesSinMexico() {
        this.apiService.getListaPaisesSinMexico().subscribe({
            next: (response) => this.#getListaPaisesSinMexico.set(response.datos),
            error: (err: HttpErrorResponse) => {
                // Espacio para controlar el error
                console.error('Error:', err)
            }
        })
    }

    /** Get lista de Entidades federativas*/
    getListaEntidadesFederativas() {
        this.apiService.getListaEntidadesFederativas().subscribe({
            next: (response) => this.#getListaEntidadesFederativas.set(response.datos),
            error: (err: HttpErrorResponse) => {
                // Espacio para controlar el error
                console.error('Error:', err)
            }
        })
    }

    /** Get lista de Datos de Pago */
    getDatosPago() {
        this.apiService.getDatosPago().subscribe({
            next: (response) => this.#getDatosPago.set(response.datos),
            error: (err: HttpErrorResponse) => {
                // Espacio para controlar el error
                console.error('Error:', err)
            }
        })
    }

    /** Get lista de Bancos */
    getListaBancos() {
        this.apiService.getListaBancos().subscribe({
            next: (response) => this.#getListaBancos.set(response.datos),
            error: (err: HttpErrorResponse) => {
                // Espacio para controlar el error
                console.error('Error:', err)
            }
        })
    }

    /** Guarda la nueva Solicitud */
    crearSolicitud(PAYLOAD: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.crearSolicitud(PAYLOAD).pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe({
                next: (response) => {
                    resolve(response); // Si hay éxito, resolvemos la promesa
                },
                error: (error) => {
                    reject(error); // Si hay error, rechazamos la promesa
                }
            });
        });
    }

    /** Obtinene las Fracciones Arancelarias por clave */
    getDecripcionFraccionArancelaria(claveFraccionArancelaria: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.getDecripcionFraccionArancelaria(claveFraccionArancelaria).pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe({
                next: (response) => {
                    const { datos } = response;
                    resolve(datos); // Si hay éxito, resolvemos la promesa
                },
                error: (error) => {
                    reject(error); // Si hay error, rechazamos la promesa
                }
            });
        });
    }

    /** Obtinene  el nombre Cientifico por medio de la clave taxonomica */
    getNombreCientifico(claveClasificacionTaxonomica: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.getNombreCientifico(claveClasificacionTaxonomica).pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe({
                next: (response) => {
                    const { datos } = response;
                    resolve(datos); // Si hay éxito, resolvemos la promesa
                },
                error: (error) => {
                    reject(error); // Si hay error, rechazamos la promesa
                }
            });
        });
    }

    /** Obtinene  el nombre Comun por medio del nombre Cientifico */
    getNombreComun(claveClasificacionTaxonomica: string, claveNombreCientifico: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.getNombreComun(claveClasificacionTaxonomica, claveNombreCientifico).pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe({
                next: (response) => {
                    const { datos } = response;
                    resolve(datos); // Si hay éxito, resolvemos la promesa
                },
                error: (error) => {
                    reject(error); // Si hay error, rechazamos la promesa
                }
            });
        });
    }

    /** Get Obtiene los Destinatarios recintos */
    getDestinatarioRecinto(tipo_movimiento: string, rfc: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.getDestinatarioRecinto(tipo_movimiento, rfc).pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe({
                next: (response) => {
                    const { datos } = response;
                    resolve(datos); // Si hay éxito, resolvemos la promesa
                },
                error: (error) => {
                    reject(error); // Si hay error, rechazamos la promesa
                }
            });
        });
    }

    /** Get Destinatarios recintos por medio de la Clave */
    getDestinatarioRecintoClave(tipo_movimiento: string, rfc: string, clave_recinto: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.getDestinatarioRecintoClave(tipo_movimiento, rfc, clave_recinto).pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe({
                next: (response) => {
                    const { datos } = response;
                    resolve(datos); // Si hay éxito, resolvemos la promesa
                },
                error: (error) => {
                    reject(error); // Si hay error, rechazamos la promesa
                }
            });
        });
    }

}
