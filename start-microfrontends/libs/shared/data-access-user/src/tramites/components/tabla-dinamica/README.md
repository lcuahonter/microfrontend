# To use TablaDinamicaComponent in the application

* Import TablaDinamicaComponent in your module or directly in standalone components.
* Provide datos and configuracionTabla as inputs.
* Enable Search / Sort / Pagination through input flags.
* Listen to events for user interactions like row selection, search input, sort click, pagination change.

# For Search, Sort, Pagination Configuration

1. Search Functionality
    a. Mode CLIENT:
        * Local filtering handled within the component.
        * Example: [mode]="'client'" [showSearch]="true"
    b. Mode SERVER:
        * Emits searchChanged event. Parent must handle API call.
        * Example: [mode]="'server'" [showSearch]="true" (searchChanged)="onSearchChanged($event)"

2. Sort Functionality:
    a. Mode CLIENT:
        * Local sorting handled within the component.
        * Example: [mode]="'client'" [showSort]="true"
    b. Mode SERVER:
        * Emits sortEvent with column and direction.
        * Parent handles API sort and data fetch.
        * Example: [mode]="'server'" (sortEvent)="onSortEvent($event)"

3. Pagination Functionality:
    a. Mode CLIENT:
        * Internal slicing handled by the component.
        * Example: [showPagination]="true" [mode]="'client'"
    b. Mode SERVER:
        * Emits pageChange and itemsPerPageChange.
        * Parent handles paginated data API.
        * Example: (pageChange)="onPageChange($event)" (itemsPerPageChange)="onItemsPerPageChange($event)"

# Row Selection Modes

1. RADIO:
    a. Single row selection emits filaSeleccionada event.
    b. Example: [tipoSeleccionTabla]="TablaSeleccion.RADIO"

2. CHECKBOX:
    a. Multiple row selection emits listaDeFilaSeleccionada event.
    b. Example: [tipoSeleccionTabla]="TablaSeleccion.CHECKBOX"

# Inputs Configuration

1. datos - Pass the data array.
2. configuracionTabla - Column configuration array.
3. acciones - Pass table action buttons (optional).
4. filasSeleccionadas - To set selected checkboxes.
5. inputSelection - To set selected radio row.
6. desactivarEmitirEvento - Disable row click event (optional).
7. desactivarButton - Disable action buttons in rows (optional).
8. totalItems - For server-side pagination.
9. itemsPerPage - Items per page count.
10. currentPage - Current page number.
11. disableSeleccionTablaCheckBox - Disable checkbox selection.
12. disableSeleccionTablaRadio - Disable radio selection.
13. tableId -  Unique identifier for the table. Useful for differentiating multiple table instances in the DOM or when handling events specifically for a table.
14. showSort - Enables sorting UI on column headers. When set to true, allows user to sort by clicking on column titles.
15. showSearch - Displays the search input above the table. Enables search functionality either locally (client mode) or triggers an event (server mode).
16. showPagination - Enables pagination controls (page numbers, next/previous buttons, items per page) at the bottom of the table.
17. mode - Defines how search, sort, and pagination are handled.
    a.  'client': Operations are performed internally within the component.
    b.  'server': Component emits events and parent handles API logic for search, sort, pagination.
18. tipoSeleccionTabla - Defines the selection mode for rows.
    a.TablaSeleccion.RADIO: Single selection via radio button.
    b.TablaSeleccion.CHECKBOX: Multi-selection via checkboxes.

# Outputs (Events)

1. filaSeleccionada - Emits selected row object.
2. listaDeFilaSeleccionada - Emits selected row list.
3. searchChanged - Emits search string.
4. sortEvent - Emits sorting column and direction.
5. pageChange - Emits current page number.
6. itemsPerPageChange - Emits items per page.
7. filaClic - Emits on row click.
8.  alternarValor - Emits when toggling values within a row.

# Handling Input Array Mutations in Child Components (Immutable Push Pattern)

If you modify the input array in-place like this: this.personas.push(DATOS);
The reference of the array remains the same, so Angular's OnPush strategy will not detect the change, and the child component (table, list, etc.) won't re-render.

# Solution: Use Immutable Array Update
To ensure the parent and child components detect the change and trigger re-rendering:
1. Create a new array reference.
2. Emit the updated array via EventEmitter.
3. Update the Store (optional, if state management is used).
4. Reset the form (if applicable).
Example Code:
if (!EXISTE_TERCERO) {
  this.personas = [...this.personas, DATOS]; // Immutable Array Update
  this.personasChange.emit(this.personas);   // Notify Parent Component
  this.tercerosStore.setTerceros(this.personas); // Update Store (Optional)
  this.FormPersona.reset(); // Reset Form State
}
# Validation Error and border
default
- The isInvalida input defaults to false.
- You must explicitly pass a value from the parent to trigger the validation behavior.
When `[isInvalida] = true`:
- A red border is applied to the table.
- A validation message (`"Este campo es obligatorio."`) is displayed below the table.
Reference 
- apps\cofepris\src\app\application\shared\components\datos-de-la-solicitud
- Procedure 260214 – datos-de-la-solicitud