import InfoIcon from "../helpers/InfoIcon"

const FormLabel = ({item}) => {
    return (
        <div className='flex gap-1 items-center w-full'>
            {item?.label}
            {item?.validate?.required && (
                <span className="text-red-500">*</span>
            )}
            {item?.description && (
                <InfoIcon head={item?.label} body={item?.description} />
            )}
        </div>
    )
}

export default FormLabel