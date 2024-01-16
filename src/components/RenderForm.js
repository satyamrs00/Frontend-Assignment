import { Button, FormControlLabel, Modal, Switch, TextField } from "@mui/material";
import { useFormik } from 'formik';
import FormInput from "./FormInput";
import FormLabel from "../helpers/FormLabel";
import { useEffect, useState } from "react";
import FormRadio from "./FormRadio";
import FormSelect from "./FormSelect";
import FormSwitch from "./FormSwitch";

const RenderForm = ({ formObject }) => {

    const [advanced, setAdvanced] = useState([]);
    const [result, setResult] = useState({});
    const [showResult, setShowResult] = useState(false);

    const validate = values => {
        const errors = {};
        formObject?.map((item, index) => {
            if (item?.uiType === 'Group') {
                item?.subParameters?.map((subItem, subIndex) => {
                    if (subItem?.uiType === 'Ignore') {
                        if (subItem?.conditions?.reduce((acc, condition) => {
                            if (condition?.op === "==") {
                                if (values[condition?.jsonKey.split('.')[0]]?.[condition?.jsonKey.split('.')[1]] === condition?.value) {
                                    return acc && true;
                                } return false
                            } return false
                        }, true)) {
                            
                            subItem?.subParameters?.map((subSubItem, subSubIndex) => {
                                if (!subSubItem?.disable && subSubItem?.validate?.required && [null, undefined, ''].includes(values[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey])) {
                                    errors[item?.jsonKey] = { ...errors[item?.jsonKey], [subItem?.jsonKey]: { ...errors[item?.jsonKey]?.[subItem?.jsonKey], [subSubItem?.jsonKey]: 'Required' } };
                                } else if (!subSubItem?.disable && subSubItem?.validate?.pattern && !subSubItem?.validate?.pattern?.test(values[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey])) {
                                    errors[item?.jsonKey] = { ...errors[item?.jsonKey], [subItem?.jsonKey]: { ...errors[item?.jsonKey]?.[subItem?.jsonKey], [subSubItem?.jsonKey]: subSubItem?.validate?.pattern?.message } };
                                }
                            })
                        }
                    } else {
                        if (!subItem?.disable && subItem?.validate?.required && [null, undefined, ''].includes(values[item?.jsonKey]?.[subItem?.jsonKey])) {
                            errors[item?.jsonKey] = { ...errors[item?.jsonKey], [subItem?.jsonKey]: 'Required' };
                        } else if (!subItem?.disable && subItem?.validate?.pattern && !subItem?.validate?.pattern?.test(values[item?.jsonKey]?.[subItem?.jsonKey])) {
                            errors[item?.jsonKey] = { ...errors[item?.jsonKey], [subItem?.jsonKey]: subItem?.validate?.pattern?.message };
                        }
                    }
                })
            } else {
                if (!item?.disable && item?.validate?.required && [null, undefined, ''].includes(values[item?.jsonKey])) {
                    errors[item?.jsonKey] = 'Required';
                } else if (!item?.disable && item?.validate?.pattern && !item?.validate?.pattern?.test(values[item?.jsonKey])) {
                    errors[item?.jsonKey] = item?.validate?.pattern?.message;
                }    
            }
        })
        return errors;
    }

    const form = useFormik({
        initialValues: {},
        validate,
        onSubmit: values => {
            const result = {}
            formObject?.map((item, index) => {
                if (item?.uiType === 'Group') {
                    const val = {}
                    item?.subParameters?.map((subItem, subIndex) => {
                        if (subItem?.uiType === 'Ignore') {
                            if (subItem?.conditions?.reduce((acc, condition) => {
                                if (condition?.op === "==") {
                                    if (values[condition?.jsonKey.split('.')[0]]?.[condition?.jsonKey.split('.')[1]] === condition?.value) {
                                        return acc && true;
                                    } return false
                                } return false
                            }, true)) {
                                const subVal = {}
                                subItem?.subParameters?.map((subSubItem, subSubIndex) => {
                                    if (!subSubItem.disable) { subVal[subSubItem?.jsonKey] = values[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey] }
                                })
                                val[subItem?.jsonKey] = subVal
                            }
                        } else {
                            if (!subItem?.disable) { val[subItem?.jsonKey] = values[item?.jsonKey]?.[subItem?.jsonKey] }
                        }
                    })
                    result[item?.jsonKey] = val
                } else {
                    if (!item?.disable) { result[item?.jsonKey] = values[item?.jsonKey] }
                }
            })

            setResult(result)
            setShowResult(true)
            console.log(values)
        }
    })

    useEffect(() => {
        form.resetForm()
        formObject?.map((item, index) => {
            if (item?.uiType === 'Group') {
                const val = {}
                item?.subParameters?.map((subItem, subIndex) => {
                    if (subItem?.uiType === 'Ignore') {
                        const subVal = {}
                        subItem?.subParameters?.map((subSubItem, subSubIndex) => {
                            subVal[subSubItem?.jsonKey] = [undefined, null, ''].includes(subSubItem?.validate?.defaultValue) ? '' : subSubItem?.validate?.defaultValue
                        })
                        val[subItem?.jsonKey] = subVal
                    } else {
                        val[subItem?.jsonKey] = [undefined, null, ''].includes(subItem?.validate?.defaultValue) ? '' : subItem?.validate?.defaultValue
                    }
                })
                form.setFieldValue(item?.jsonKey, val)
            } else {
                form.setFieldValue(item?.jsonKey, [undefined, null, ''].includes(item?.validate?.defaultValue) ? '' : item?.validate?.defaultValue)
            }
        })
    
    }, [formObject])

    return (
        <>
            <Modal
                open={showResult}
                onClose={() => setShowResult(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className=" self-center w-[80vw] mah-h-[80vh] bg-white rounded-xl p-4 overflow-y-scroll">
                    <TextField
                        id="outlined-multiline-static"
                        label="Result"
                        fullWidth
                        multiline
                        disabled                        
                        defaultValue={JSON.stringify(result, null, 2)}
                        variant="outlined"
                    />
                </div>
            </Modal>
            <form className="w-full h-full rounded-xl border-2 p-4 flex flex-col gap-4 overflow-y-scroll" onSubmit={form.handleSubmit}>
                <div className="bg-[#e5e7eb] h-[2px] w-full"></div>
                {formObject && formObject?.sort((a, b) => a?.sort - b?.sort)?.map((item, index) => (

                    item?.uiType === 'Input' ? (
                        !item?.disable && (
                            (item?.validate?.required || advanced?.includes('all')) && (
                                <div key={index} className=" border-2 p-4 rounded-lg ">
                                    <FormInput 
                                        item={item} 
                                        disabled={item?.validate?.immutable} 
                                        value={form?.values[item?.jsonKey] || ""} 
                                        onChange={(newValue) => form.setFieldValue(item?.jsonKey, newValue)} 
                                        placeholder={item?.placeholder} 
                                        error={form?.touched[item?.jsonKey] && Boolean(form?.errors[item?.jsonKey])} 
                                        errorText={form?.touched[item?.jsonKey] && form?.errors[item?.jsonKey]} 
                                        onBlur={() => form.setFieldTouched(item?.jsonKey, true)} 
                                    />
                                </div>    
                            )
                        )
                    ) : item.uiType === 'Select' ? (
                        !item?.disable && (
                            (item?.validate?.required || advanced?.includes('all')) && (
                                <div key={index} className="border-2 p-4 rounded-lg ">
                                    <FormSelect
                                        item={item}
                                        value={form?.values[item?.jsonKey] || ""} 
                                        onChange={(newValue) => form.setFieldValue(item?.jsonKey, newValue)} 
                                        placeholder={item?.placeholder} 
                                        error={form?.touched[item?.jsonKey] && Boolean(form?.errors[item?.jsonKey])} 
                                        errorText={form?.touched[item?.jsonKey] && form?.errors[item?.jsonKey]} 
                                        onBlur={() => form.setFieldTouched(item?.jsonKey, true)} 
                                        options={item?.validate?.options}
                                    />
                                </div>
                            )
                        )    

                    ) : item?.uiType === 'Group' ? (
                        !item?.disable && (
                            (item?.validate?.required || advanced?.includes('all')) && (
                                <div key={index} className="flex flex-col border-2 p-4 rounded-lg gap-4">
                                    <FormLabel item={item} />
                                    <div className="bg-[#e5e7eb] h-[2px] w-full"></div>
                                    {item?.subParameters?.sort((a, b) => a?.sort - b?.sort)?.map((subItem, subIndex) => (
            
                                        subItem?.uiType === 'Radio' ? (
                                            !subItem?.disable && (
                                                (subItem?.validate?.required || advanced?.includes('all') || advanced?.includes(item?.jsonKey)) && (
                                                    <FormRadio 
                                                        key={subIndex} 
                                                        options={subItem?.validate?.options} 
                                                        disabled={subItem?.validate?.immutable} 
                                                        error={form.touched[item?.jsonKey]?.[subItem?.jsonKey] && form.errors[item?.jsonKey]?.[subItem?.jsonKey]}
                                                        value={form.values[item?.jsonKey]?.[subItem?.jsonKey] || ""}
                                                        onChange={(newValue) => form.setFieldValue(item?.jsonKey, { ...form.values[item?.jsonKey], [subItem?.jsonKey]: newValue })}
                                                        onBlur={() => form.setFieldTouched(item?.jsonKey, { ...form.touched[item?.jsonKey], [subItem?.jsonKey]: true })}
                                                        errorText={form.errors[item?.jsonKey]?.[subItem?.jsonKey]}
                                                    />
                                                )
                                            )
            
                                        ) : subItem?.uiType === 'Select' ? (
                                            !subItem?.disable && (
                                                (subItem?.validate?.required || advanced?.includes('all') || advanced?.includes(item?.jsonKey)) && (
                                                    <FormSelect
                                                        key={subIndex}
                                                        item={subItem}
                                                        value={form.values[item?.jsonKey]?.[subItem?.jsonKey]}
                                                        onChange={(newValue) => form.setFieldValue(item?.jsonKey, { ...form.values[item?.jsonKey], [subItem?.jsonKey]: newValue })}
                                                        onBlur={() => form.setFieldTouched(item?.jsonKey, { ...form.touched[item?.jsonKey], [subItem?.jsonKey]: true })}
                                                        error={form.touched[item?.jsonKey]?.[subItem?.jsonKey] && form.errors[item?.jsonKey]?.[subItem?.jsonKey]}
                                                        errorText={form.errors[item?.jsonKey]?.[subItem?.jsonKey]}
                                                        options={subItem?.validate?.options}
                                                        placeholder={subItem?.placeholder}
                                                    />
                                                )
                                            )
            
                                        ) : subItem?.uiType === 'Switch' ? (
                                            !subItem?.disable && (
                                                (subItem?.validate?.required || advanced?.includes('all') || advanced?.includes(item?.jsonKey)) && (
                                                    <FormSwitch
                                                        key={subIndex}
                                                        item={subItem}
                                                        value={form.values[item?.jsonKey]?.[subItem?.jsonKey]}
                                                        onChange={(newValue) => form.setFieldValue(item?.jsonKey, { ...form.values[item?.jsonKey], [subItem?.jsonKey]: newValue })}
                                                        onBlur={() => form.setFieldTouched(item?.jsonKey, { ...form.touched[item?.jsonKey], [subItem?.jsonKey]: true })}
                                                        error={form.touched[item?.jsonKey]?.[subItem?.jsonKey] && form.errors[item?.jsonKey]?.[subItem?.jsonKey] }
                                                        errorText={form.errors[item?.jsonKey]?.[subItem?.jsonKey]}
                                                    />
                                                )
                                            )
            
                                        ) : subItem?.uiType === 'Ignore' ? (
                                            subItem?.conditions?.reduce((acc, condition) => {
                                                if (condition?.op === "==") {
                                                    if (form.values[condition?.jsonKey.split('.')[0]]?.[condition?.jsonKey.split('.')[1]] === condition?.value) {
                                                        return acc && true;
                                                    } return false
                                                } return false
                                            }, true) && (
                                                <div key={subIndex} className="flex flex-col gap-4">
                                                    {subItem?.subParameters?.sort((a, b) => a?.sort - b?.sort)?.map((subSubItem, subSubIndex) => (
                                                        subSubItem?.uiType === 'Select' ? (
                                                            !subSubItem?.disable && (
                                                                (subSubItem?.validate?.required || advanced?.includes('all') || advanced?.includes(item?.jsonKey)) && (    
                                                                    <FormSelect
                                                                        item={subSubItem}
                                                                        value={form.values[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey] || ""}
                                                                        onChange={(newValue) => form.setFieldValue(item?.jsonKey, { ...form.values[item?.jsonKey], [subItem?.jsonKey]: { ...form.values[item?.jsonKey]?.[subItem?.jsonKey], [subSubItem?.jsonKey]: newValue } })}
                                                                        onBlur={() => form.setFieldTouched(item?.jsonKey, { ...form.touched[item?.jsonKey], [subItem?.jsonKey]: { ...form.touched[item?.jsonKey]?.[subItem?.jsonKey], [subSubItem?.jsonKey]: true } })}
                                                                        error={form.touched[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey] && form.errors[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey]}
                                                                        errorText={form.touched[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey] && form.errors[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey]}
                                                                        options={subSubItem?.validate?.options}
                                                                        placeholder={subSubItem?.placeholder}
                                                                    />
                                                                )
                                                            )
                                                        ) : subSubItem?.uiType === 'Input' ? (
                                                            !subSubItem?.disable && (
                                                                (subSubItem?.validate?.required || advanced?.includes('all') || advanced?.includes(item?.jsonKey)) && (
                                                                    <FormInput
                                                                        item={subSubItem}
                                                                        value={form.values[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey]}
                                                                        onChange={(newValue) => form.setFieldValue(item?.jsonKey, { ...form.values[item?.jsonKey], [subItem?.jsonKey]: { ...form.values[item?.jsonKey]?.[subItem?.jsonKey], [subSubItem?.jsonKey]: newValue } })}
                                                                        onBlur={() => form.setFieldTouched(item?.jsonKey, { ...form.touched[item?.jsonKey], [subItem?.jsonKey]: { ...form.touched[item?.jsonKey]?.[subItem?.jsonKey], [subSubItem?.jsonKey]: true } })}
                                                                        error={form.touched[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey] && form.errors[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey]}
                                                                        errorText={form.touched[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey] && form.errors[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey]}
                                                                        placeholder={subSubItem?.placeholder}
                                                                    />
                                                                )
                                                            )
                                                        ) : subSubItem?.uiType === 'Switch' && (
                                                            !subSubItem?.disable && (
                                                                (subSubItem?.validate?.required || advanced?.includes('all') || advanced?.includes(item?.jsonKey)) && (
                                                                    <FormSwitch
                                                                        item={subSubItem}
                                                                        value={form.values[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey]}
                                                                        onChange={(newValue) => form.setFieldValue(item?.jsonKey, { ...form.values[item?.jsonKey], [subItem?.jsonKey]: { ...form.values[item?.jsonKey]?.[subItem?.jsonKey], [subSubItem?.jsonKey]: newValue } })}
                                                                        onBlur={() => form.setFieldTouched(item?.jsonKey, { ...form.touched[item?.jsonKey], [subItem?.jsonKey]: { ...form.touched[item?.jsonKey]?.[subItem?.jsonKey], [subSubItem?.jsonKey]: true } })}
                                                                        error={form.touched[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey] && form.errors[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey]}
                                                                        errorText={form.touched[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey] && form.errors[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey]}
                                                                    />
                                                                )
                                                            )
                                                        )
                                                    ))}
                                                </div>
                                            )
                                        ) : ''
                                    ))}
                                    {item?.subParameters?.reduce((acc, subItem) => {
                                        if (subItem?.uiType === 'Ignore') {
                                            return acc && subItem?.subParameters?.reduce((acc, subSubItem) => {
                                                if (!subSubItem?.validate?.required) {
                                                    return true
                                                } return acc
                                            }, true)
                                        } else {
                                            if (!subItem?.validate?.required) {
                                                return true
                                            } return acc
                                        }
                                    }, false) && (
                                        <FormControlLabel
                                            control={<Switch
                                                checked={advanced?.includes(item?.jsonKey)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setAdvanced([...advanced, item?.jsonKey])
                                                    } else {
                                                        setAdvanced(advanced?.filter((adv) => adv !== item?.jsonKey))
                                                    }
                                                }}
                                            />}
                                            sx={{ marginRight: 'auto', marginLeft: 0 }}
                                            label="Show advanced options"
                                            labelPlacement="start"
                                        />
                                    )}
                                </div>
                            )
                        )

                    ) : (
                        null
                    )
                ))}
                <div className="flex gap-4 justify-end">
                    {formObject?.reduce((acc, item) => {
                        if (item?.uiType === 'Group') {
                            return acc && item?.subParameters?.reduce((acc, subItem) => {
                                if (subItem?.uiType === 'Ignore') {
                                    return acc && subItem?.subParameters?.reduce((acc, subSubItem) => {
                                        if (!subSubItem?.validate?.required) {
                                            return true
                                        } return acc
                                    }, true)
                                } else {
                                    if (!subItem?.validate?.required) {
                                        return true
                                    } return acc
                                }
                            }, true)
                        } else {
                            if (!item?.validate?.required) {
                                return true
                            } return acc
                        } 
                    }, false) && (
                        <FormControlLabel 
                            control={<Switch 
                                checked={advanced?.includes('all')}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setAdvanced([...advanced, 'all'])
                                    } else {
                                        setAdvanced(advanced?.filter((adv) => adv !== 'all'))
                                    }
                                }}
                            />} 
                            sx={{ marginRight: 'auto', marginLeft: 0 }}
                            label="Show advanced options" 
                            labelPlacement="start"
                        />
                    )}
                    <Button 
                        variant="outlined" 
                        color="black"
                        type="reset"
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        color="black"
                        type="submit"
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </>
    )
}

export default RenderForm