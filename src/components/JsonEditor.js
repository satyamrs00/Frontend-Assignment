import { useState } from 'react';
import { TextField } from '@mui/material';

const JsonEditor = ({ setFormObject }) => {
    const [jsonText, setJsonText] = useState('')

    const handleChange = (event) => {
        setJsonText(event.target.value);
        try {
            const parsed = JSON.parse(event.target.value);
            setFormObject(parsed || []);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className=' overflow-y-scroll h-full w-full'>
            <TextField
                id="outlined-multiline-static"
                label="JSON"
                multiline
                fullWidth
                
                variant="outlined"
                onChange={handleChange}
                value={jsonText}
            />
        </div>
    )
}

export default JsonEditor;