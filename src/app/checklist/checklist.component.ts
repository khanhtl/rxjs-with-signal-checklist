import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ModalComponent } from '../shared/ui/modal.component';
import { ChecklistItem } from './../shared/interfaces/checklist-item';
import { FormModalComponent } from './../shared/ui/form-modal.component';
import { ChecklistItemService } from './data-access/checklist-item.service';
import { ChecklistHeaderComponent } from './ui/checklist-header.component';
import { ChecklistItemListComponent } from './ui/checklist-item-list.component';
@Component({
  standalone: true,
  imports: [
    ChecklistHeaderComponent,
    ModalComponent,
    FormModalComponent,
    ChecklistItemListComponent,
  ],
  selector: 'app-checklist',
  template: `
    @if(checklist(); as checklist) {
    <app-checklist-header
      (addItem)="checklistItemBeingEdited.set({})"
      (reset)="checklistItemService.reset$.next($event)"
      [checklist]="checklist"
    />
    <app-checklist-item-list
      [checklistItems]="checklistItems()"
      (delete)="checklistItemService.remove$.next($event)"
      (edit)="checklistItemBeingEdited.set($event)"
      (toggle)="checklistItemService.toggle$.next($event)"
    />
    }
    <app-modal [isOpen]="!!checklistItemBeingEdited()">
      <ng-template>
        <app-form-modal
          [formGroup]="checklistItemForm"
          title="Crete item"
          (save)="
            checklistItemBeingEdited()?.id
        ? checklistItemService.edit$.next({
          id: checklistItemBeingEdited()!.id!,
          data: checklistItemForm.getRawValue(),
        })
        : checklistItemService.add$.next({
          item: checklistItemForm.getRawValue(),
          checklistId: checklist()?.id!,
        })
          "
          (close)="checklistItemBeingEdited.set(null)"
        />
      </ng-template>
    </app-modal>
  `,
  styles: [``],
})
export default class ChecklistComponent {
  checklistService = inject(ChecklistService);
  checklistItemService = inject(ChecklistItemService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  checklistItemBeingEdited = signal<Partial<ChecklistItem | null>>(null);

  params = toSignal(this.route.paramMap);

  checklist = computed(() =>
    this.checklistService
      .checklists()
      .find((checklist) => checklist.id === this.params()?.get('id'))
  );

  checklistItems = computed(() =>
    this.checklistItemService
      .checklistItems()
      .filter((item) => item.checklistId === this.params()?.get('id'))
  );

  checklistItemForm = this.fb.nonNullable.group({
    title: [''],
  });

  constructor() {
    effect(() => {
      const checklistItem = this.checklistItemBeingEdited();
      if (!checklistItem) {
        this.checklistItemForm.reset();
      } else {
        this.checklistItemForm.patchValue({
          title: checklistItem.title,
        });
      }
    });
  }
}
