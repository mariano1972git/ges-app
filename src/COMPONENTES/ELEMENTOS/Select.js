import React ,{useContext} from 'react'
import FormContext  from '../../COMPONENTES/FormContext.js'

const Select=({field_type,field_id,field_label,
    field_placeholder,field_value,field_options})=>{
    const {handleChange}=useContext(FormContext)
    return(
        <div className="form-group form-select">
            <label htmlFor={field_id}>{field_label}</label>
            <select 
            className="form-control" 
            id={field_id}
            name={field_id}
            onChange={(event)=>handleChange(event)}>
                {field_options.length>0 && field_options.map((option,i)=>
                    <option value={option.option_label} key={i}>
                        {option.option_label}
                    </option>
                )}
            </select>
      </div>
    )
}

export default Select