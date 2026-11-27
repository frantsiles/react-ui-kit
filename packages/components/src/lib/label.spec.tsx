import { render, screen } from '@testing-library/react';
import { ErrorMessage } from './error-message';
import { Label } from './label';

describe('Label', () => {
  it('se asocia con htmlFor', () => {
    render(
      <>
        <Label htmlFor="n">Nombre</Label>
        <input id="n" />
      </>,
    );
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
  });

  it('optionalText permite traducir', () => {
    render(
      <Label optional optionalText="(optional)">
        Phone
      </Label>,
    );
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('required tiene prioridad sobre optional', () => {
    render(
      <Label required optional>
        Nombre
      </Label>,
    );
    expect(screen.queryByText('(opcional)')).toBeNull();
  });
});

describe('ErrorMessage', () => {
  it('lleva ícono (decorativo) además del color', () => {
    const { container } = render(<ErrorMessage>Revisa el campo</ErrorMessage>);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Revisa el campo')).toBeInTheDocument();
  });
});
