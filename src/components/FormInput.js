import { TextField } from '@mui/material';
import FormLabel from '../helpers/FormLabel';

const FormInput = ({ item, disabled, value, onChange, placeholder, error, errorText, onBlur }) => {
    return (
        <div className='flex gap-4'>
            <FormLabel item={item} />
            <TextField
                color='primary' 
                disabled={disabled}
                fullWidth
                size="small"
                variant="outlined"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                error={error}
                helperText={errorText}
                onBlur={() => onBlur()}
            />
        </div>
    )
}

export default FormInput