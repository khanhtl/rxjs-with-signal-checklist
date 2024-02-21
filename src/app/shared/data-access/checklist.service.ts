import { Injectable, computed, signal } from '@angular/core';
import { AddChecklist, Checklist, ChecklistId } from '../interfaces/checklist';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface ChecklistState {
  checklists: Checklist[];
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  // state
  private state = signal<ChecklistState>({
    checklists: [],
  });
  // selector
  checklists = computed(() => this.state().checklists);

  // sources

  add$ = new Subject<AddChecklist>();
  constructor() {
    // reducer
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklist) =>
      this.state.update((state) => ({
        ...state,
        checklists: [...state.checklists, this.addIdToChecklist(checklist)],
      }))
    );
  }

  addIdToChecklist(checklist: AddChecklist): Checklist {
    return {
      ...checklist,
      id: this.generateSlug(checklist.title),
    };
  }

  generateSlug(title: Checklist['title']): string {
    let slug = title.toLowerCase().replace(/\s+/g, '-');
    const matchingSlugs = this.checklists().find(
      (checklist) => checklist.id === slug
    );
    if (matchingSlugs) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }
}
