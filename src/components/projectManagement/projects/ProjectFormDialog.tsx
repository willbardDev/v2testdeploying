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
import StakeholderSelector from '@/components/masters/stakeholders/StakeholderSelector';
import ProjectCategoriesSelector from '../projectCategories/ProjectCategoriesSelector';

interface ProjectFormDialogProps {
  project?: any;
  setOpenDialog: (open: boolean) => void;
}

interface ProjectFormData {
  id?: number;
  name: string;
  project_category_id?: number;
  client_id?: number;
  reference?: string;
  description?: string;
  commencement_date: Date | null;
  completion_date: Date | null;
  store_ids: { id: number; name: string }[];
}

const validationSchema = yup.object({
  name: yup.string().required('The name field is required.'),
  project_category_id: yup.number().required('Project category is required'),
  client_id: yup.number().required('Client is required'),
  reference: yup.string().optional(),
  description: yup.string().optional(),
  commencement_date: yup.date().required('Commencement date is required'),
  completion_date: yup.date().required('Completion date is required'),
  store_ids: yup
    .array()
    .of(
      yup.object({
        id: yup.number().required(),
        name: yup.string().required(),
      })
    )
    .min(1, 'At least one store is required'),
});

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
      id: project?.id,
      name: project?.name || '',
      project_category_id: project?.project_category_id || undefined,
      client_id: project?.client_id || undefined,
      reference: project?.reference || '',
      description: project?.description || '',
      commencement_date: project?.commencement_date
        ? new Date(project.commencement_date)
        : null,
      completion_date: project?.completion_date
        ? new Date(project.completion_date)
        : null,
      store_ids: project?.stores || [],
    },
    resolver: yupResolver(validationSchema),
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
    store_ids: formData.store_ids.map((store) => store.id),
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
        <Grid container spacing={2}>
          <Grid size={{xs: 12, md: 6}}>
            <TextField
              fullWidth
              size="small"
              label="Project Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
            <Controller
              name="project_category_id"
              control={control}
              render={({ field }) => (
                <ProjectCategoriesSelector
                  value={field.value}
                  onChange={field.onChange}
                  frontError={errors.project_category_id}
                />
              )}
            />
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
            <Controller
              name="client_id"
              control={control}
              render={({ field }) => (
                <StakeholderSelector
                  value={field.value}
                  onChange={field.onChange}
                  frontError={errors.client_id}
                />
              )}
            />
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
            <TextField
              fullWidth
              size="small"
              label="Reference"
              {...register('reference')}
              error={!!errors.reference}
              helperText={errors.reference?.message}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              size="small"
              label="Description"
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
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
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
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
          </Grid>

          <Grid size={12}>
            <Controller
              name="store_ids"
              control={control}
              render={({ field }) => (
                <StoreSelector
                  multiple
                  defaultValue={project ? project.store_ids : []}
                  onChange={field.onChange}
                  frontError={errors.store_ids}
                />
              )}
            />
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
