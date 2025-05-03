// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import type { UsersType } from '@/types/apps/userType'

// Component Imports
// eslint-disable-next-line import/no-unresolved
import CustomTextField from '@core/components/mui/TextField'

const TableFilters = ({ setData, tableData }: { setData: (data: UsersType[]) => void; tableData?: UsersType[] }) => {
  // Estados
  const [role, setRole] = useState<string>('') // Estado para filtrar por roles
  const [status, setStatus] = useState<boolean | ''>('') // Estado para filtrar por estado (activo/inactivo)

  useEffect(() => {
    if (!tableData || !Array.isArray(tableData)) return // Verificar si tableData es un array

    const filteredData = tableData.filter(user => {
      const matchRole = role ? user?.roles?.some(r => r.roleEnum === role) : true // Comparar roles

      const matchStatus = status !== '' ? user.enabled === status : true // Comparar el estado

      return matchRole && matchStatus
    })

    setData(filteredData)
  }, [role, status, tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        {/* Role Filter */}
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-role'
            value={role}
            onChange={e => setRole(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select Role</MenuItem>
            <MenuItem value='admin'>Admin</MenuItem>
            <MenuItem value='user'>User</MenuItem>
            <MenuItem value='superadmin'>Superadmin</MenuItem>
          </CustomTextField>
        </Grid>

        {/* Status Filter */}
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-status'
            value={status}
            onChange={e => {
              const selectedValue = e.target.value

              setStatus(selectedValue === 'active' ? true : selectedValue === 'inactive' ? false : '')
            }}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select Status</MenuItem>
            <MenuItem value='active'>Activo</MenuItem>
            <MenuItem value='inactive'>Inactivo</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
