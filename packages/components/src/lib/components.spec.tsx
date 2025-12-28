import { render } from '@testing-library/react';

import MyUiComponents from './components';

describe('MyUiComponents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MyUiComponents />);
    expect(baseElement).toBeTruthy();
  });
});
