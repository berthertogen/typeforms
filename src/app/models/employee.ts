import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

export interface Employee {
    firstName: string;
    lastName: string;
    endOfContract?: NgbDateStruct;
    workdayStart: NgbTimeStruct;
    workdayEnd: NgbTimeStruct;
    nightwork: boolean;
}