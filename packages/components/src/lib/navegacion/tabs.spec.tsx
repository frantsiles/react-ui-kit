import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tab, TabList, TabPanel, Tabs, type TabsProps } from './tabs';

function Example(props: Partial<TabsProps>) {
  return (
    <Tabs {...props}>
      <TabList aria-label="Factura 2041">
        <Tab value="detalle">Detalle</Tab>
        <Tab value="pagos">Pagos</Tab>
        <Tab value="historial" disabled>
          Historial
        </Tab>
        <Tab value="notas">Notas</Tab>
      </TabList>
      <TabPanel value="detalle">Ferretería El Clavo, $ 120.000</TabPanel>
      <TabPanel value="pagos">
        <button type="button">Registrar pago</button>
      </TabPanel>
      <TabPanel value="historial">Sin cambios</TabPanel>
      <TabPanel value="notas">Entregar el lunes</TabPanel>
    </Tabs>
  );
}

const tab = (name: string) => screen.getByRole('tab', { name });

describe('Tabs', () => {
  it('tablist con nombre, la primera elegida y su panel nombrado por la pestaña', () => {
    render(<Example />);
    expect(screen.getByRole('tablist', { name: 'Factura 2041' })).toHaveAttribute('aria-orientation', 'horizontal');
    expect(tab('Detalle')).toHaveAttribute('aria-selected', 'true');
    expect(tab('Pagos')).toHaveAttribute('aria-selected', 'false');
    const panel = screen.getByRole('tabpanel', { name: 'Detalle' });
    expect(panel).toHaveTextContent('Ferretería El Clavo');
    expect(tab('Detalle')).toHaveAttribute('aria-controls', panel.id);
    // Solo se muestra el panel elegido
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
  });

  it('flechas cambian de pestaña (activación automática), saltan la deshabilitada y dan la vuelta', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Example onChange={onChange} />);
    await user.tab();
    expect(tab('Detalle')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(tab('Pagos')).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('pagos');
    expect(screen.getByRole('tabpanel', { name: 'Pagos' })).toBeInTheDocument();
    await user.keyboard('{ArrowRight}');
    expect(tab('Notas')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(tab('Detalle')).toHaveFocus();
    await user.keyboard('{End}');
    expect(tab('Notas')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(tab('Detalle')).toHaveFocus();
  });

  it('una sola parada de Tab en la lista; Tab entra al panel', async () => {
    const user = userEvent.setup();
    render(<Example defaultValue="pagos" />);
    await user.tab();
    expect(tab('Pagos')).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Registrar pago' })).toHaveFocus();
  });

  it('un panel sin nada enfocable recibe el foco', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.tab();
    expect(screen.getByRole('tabpanel', { name: 'Detalle' })).toHaveFocus();
  });

  it('activación manual: las flechas mueven el foco y Enter elige', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Example activation="manual" onChange={onChange} />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(tab('Pagos')).toHaveFocus();
    expect(tab('Detalle')).toHaveAttribute('aria-selected', 'true');
    expect(onChange).not.toHaveBeenCalled();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('pagos');
    expect(tab('Pagos')).toHaveAttribute('aria-selected', 'true');
  });

  it('vertical: aria-orientation y flechas arriba/abajo', async () => {
    const user = userEvent.setup();
    render(<Example orientation="vertical" />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(tab('Pagos')).toHaveFocus();
  });

  it('no llama a onChange al montar', () => {
    const onChange = vi.fn();
    render(<Example onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('controlado con value; la deshabilitada lo anuncia', () => {
    render(<Example value="notas" />);
    expect(tab('Notas')).toHaveAttribute('aria-selected', 'true');
    expect(tab('Historial')).toHaveAttribute('aria-disabled', 'true');
  });

  it('sin violaciones de axe', async () => {
    const { container } = render(<Example />);
    await expect(container).toHaveNoAxeViolations();
  });
});
