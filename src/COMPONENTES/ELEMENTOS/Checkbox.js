import React,{useContext} from 'react'
import FormContext  from '../../COMPONENTES/FormContext.js'

const Checkbox=({field_id,field_label,field_value})=>{
    const {handleChange}=useContext(FormContext)
    return(
        <div className="form-group">
            <label htmlFor={field_id} >{field_label}</label>
            <div className="form-group form-check">
            <input type="checkbox" className="form-check-input" 
                name={field_id} 
                id={field_id} 
                onChange={(event)=>handleChange(event)}/>
            </div>
        </div>
        )
    
}

export default Checkbox

