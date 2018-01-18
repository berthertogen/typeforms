import { Injectable } from "@angular/core";
import { Employee } from "../models/employee";

@Injectable()
export class EmployeeService {
    public getFirstNames(query?: string) {
        return ["Alice", "Bob", "Christie", "Daniel", "Elena"].map(name => name.toLowerCase()).filter(name => name.includes(query ? query.toLowerCase() : ''));
    }
}