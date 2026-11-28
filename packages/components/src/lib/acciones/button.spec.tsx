import { createRef, type FormEvent } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconCheck, IconX } from '@my-ui/icons';
import { Button } from './button';
import { ButtonGroup } from './button-group';
import { IconButton } from './icon-button';

describe('Button', () => {
  it('es un botón nativo con su texto como nombre accesible', () => {
    render(<Button startIcon={<IconCheck />}>Guardar</Button>);
    const button = screen.getByRole('button', { name: 'Guardar' });
    expect(button.tagName).toBe('BUTTON');
  });

  it('es type="button" por defecto para no enviar formularios por accidente', () => {
    render(<Button>Cancelar</Button>);
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveAttribute('type', 'button');
  });

  it('envía el formulario solo con type="submit"', async () => {
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Cancelar</Button>
        <Button type="submit">Enviar</Button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onSubmit).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('se activa con clic, Enter y Espacio', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Guardar</Button>);
    await userEvent.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('deshabilitado no recibe foco ni clics', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Guardar
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Guardar' });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    await userEvent.tab();
    expect(onClick).not.toHaveBeenCalled();
    expect(button).not.toHaveFocus();
  });

  it('los íconos son decorativos', () => {
    const { container } = render(
      <Button startIcon={<IconCheck />} endIcon={<IconX />}>
        Guardar
      </Button>,
    );
    for (const svg of Array.from(container.querySelectorAll('svg'))) {
      expect(svg.closest('[aria-hidden="true"]')).not.toBeNull();
    }
  });

  it('pasa ref y props restantes al <button>', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} aria-describedby="ayuda" data-testid="b" className="w-full">
        Guardar
      </Button>,
    );
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(ref.current).toHaveAttribute('aria-describedby', 'ayuda');
    expect(ref.current).toHaveClass('w-full');
  });

  it('no tiene violaciones de axe en sus variantes', async () => {
    const { container } = render(
      <>
        <Button>Guardar</Button>
        <Button variant="outline">Vista previa</Button>
        <Button variant="ghost">Cancelar</Button>
        <Button tone="danger">Eliminar</Button>
        <Button disabled>Deshabilitado</Button>
      </>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});

describe('IconButton', () => {
  it('toma su nombre accesible de label y el ícono es decorativo', () => {
    const { container } = render(
      <IconButton label="Cerrar">
        <IconX />
      </IconButton>,
    );
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
    expect(container.querySelector('svg')?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('se activa con teclado', async () => {
    const onClick = vi.fn();
    render(
      <IconButton label="Cerrar" onClick={onClick}>
        <IconX />
      </IconButton>,
    );
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('no tiene violaciones de axe', async () => {
    const { container } = render(
      <IconButton label="Cerrar">
        <IconX />
      </IconButton>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});

describe('ButtonGroup', () => {
  it('es un grupo con nombre', () => {
    render(
      <ButtonGroup aria-label="Alineación">
        <Button>Izquierda</Button>
        <Button>Derecha</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole('group', { name: 'Alineación' });
    expect(group).toContainElement(screen.getByRole('button', { name: 'Izquierda' }));
  });

  it('pasa disabled a sus botones, y la prop del botón gana', () => {
    render(
      <ButtonGroup disabled aria-label="Acciones">
        <Button>Copiar</Button>
        <IconButton label="Cerrar">
          <IconX />
        </IconButton>
        <Button disabled={false}>Pegar</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('button', { name: 'Copiar' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Pegar' })).toBeEnabled();
  });

  it('cada botón es una parada de Tab', async () => {
    render(
      <ButtonGroup aria-label="Acciones">
        <Button>Uno</Button>
        <Button>Dos</Button>
      </ButtonGroup>,
    );
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Uno' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Dos' })).toHaveFocus();
  });

  it('no tiene violaciones de axe', async () => {
    const { container } = render(
      <ButtonGroup attached variant="outline" aria-label="Vista">
        <Button>Lista</Button>
        <Button>Cuadrícula</Button>
      </ButtonGroup>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
