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
import { LoaderCombBarStyle, LoaderCombRootStyle } from './Comb.css';

export type CombStylesNames = 'root';
export type CombCssVariables = {
  root: '--comb-color' | '--comb-size';
};

export interface CombProps extends BoxProps, StylesApiProps<CombFactory>, ElementProps<'span'> {
  /** Controls `width` and `height` of the loader. `Loader` has predefined `xs`-`xl` values. Numbers are converted to rem. Default value is `'md'` */
  size?: MantineSize | (string & {}) | number;

  /** Key of `theme.colors` or any valid CSS color, default value is `theme.primaryColor`  */
  color?: MantineColor;
}

export type CombFactory = Factory<{
  props: CombProps;
  ref: HTMLDivElement;
  stylesNames: CombStylesNames;
  vars: CombCssVariables;
}>;

const defaultProps: Partial<CombProps> = {
  size: 100,
};

const getNewSize = (size: MantineSize | (string & {}) | number | undefined) => {
  if (typeof size === 'string') {
    const sizes: Record<MantineSize, number> = {
      xs: 50,
      sm: 61,
      md: 100,
      lg: 122,
      xl: 161,
    };

    if (size in sizes) {
      return sizes[size as MantineSize];
    } else {
      return 36;
    }
  }

  return size;
};

const varsResolver = createVarsResolver<CombFactory>(
  // @ts-ignore
  (theme, { color, size }) => ({
    root: {
      '--comb-color': color ? getThemeColor(color, theme) : undefined,
      '--comb-size': getSize(size, 'comb-size') ?? undefined,
    },
  })
);

export const Comb = factory<CombFactory>((_props, ref) => {
  const props = useProps('Comb', defaultProps, _props);
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

  const getStyles = useStyles<CombFactory>({
    name: 'Comb',
    props,
    classes: {
      root: LoaderCombRootStyle,
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
      {[...Array(Math.floor(newSize / 9))].map((_, i) => {
        return (
          <span
            className={LoaderCombBarStyle}
            key={i}
            style={{
              animationDelay: `calc(0.05s * ${i})`,
              left: `calc(${i} * 9px)`,
            }}
          />
        );
      })}
    </Box>
  );
});

Comb.displayName = '@mantine/core/Comb';
