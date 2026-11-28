import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton } from '../acciones/icon-button';
import { Tooltip } from './tooltip';

function Example(props: { disabled?: boolean }) {
  return (
    <Tooltip content="Copia el enlace al portapapeles" delay={0} closeDelay={0} {...props}>
      <IconButton label="Copiar enlace">
        <svg />
      </IconButton>
    </Tooltip>
  );
}

describe('Tooltip', () => {
  it('se muestra con el foco de teclado y describe al disparador', async () => {
    const user = userEvent.setup();
    render(<Example />);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.tab();
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Copia el enlace al portapapeles');
    // El nombre sigue siendo el del botón; el tooltip es la descripción
    const trigger = screen.getByRole('button', {
      name: 'Copiar enlace',
      description: 'Copia el enlace al portapapeles',
    });
    expect(trigger).toHaveFocus();
  });

  it('Escape lo oculta sin mover el foco', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await screen.findByRole('tooltip');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Copiar enlace' })).toHaveFocus();
  });

  // El hover con mouse se prueba en la historia (navegador real): jsdom no lo emula como React Aria espera.

  it('disabled no lo muestra', async () => {
    const user = userEvent.setup();
    render(<Example disabled />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Copiar enlace' })).toHaveFocus();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('sin violaciones de axe', async () => {
    const user = userEvent.setup();
    const { container } = render(<Example />);
    await user.tab();
    await expect(container).toHaveNoAxeViolations();
    await expect(await screen.findByRole('tooltip')).toHaveNoAxeViolations();
  });
});
