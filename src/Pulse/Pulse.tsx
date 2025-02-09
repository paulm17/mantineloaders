import {
  Box,
  BoxProps,
  createVarsResolver,
  ElementProps,
  factory,
  Factory,
  getSize,
  getThemeColor,
  MantineColor,
  MantineSize,
  StylesApiProps,
  useProps,
  useStyles,
} from '@mantine/core';
import { LoaderPulseCubeStyle, LoaderPulseRootStyle } from './Pulse.css';

export type PulseStylesNames = 'root';
export type PulseCssVariables = {
  root: '--pulse-color' | '--pulse-size';
};

export interface PulseProps extends BoxProps, StylesApiProps<PulseFactory>, ElementProps<'span'> {
  /** Controls `width` and `height` of the loader. `Loader` has predefined `xs`-`xl` values. Numbers are converted to rem. Default value is `'md'` */
  size?: MantineSize | (string & {}) | number;

  /** Speed multiplier, default value is `1` */
  speedMultiplier?: number;

  /** Key of `theme.colors` or any valid CSS color, default value is `theme.primaryColor`  */
  color?: MantineColor;
}

export type PulseFactory = Factory<{
  props: PulseProps;
  ref: HTMLDivElement;
  stylesNames: PulseStylesNames;
  vars: PulseCssVariables;
}>;

const defaultProps: Partial<PulseProps> = {
  size: 40,
};

const getNewSize = (size: MantineSize | (string & {}) | number | undefined) => {
  if (typeof size === 'string') {
    const sizes: Record<MantineSize, number> = {
      xs: 18,
      sm: 22,
      md: 36,
      lg: 44,
      xl: 58,
    };

    if (size in sizes) {
      return sizes[size as MantineSize];
    } else {
      return 36;
    }
  }

  return size;
};

const varsResolver = createVarsResolver<PulseFactory>(
  // @ts-ignore
  (theme, { color, size }) => ({
    root: {
      '--pulse-color': color ? getThemeColor(color, theme) : undefined,
      '--pulse-size': getSize(size, 'pulse-size') ?? undefined,
    },
  })
);

export const Pulse = factory<PulseFactory>((_props, ref) => {
  const props = useProps('Pulse', defaultProps, _props);
  const {
    color,
    vars,
    className,
    style,
    classNames,
    styles,
    unstyled,
    size,
    variant,
    children,
    ...others
  } = props;

  const getStyles = useStyles<PulseFactory>({
    name: 'Pulse',
    props,
    classes: {
      root: LoaderPulseRootStyle,
    },
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver,
  });

  const newSize = getNewSize(size) as number;

  return (
    <Box {...getStyles('root')} ref={ref} {...others}>
      {/* @ts-ignore */}
      {[...Array(3)].map((_, i) => {
        return (
          <span
            key={i}
            className={LoaderPulseCubeStyle}
            style={{
              // @ts-ignore
              left: `${i * (newSize / 3 + newSize / 15)}px`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        );
      })}
    </Box>
  );
});

Pulse.displayName = '@mantine/core/Pulse';
