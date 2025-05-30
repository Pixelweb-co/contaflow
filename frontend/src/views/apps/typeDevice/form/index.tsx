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
  InputLabel,
  Select,
  FormControl,
  Typography,
  Divider
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import dotenv from "dotenv";

import type { TypeDeviceType } from '../type/typeDeviceType'

const schema = yup.object().shape({
  typeDevice: yup.string().required('El nombre es obligatorio'),

})

const TypeDeviceForm = ({
  open,
  onClose,
  setOpen,
  rowSelect
}: {
  open: boolean
  onClose: () => void
  setOpen: () => void
  rowSelect: TypeDeviceType
}) => {
  const [id, setId] = useState<any>(null)

  const [editData, setEditData] = useState<any>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      typeDevice: ''

    }
  })

  const onSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem('AuthToken')

      console.log('token ', token)

      if (!token) {
        throw new Error('Token no disponible. Por favor, inicia sesión nuevamente.')
      }

      // Si tienes un ID, significa que estás actualizando el usuario, de lo contrario, creas uno nuevo

      const method = id ? 'put' : 'post' // Actualización o Creación
      const apiUrl = id ? `${process.env.NEXT_PUBLIC_API_URL}/type-device/${id}` : `${process.env.NEXT_PUBLIC_API_URL}/type-device` // Creación

      const response = await axios({
        method: method, // Usa 'put' para actualización o 'post' para creación
        url: apiUrl,
        data: data,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      // Procesar la respuesta
      if (response.data.result === 'success') {
        console.log('Customer guardado con éxito:', response.data)

        // Aquí puedes redirigir o mostrar un mensaje de éxito
      } else {
        console.error('Error en la respuesta:', response.data.message)
      }

      setEditData(null)
      setValue('typeDevice', '')

      reset()
      setId(null)

      onClose()
    } catch (error) {
      console.error('Error al enviar los datos:', error)
    }
  }

  useEffect(() => {
    console.log('rsl ', rowSelect)

    if (rowSelect.id) {
      console.log('rowSelect', rowSelect)
      setId(rowSelect.id)
      setValue('typeDevice', rowSelect.typeDevice || '')
      setEditData(rowSelect)

    }
  }, [rowSelect])

  return (
    <Dialog open={!!open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>{!id? 'Agregar nuevo tipo de servicio' : 'Editar tipo de servicio'}</DialogTitle>
      <DialogContent>
        <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
          <Grid container >
            <Grid item xs={12} sm={12}>
              <Controller
                name='typeDevice'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    value={editData ? editData.typeDevice : ''}
                    onChange={e => {
                      setEditData({ ...editData, typeDevice: e.target.value })
                      setValue('typeDevice', e.target.value)
                    }}
                    label='Nombre'
                    error={!!errors.typeDevice}
                    helperText={errors.typeDevice?.message}
                  />
                )}
              />
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

export default TypeDeviceForm
