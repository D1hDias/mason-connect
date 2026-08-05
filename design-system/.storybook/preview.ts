import type { Preview } from '@storybook/react';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'cream',
      values: [
        { name: 'cream', value: '#F7F1E4' },
        { name: 'white', value: '#FFFFFF' },
      ],
    },
  },
};

export default preview;
