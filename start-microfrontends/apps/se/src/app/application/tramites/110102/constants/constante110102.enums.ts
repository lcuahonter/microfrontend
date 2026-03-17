/**
 * Constante que define las opciones de los radios que existen
 * 
 * @constant RADIO_OPCIONS
 * @description Opciones de radio.
 */
export const RADIO_OPCIONS = [
  { label: 'Programa IMMEX vigente', value: 'CEXPA.01' },
  { label: 'Haber exportador al menos una ocasionya sea en el ultimo ano fiscal o en los ultimos 12 meses anteriores immediatos a partir de la fecha de la solicitud', value: 'CEXPA.02' },
  { label: 'La mercancia a exportar es un producto perecedero', value: 'CEXPA.03' },
  { label: 'La mercancia a exportar es un producto artesanal', value: 'CEXPA.04' }
];

/**
 * @constante ERROR_FORMA_ALERT
 * @tipo {string}
 * @exportado
 * @descripcion
 * Template HTML para mostrar mensajes de error cuando faltan campos obligatorios en formularios.
 * 
 * @estructura_html
 * Utiliza clases de Bootstrap 4/5 para:
 * - **d-flex**: Contenedor flex para centrado
 * - **justify-content-center**: Alineación horizontal al centro
 * - **text-center**: Alineación de texto al centro
 * - **col-md-12**: Ancho completo en pantallas medianas y superiores
 * 
 * @mensaje_contenido
 * "Faltan campos por capturar."
 * - Mensaje claro e informativo
 * - Lenguaje directo y comprensible
 * - Orienta al usuario sobre la acción necesaria
 * - Evita tecnicismos innecesarios
 * 
 * @casos_uso
 * - **Validación de formularios**: Mostrado cuando hay campos vacíos requeridos
 * - **Alertas modales**: Contenido de modales de error
 * - **Mensajes toast**: Notificaciones temporales de error
 * - **Validaciones en tiempo real**: Feedback inmediato al usuario
 * 
 * @patron_centrado
 * El diseño centrado es ideal para:
 * - Atraer atención del usuario al mensaje
 * - Proporcionar simetría visual en la interfaz
 * - Mantener consistencia con otros mensajes de error
 * - Facilitar lectura en diferentes tamaños de pantalla
 * 
 * @integracion_angular
 * ```typescript
 * // Uso con innerHTML
 * this.alertContainer.nativeElement.innerHTML = ERROR_FORMA_ALERT;
 * 
 * // Uso con DomSanitizer
 * this.alertHtml = this.sanitizer.bypassSecurityTrustHtml(ERROR_FORMA_ALERT);
 * ```
 * 
 * @responsive_design
 * - Se adapta a diferentes tamaños de pantalla
 * - Mantiene centrado en dispositivos móviles
 * - Compatible con grid system de Bootstrap
 * 
 * @accesibilidad
 * Considerar agregar:
 * - Atributos ARIA para lectores de pantalla
 * - Roles semánticos (role="alert")
 * - Contraste de colores apropiado
 * 
 * @personalización
 * Template base que permite:
 * - Modificar clases CSS según el theme
 * - Agregar iconos de error
 * - Incluir animaciones de entrada/salida
 * - Adaptar a diferentes frameworks CSS
 */
export const ERROR_FORMA_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Faltan campos por capturar.
    </div>
  </div>
</div>
`