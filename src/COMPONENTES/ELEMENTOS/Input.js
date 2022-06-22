/* eslint-disable no-eval */
import React,{useContext,useEffect,useState,useRef} from 'react'
import FormContext  from '../../COMPONENTES/FormContext.js'
import ax from '../../HELPERS/ax.js'
import api_  from '../../HELPERS/cons.js';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import nextId from "react-id-generator";
import {  Form } from 'react-bootstrap'

const Input=(props)=>{

   
    const busRef = useRef()

    let {  
    nombre,
    descrip,
    DESCRIPLONG
    }=props.campo
    nombre = nombre.trim()
    descrip = descrip.trim()
    DESCRIPLONG = DESCRIPLONG.trim()


    const [busqueda, setBusqueda] = useState(false);
    const [defaultValue, setDefaultValue] = useState([]);
    const [options, setOptions] = useState({});
    const {handleChange,form,showModif,relaciones,setForm}=useContext(FormContext)
    const [selected, setSelected] = useState(null);

    const toInputUppercase = e => {
        e.target.value = ("" + e.target.value).toUpperCase();
        // console.log(e.target.value)
    };

    let options_=[]

    // Nombre del input de retorno de búsqueda.
    let nom_bus = ""
    // Generar id para el campo de retorno de búsqueda.
    let id_bus = ""

    // Se ejecuta antes de la primera renderización.
    useEffect(() => { 

        nom_bus = nombre+"_bus"
        // Generar id para el campo de retorno de búsqueda.
        id_bus = nextId()

        relaciones.forEach(item =>{
            let {CAMPO,TABLA_FK,CAMPO_FK} = item
            CAMPO=CAMPO.trim() //Campo que dispara la búsqueda
            TABLA_FK=TABLA_FK.trim()
            CAMPO_FK=CAMPO_FK.trim()
            let camBus="" // Campo sobre el que se hace la búsqueda incremental.
            let sql="SELECT * "
            if(CAMPO===nombre) {
                 setBusqueda(true) 
                 // Recuperar metadatos de las relaciones de la tabla
                let url = api_.SERVER+"campos/?c=SELECT * FROM campos WHERE tabla='" + TABLA_FK + "' AND busqueda='S'";
                ax.get({
                    url: url,
                    cbSuccess: (remoteRowData) => {
                        remoteRowData.forEach(el => {
                        camBus=el.nombre.trim()
                        sql=sql+" FROM "+TABLA_FK+" ORDER BY "+camBus
                        url = api_.SERVER+TABLA_FK+"/?c="+sql
                        ax.get({
                            url: url,
                            cbSuccess: (remoteRowData) => {
                                remoteRowData.forEach((el) => {            
                                    let value_=""
                                    let label_=""
                                    let ex="value_= el."+CAMPO_FK
                                    eval(ex)
                                    ex="label_= el."+camBus
                                    eval(ex)
                                    // console.log("value_",value_)
                                    // console.log("label_",label_)
                                    let o={
                                        id: value_,
                                        name: label_
                                    }
                                    options_.push(o)
                                })    
                            }
                        })
                    })    
                    }
                })
                setOptions(options_)
            }
        })

        // Cuando viene de una modificación hay que mostrar el 
        // registro seleccionado en la grilla
        if(showModif){
            Object.entries(form).forEach(([key, value]) => {
                // console.log("Key",key)
                if(key===nombre){
                   setDefaultValue(value)     
                }
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //console.log(options)

    if(busqueda){
        // Por acá arma los controles para una búsqueda.
        return(
            <>
            <div className="form-group">
            <label htmlFor={nombre}>{descrip}</label>
            <Autocomplete
                name={nombre} 
                id={nombre} 
                options={options}
                renderInput={params => (
                    <TextField {...params}   
                    placeholder={DESCRIPLONG?DESCRIPLONG:''} 
                    variant="outlined" 
                    />
                )}
                getOptionLabel={option => option.name}
                style={{ width:  766 }}
                value={selected}
                onChange={(_event, item) => {
                    const {id}=item
                    // console.log(id)
                    busRef.current.value = id
                    setSelected(item);

                    // Cambio en el estado que tiene los campos del registro activo.
                    setForm({
                        ...form,
                        [nombre]:id
                   })     

                }}
            />
            <Form.Control 
            required
            type="text" 
            name={nom_bus} 
            id={id_bus} 
            ref={busRef} 
             />           
             <Form.Control.Feedback type="invalid">
              El campo no puede quedar vacio.
             </Form.Control.Feedback>  
            {/* <input 
                name={nom_bus} 
                id={id_bus} 
                ref={busRef} ></input> */}
            </div>
            </>
        )
    }
    else {
        // Por acá renderiza el input normal.
        return(
         <>
         <Form.Group className="mb-3">
         <Form.Label>{descrip}</Form.Label>
         <Form.Control 
            required
            type="text" 
            className="form-control" 
            name={nombre} 
            id={nombre} 
            aria-describedby={descrip}
            placeholder={DESCRIPLONG?DESCRIPLONG:''}
            onChange={(event)=>handleChange(event)}
            defaultValue={defaultValue}
            onInput={toInputUppercase}
         />         
          <Form.Control.Feedback type="invalid">
              El campo no puede quedar vacio.
           </Form.Control.Feedback>  
         </Form.Group>  
         </>   

        // <div className="form-group">
        // <label htmlFor={nombre}>{descrip}</label>
        // <input 
        //     required
        //     type="text" 
        //     className="form-control" 
        //     name={nombre} 
        //     id={nombre} 
        //     aria-describedby={descrip}
        //     placeholder={DESCRIPLONG?DESCRIPLONG:''}
        //     onChange={(event)=>handleChange(event)}
        //     defaultValue={defaultValue}
        //     onInput={toInputUppercase}
        //     />
        // </div>
        )
    }
}

export default Input