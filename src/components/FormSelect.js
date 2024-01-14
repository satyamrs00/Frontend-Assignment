import FormLabel from "../helpers/FormLabel"
import { Select, MenuItem, FormHelperText } from '@mui/material';

const FormSelect = ({ item, value, onChange, placeholder, error, errorText, onBlur, options }) => {
    return (
        <div className="flex gap-4 justify-between w-full">
            <FormLabel item={item} />
            <div className="w-full">
                <Select
                    name={item?.jsonKey}
                    color='primary' 
                    disabled={item?.validate?.immutable}
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    error={error}
                    helperText={errorText}
                    onBlur={() => onBlur()}
                >
                    {options?.map((option, optionIndex) => (
                        <MenuItem key={optionIndex} value={option?.value}>{option?.label}</MenuItem>
                    ))}
                </Select>
                {error && <FormHelperText error>{errorText}</FormHelperText>}
            </div>
        </div>
    )
}

export default FormSelect