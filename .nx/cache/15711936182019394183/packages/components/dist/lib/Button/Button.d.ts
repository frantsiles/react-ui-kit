import { default as React } from 'react';
import { Variant, Size, BaseProps, DisableableProps, LoadableProps, WithChildren, WithIcon, ClickableProps } from '../../../../core/src/index.ts';
export interface ButtonProps extends BaseProps, DisableableProps, LoadableProps, WithChildren, WithIcon, ClickableProps {
    /**
     * The visual style variant of the button
     */
    variant?: Variant;
    /**
     * The size of the button
     */
    size?: Size;
    /**
     * The HTML button type
     */
    type?: 'button' | 'submit' | 'reset';
    /**
     * Whether the button should take full width
     */
    fullWidth?: boolean;
    /**
     * Custom loading text
     */
    loadingText?: string;
}
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export { Button };
//# sourceMappingURL=Button.d.ts.map