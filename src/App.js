import { useState } from 'react';
import './App.css';
import JsonEditor from './components/JsonEditor';
import RenderForm from './components/RenderForm';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
  const [formObject, setFormObject] = useState()

  const theme = createTheme({
    palette: {
      primary: {
        main: '#3E5680',
        light: '#F0F7FF',
        dark: '#3E5680',
        contrastText: '#fff',
      },
      black: {
        main: '#3C4451',
        dark: '#1C1C1C',
        light: '#F6F6F6',
        contrastText: '#fff',
      }
    },
    components: {
      MuiTooltip: {
        styleOverrides: {
          popper: {
            backgroundColor: 'transparent',
            fontSize: '1rem',
            minWidth: '250px'
          },
          tooltip: {
            backgroundColor: '#fff',
            boxShadow: 'none',
            border: '1px solid #e5e7eb',
            color: 'black',
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '400',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            }
          },
          outlined: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            }
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#F0F7FF',
            },
            '&:hover .MuiOutlinedInput-root': {
              backgroundColor: '#F0F7FF',
            },
            '&.Mui-focused .MuiOutlinedInput-root': {
              backgroundColor: '#F0F7FF',
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
              backgroundColor: '#F0F7FF',
            '&:hover .MuiOutlinedInput-root': {
              backgroundColor: '#F0F7FF',
            },
            '&.Mui-focused .MuiOutlinedInput-root': {
              backgroundColor: '#F0F7FF',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            backgroundColor: '#F0F7FF',
            color: '#000',
            '&:hover': {
              backgroundColor: '#F0F7FF',
              color: '#000'
            },
            '& .MuiSelected': {
              backgroundColor: '#3E5680',
              color: '#fff'
            }
          },
        },
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <div className='w-full h-[200vh] lg:h-[100vh] flex flex-col lg:flex-row p-4 gap-4 text-[#3D4351]'>
        <div className='w-full h-full'>
          <JsonEditor setFormObject={setFormObject} />
        </div>
        <div className='w-full h-full'>
          <RenderForm formObject={formObject} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
