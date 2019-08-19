import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { TextMask } from '@ng-holistic/clr-controls';
import { ClrFormLayouts, HlcClrFormComponent } from '@ng-holistic/clr-forms';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { FormFooterDataAccess } from '@ng-holistic/clr-common';
import { DataService } from './data.service';

const definition: ClrFormLayouts.ClrFormLayout = {
    kind: 'fields',
    fields: [
        {
            id: 'text',
            kind: 'TextField',
            props: {
                label: 'Text',
                placeholder: 'Type something'
            },
            validators: [Validators.required]
        },
        {
            id: 'num',
            kind: 'MaskField',
            props: {
                label: 'Number',
                placeholder: '0000000',
                mask: TextMask.int(7),
                unmask: TextMask.unmaskNumber
            }
        }
    ]
};

@Component({
  selector: 'my-app',
  template: `<hlc-clr-form [definition]="definition" #clrForm></hlc-clr-form><hlc-clr-form-footer [form]="clrForm.formGroup" [dataAccess]="dataAccess"></hlc-clr-form-footer>`
})
export class AppComponent implements AfterViewInit, OnDestroy {
    readonly dataAccess: FormFooterDataAccess;
    private readonly destroy$ = new Subject();

    definition = definition;

    @ViewChild(HlcClrFormComponent, { static: false }) hlcClrForm: HlcClrFormComponent;

    constructor(private readonly dataService: DataService) {
      this.dataAccess = {
            update(data: any) {
                return dataService.saveData(data);
            }
      };

    }

    ngAfterViewInit(): void {

        this.dataService
            .loadData()
            .pipe(
                take(1),
                takeUntil(this.destroy$)
            )
            .subscribe(val => {
                if (val) {
                    this.hlcClrForm.formGroup.setValue(val);
                }
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
    }
}
