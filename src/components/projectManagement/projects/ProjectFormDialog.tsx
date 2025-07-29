import React, { useMemo } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { Div } from '@jumbo/shared';
import StoreSelector from '@/components/procurement/stores/StoreSelector';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import projectServices, { AddProjectResponse, UpdateProjectResponse } from './project-services';
import { Project } from './ProjectTypes';
import ProjectCategoriesSelector from '../projectCategories/ProjectCategoriesSelector';
import StakeholderSelector from '@/components/masters/stakeholders/StakeholderSelector';

interface ProjectFormDialogProps {
  project?: any;
  setOpenDialog: (open: boolean) => void;
}

interface ProjectFormData {
  id?: number;
  name: string;
  project_category:{name:string; id:number}[];
  stakeholder:{
    name:string; 
    client_ids: number[];}[]
  reference?: string;
  description?: string;
  commencement_date: Date | null;
  completion_date: Date | null;
  stores: { name: string; id: number }[];
}

const validationSchema = yup.object({
  name: yup.string().required('The name field is required.'),
  project_category: yup
              .array()
              .of(
                yup.object({
                  name: yup.string().required(),
                  id: yup.number().required(),
                })
              )
              .min(1, 'At least one Project Category is required')
              .required('At least one Project Category is required'),
  stakeholder: yup
              .array()
              .of(
                yup.object({
                name: yup.string().required('Stakeholder name is required'),
                client_ids: yup
              .array()
              .of(yup.number().required())
              .min(1, 'At least one  account is required')
              .required(),
              })
            )
            .min(1, 'At least one counter is required')
            .required(),
  reference: yup.string().optional(),
  description: yup.string().optional(),
  commencement_date: yup.date().required('Commencement date is required'),
  completion_date: yup.date().required('Completion date is required'),
  stores: yup
        .array()
        .of(
          yup.object({
            name: yup.string().required(),
            id: yup.number().required(),
          })
        )
        .min(1, 'At least one store is required')
        .required('At least one store is required'),
      })

const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({
  project,
  setOpenDialog,
}) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      id: project?.id || undefined,
      name: project ? project.name : '',
      project_category: project?.project_category || [],
      stakeholder: project?.id ? project.stakeholder?.map((s:{name:string;clients?: { id: number }[] }) => ({
        name: s.name,
        client_ids: s.clients?.map(c => c.id) || []}))
        : [{ name: '', client_ids: [] }],
      reference: project?.reference || '',
      description: project?.description || '',
      commencement_date: project?.commencement_date
        ? new Date(project.commencement_date)
        : null,
      completion_date: project?.completion_date
        ? new Date(project.completion_date)
        : null,
      stores: project?.stores || [],
    },
    resolver: yupResolver(validationSchema)as any,
  });

  const { mutate: addProject, isPending: addLoading } = useMutation<
  AddProjectResponse,
  unknown,
  Project
>({
  mutationFn: (data: Project) => projectServices.create(data),

  onSuccess: (res) => {
    enqueueSnackbar(res.message, { variant: 'success' });
    queryClient.invalidateQueries({ queryKey: ['Project'] });
    setOpenDialog(false);
  },

  onError: (error: unknown) => {
    let message = 'Something went wrong';

    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as any).response?.data?.message === 'string'
    ) {
      message = (error as any).response.data.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    enqueueSnackbar(message, { variant: 'error' });
  },
});


const { mutate: updateProject, isPending: updateLoading } = useMutation<
  UpdateProjectResponse,
  unknown,
  Project
>({
  mutationFn: (data: Project) => projectServices.update({ id: data.id!, ...data }),

  onSuccess: (res) => {
    enqueueSnackbar(res.message, { variant: 'success' });
    queryClient.invalidateQueries({ queryKey: ['Project'] });
    setOpenDialog(false);
  },

  onError: (error: unknown) => {
    let message = 'Something went wrong';

    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as any).response?.data?.message === 'string'
    ) {
      message = (error as any).response.data.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    enqueueSnackbar(message, { variant: 'error' });
  },
});

const saveMutation = useMemo(() => {
  return project?.id ? updateProject : addProject;
}, [project, updateProject, addProject]);


  const onSubmit = (formData: ProjectFormData) => {
  const payload = {
    ...formData,
    store_ids: formData.stores.map((store) => store.id),
    ...(project?.id ? { id: project.id } : {}),
  };

  saveMutation(payload as any);
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogTitle sx={{ textAlign: 'center' }}>
        {!project ? 'New Project' : `Edit ${project.name}`}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid size={{xs: 12, md: 6}}>
            <Div sx={{ mt: 1, mb: 1 }}>
            
              <TextField
                fullWidth
                size="small"
                label="Project Name"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Div>
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
            <Div sx={{ mt: 1, mb: 1 }}>
            <Controller
              name="project_category"
              control={control}
              render={({ field }) => (
                <ProjectCategoriesSelector
                  defaultValue={field.value}
                  onChange={field.onChange}
                  frontError={errors.project_category as any}
                />
              )}
            />
            </Div>
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
             <Div sx={{ mt: 1, mb: 1 }}>
            <Controller
              name="client"
              control={control}
              render={({ field }) => (
                <StakeholderSelector
                  defaultValue={field.value}
                  onChange={field.onChange}
                  frontError={errors.client_ids}
                />
              )}
            />
            </Div>
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
            <Div sx={{ mt: 1, mb: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Reference"
              {...register('reference')}
              error={!!errors.reference}
              helperText={errors.reference?.message}
            />
            </Div>
          </Grid>

          <Grid size={12}>
            <Div sx={{ mt: 1, mb: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Description"
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            </Div>
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
            <Div sx={{ mt: 1, mb: 1 }}>
            <Controller
              name="commencement_date"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  label="Commencement Date"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      error: !!errors.commencement_date,
                      helperText: errors.commencement_date?.message,
                    },
                  }}
                />
              )}
            />
            </Div>
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
             <Div sx={{ mt: 1, mb: 1 }}>
            <Controller
              name="completion_date"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  label="Completion Date"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      error: !!errors.completion_date,
                      helperText: errors.completion_date?.message,
                    },
                  }}
                />
              )}
            />
            </Div>
          </Grid>

          <Grid size={12}>
            <Div sx={{ mt: 1, mb: 1 }}>
            <Controller
              name="stores"
              control={control}
              render={({ field }) => (
                <StoreSelector
                  multiple
                  defaultValue={project ? project.stores : []}
                  onChange={field.onChange}
                  frontError={errors.stores as any}
                />
              )}
            />
            </Div>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)} size="small">
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          size="small"
          loading={addLoading || updateLoading}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </form>
  );
};

export default ProjectFormDialog;
