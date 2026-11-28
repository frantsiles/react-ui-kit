import { Unstyled } from '@storybook/addon-docs/blocks';
import {
  Field,
  LocaleProvider,
  PasswordInput,
  SearchInput,
  Tag,
  useLocale,
} from '@my-ui/components';

/** Textos de la app (no del kit) para cada demo. */
const appText: Record<string, { password: string; search: string }> = {
  es: { password: 'Contraseña', search: 'Buscar' },
  en: { password: 'Password', search: 'Search' },
  ar: { password: 'كلمة المرور', search: 'بحث' },
};

function Section({ title }: { title: string }) {
  const { locale, direction } = useLocale();
  const text = appText[locale] ?? appText['es'];
  return (
    // lang y dir en la sección, con los valores del proveedor
    <section
      lang={locale}
      dir={direction}
      className="flex flex-col gap-3 rounded-lg border border-ui-border-subtle bg-ui-surface p-4 text-ui-fg"
    >
      <p className="m-0 font-ui-mono text-ui-label">{title}</p>
      <Field label={text?.password} optional>
        <PasswordInput />
      </Field>
      <SearchInput aria-label={text?.search} defaultValue="React" />
      <div className="flex flex-wrap gap-2">
        <Tag onRemove={() => undefined}>React</Tag>
        <Tag onRemove={() => undefined}>Tailwind</Tag>
      </div>
    </section>
  );
}

/** Los mismos controles con tres proveedores distintos. */
export function LocalePreview() {
  return (
    <Unstyled>
      <div className="my-4 grid gap-3 ui-md:grid-cols-3">
        <LocaleProvider locale="es">
          <Section title='locale="es"' />
        </LocaleProvider>
        <LocaleProvider locale="en">
          <Section title='locale="en"' />
        </LocaleProvider>
        <LocaleProvider
          locale="ar"
          messages={{
            'label.optional': '(اختياري)',
            'passwordInput.show': 'إظهار كلمة المرور',
            'searchInput.clear': 'مسح البحث',
            'tag.remove': (text) => `إزالة ${text}`,
            'tag.removeUnnamed': 'إزالة',
          }}
        >
          <Section title='locale="ar" + messages' />
        </LocaleProvider>
      </div>
    </Unstyled>
  );
}
