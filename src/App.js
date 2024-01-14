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
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <div className='w-full h-[200vh] lg:h-[100vh] flex flex-col lg:flex-row p-4 gap-4'>
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
