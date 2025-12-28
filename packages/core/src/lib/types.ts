import { ReactNode } from 'react';

/**
 * Common size variants used across components
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Common color variants used across components
 */
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral';

/**
 * Common button/component variants
 */
export type Variant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link';

/**
 * Common validation states
 */
export type ValidationState = 'valid' | 'invalid' | 'warning' | undefined;

/**
 * Common loading states
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Common alignment options
 */
export type Alignment = 'left' | 'center' | 'right' | 'justify';

/**
 * Common position options
 */
export type Position =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/**
 * Base props that most components should accept
 */
export interface BaseProps {
  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: React.CSSProperties;

  /**
   * Test ID for testing purposes
   */
  'data-testid'?: string;

  /**
   * Unique identifier
   */
  id?: string;
}

/**
 * Props for components that can be disabled
 */
export interface DisableableProps {
  /**
   * Whether the component is disabled
   */
  disabled?: boolean;
}

/**
 * Props for components that can have loading states
 */
export interface LoadableProps {
  /**
   * Whether the component is in a loading state
   */
  loading?: boolean;

  /**
   * Loading state details
   */
  loadingState?: LoadingState;
}

/**
 * Props for components that can have children
 */
export interface WithChildren {
  /**
   * Child elements
   */
  children?: ReactNode;
}

/**
 * Props for components that can have icons
 */
export interface WithIcon {
  /**
   * Icon to display (usually before content)
   */
  icon?: ReactNode;

  /**
   * Icon to display after content
   */
  iconAfter?: ReactNode;

  /**
   * Whether to show only the icon (hide text content)
   */
  iconOnly?: boolean;
}

/**
 * Props for form components
 */
export interface FormProps {
  /**
   * The name attribute for form elements
   */
  name?: string;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Validation state
   */
  validationState?: ValidationState;

  /**
   * Error message to display
   */
  errorMessage?: string;

  /**
   * Help text to display
   */
  helpText?: string;

  /**
   * Label for the form element
   */
  label?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;
}

/**
 * Props for clickable components
 */
export interface ClickableProps {
  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent) => void;

  /**
   * Whether the component should be focusable
   */
  focusable?: boolean;

  /**
   * Tab index for keyboard navigation
   */
  tabIndex?: number;
}

/**
 * Combined props for interactive components
 */
export interface InteractiveProps
  extends BaseProps,
          DisableableProps,
          LoadableProps,
          ClickableProps {}

/**
 * Animation duration options
 */
export type AnimationDuration = 'fast' | 'normal' | 'slow';

/**
 * Responsive breakpoint values
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Responsive value type that can accept different values for different breakpoints
 */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;
