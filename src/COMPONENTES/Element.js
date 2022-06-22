import React from 'react'
import Input from '../COMPONENTES/ELEMENTOS/Input'
import Checkbox from '../COMPONENTES/ELEMENTOS/Checkbox'
import Select from '../COMPONENTES/ELEMENTOS/Select'
// import { Modal , Button , Row , Col , Form} from 'react-bootstrap'

const Element=(props)=>{

   let { OBJHTML }=props.campo

   OBJHTML = OBJHTML.toUpperCase().trim()

    switch( OBJHTML){
        case 'TEXT':
            return(<Input campo={props.campo} tabla={props.tabla}/>)
        case 'CHECKBOX':
            return(<Checkbox campo={props.campo} tabla={props.tabla}/>)    
        case 'SELECT':
            return(<Select campo={props.campo} tabla={props.tabla}/>) 
        default:
            return(null)
    }
}

export default Element