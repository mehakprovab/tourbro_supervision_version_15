import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'typeof'
})
export class TypeofPipe implements PipeTransform {

    public transform(value: any) {
        return typeof value;
    }

}