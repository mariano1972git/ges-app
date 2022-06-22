import React,{useContext,useState} from 'react';
import Element from './Element'
import { Modal , Button , Form  } from 'react-bootstrap'
import FormContext  from './FormContext'

export default function FormAM(props){
    const {tabla,campos,showAlta,showModif,close} = useContext(FormContext)
    const {descrip} = tabla[0]?tabla[0]:""

    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
  
      setValidated(true);
    };

    return(
    <>
    <div className="App container">
    <Modal 
        show={showAlta||showModif} 
        onHide={close} 
        scrollable={true}
        size="lg" 
        >
            <Modal.Header closeButton>
                <Modal.Title>{descrip}</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <Form noValidate validated={validated} onSubmit={handleSubmit} >
                     {campos?campos.map((campo,i)=><Element key={i} campo={campo} tabla={tabla}/>):null}      
                     <div style={{"text-align": "right"}}>
                        <Button type="submit" variant="primary">Grabar cambios</Button>
                        <Button onClick={()=>{
                            setValidated(false)                        
                            close()}}
                            variant="secondary" >Cerrar</Button>
                      </div>  
                </Form>
            </Modal.Body >
            <Modal.Footer>    
            </Modal.Footer>
    </Modal>
    </div>
    </>    
    )
 }
