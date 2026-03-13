/** Modelo de agentes aduanales */
export interface AgenteAduanal {
    /**Nombre agente aduanal */
    patente: string;
    /** Primer nombre del agente aduanal */
    nombreAgente: string;
    /** Primer apellido del agente aduanal */
    apellidoPaternoAgente: string;
    /** Segundo apellido del agente aduanal */
    apellidoMaternoAgente: string;
    /** RFC del agente aduanal */
    rfcModal: string;
    /** Razon social */
    razonSocial?: string;
}