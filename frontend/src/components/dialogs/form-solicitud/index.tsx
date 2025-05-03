'use client'
import React, { useEffect, useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,

  List,
  ListItem,
  ListItemButton,
  ListItemIcon,

  Checkbox,
  ListItemText,
  Card,
  CardContent
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import dotenv from "dotenv";
import type { SolicitudType } from '@/types/apps/solicitudType'


import CustomTextField from '@/@core/components/mui/TextField'
import type { UsersType } from '@/types/apps/userType'


interface Solicitud {
  idSolicitud?: number;
  entidad?: string;
  fecha?: string;
  tipoServicio?: string;
  descripcion?: string;
  asig?: Asig;
  fchasg?: string;
  horasg?: string;
}

interface Asig{
  id?:string
}

const schema = yup.object().shape({
  entidad: yup.string().notOneOf(['0'], 'El cliente es obligatorio'),
  fecha: yup.string().required('La fecha es obligatoria'),

  tipoServicio:  yup.string().notOneOf(['0'], 'El tipo de servicio es obligatorio'),
  descr: yup.string().required('descripcion es obligatorio'),
  asig:  yup.string().notOneOf(['0'], 'El ingeniero asignado es obligatorio'),
  fchasg: yup.string().notRequired(),
  horasg: yup.string().notRequired()
})

const SolicitudForm = ({
  open,
  onClose,
  setOpen,
  rowSelect
}: {
  open: boolean
  onClose: () => void
  setOpen: () => void
  rowSelect: SolicitudType
}) => {
  const [id, setId] = useState<any>(null)
  const [customersList, setCustomersList] = useState<any[]>([])
  const [productsList, setProductsList] = useState<any[]>([])
  const [typeServiceList, setTypeServiceList] = useState<any[]>([])
  const [userList, setUsersList] = useState<UsersType[]>([])
  const [editData, setEditData] = useState<any>(null)
  const [checked, setChecked] = useState<any[]>([]);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  const fetchOptions = async () => {
    try {
      const token = localStorage.getItem('AuthToken')

      if (!token) {
        throw new Error('Token no disponible. Por favor, inicia sesión nuevamente.')
      }

      const [customersRes,userRes,typeServiceRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/customers`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }),
        axios.get(`${API_BASE_URL}/users`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }),
        axios.get(`${API_BASE_URL}/type-service`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
      ])

      setCustomersList(customersRes.data)
      setUsersList(userRes.data)
      setTypeServiceList(typeServiceRes.data)


      return true
    } catch (error) {
      console.error('Error al obtener datos:', error)
    }
  }

  const fetchProducts = async (idCustomer: any) => {
    try {

      console.log("Fp: ",idCustomer)

      const token = localStorage.getItem('AuthToken')

      if (!token) {
        throw new Error('Token no disponible. Por favor, inicia sesión nuevamente.')
      }

      const [productsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/contratos/customer/${idCustomer}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
      ])

      setProductsList(productsRes.data.productos)


      return true

    }catch(e){
      console.log(e)
    }

  }

  useEffect(() => {
    fetchOptions()
  }, [])

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      entidad: '0',
      fecha: '',

      tipoServicio: '0',
      descr: '',
      asig: '0',
      fchasg: '',
      horasg: ''
    }
  })

  const onSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem('AuthToken')

      console.log('token ', token)
      console.log("pids ",checked)

      if (!token) {
        throw new Error('Token no disponible. Por favor, inicia sesión nuevamente.')
      }

      // Si tienes un ID, significa que estás actualizando el usuario, de lo contrario, creas uno nuevo

      const method = id ? 'put' : 'post' // Actualización o Creación
      const apiUrl = id ? `${process.env.NEXT_PUBLIC_API_URL}/solicitudes/${id}` : `${process.env.NEXT_PUBLIC_API_URL}/solicitudes` // Creación

      const response = await axios({
        method: method, // Usa 'put' para actualización o 'post' para creación
        url: apiUrl,
        data: {...data, productsToInsert:checked,status:1},
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })



      // Procesar la respuesta
      if (response.data.result === 'success') {
        console.log('Solicitud guardado con éxito:', response.data)

        // Aquí puedes redirigir o mostrar un mensaje de éxito
      } else {
        console.error('Error en la respuesta:', response.data.message)
      }

      setEditData(null)
      setProductsList([])
      setValue('entidad', '0')
      setValue('fecha', '')

      setValue('tipoServicio', '0')
      setValue('descr', '')
      setValue('asig', '0')
      setValue('fchasg', '')
      setValue('horasg', '')

      reset()
      setId(null)

      onClose()
    } catch (error) {
      console.error('Error al enviar los datos:', error)
    }
  }



  function setSolicitudValues(rowSelect: SolicitudType) {
    setId(rowSelect.idSolicitud);
    setValue('entidad', rowSelect.entidad || '0');
    setValue('fecha', rowSelect.fecha || '');
    setValue('tipoServicio', rowSelect.tipoServicio || '0');
    setValue('descr', rowSelect.descripcion || '');
    setValue('asig', rowSelect.asig || '0');
    setValue('fchasg', rowSelect.fchasg || '');
    setValue('horasg', rowSelect.horasg || '');
    fetchProducts(rowSelect.entidad);
  }

  useEffect(() => {
    console.log('rsl ', rowSelect)

    if (rowSelect && rowSelect.idSolicitud) {
      console.log('rowSelect', rowSelect)
      setSolicitudValues(rowSelect);
      setEditData(rowSelect)
    } else {
      setValue('entidad', '0')
      setValue('fecha', '')

      setValue('tipoServicio', '0')
      setValue('descr', '')
      setValue('asig', '0')
      setValue('fchasg', '')
      setValue('horasg', '')
      setProductsList([])

      reset()
      setId(null)
      setEditData({
        entidad: '0',
        fecha: '',

        tipoServicio: '0',
        descr: '',
        asig: '0',
        fchasg: '',
        horasg: ''
      })
    }
  }, [rowSelect])

  return (
    <Dialog open={!!open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Datos de la solicitud</DialogTitle>
      <DialogContent>
        <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <h3>Datos de la solicitud</h3>
              <Controller
                name='entidad'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    disabled={!!id}
                    className='mt-2'
                    value={editData?.entidad ? editData?.entidad : '1'}
                    onChange={e => {
                      setEditData({ ...editData, entidad: e.target.value })
                      setValue('entidad', e.target.value)
                      fetchProducts(e.target.value)
                    }}
                    label='Cliente'
                    error={Boolean(errors.entidad)}
                    helperText={errors.entidad?.message}
                  >
                   <MenuItem key={0} value={'0'}>
                        Seleccionar ...
                    </MenuItem>

                    {customersList.map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />


            <Controller
                      name='fecha'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          className='mt-2'
                          fullWidth
                          type='date'
                          label='Fecha'
                          error={Boolean(errors.fecha)}
                          helperText={errors.fecha?.message}
                        />
                      )}
                    />




<Controller
                name='tipoServicio'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    className='mt-2'
                    select
                    fullWidth
                    value={editData?.tipoServicio ? editData?.tipoServicio : '1'}
                    onChange={e => {
                      setEditData({ ...editData, tipoServicio: e.target.value })
                      setValue('tipoServicio', e.target.value)

                    }}
                    label='Tipo de servicio'
                    error={Boolean(errors.tipoServicio)}
                    helperText={errors.tipoServicio?.message}
                  >
                    <MenuItem key={0} value={'0'}>
                        Seleccionar ...
                    </MenuItem>

                    {typeServiceList.map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.typeService}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
<Controller
                name='asig'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    className='mt-2'
                    select
                    fullWidth
                    value={editData?.asig.id ? editData?.asig.id : '0'}
                    onChange={e => {
                      setEditData({ ...editData, asig: {...editData.asig, id: e.target.value }})
                      setValue('asig', e.target.value)

                    }}
                    label='Asignado a'
                    error={Boolean(errors.asig)}
                    helperText={errors.asig?.message}
                  >
                    <MenuItem key={0} value={'0'}>
                        Seleccionar ...
                    </MenuItem>
                    {userList.filter((user)=>user.roles?.find((rol)=>['BIOMEDICAL','SUPERADMIN'].find(roln=>roln === rol.roleEnum )))?.map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.nombres} {item.apellidos} {`(${item.roles && item.roles[0] ? item.roles[0].roleEnum : 'N/A'})`}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />

              <Controller
                              name='descr'
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  className='mt-4'
                                  fullWidth
                                  value={editData?.descripcion ? editData.descripcion : ''}
                                  onChange={e => {
                                    setEditData({
                                      ...editData,
                                      descripcion: e.target.value
                                    })
                                    setValue('descr', e.target.value)
                                  }}
                                  label='Descripción'
                                  multiline
                                  maxRows={6}
                                  error={!!errors.descr}
                                  helperText={errors.descr?.message}
                                />
                              )}
                            />




            </Grid>

            <Grid item xs={12} sm={6}>

              <h3>Equipos</h3>
                <Card>
                <CardContent>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {productsList.map(value => {
                  const labelId = `checkbox-list-label-${value.id}`
                  const handleToggle = (value: any) => () => {
                    setChecked((prevChecked: any[]) =>
                      prevChecked.includes(value) ? prevChecked.filter((item) => item !== value) : [...prevChecked, value]
                    );
                  };

                if(rowSelect.idSolicitud && value.id === editData.idEquipo){

                  return (

                    <ListItem
                      key={value.id}

                      disablePadding
                    >
                      <ListItemButton role={undefined} onClick={handleToggle(value.id)} dense>
                        <ListItemIcon>
                          {!id && <Checkbox
                            edge='start'
                            checked={checked.includes(value.id)}
                            tabIndex={-1}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />}
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={`${value.productName}`} />
                      </ListItemButton>
                    </ListItem>
                  )

                }

                if(!rowSelect.idSolicitud){
                  return (
                    <ListItem
                      key={value.id}

                      disablePadding
                    >
                      <ListItemButton role={undefined} onClick={handleToggle(value.id)} dense>
                        <ListItemIcon>
                          {!id && <Checkbox
                            edge='start'
                            checked={checked.includes(value.id)}
                            tabIndex={-1}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />}
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={`${value.productName}`} />
                      </ListItemButton>
                    </ListItem>
                  )
                }

                })}
              </List>
              </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          Cerrar
        </Button>
        <Button type='submit' variant='contained' color='primary' onClick={handleSubmit(onSubmit)}>
          Guardar datos
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SolicitudForm
