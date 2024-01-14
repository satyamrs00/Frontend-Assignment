import FormLabel from "../helpers/FormLabel"
import { Chip } from '@mui/material';

const FormRadio = ({ options, disabled, error, value, onChange, onBlur, errorText }) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {options?.map((option, optionIndex) => (
                <Chip 
                    key={optionIndex}
                    disabled={disabled}
                    label={<FormLabel item={option} />}
                    color={error ? 'secondary' : 'primary'}
                    variant={value === option?.value ? 'filled' : 'outlined'}
                    onClick={() => onChange(option?.value)}
                    onBlur={() => onBlur()}
                />
            ))}
            {error && (
                <div className="text-red-500 row-span-2">
                    {errorText}
                </div>
            )}
        </div>
    )
}

export default FormRadio