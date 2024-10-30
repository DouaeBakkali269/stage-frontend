import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { inputsCustomizations } from './customizations/inputs';
import { dataDisplayCustomizations } from './customizations/dataDisplay';
import { feedbackCustomizations } from './customizations/feedback';
import { navigationCustomizations } from './customizations/navigation';
import { surfacesCustomizations } from './customizations/surfaces';
import { colorSchemes, typography, shadows, shape } from './themePrimitives';

function AppTheme({ children, disableCustomTheme, themeComponents }) {
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
          cssVariables: {
            colorSchemeSelector: 'data-mui-color-scheme',
            cssVarPrefix: 'template',
          },
           // Define your color palette here
           palette: {
            primary: {
              main: '#68B884', // A color extracted from the image (greenish tone)
              contrastText: '#FFFFFF',
            },
            secondary: {
              main: '#FF8C66', // Another color for secondary elements (orangeish tone)
              contrastText: '#FFFFFF',
            },
            error: {
              main: '#FF5252', // Color for error icons or buttons
            },
            warning: {
              main: '#FFC107', // For warning messages or icons
            },
            success: {
              main: '#66BB6A', // For success states
            },
            info: {
              main: '#29B6F6', // Information icons or states
            },
            background: {
              default: '#F5F5F5', // Light background tone
              paper: '#FFFFFF', // Paper surfaces
            },
            text: {
              primary: '#333333', // Primary text color
              secondary: '#757575', // Secondary text color
            },
            icon: {
              main: '#68B884', // Same greenish tone for icons
            },
          },
          colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
          typography,
          shadows,
          shape,
          components: {
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
            ...navigationCustomizations,
            ...surfacesCustomizations,
            ...themeComponents,
        
            MuiIconButton: {
                styleOverrides: {
                  root: {
                    color: '# DDA0DD', // Override for icon buttons
                  },
                },
              },
        },
        });
  }, [disableCustomTheme, themeComponents]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

AppTheme.propTypes = {
  children: PropTypes.node,
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme: PropTypes.bool,
  themeComponents: PropTypes.object,
};

export default AppTheme;