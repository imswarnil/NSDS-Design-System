/* Namaste UI — Input.
   =========================================================================
   The canonical implementation now lives in components/forms/Form.jsx, next
   to Field, Select, Textarea and the rest of the form family, and is styled
   by the shared .ns-input classes that the Ghost theme also renders.

   This file is kept as a re-export so existing imports from
   components/core/Input keep working. It previously held a second,
   inline-styled implementation — two Inputs that had already begun to differ
   from each other.

   Prefer wrapping it in <Field>, which supplies the label and wires
   aria-describedby to the help and error text:

     <Field label="Email" help="We send lesson updates here." error={err}>
       <Input type="email" />
     </Field>
*/
export { Input } from "../forms/Form.jsx";
