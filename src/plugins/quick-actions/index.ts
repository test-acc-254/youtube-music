import { t } from '@/i18n';
import { createPlugin } from '@/utils';

export default createPlugin<
  unknown,
  unknown,
  {
    keydownHandler: (event: KeyboardEvent) => void;
    start(): void;
    stop(): void;
  }
>({
  name: () => t('plugins.quick-actions.name'),
  description: () => t('plugins.quick-actions.description'),
  restartNeeded: false,
  renderer: {
    start() {
      this.keydownHandler = (event: KeyboardEvent) => {
        // Only trigger shortcuts when not typing in input fields
        if (
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement ||
          (event.target as Element)?.contentEditable === 'true'
        ) {
          return;
        }

        // Ctrl+Shift+S - Toggle Shuffle
        if (event.ctrlKey && event.shiftKey && event.key === 'S') {
          event.preventDefault();
          const shuffleBtn = document.querySelector<HTMLButtonElement>(
            'tp-yt-paper-icon-button[title*="Shuffle" i], tp-yt-paper-icon-button[title*="shuffle" i]'
          );
          shuffleBtn?.click();
        }

        // Ctrl+Shift+R - Toggle Repeat
        if (event.ctrlKey && event.shiftKey && event.key === 'R') {
          event.preventDefault();
          const repeatBtn = document.querySelector<HTMLButtonElement>(
            'tp-yt-paper-icon-button[title*="Repeat" i], tp-yt-paper-icon-button[title*="repeat" i]'
          );
          repeatBtn?.click();
        }

        // Ctrl+Shift+Q - Clear Queue
        if (event.ctrlKey && event.shiftKey && event.key === 'Q') {
          event.preventDefault();
          const clearQueueBtn = document.querySelector<HTMLButtonElement>(
            'tp-yt-paper-icon-button[title*="Clear" i]'
          );
          clearQueueBtn?.click();
        }

        // Ctrl+Shift+L - Toggle Like
        if (event.ctrlKey && event.shiftKey && event.key === 'L') {
          event.preventDefault();
          const likeBtn = document.querySelector<HTMLButtonElement>(
            'tp-yt-paper-icon-button.like:not(.dislike)'
          );
          likeBtn?.click();
        }

        // Ctrl+Shift+D - Toggle Dislike
        if (event.ctrlKey && event.shiftKey && event.key === 'D') {
          event.preventDefault();
          const dislikeBtn = document.querySelector<HTMLButtonElement>(
            'tp-yt-paper-icon-button.dislike'
          );
          dislikeBtn?.click();
        }
      };

      document.addEventListener('keydown', this.keydownHandler);
    },

    stop() {
      document.removeEventListener('keydown', this.keydownHandler);
    },
  },
});