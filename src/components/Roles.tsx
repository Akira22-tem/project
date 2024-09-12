// Roles.tsx
import { useEffect, useRef, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { format } from 'date-fns';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";




interface Roles {
    id: number;
    rol: string;
    descripcion: string;
    estado: string;
    fechaCreacion: string;
    fechaActualizacion: string;
    usuarios: string;
}

const estadoTemplate = (rowData: Roles) => {
    return <Tag value={rowData.estado} severity={rowData.estado === 'Activo' ? 'success' : rowData.estado === 'Inactivo' ? 'danger' : 'warning'} />;
}

const fechaTemplate = (rowData: Roles, column: string) => {
    return format(new Date(rowData[column as keyof Roles]), 'dd/MM/yyyy');
}


export const RolesTable: React.FC = () => {
    const [roles, setRoles] = useState<Roles[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const toast= useRef<Toast>(null);
    const [rol,setRol]=useState<Roles|null >(null);
    const [rolDialog,setRolDialog]=useState<boolean >(true);
    const [deleteDialog,setDeleteDialog]=useState<boolean >(false);
    const [sumited,setSumited]=useState<boolean >(false);

    useEffect(() => {
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await fetch('http://localhost:8000/roles/');
            if (!response.ok) {
                throw new Error('Error fetching Roles');
            }
            const data: Roles[] = await response.json();
            setRoles(data);
        } catch (error) {
            console.log('Error fetching Roles', error);
        } finally {
            setLoading(false);
        }
    }
    fetchRoles();

    const createRoles= async (roles: Roles)=>{
        try{
            const response=await fetch('http://localhost:8000/roles/',{
                method: 'POST',
                headers: {'content-Type': 'application/json'},
                body: JSON.stringify(roles)
            });
            if (!response.ok)throw new Error('Error creating roles');   
        }catch (error){
            console.error('Error creating roles:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error creating roles', life: 3150 })
        }
    }
    const updateRoles= async (roles: Roles)=>{
        try{
            const response=await fetch(`http://localhost:8000/roles/${roles.id}`,{
                method: 'PUT',
                headers: {'content-Type': 'application/json'},
                body: JSON.stringify(roles)
            });
            if (!response.ok)throw new Error('Error updating roles');   
        }catch (error){
            console.error('Error updating roles:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error updating roles', life: 3150 })
        }
    }
    const deleteRoles= async ()=>{
        if(rol){
            try{
                const response= await fetch(`http://localhost:8000/roles/${rol.id}`,{
                    method:'DELETE'
                });
                if (!response.ok)throw new Error('Error deleting roles')

            }catch(error){
                console.error('Error deleting roles:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error deleting roles', life: 3150 })

            }
        }
    }
    const openNew=()=>{
        setRol({id:0, rol: ' ',descripcion: ' ', estado: ' ', fechaCreacion: ' ', fechaActualizacion: ' ', usuarios: ' ' });
        setSumited(false);
        setRolDialog(true);
    }


    const header = (
        <div className="table-header">
            <h3>Gestión de Roles</h3>
            <Button label="Añadir Rol" icon="pi pi-user-plus" className="p-button-success mt-2" onClick={openNew} />
        </div>
    );
    
    

    return (
        <div>
            <Toast ref={toast}/>
            <Toolbar className= "p-mb-4" center= {header}>


            </Toolbar>

          
            <DataTable 
                value={roles} 
                loading={loading} 
                showGridlines 
                stripedRows 
                tableStyle={{ minWidth: '60rem' }} 
                breakpoint="960px"
            >
                <Column 
                    field="id" 
                    header="Id" 
                    headerStyle={{ textAlign: 'center' }} 
                    bodyStyle={{ textAlign: 'left' }}
                    style={{ width: '50px' }} 
                />
                <Column 
                    field="rol" 
                    header="Rol" 
                    headerStyle={{ textAlign: 'center' }} 
                    bodyStyle={{ textAlign: 'left' }}
                    style={{ width: '150px' }} 
                />
                <Column 
                    field="descripcion" 
                    header="Descripción" 
                    headerStyle={{ textAlign: 'center' }} 
                    bodyStyle={{ textAlign: 'left' }}
                    style={{ width: '300px' }} 
                />
                <Column 
                    field="estado" 
                    header="Estado" 
                    body={estadoTemplate} 
                    headerStyle={{ textAlign: 'center' }} 
                    bodyStyle={{ textAlign: 'left' }}
                    style={{ width: '120px' }} 
                />
                <Column 
                    field="fechaCreacion" 
                    header="Fecha de Creación" 
                    body={(rowData) => fechaTemplate(rowData, 'fechaCreacion')} 
                    headerStyle={{ textAlign: 'center' }} 
                    bodyStyle={{ textAlign: 'left' }}
                    style={{ width: '180px' }} 
                />
                <Column 
                    field="fechaActualizacion" 
                    header="Fecha de Actualización" 
                    body={(rowData) => fechaTemplate(rowData, 'fechaActualizacion')} 
                    headerStyle={{ textAlign: 'center' }} 
                    bodyStyle={{ textAlign: 'left' }}
                    style={{ width: '180px' }} 
                />
                <Column 
                    field="usuarios" 
                    header="Usuarios" 
                    headerStyle={{ textAlign: 'center' }} 
                    bodyStyle={{ textAlign: 'left' }}
                    style={{ width: '150px' }} 
                />
                <Column body={(rowData)=>(
                    <div>
                        <Button icon='pi pi-pencil'/>
                        <Button icon='pi pi-trash'/>

                    </div>
                    

                )}/>
            </DataTable>
            <Dialog visible={rolDialog}
                header= "nuevo"
                modal
                className="p-fluid"
                onHide={()=>setRolDialog(false)}
            >
                <div className= "p-field">
                    <label htmlFor="txtName">Nombre:</label>
                    <InputText
                        id="txtName"
                        value={rol?.rol}
                        onChange={(e)=>({...rol!,rol: e.target.value})}
                    />  
                </div>

            </Dialog>
        </div>
    );
}
