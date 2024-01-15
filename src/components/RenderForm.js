import InfoIcon from "../helpers/InfoIcon"
import { TextField, Button, Chip } from '@mui/material';
import { useFormik } from 'formik';
import FormInput from "./FormInput";
import FormLabel from "../helpers/FormLabel";
import { useEffect } from "react";
import FormRadio from "./FormRadio";
import FormSelect from "./FormSelect";
import FormSwitch from "./FormSwitch";

const RenderForm = ({ formObject }) => {

    const validate = values => {
        const errors = {};
        formObject?.map((item, index) => {
            if (item?.uiType === 'Group') {
                item?.subParameters?.map((subItem, subIndex) => {
                    if (subItem?.uiType === 'Ignore') {
                        subItem?.subParameters?.map((subSubItem, subSubIndex) => {
                            if (subSubItem?.validate?.required && [null, undefined, ''].includes(values[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey])) {
                                errors[item?.jsonKey] = { ...errors[item?.jsonKey], [subItem?.jsonKey]: { ...errors[item?.jsonKey]?.[subItem?.jsonKey], [subSubItem?.jsonKey]: 'Required' } };
                            } else if (subSubItem?.validate?.pattern && !subSubItem?.validate?.pattern?.test(values[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey])) {
                                errors[item?.jsonKey] = { ...errors[item?.jsonKey], [subItem?.jsonKey]: { ...errors[item?.jsonKey]?.[subItem?.jsonKey], [subSubItem?.jsonKey]: subSubItem?.validate?.pattern?.message } };
                            }
                        })
                    } else {
                        if (subItem?.validate?.required && [null, undefined, ''].includes(values[item?.jsonKey]?.[subItem?.jsonKey])) {
                            errors[item?.jsonKey] = { ...errors[item?.jsonKey], [subItem?.jsonKey]: 'Required' };
                        } else if (subItem?.validate?.pattern && !subItem?.validate?.pattern?.test(values[item?.jsonKey]?.[subItem?.jsonKey])) {
                            errors[item?.jsonKey] = { ...errors[item?.jsonKey], [subItem?.jsonKey]: subItem?.validate?.pattern?.message };
                        }
                    }
                })
            } else {
                if (item?.validate?.required && [null, undefined, ''].includes(values[item?.jsonKey])) {
                    errors[item?.jsonKey] = 'Required';
                } else if (item?.validate?.pattern && !item?.validate?.pattern?.test(values[item?.jsonKey])) {
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
                            subVal[subSubItem?.jsonKey] = subSubItem?.validate?.defaultValue || ""
                        })
                        val[subItem?.jsonKey] = subVal
                    } else {
                        val[subItem?.jsonKey] = subItem?.validate?.defaultValue || ''
                    }
                })
                form.setFieldValue(item?.jsonKey, val)
            } else {
                form.setFieldValue(item?.jsonKey, item?.validate?.defaultValue || '')
            }
        })
    
    }, [formObject])

    return (
        <form className="w-full h-full rounded-xl border-2 p-4 flex flex-col gap-4 overflow-y-scroll" onSubmit={form.handleSubmit}>
            <div className="bg-[#e5e7eb] h-[2px] w-full"></div>
            {formObject && formObject?.sort((a, b) => a?.sort - b?.sort)?.map((item, index) => (

                item?.uiType === 'Input' ? (
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

                ) : item.uiType === 'Select' ? (
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

                ) : item?.uiType === 'Group' ? (
                    <div key={index} className="flex flex-col border-2 p-4 rounded-lg gap-4">
                        <FormLabel item={item} />
                        <div className="bg-[#e5e7eb] h-[2px] w-full"></div>
                        {item?.subParameters?.sort((a, b) => a?.sort - b?.sort)?.map((subItem, subIndex) => (

                            subItem?.uiType === 'Radio' ? (
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

                            ) : subItem?.uiType === 'Select' ? (
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

                            ) : subItem?.uiType === 'Switch' ? (
                                <FormSwitch
                                    key={subIndex}
                                    item={subItem}
                                    value={form.values[item?.jsonKey]?.[subItem?.jsonKey]}
                                    onChange={(newValue) => form.setFieldValue(item?.jsonKey, { ...form.values[item?.jsonKey], [subItem?.jsonKey]: newValue })}
                                    onBlur={() => form.setFieldTouched(item?.jsonKey, { ...form.touched[item?.jsonKey], [subItem?.jsonKey]: true })}
                                    error={form.touched[item?.jsonKey]?.[subItem?.jsonKey] && form.errors[item?.jsonKey]?.[subItem?.jsonKey] }
                                    errorText={form.errors[item?.jsonKey]?.[subItem?.jsonKey]}
                                />

                            ) : subItem?.uiType === 'Ignore' ? (
                                subItem?.conditions?.reduce((acc, condition) => {
                                    if (condition?.op === "==") {
                                        console.log(form.values[condition?.jsonKey.split('.')[0]]?.[condition?.jsonKey.split('.')[1]], condition?.value)
                                        if (form.values[condition?.jsonKey.split('.')[0]]?.[condition?.jsonKey.split('.')[1]] === condition?.value) {
                                            console.log('here')
                                            return acc && true;
                                        } return false
                                    } return false
                                }, true) && (
                                    <div key={subIndex} className="flex flex-col gap-4">
                                        {subItem?.subParameters?.sort((a, b) => a?.sort - b?.sort)?.map((subSubItem, subSubIndex) => (
                                            subSubItem?.uiType === 'Select' ? (
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
                                            ) : subSubItem?.uiType === 'Input' ? (
                                                <FormInput
                                                    item={subSubItem}
                                                    value={form.values[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey]}
                                                    onChange={(newValue) => form.setFieldValue(item?.jsonKey, { ...form.values[item?.jsonKey], [subItem?.jsonKey]: { ...form.values[item?.jsonKey]?.[subItem?.jsonKey], [subSubItem?.jsonKey]: newValue } })}
                                                    onBlur={() => form.setFieldTouched(item?.jsonKey, { ...form.touched[item?.jsonKey], [subItem?.jsonKey]: { ...form.touched[item?.jsonKey]?.[subItem?.jsonKey], [subSubItem?.jsonKey]: true } })}
                                                    error={form.touched[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey] && form.errors[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey]}
                                                    errorText={form.touched[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey] && form.errors[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey]}
                                                    placeholder={subSubItem?.placeholder}
                                                />
                                            ) : subSubItem?.uiType === 'Switch' && (
                                                <FormSwitch
                                                    item={subSubItem}
                                                    value={form.values[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey]}
                                                    onChange={(newValue) => form.setFieldValue(item?.jsonKey, { ...form.values[item?.jsonKey], [subItem?.jsonKey]: { ...form.values[item?.jsonKey]?.[subItem?.jsonKey], [subSubItem?.jsonKey]: newValue } })}
                                                    onBlur={() => form.setFieldTouched(item?.jsonKey, { ...form.touched[item?.jsonKey], [subItem?.jsonKey]: { ...form.touched[item?.jsonKey]?.[subItem?.jsonKey], [subSubItem?.jsonKey]: true } })}
                                                    error={form.touched[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey] && form.errors[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey]}
                                                    errorText={form.touched[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey] && form.errors[item?.jsonKey]?.[subItem?.jsonKey]?.[subSubItem?.jsonKey]}
                                                />
                                            )
                                        ))}
                                    </div>
                                )
                            ) : ''
                        ))}
                    </div>
                ) : item?.uiType === 'Ignore' && (
                    ''
                )
            ))}
            <Button 
                variant="contained" 
                color="primary"
                type="submit"
            >
                Submit
            </Button>
        </form>
    )
}

export default RenderForm