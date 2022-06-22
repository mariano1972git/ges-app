/* eslint-disable react-hooks/exhaustive-deps */
import React,{ useCallback, useEffect, useRef, useState  } from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import ax from '../HELPERS/ax.js';
import api_  from '../HELPERS/cons.js';
import str from '../HELPERS/func.js'
import {localeEs} from '../HELPERS/espanol'
import FormAM from './FormAM'
import { Button} from 'react-bootstrap'
import FormContext from './FormContext'
 
export default function Grilla(props) {
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);
    const [defaultColDef, setDefaultColDef] = useState([]);
    const [dime, setDime] = useState({});
    const [idioma, setIdioma] = useState({});
    const [campos,setCampos] = useState([])
    const [tabla,setTabla] = useState([])
    const [form,setForm] = useState({})
    const [showAlta, setShowAlta] = useState(false);
    const [showModif, setShowModif] = useState(false);
    const [relaciones, setRelaciones] = useState({});

    const handleShowAlta=()=>setShowAlta(true)
    const handleCloseAlta=()=>setShowAlta(false)
    const handleShowModif=()=>setShowModif(true)
    const handleCloseModif=()=>setShowModif(false)

    const alta=()=>{
        // El objeto form aranca vacío para el alta.
        setForm({}) 
        handleShowAlta()
        handleCloseModif()
    }
    const modif=()=>{
        getActiveRow()
        handleShowModif()
        handleCloseAlta()
    }    
    const close=()=>{
        handleCloseAlta()
        handleCloseModif()        
    }

    // Controla los cambios cuando se editan los campos del formulario
    // de alta/modificación
    const handleChange=(e)=>{
        let value=e.target.value
        if(e.target.type==="checkbox"){
          value=e.target.checked
        }
       setForm({
            ...form,
            [e.target.id.toUpperCase()]:value
       })
    }

    //Recupera el registro activo de la grilla y lo pasa al
    // estado form que se usa para las altas y bajas.
    const getActiveRow=()=>{
        let selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        const data = selectedData[0]?selectedData[0]:{} 
        setForm(data)       
    }

    const gridRef = useRef(); // Crea una referencia de la grilla.
    
    const onCellClicked = useCallback(CellClickedEvent => {});

    const onGridReady = useCallback(onGridReadyEvent => {
       // gridRef.current.api.setDomLayout("autoHeight");

    });

    const onFirstDataRendered = useCallback(onfirstDataRenderedEvent => { 
        // const allColumnIds = [];
        // gridRef.current.columnApi.getAllColumns().forEach((column) => {
        //     allColumnIds.push(column.getId());
        // });
        // gridRef.current.columnApi.autoSizeColumns(allColumnIds, true);
        // Barra de scroll horizontal al final.
       
         // Ajusta todas las columnas al tamaño de la página.   
        // gridRef.current.api.sizeColumnsToFit();
    });   

    useEffect(() => {                
        // Dimensionar el div de la grilla.
        let h=window.innerHeight;
        let w=window.innerWidth;
        setDime({height:h,width:w})   
           // Mapear el español.
        var mapa_idioma = {};
        Object.keys(localeEs).forEach(function (key) {
          if (key === 'thousandSeparator' || key === 'decimalSeparator') {
            return;
          }
          mapa_idioma[key] =  localeEs[key];
        });
        setIdioma(mapa_idioma);
         
        //Default para todas las columnas.
        const cd = {
            editable: false,
            sortable: true,
            filter: 'agTextColumnFilter',
            resizable:true
        };
        setDefaultColDef(cd);

        // Variable para recuperar información de la tabla.    
        let url_datos_ = api_.SERVER+props.tabla.toUpperCase();
        // Variable para recupetar metadatos de la tabla
        let url_def_   = api_.SERVER+"/tablas?c=SELECT * FROM tablas WHERE nombre='" + props.tabla + "'";
        let tabla_=[] 
        ax.get({
            url: url_datos_,
            cbSuccess: (rowData) => setRowData(rowData)
        });
        ax.get({
            url: url_def_,
            cbSuccess: (remoteRowData) => {
                remoteRowData.forEach(el => {
                    tabla_.push(el)
                })    
            }
        })
        setTabla(tabla_)
        
      
        // Recuperar metadatos de los campos de la tabla
        let url_def   = api_.SERVER+"/campos?c=SELECT * FROM campos WHERE tabla='" + props.tabla + "'";
        let aux = [];
        let campos_=[]               

        ax.get({
            url: url_def,
            cbSuccess: (remoteRowData) => {
                
                remoteRowData.forEach(el => {

                   campos_.push(el)

                    // Definción de cada columna.
                    
                    let {
                        nombre,
                        tipo,
                        long
                    } = el;

                       // console.log("Nombre",nombre)    
                        
                    tipo = tipo.toUpperCase().trim();
                    let clasecelda = ""; 
                    // Primer ancho. Se terminan de acomodar con
                    // gridRef.current.columnApi.autoSizeColumns(allColumnIds, false);
                    let width_=0;                                        
                    if(tipo==="DATETIME"){
                        width_=30;
                        clasecelda='ag-left-aligned-cell'; 
                    }else if(tipo==="INT"){
                        width_=70;
                        clasecelda='ag-right-aligned-cell'; 
                    }else if(tipo==="NCHAR"){
                        if(long<5)
                        {
                            width_=100;
                        }  else {
                            width_=long*9;
                        }                                            
                        clasecelda='ag-left-aligned-cell'; 
                    }else if(tipo==="NUMERIC"){
                        width_=120
                        clasecelda='ag-right-aligned-cell'; 
                    }else if(tipo==="NVARCHAR"){
                        width_=long*2;
                        clasecelda='ag-left-aligned-cell'; 
                    }else if(tipo==="SMALLINT"){
                        width_=20
                        clasecelda='ag-right-aligned-cell'; 
                    }
                    // console.log(nombre,tipo,width_);
                    let tit=str.proper(nombre);
                    let o = {
                        width: width_,
                        field: nombre.trim(),
                        sortable: true,
                        filter: true,
                        headerName:tit,
                        cellClass: clasecelda
                    };
                    aux.push(o);
                    

                });
                setColumnDefs(aux);
                setCampos(campos_)               
            }
        });
        
        // Recuperar metadatos de las relaciones de la tabla
        let url_def_rel   = api_.SERVER+"RELACIONES/?c=SELECT * FROM relaciones WHERE tabla='" + props.tabla + "'";
        let relaciones_=[]     
        ax.get({
            url: url_def_rel,
            cbSuccess: (remoteRowData) => {
                remoteRowData.forEach(el => {
                    relaciones_.push(el)
                })    
            }
        })
        setRelaciones(relaciones_)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // El arreglo vacio significa que se ejecuta nada más en la fase de montaje.
  
      const rowSelection = 'single'   
      return (        		
        <>
        <Button variant="outline-primary" onClick={alta}>Alta</Button>{'  '}
        <Button variant="outline-primary" onClick={modif}>Modificación</Button>{'  '}
        <Button variant="outline-primary" >Baja</Button>
        <br/>
        <div className="ag-theme-alpine" style={dime}>
            <AgGridReact
                rowSelection={rowSelection}
                onFirstDataRendered={onFirstDataRendered}
                onCellClicked={onCellClicked}
                onGridReady={onGridReady}
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                localeText ={idioma}>
            </AgGridReact>
        </div>
        <FormContext.Provider value={{
            handleChange,
            tabla,
            campos,
            showAlta,
            showModif,
            close,
            form,
            setForm,
            relaciones
            }}>
            <FormAM /> 
        </FormContext.Provider>
    </>
    );
}

