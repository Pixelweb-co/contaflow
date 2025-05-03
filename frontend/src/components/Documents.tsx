import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

import axios from 'axios';
import dotenv from "dotenv";

import ConfirmationDialog from './dialogs/ConfirmationDialog';

interface DocumentsProps {
  product_id: any;
}

const Documents: React.FC<DocumentsProps> = ({ product_id }) => {
  const [file, setFile] = useState<File | null>(null);
  const [tag, setTag] = useState<string>('');
  const [isReport, setIsReport] = useState<boolean>(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('')

  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };




  useEffect(() => {
    const fetchOptions = async () => {
      console.log('fetchOptions')

      try {
        const token = localStorage.getItem('AuthToken')

        if (!token) {
          throw new Error('Token no disponible. Por favor, inicia sesión nuevamente.')
        }

        const [documentsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/document/list/${product_id}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          })
        ])

        setDocuments(documentsRes.data)

        return true
      } catch (error) {
        console.error('Error al obtener datos:', error)
      }
    }

    fetchOptions()

  }, [])

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor, selecciona un archivo.');

      return;
    }

    const formData = new FormData();

    formData.append('file', file);
    formData.append('tag', tag);
    formData.append('isReport', String(isReport));
    formData.append('product_id', product_id);

    try {

      const token = localStorage.getItem('AuthToken')

      console.log('token ', token)

      if (!token) {
        throw new Error('Token no disponible. Por favor, inicia sesión nuevamente.')
      }

      const method = 'post'; // Crear documento
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/document`; // Ruta de la API

      const response = await axios({
        method: method,
        url: apiUrl,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      alert('Archivo cargado exitosamente');
      console.log('Respuesta:', response.data);

      setDocuments(response.data);

      // Resetear el estado después de la carga
      setFile(null);
      setTag('');
      setIsReport(false);
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
      alert('Hubo un error al cargar el archivo.');
    }
  };

  const handleDeleteConfirm = async(document_name:string) => {

    console.log('Eliminar documento tr',document_name)
    setName(document_name)
    setOpen(true)

  }

  const handleDelete = async (document_name:string) => {

    // eslint-disable-next-line no-console
    console.info('api.',document_name)

    if(document_name ){

      try {

      const token = localStorage.getItem('AuthToken');

      if (!token) {
        throw new Error('Token no disponible. Por favor, inicia sesión nuevamente.');
      }

      // Llamada a la API para eliminar el documento
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/document/${name}`;

      await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Eliminar el documento del estado local después de la confirmación
      setDocuments((prevDocuments) =>
        prevDocuments.filter((doc) => doc.name !== name)
      );
      setOpen(false)

    } catch (error) {
      console.error('Error al eliminar el documento:', error);

    }

  }
  }

  return (
    <>
      {/* Card para subir documentos */}
      <Card>
        <CardHeader title="Documentos Anexos" />
        <CardContent>
          <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
            {/* Input para cargar archivos */}
            <input
              type="file"
              onChange={handleFileChange}
              className="btn"
              style={{ marginRight: '16px' }}
            />

            {/* Campo de etiqueta */}
            <TextField
              placeholder="Etiqueta"
              size="small"
              sx={{ flexGrow: 1, mr: 2 }}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />

            {/* Checkbox para reporte */}
            <Checkbox
              checked={isReport}
              onChange={(e) => setIsReport(e.target.checked)}
            />
            <Typography variant="body2" sx={{ mr: 2 }}>
              Reporte
            </Typography>

            {/* Botón para cargar */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!file || !tag}
            >
              Cargar
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Card para listar documentos */}
      <Card>
        <CardHeader title="Documentos relacionados" />
        <CardContent>

          <Grid container spacing={2}>
            {documents.map((document) => (
              <Grid item xs={3} key={document.id}>



                  <Chip
          label={document.name}
          color='primary'
          variant='tonal'
          onClick={() => {

            window.open(`${process.env.NEXT_PUBLIC_API_URL}/document/${document.name}`, '_blank');
          }}
          onDelete={()=>handleDeleteConfirm(document.name)}
          deleteIcon={<i className='tabler-trash-x' />}
        />



              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      <ConfirmationDialog
        entitYName='Documento'
        open={open}
        setOpen={setOpen}
        name={name}
        onConfirmation={(dv:string) => {
          console.log('Documento eliminado desde c',dv)
          handleDelete(dv)
          setOpen(false)
        }}
      />
    </>
  );
};

export default Documents;
