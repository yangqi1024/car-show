import {useEffect} from 'react'
import {SketchPicker} from 'react-color';
import { Popover } from 'antd';
import './index.css'

function ColorSelect({color,label, onChange}) {
    useEffect(()=>{
        console.log("color",color)
        },[])
    return (

    <Popover
        content={ <SketchPicker color={color} onChange={onChange}/>}
        trigger="click"
        ><div className="color-select-container">
        <div className="color" style={{backgroundColor: color}}/>
        <div className="color-label">{label}</div>
    </div>
    </Popover>
    )
}

export default ColorSelect
