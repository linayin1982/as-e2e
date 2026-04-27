import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CaseNotesPage extends BasePage {
  // Create note section
  readonly createNoteHeading: Locator;
  readonly noteTextarea: Locator;
  readonly clearAllButton: Locator;
  readonly saveNoteButton: Locator;
  readonly noteDisclaimer: Locator;

  // Notes history section
  readonly notesHistoryHeading: Locator;
  readonly latestNotesButton: Locator;
  readonly noNotesMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.createNoteHeading = page.getByRole('heading', { name: 'Create note', level: 2 });
    this.noteTextarea = page.getByRole('textbox', { name: 'Insert information and context regarding the case' });
    this.clearAllButton = page.getByRole('button', { name: 'Clear all' });
    this.saveNoteButton = page.getByRole('button', { name: 'Save note' });
    this.noteDisclaimer = page.getByText('Avoid entering personal information');

    this.notesHistoryHeading = page.getByRole('heading', { name: 'Notes history', level: 2 });
    this.latestNotesButton = page.getByRole('button', { name: 'Latest notes' });
    this.noNotesMessage = page.getByText('There are no notes related to this case yet.');
  }

  async createNote(text: string): Promise<void> {
    await this.noteTextarea.fill(text);
    await this.saveNoteButton.click();
  }

  async clearNote(): Promise<void> {
    await this.clearAllButton.click();
  }
}
