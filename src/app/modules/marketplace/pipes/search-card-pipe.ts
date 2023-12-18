import { Pipe, PipeTransform } from '@angular/core';
import { AssetModel } from '@app/shared/models/asset.model';

@Pipe({
    name: 'search',
})
export class SearchPipe implements PipeTransform {
    public transform(value: Array<AssetModel>, searchValue: string) {
        if (!searchValue) return value;

        return value.filter(
            (v: AssetModel) =>
                v.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
                v.description.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
        );
    }
}