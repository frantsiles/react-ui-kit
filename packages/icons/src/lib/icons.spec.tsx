import { render } from '@testing-library/react';

import MyUiIcons from './icons';

describe('MyUiIcons', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MyUiIcons />);
    expect(baseElement).toBeTruthy();
  });
});
