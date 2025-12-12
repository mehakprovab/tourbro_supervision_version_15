import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'map'
})
export class MapPipe implements PipeTransform {

    public transform<T, R>(
        thisArg: T,
        project: (t: T, ...others: any[]) => R,
        ...args: any[]): R {
        return project(thisArg, ...args);
    }

}
