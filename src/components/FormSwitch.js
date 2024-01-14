import { Checkbox, FormHelperText, FormControlLabel } from '@mui/material'
import FormLabel from '../helpers/FormLabel'

const FormSwitch = ({ item, disabled, value, onChange, placeholder, error, errorText, onBlur }) => {
    return (
        <div>
            <FormControlLabel
                control={
                    <Checkbox
                        color='primary'
                        disabled={disabled}
                        fullWidth
                        size="small"
                        variant="outlined"
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        error={error}
                        onBlur={() => onBlur()}
                    />
                }
                label={<FormLabel item={item} />}
            />
            {error && <FormHelperText error>{errorText}</FormHelperText>}
        </div>
    )
}

export default FormSwitch