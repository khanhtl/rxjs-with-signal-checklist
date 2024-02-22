import { ChecklistListComponent } from './ui/checklist-list.component';
import { Component, effect, inject, signal } from '@angular/core';
import { ModalComponent } from '../shared/ui/modal.component';
import { Checklist } from '../shared/interfaces/checklist';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormModalComponent } from '../shared/ui/form-modal.component';
import { ChecklistService } from '../shared/data-access/checklist.service';
@Component({
  standalone: true,
  imports: [ModalComponent, FormModalComponent, ChecklistListComponent],
  selector: 'app-home',
  template: `
    <h1>Quicklists</h1>
    <button (click)="checklistBeingEdited.set({})">Add Checklist</button>

    <app-modal [isOpen]="!!checklistBeingEdited()">
      <ng-template>
        <app-form-modal
          [formGroup]="checklistForm"
          [title]="checklistBeingEdited()?.title || 'Add Checklist'"
          (close)="checklistBeingEdited.set(null)"
          (save)="
            checklistBeingEdited()?.id
              ? checklistService.edit$.next({
                  id: checklistBeingEdited()!.id!,
                  data: checklistForm.getRawValue()
                })
              : checklistService.add$.next(checklistForm.getRawValue())
          "
        ></app-form-modal>
      </ng-template>
    </app-modal>
    <section>
      <h2>Your checklists</h2>
      <app-checklist-list
        (delete)="checklistService.remove$.next($event)"
        (edit)="checklistBeingEdited.set($event)"
        [checklists]="checklistService.checklists()"
      />
    </section>
  `,
  styles: [``],
})
export default class HomeComponent {
  fb = inject(FormBuilder);
  checklistService = inject(ChecklistService);
  checklistBeingEdited = signal<Partial<Checklist> | null>(null);
  checklistForm = this.fb.nonNullable.group({
    title: [''],
  });

  constructor() {
    effect(() => {
      const checklist = this.checklistBeingEdited();
      if (!checklist) {
        this.checklistForm.reset();
      } else {
        this.checklistForm.patchValue({
          title: checklist.title,
        });
      }
    });
  }
}
