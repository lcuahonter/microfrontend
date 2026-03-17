export interface DatosGeneralesModel {
    codigo: string;
    mensaje: string;
    datos: {
        rfc_original: string;
        rfc_vigente: string;
        rfc_solicitado: string;
        bo_id: string;
        person_id: string;
        actividades: [
            {
                c_actividad: string;
                d_actividad: string;
                orden: string;
                porcentaje: string;
                f_alta_act: string;
                f_baja_act: string;
            }
        ];
        grupo_empresas:string;
        identificacion: {
            tipo_persona: string;
            clave_segmento: string;
            descripcion_segmento: string;
            curp: string | null;
            nit: string;
            razon_social: string;
            tipo_sociedad: string;
            nombre: string | null;
            ap_paterno: string | null;
            ap_materno: string | null;
            nombre_comercial: string | null;
            fecha_nacimiento: string | null;
            fecha_constitucion: string;
            nacionalidad: string | null;
            fechaInicio_operacion: string;
            c_sit_cont: string;
            c_det_sit_cont: string;
            d_sit_cont: string;
            f_sit_cont: string;
            c_sit_dom: string;
            d_sit_dom: string;
            c_sit_cont_dom: string;
            d_sit_cont_dom: string;
            pais_origen: string;
            df_tipo: string;
            df_folio: string;
            df_f_inicio: string;
            df_f_fin: string;
            email: string;
        };
        ubicacion: {
            c_alr: string;
            d_alr: string;
            calle: string;
            n_exterior: string;
            n_interior: string;
            c_colonia: string;
            d_colonia: string;
            c_localidad: string;
            d_localidad: string;
            d_calle_1: string;
            d_calle_2: string;
            d_Referencia: string;
            t_inmueble: string;
            d_inmueble: string;
            t_vialidad: string;
            d_vialidad: string;
            cp: string;
            c_municipio: string;
            d_municipio: string;
            c_ent_fed: string;
            d_ent_fed: string;
            telefono_1: string;
            t_tel_1: string;
            telefono_2: string;
            t_tel_2: string;
            email: string | null;
            f_alta_dom: string | null;
            pais_residencia: string;
            caract_domicilio: string;
            c_crh: string;
            d_crh: string;
        };
    };
}