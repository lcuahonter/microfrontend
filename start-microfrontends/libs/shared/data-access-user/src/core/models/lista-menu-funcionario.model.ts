

/**
 * Representa un elemento de menú para un funcionario.
 * @property label Texto visible del menú.
 * @property icon Icono asociado.
 * @property route Ruta de navegación.
 * @property classbutton (Opcional) Clase CSS para el botón.
 */
export interface MenuFuncionario {
    label: string;
    icon: string;
    route: string;
    classbutton?: string;
}