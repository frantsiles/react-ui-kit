import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconCheck } from '@my-ui/icons';
import { Badge } from './badge';
import { Tag } from './tag';

describe('Tag', () => {
  it('no es interactivo por defecto', () => {
    render(<Tag>Diseño</Tag>);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('el botón de quitar tiene nombre accesible derivado del texto', async () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>Diseño</Tag>);
    await userEvent.click(screen.getByRole('button', { name: 'Quitar Diseño' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('se puede quitar con teclado', async () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>Diseño</Tag>);
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Quitar Diseño' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('removeLabel personaliza el nombre accesible', () => {
    render(
      <Tag onRemove={() => undefined} removeLabel="Quitar filtro de color">
        <strong>Rojo</strong>
      </Tag>,
    );
    expect(screen.getByRole('button', { name: 'Quitar filtro de color' })).toBeInTheDocument();
  });

  it('avisa en desarrollo si falta removeLabel con contenido no textual', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <Tag onRemove={() => undefined}>
        <strong>Rojo</strong>
      </Tag>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('removeLabel'));
    warn.mockRestore();
  });

  it('muestra el texto completo como title (por si se trunca)', () => {
    render(<Tag>Un texto muy largo</Tag>);
    expect(screen.getByText('Un texto muy largo')).toHaveAttribute('title', 'Un texto muy largo');
  });

  it('disabled deshabilita el botón de quitar', () => {
    render(
      <Tag onRemove={() => undefined} disabled>
        Diseño
      </Tag>,
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <div>
        <Tag tone="success" icon={<IconCheck />}>
          Aprobado
        </Tag>
        <Tag tone="danger" onRemove={() => undefined}>
          Rechazado
        </Tag>
      </div>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});

describe('Badge', () => {
  it('srText agrega contexto solo para lectores de pantalla', () => {
    render(
      <button type="button">
        Mensajes <Badge srText="sin leer">3</Badge>
      </button>,
    );
    expect(screen.getByRole('button', { name: 'Mensajes 3 sin leer' })).toBeInTheDocument();
    expect(screen.getByText('sin leer')).toHaveClass('sr-only');
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<Badge tone="danger">Nuevo</Badge>);
    await expect(container).toHaveNoAxeViolations();
  });
});
