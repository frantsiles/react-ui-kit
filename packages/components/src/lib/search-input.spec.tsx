import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './search-input';

describe('SearchInput', () => {
  it('es un campo de búsqueda con tecla "buscar" en móvil', () => {
    render(<SearchInput aria-label="Buscar" />);
    const input = screen.getByRole('searchbox', { name: 'Buscar' });
    expect(input).toHaveAttribute('enterkeyhint', 'search');
  });

  it('muestra el botón de limpiar solo cuando hay texto', async () => {
    render(<SearchInput aria-label="Buscar" />);
    expect(screen.queryByRole('button', { name: 'Limpiar búsqueda' })).toBeNull();
    await userEvent.type(screen.getByRole('searchbox'), 'hola');
    expect(screen.getByRole('button', { name: 'Limpiar búsqueda' })).toBeInTheDocument();
  });

  it('limpiar (no controlado) vacía, devuelve el foco y avisa', async () => {
    const onClear = vi.fn();
    const onChange = vi.fn();
    render(<SearchInput aria-label="Buscar" defaultValue="hola" onClear={onClear} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }));
    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ target: input }));
    expect(screen.queryByRole('button', { name: 'Limpiar búsqueda' })).toBeNull();
  });

  it('limpiar (controlado) dispara onChange con valor vacío', async () => {
    function Controlled() {
      const [value, setValue] = useState('hola');
      return <SearchInput aria-label="Buscar" value={value} onChange={(e) => setValue(e.target.value)} />;
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }));
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });

  it('Escape limpia y no se propaga (no cierra un diálogo contenedor)', async () => {
    const onParentKeyDown = vi.fn();
    render(
      <div onKeyDown={onParentKeyDown}>
        <SearchInput aria-label="Buscar" defaultValue="hola" />
      </div>,
    );
    const input = screen.getByRole('searchbox');
    input.focus();
    await userEvent.keyboard('{Escape}');
    expect(input).toHaveValue('');
    expect(onParentKeyDown).not.toHaveBeenCalled();
  });

  it('Escape sin texto sí se propaga', async () => {
    const onParentKeyDown = vi.fn();
    render(
      <div onKeyDown={onParentKeyDown}>
        <SearchInput aria-label="Buscar" />
      </div>,
    );
    screen.getByRole('searchbox').focus();
    await userEvent.keyboard('{Escape}');
    expect(onParentKeyDown).toHaveBeenCalled();
  });

  it('deshabilitado no ofrece limpiar', () => {
    render(<SearchInput aria-label="Buscar" defaultValue="hola" disabled />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<SearchInput aria-label="Buscar productos" defaultValue="zapatos" />);
    await expect(container).toHaveNoAxeViolations();
  });
});
