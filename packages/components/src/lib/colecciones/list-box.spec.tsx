import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ListBox, ListBoxItem, ListBoxSection } from './list-box';

const items = (
  <>
    <ListBoxItem value="clavo">Ferretería El Clavo</ListBoxItem>
    <ListBoxItem value="aurora" description="Cliente desde 2021">
      Panadería La Aurora
    </ListBoxItem>
    <ListBoxItem value="cerrada" disabled>
      Librería Cerrada
    </ListBoxItem>
    <ListBoxItem value="sol">Farmacia del Sol</ListBoxItem>
  </>
);

interface SingleProps {
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string | null) => void;
}

function Single(props: SingleProps) {
  return (
    <ListBox aria-label="Cliente" {...props}>
      {items}
    </ListBox>
  );
}

describe('ListBox', () => {
  it('listbox con nombre y opciones', () => {
    render(<Single />);
    const listbox = screen.getByRole('listbox', { name: 'Cliente' });
    expect(listbox).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(4);
    // La descripción es parte del nombre, como en un <option> nativo
    expect(screen.getByRole('option', { name: 'Panadería La Aurora Cliente desde 2021' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Librería Cerrada' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('elige con el mouse y llama a onChange con el valor', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Single onChange={onChange} />);
    await user.click(screen.getByRole('option', { name: 'Farmacia del Sol' }));
    expect(onChange).toHaveBeenLastCalledWith('sol');
    expect(screen.getByRole('option', { name: 'Farmacia del Sol' })).toHaveAttribute('aria-selected', 'true');
  });

  it('teclado: flechas saltan las deshabilitadas, Enter elige, letras buscan', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Single defaultValue="aurora" onChange={onChange} />);
    await user.tab();
    // El foco entra en la opción elegida
    expect(screen.getByRole('option', { name: /^Panadería La Aurora/ })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Farmacia del Sol' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('sol');
    await user.keyboard('fe');
    expect(screen.getByRole('option', { name: 'Ferretería El Clavo' })).toHaveFocus();
  });

  it('controlado', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState<string | null>('clavo');
      return (
        <>
          <Single value={value} onChange={setValue} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('option', { name: 'Farmacia del Sol' }));
    expect(screen.getByRole('status')).toHaveTextContent('sol');
    // Volver a elegir la misma no la desmarca
    await user.click(screen.getByRole('option', { name: 'Farmacia del Sol' }));
    expect(screen.getByRole('status')).toHaveTextContent('sol');
  });

  it('selección múltiple', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ListBox aria-label="Clientes" selectionMode="multiple" defaultValue={['clavo']} onChange={onChange}>
        {items}
      </ListBox>,
    );
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    await user.click(screen.getByRole('option', { name: 'Farmacia del Sol' }));
    expect(onChange).toHaveBeenLastCalledWith(['clavo', 'sol']);
    await user.click(screen.getByRole('option', { name: 'Ferretería El Clavo' }));
    expect(onChange).toHaveBeenLastCalledWith(['sol']);
  });

  it('secciones con título', () => {
    render(
      <ListBox aria-label="Cliente">
        <ListBoxSection title="Frecuentes">
          <ListBoxItem value="clavo">Ferretería El Clavo</ListBoxItem>
        </ListBoxSection>
        <ListBoxSection title="Otros">
          <ListBoxItem value="sol">Farmacia del Sol</ListBoxItem>
        </ListBoxSection>
      </ListBox>,
    );
    expect(screen.getByRole('group', { name: 'Frecuentes' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Otros' })).toBeInTheDocument();
  });

  it('vacía muestra el texto de useMessages', () => {
    render(<ListBox aria-label="Cliente">{null}</ListBox>);
    expect(screen.getByText('Sin opciones')).toBeInTheDocument();
  });

  it('sin violaciones de axe', async () => {
    const { container } = render(<Single defaultValue="clavo" />);
    await expect(container).toHaveNoAxeViolations();
  });
});
