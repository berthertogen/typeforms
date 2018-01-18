----------
# Statically-Typed Angular Reactive Forms (Typeforms)

## Usage

Define the interface which describes your form

> employee.ts
```ts
export interface Employee {
    firstName: string;
    lastName: string;
    endOfContract?: NgbDateStruct;
    workdayStart: NgbTimeStruct;
    workdayEnd: NgbTimeStruct;
    nightwork: boolean;
}
```

Define a typeform class which extends Typeform < your form's interface >

> employee.typeform.ts

```ts
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
```

Instantiate your Typeform class and store it in yoru component code-behind

> app.component.ts

```ts
	form: EmployeeTypeform;

	ngOnInit(): void {
		// note : Fields<T> == { [keys of T]: any }
	    this.form = new EmployeeTypeform(this.formBuilder.group(<Fields<Employee>>
	    {
		  ...
	      lastName: ['', Validators.required], // form field (statically typed): [initial value (!not statically typed!), followed by a validator (or a list of validators aggregated with Validators.compose[...validators]))]
	      ...
	    }));
	  }
```

To consume the fields in your HTML :

> app.component.html

```html
<form [formGroup]='form?.formGroup' novalidate>
	...
	        <input formControlName="firstName" [class.is-invalid]="form?.hasErrors('firstName')" ... />
		    <div *ngIf="form?.hasError('firstName', 'required')">
		       First Name is required
		    </div>
	...
</form>
```

## Advanced usages

To manually trigger validation of the form

```ts
    this.form.validate({...props}); // 0 or more statically-analyzed form fields (0 = entire form validation)

```
To observe changes in a form field
	
```ts
	this.revalidateWorkdayEndSubscription =
	this.form.workdayStart$.combineLatest(this.form.nightwork$)
		.subscribe(time => this.form.validate("workdayEnd")); // string is statically analyzed
```

### Inheritance

Here is a sample use of Typeforms + inheritance

```ts
export interface IBaseForm {
	// base form fields
}

export class BaseTypeform<IForm extends IBaseForm> extends Typeform<IBaseForm> {
	// base form getters / setters
}

export interface IAForm {
	// A form specific fields
}

export class ATypeform extends BaseTypeform<IAForm> {
	// A form specific getters / setters
}

export interface IBForm {
	// B form specific fields
}

export class BTypeform extends BaseTypeform<IBForm> {
	// B form specific getters / setters
}

```

## Behind the scenes

This is all possible through the power of the `keyof` operator, as well as generic constraints. For more information, please see the implementation of `validation/typeform.ts`.

## Room for improvement

* Is there a way to achieve inheritance / composition for the `FormBuilder.group()` blueprint parameter? This more specifically translates to :
	* Can we isolate the creation of the object into a factory (with one or more input parameters, perhaps typed to the same interface)
	* Is there a better way of writing validators for interdependent fields
	* Is it possible / better to have a wrapper factory create the entire Typeform (taking in the `FormBuilder`, an initial state object satisfying the form interface and a [field] -> [...validators] map)? This would enforce the structure of the object further, imposing the shape of the initial state and validators list.
* What do we do with tree-shaped form topologies
	* This would be particularly useful within trees of form-featuring components, such as custom controls or subforms
	* Would it make sense to have a `Children` property on Typeforms and include it during validation in an ancestral way? (children invalid => parent invalid)