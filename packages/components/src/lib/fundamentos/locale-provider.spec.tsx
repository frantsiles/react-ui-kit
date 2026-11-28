import { render, screen } from '@testing-library/react';
import { Field } from './field';
import { LocaleProvider, useLocale } from './locale-provider';
import { directionFor, messagesFor } from './messages';
import { PasswordInput } from './password-input';
import { SearchInput } from './search-input';
import { Tag } from './tag';

function Controls() {
  return (
    <>
      <Field label="Clave" optional>
        <PasswordInput />
      </Field>
      <SearchInput aria-label="Buscar" defaultValue="hola" />
      <Tag onRemove={() => undefined}>React</Tag>
    </>
  );
}

function ShowLocale() {
  const { locale, direction } = useLocale();
  return <output>{`${locale} ${direction}`}</output>;
}

describe('LocaleProvider', () => {
  it('sin proveedor, los textos internos están en español', () => {
    render(<Controls />);
    expect(screen.getByRole('button', { name: 'Mostrar contraseña' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Limpiar búsqueda' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quitar React' })).toBeInTheDocument();
    expect(screen.getByText('(opcional)')).toBeInTheDocument();
  });

  it('traduce los textos internos al idioma del proveedor', () => {
    render(
      <LocaleProvider locale="en">
        <Controls />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument();
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('la prop del componente gana sobre el proveedor', () => {
    render(
      <LocaleProvider locale="en">
        <PasswordInput aria-label="PIN" toggleLabel="Ver PIN" />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'Ver PIN' })).toBeInTheDocument();
  });

  it('messages reemplaza textos uno por uno y el resto sale del idioma', () => {
    render(
      <LocaleProvider locale="en" messages={{ 'tag.remove': (text) => `Delete ${text}` }}>
        <Controls />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'Delete React' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
  });

  it('un proveedor anidado sin locale hereda el idioma y suma sus textos', () => {
    render(
      <LocaleProvider locale="en" messages={{ 'searchInput.clear': 'Reset' }}>
        <LocaleProvider messages={{ 'passwordInput.show': 'Reveal' }}>
          <Controls />
          <ShowLocale />
        </LocaleProvider>
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'Reveal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('en ltr');
  });

  it('un proveedor anidado con otro idioma no hereda los textos propios del superior', () => {
    render(
      <LocaleProvider locale="en" messages={{ 'searchInput.clear': 'Reset' }}>
        <LocaleProvider locale="es">
          <SearchInput aria-label="Buscar" defaultValue="hola" />
        </LocaleProvider>
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'Limpiar búsqueda' })).toBeInTheDocument();
  });

  it('useLocale da la dirección del idioma', () => {
    render(
      <LocaleProvider locale="ar-EG">
        <ShowLocale />
      </LocaleProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('ar-EG rtl');
  });
});

describe('messagesFor y directionFor', () => {
  it('busca la etiqueta exacta, luego el idioma y si no, español', () => {
    expect(messagesFor('en-US')['passwordInput.show']).toBe('Show password');
    expect(messagesFor('es-CR')['passwordInput.show']).toBe('Mostrar contraseña');
    expect(messagesFor('fr')['passwordInput.show']).toBe('Mostrar contraseña');
  });

  it.each([
    ['es', 'ltr'],
    ['en-US', 'ltr'],
    ['ar', 'rtl'],
    ['he-IL', 'rtl'],
    ['fa', 'rtl'],
    ['ur-PK', 'rtl'],
  ] as const)('%s → %s', (locale, direction) => {
    expect(directionFor(locale)).toBe(direction);
  });
});
