import { AbstractControl } from "@angular/forms";
import { NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";

export function notInArray(array: string[]) {
    return (control: AbstractControl): { [key: string]: any } => {
        const val = control.value;
        const result = array.map(x => x.toLowerCase()).includes(val.toLowerCase());
        if (result) {
            return null;
        }
        return { notInArray: true };
    }
}

export function isDateValid() {
    return (control: AbstractControl): { [key: string]: any } => {
        const date = control.value;

        if (!date || (typeof date != "string"
            && ("year" in date)
            && ("month" in date)
            && ("day" in date))) {
            return null;
        }
        return { invalid: true };
    };
}

export function checkTimeDIff(vanGetter: () => NgbTimeStruct, nachtzorgGetter: () => boolean) {
    return (control: AbstractControl): { [key: string]: any } => {
        const tot = control.value;
        const van = vanGetter();
        const nacthzorg = nachtzorgGetter();

        if (!van || !tot) {
            return null;
        }

        let diff = diffMinutes(van, tot);
        if (diff >= 0 && diff < 30) {
            return { intervalTooSmall: true };
        }
        if (nacthzorg) {
            return null;
        }
        if (diff <= 0) {
            return { totBeforeVan: true };
        }
    };
}


function diffMinutes(
    first: { hour: number; minute: number; second: number },
    second: { hour: number; minute: number; second: number }
): number {
    const firstDate: any = new Date(
        0,
        0,
        0,
        first.hour,
        first.minute,
        first.second
    );
    const secondDate: any = new Date(
        0,
        0,
        0,
        second.hour,
        second.minute,
        second.second
    );
    return Math.round((secondDate - firstDate) / (1000 * 60));
}