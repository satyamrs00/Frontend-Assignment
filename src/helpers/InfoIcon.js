import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Tooltip } from '@mui/material'

const InfoIcon = ({ head, body }) => {
    return (
        <Tooltip
            placement='right' 
            title={
                <div className='flex flex-col gap-1 p-2'>
                    <div className='font-medium '>{head}</div>
                    <div className="bg-[#e5e7eb] h-[1px] w-full"></div>
                    <div className='text-[#3E5680]'>{body}</div>
                </div>
            }
        >
            <InfoOutlinedIcon className="text-gray-500" fontSize='small' />
        </Tooltip>
    )
}

export default InfoIcon