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
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { Div } from '@jumbo/shared';
import StoreSelector from '@/components/procurement/stores/StoreSelector';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import projectsServices, { AddProjectResponse, UpdateProjectResponse } from './project-services';
import { Project } from './ProjectTypes';
import ProjectCategoriesSelector from '../projectCategories/ProjectCategoriesSelector';
import StakeholderSelector from '@/components/masters/stakeholders/StakeholderSelector';
import { Stakeholder } from '@/components/masters/stakeholders/StakeholderType';

      interface ProjectFormDialogProps {
        project?: any;
        setOpenDialog: (open: boolean) => void;
      }

      export interface ProjectFormData {
        id?: number;
        name: string;
        project_category_id: number;
        client_id: number;
        store_ids: number[];
        reference?: string;
        description?: string;
        commencement_date: Date | string | null;
        completion_date: Date | string | null;
      }

      const validationSchema = yup.object({
        name: yup.string().required('The name field is required.'),
        project_category_id: yup
          .number()
          .typeError('Project Category is required')
          .required('Project Category is required'),
        client_id: yup.number().optional(),
        store_ids: yup.array().of(yup.number()).optional(),
        reference: yup.string().optional(),
        description: yup.string().optional(),
        commencement_date: yup
          .date()
          .nullable()
          .optional(),

        completion_date: yup
          .date()
          .nullable()
          .optional()
          .min(
            yup.ref('commencement_date'),
            'Completion date cannot be earlier than commencement date'
          ),
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
            id: project?.id ?? undefined,
            name: project?.name ?? '',
            project_category_id: project?.project_category_id ?? 0,
            client_id: project?.client_id ?? undefined,
            store_ids: project?.store_ids ?? [],
            reference: project?.reference ?? '',
            description: project?.description ?? '',
            commencement_date: null,
            completion_date: null,
          },
          resolver: yupResolver(validationSchema as any),
        });

  const { mutate: addProject, isPending: addLoading } = useMutation<AddProjectResponse, unknown, Project>({
      mutationFn: (data: Project) => projectsServices.create(data),
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

    const { mutate: updateProject, isPending: updateLoading } = useMutation<UpdateProjectResponse, unknown, Project>({
        mutationFn: (data: Project) => projectsServices.update({ id: data.id!, ...data }),
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

    const saveMutation = useMemo(() => (project?.id ? updateProject : addProject), [project, updateProject, addProject]);
    const onSubmit = (formData: ProjectFormData) => {
    const payload = {
        ...formData,
        ...(project?.id ? { id: project.id } : {}),
      };
      saveMutation(payload as any );
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogTitle sx={{ textAlign: 'center' }}>{!project ? 'New Project' : `Edit ${project.name}`}</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid size={{xs: 12, md: 8}}>
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
          <Grid size={{xs: 12, md: 4}}>
            <Div sx={{ mt: 1, mb: 1 }}>
            <Controller
            name="project_category_id"
            control={control}
            render={({ field }) => (
              <ProjectCategoriesSelector
                defaultValue={field.value} // this is a number (ID)
                onChange={(selected) => field.onChange(selected?.id ?? null)}
                frontError={errors.project_category_id as any}
              />
            )}
          />
            </Div>
          </Grid>
          <Grid size={{xs: 12, md: 8}}>
           <Div sx={{ mt: 1, mb: 1 }}>
          <Controller
            name="client_id"
            control={control}
            render={({ field }) => (
              <StakeholderSelector
                defaultValue={field.value}
                onChange={(selected) =>
                field.onChange((selected as Stakeholder)?.id ?? null) }
                label="Client"
                frontError={errors.client_id as any}
              />
            )}
          />
            </Div>
          </Grid>
          <Grid size={{xs: 12, md: 4}}>
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
          <Grid size={{xs: 12, md: 4}}>
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
          <Grid size={{xs: 12, md: 4}}>
            <Div sx={{ mt: 1, mb: 1 }}>
             <Controller
              name="completion_date"
              control={control}
              render={({ field }) => {
                // Watch commencement_date to restrict completion_date
              const commencementDate = useWatch({ control, name: 'commencement_date' });
                return (
                  <DateTimePicker
                    label="Completion Date"
                    value={field.value}
                    onChange={field.onChange}
                    minDateTime={commencementDate || undefined} // 👈 Restrict earlier dates
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        error: !!errors.completion_date,
                        helperText: errors.completion_date?.message,
                      },
                    }}
                  />
                );
              }}
            />
            </Div>
          </Grid>
          <Grid size={4}>
            <Div sx={{ mt: 1, mb: 1 }}>
              <Controller
                name="store_ids"
                control={control}
                render={({ field }) => (
                  <StoreSelector
                    multiple
                    defaultValue={field.value}
                    onChange={field.onChange}
                    label='inventory store(s)'
                    frontError={errors.store_ids as any}
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
        <LoadingButton type="submit" variant="contained" size="small" loading={addLoading || updateLoading}>
          Submit
        </LoadingButton>
      </DialogActions>
    </form>
  );
};

export default ProjectFormDialog;
