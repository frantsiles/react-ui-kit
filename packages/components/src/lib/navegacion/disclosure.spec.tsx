import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, AccordionItem, Disclosure, type AccordionProps } from './disclosure';

const button = (name: string) => screen.getByRole('button', { name });

describe('Disclosure', () => {
  it('botón dentro de un encabezado, cerrado al inicio y con aria-controls', () => {
    render(<Disclosure title="Condiciones de pago">Treinta días desde la fecha de la factura.</Disclosure>);
    const trigger = button('Condiciones de pago');
    expect(screen.getByRole('heading', { level: 3, name: 'Condiciones de pago' })).toContainElement(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Treinta días desde la fecha de la factura.')).not.toBeVisible();
    const panelId = trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId ?? '')).toHaveTextContent('Treinta días');
  });

  it('se abre y se cierra con clic, Enter y Espacio', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Disclosure title="Condiciones de pago" onOpenChange={onOpenChange}>
        Treinta días.
      </Disclosure>,
    );
    await user.click(button('Condiciones de pago'));
    expect(button('Condiciones de pago')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Treinta días.')).toBeVisible();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await user.keyboard('{Enter}');
    expect(button('Condiciones de pago')).toHaveAttribute('aria-expanded', 'false');
    await user.keyboard(' ');
    expect(button('Condiciones de pago')).toHaveAttribute('aria-expanded', 'true');
  });

  it('headingLevel, defaultOpen y disabled', () => {
    render(
      <Disclosure title="Notas" headingLevel={2} defaultOpen disabled>
        Sin notas.
      </Disclosure>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Notas' })).toBeInTheDocument();
    expect(button('Notas')).toHaveAttribute('aria-expanded', 'true');
    expect(button('Notas')).toBeDisabled();
  });

  it('sin violaciones de axe, cerrado y abierto', async () => {
    const { container, rerender } = render(<Disclosure title="Notas">Sin notas.</Disclosure>);
    await expect(container).toHaveNoAxeViolations();
    rerender(
      <Disclosure title="Notas" open>
        Sin notas.
      </Disclosure>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});

function Faq(props: Partial<AccordionProps>) {
  return (
    <Accordion {...props}>
      <AccordionItem value="plazo" title="¿Cuándo vence una factura?">
        A los treinta días.
      </AccordionItem>
      <AccordionItem value="moneda" title="¿En qué moneda facturo?">
        En pesos.
      </AccordionItem>
      <AccordionItem value="anular" title="¿Puedo anular una factura?" disabled>
        Con una nota de crédito.
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('abrir una sección cierra la otra', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Faq defaultValue={['plazo']} onChange={onChange} />);
    expect(button('¿Cuándo vence una factura?')).toHaveAttribute('aria-expanded', 'true');
    await user.click(button('¿En qué moneda facturo?'));
    expect(button('¿En qué moneda facturo?')).toHaveAttribute('aria-expanded', 'true');
    expect(button('¿Cuándo vence una factura?')).toHaveAttribute('aria-expanded', 'false');
    expect(onChange).toHaveBeenLastCalledWith(['moneda']);
  });

  it('multiple deja varias abiertas', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Faq multiple onChange={onChange} />);
    await user.click(button('¿Cuándo vence una factura?'));
    await user.click(button('¿En qué moneda facturo?'));
    expect(onChange).toHaveBeenLastCalledWith(['plazo', 'moneda']);
    expect(button('¿Cuándo vence una factura?')).toHaveAttribute('aria-expanded', 'true');
  });

  it('Tab recorre los botones habilitados en orden', async () => {
    const user = userEvent.setup();
    render(<Faq />);
    await user.tab();
    expect(button('¿Cuándo vence una factura?')).toHaveFocus();
    await user.tab();
    expect(button('¿En qué moneda facturo?')).toHaveFocus();
    expect(button('¿Puedo anular una factura?')).toBeDisabled();
  });

  it('controlado con value', () => {
    render(<Faq value={['moneda']} />);
    expect(button('¿En qué moneda facturo?')).toHaveAttribute('aria-expanded', 'true');
    expect(button('¿Cuándo vence una factura?')).toHaveAttribute('aria-expanded', 'false');
  });

  it('sin violaciones de axe', async () => {
    const { container } = render(<Faq defaultValue={['plazo']} />);
    await expect(container).toHaveNoAxeViolations();
  });
});
