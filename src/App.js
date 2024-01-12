import { useState } from 'react';
import './App.css';
import JsonEditor from './components/JsonEditor';

function App() {
  const [formObject, setFormObject] = useState({})
  return (
    <div className='w-full h-[200vh] lg:h-[100vh] flex flex-col lg:flex-row p-4 gap-4'>
      <div className=' w-full h-full overflow-y-scroll'>
        <JsonEditor setFormObject={setFormObject} />
      </div>
      <div className='bg-black w-full h-full'>
        
      </div>
    </div>
  );
}

export default App;
