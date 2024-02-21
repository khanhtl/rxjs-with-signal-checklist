import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { Checklist } from '../interfaces/checklist';
import { of } from 'rxjs';
import { ChecklistItem } from '../interfaces/checklist-item';

@Injectable({
  providedIn: 'root',
})
export class ChecklistStorageService {
  private storageService = inject(StorageService);

  loadChecklists() {
    const checklists = this.storageService.get('checklists');
    return of(checklists ? (JSON.parse(checklists) as Checklist[]) : []);
  }

  loadChecklistItems() {
    const checklistsItems = this.storageService.get('checklistItems');
    return of(
      checklistsItems ? (JSON.parse(checklistsItems) as ChecklistItem[]) : []
    );
  }

  saveChecklists(checklists: Checklist[]) {
    this.storageService.set('checklists', JSON.stringify(checklists));
  }

  saveChecklistItems(checklistItems: ChecklistItem[]) {
    this.storageService.set('checklistItems', JSON.stringify(checklistItems));
  }
}
