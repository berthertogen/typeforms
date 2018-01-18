import { Typeform } from "../validation/typeform";
import { Employee } from "./employee";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-struct";

// could we (should we) somehow automate the creation of this wrapper class?
export class EmployeeTypeform extends Typeform<Employee> {
    get firstName() { return this.getField("firstName"); } // the strings in getField are statically analyzed (try IntelliSense)
    get lastName() { return this.getField("lastName"); } // being statically analyzed, any typos in the strings will be caught at compile-time
    get endOfContract() { return this.getField("endOfContract"); } // the getters know how to infer the returned object's type using the property key string [thanks to the keyof keyword]
    get workdayStart() { return this.getField("workdayStart"); }
    // get workdayEnd() { return this.getField("workdayEnd"); } // getters / setters in this class are opt in, providing further encapsulation if required
    get nightwork() { return this.getField("nightwork"); }

    get workdayStart$() { return this.getFieldObservable("workdayStart"); } // we can also expose fields as typed observables
    get nightwork$() { return this.getFieldObservable("nightwork"); }

    set endOfContract(value: NgbDateStruct) { this.setField("endOfContract", value); } // and we can also expose setters [which are fully typed as well, again thanks to keyof]
}