## How to use the Formbuilder reusable component - (formas-dinamicas)

Path to the component "libs/shared/data-access-user/src/tramites/components/formas-dinamicas/"

Component Reference path: "apps/cofepris/src/app/application/tramites/261702/components/permisoDesistir.component.ts"

JSON Reference Path: "apps/cofepris/src/app/application/tramites/261702/constantes/retiros-cofepris.enum.ts"

Step 1: Populate the @Input  properties (formularioTitulo, forma, formularioDatos, and state) in the parent component.

`formularioTitulo` =>  formTitle (optional)

`forma` => create a form and inside create an empty child formgroup and pass that formgroup to this reusable component

`formularioDatos` => create json as mentioned in the reference

`state` => store the state in the parent component and pass the state as input to this reusable component

`soloLectura` => for handling the disabled state

`templateMap` => its purpose is to let you pass in a collection of Angular templates that can be rendered dynamically

`label-only` => Renders only the label associated with a form field without displaying an input control.

STEP 2: Handle all the field related functionalities in the parent component(can refer the component as mentioned above)

## Handling Validations for Formbuilder component
1. Inbuilt validators - Validators like `required, minlength, maxlength and pattern` are implemented directly in the reusable component. Just required to pass the validators in the json.

2. Backend-driven validations - Use the setError function on the formcontrol to display the error messages returned from the backend in the parent component.

3. Custom validators - Define the custom validation functions in the parent component and use the setError function on the formcontrol to display the error messages returned from the backend in the parent component.

## Handling State Management

1. Have used `emitirCambioDeValor` output event for emitting the changed values of the form controls in the formbuilder component.

2. This event can be used to handle the state management (i.e) update the state in the store and query the store to fetch the state and pass the state to the formbuilder component such that this component will take care of the rest.

## Example usage of 'templateMap'

Step 1: in json

{
    id: 'customSection',
    labelNombre: '',
    campo: '',
    clase: 'col-md-12',
    tipoInput: 'custom-html',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 5,
    templateKey: 'customSection',
  },

  Step 2: in parent component ts file 

  @ViewChild('customTemplate') customTemplate!: TemplateRef<unknown>;

  public templateMap: Record<string, TemplateRef<unknown>> = {};

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.templateMap = {
        customSection: this.customTemplate
      };
    });
  }

  Step 3: in parent component template

  <formas-dinamicas
    [forma]="ninoFormGroupUno"
    [formularioDatos]="formDataUno"
    [templateMap]="templateMap"
    (emitirCambioDeValor)="establecerCambioDeValorUno($event)"
></formas-dinamicas>

  <ng-template #customTemplate>
    @if (mostrarAlertaUno) {
        <div class="alert alert-info">
            <div class="form-check">
                <p>
                Anexar copia del documento expedido por la SCT, con el que acredite
                que cuenta con la concesión o el permiso vigente para prestar el
                servicio de transporte ferroviario de carga.
                </p>
            </div>
        </div>
    }
  </ng-template>

  This way we can inject any dynamic content (including alerts, tables, custom html inputs and so on) to formas-dinamicas component to avoid breaks in the parent component

  



