import JumboCardQuick from '@jumbo/components/JumboCardQuick';
import { Autocomplete, Grid, LinearProgress, Typography, TextField, Checkbox, Chip, useMediaQuery, FormControl, InputLabel, Select, MenuItem, ButtonGroup, Tooltip, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import fuelStationServices from '../../fuelStation/fuelStationServices';
import { useQuery } from 'react-query';
import { useDashboardSettings } from '../Dashboard';
import DippingTrend from './DippingTrend';
import LatestDippings from './LatestDippings';
import { useJumboTheme } from '@jumbo/hooks';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { deviceType } from 'app/helpers/user-agent-helpers';
import Div from '@jumbo/shared/Div';

function DippingsCard() {
    const { chartFilters: { from, to, costCenters } } = useDashboardSettings();
    const isMobile = deviceType() === 'mobile';

    const fuelStationCostCenters = costCenters.filter(cost_center => cost_center.type === 'Fuel Station');

    // Screen handling constants
    const { theme } = useJumboTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('md')) || isMobile;
    const midScreen = useMediaQuery('(min-width: 960.1px) and (max-width: 1279.9px)');

    const [selectedStations, setSelectedStations] = useState([]);
    const [selectedType, setSelectedType] = useState('closing')
    const [params, setParams] = useState({
        from,
        to,
        fuel_station_ids: fuelStationCostCenters.map(cost_center => cost_center.cost_centerable_id),
        with_calculated_stock: 0
    });

    useEffect(() => {
        setParams(params => ({
            ...params,
            from,
            to,
            fuel_station_ids: selectedStations.length > 0 ?
                selectedStations.map(station => station.cost_centerable_id)
                :  fuelStationCostCenters.map(cost_center => cost_center.cost_centerable_id),
            with_calculated_stock: selectedType === 'closing' ? 0 : 1, 
        }));
    }, [from, to, selectedStations, costCenters, selectedType]);

    const { data: reportData, isLoading } = useQuery(['dippingsReport', params], async () => {
        return await fuelStationServices.dippingReport(params);
    });

    return (
        <JumboCardQuick
            sx={{
                height: smallScreen ? 700 : 310
            }}
            title={
                isLoading ? <LinearProgress/> : (
                    !smallScreen && !midScreen ? 
                    <>
                        <Grid container spacing={1} borderBottom={1} borderColor={'divider'} pb={1}>
                            <Grid item xs={12} md={2}>
                                <Typography variant='h4'>Dippings</Typography>
                            </Grid>
                            <Grid item xs={6} md={5} lg={3}> 
                                <ButtonGroup
                                    variant="outlined"
                                    size='small'
                                    disableElevation
                                >
                                    <Tooltip title={'Closing'}>
                                        <Button variant={selectedType === 'closing' ? "contained" : "outlined"}
                                            onClick={() => setSelectedType('closing')}
                                        >Closing</Button>
                                    </Tooltip>
                                    <Tooltip title={'Deviation'}>
                                        <Button variant={selectedType === 'deviation' ? "contained" : "outlined"}
                                            onClick={() => setSelectedType('deviation')}
                                        >Deviation</Button>
                                    </Tooltip>
                                    <Tooltip title={'Calculated Stock'}>
                                        <Button variant={selectedType === 'calculated stock' ? "contained" : "outlined"}
                                            onClick={() => setSelectedType('calculated stock')}
                                        >Stock</Button>
                                    </Tooltip>
                                </ButtonGroup>
                            </Grid>
                            <Grid item xs={6} md={5} lg={7}>
                                <Autocomplete
                                    multiple
                                    options={fuelStationCostCenters}
                                    value={selectedStations}
                                    getOptionLabel={(option) => option.name}
                                    size='small'
                                    onChange={(event, newValue) => {
                                        setSelectedStations(newValue || []);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Fuel Stations"
                                            placeholder="Fuel Stations"
                                        />
                                    )}
                                    renderTags={(tagValue, getTagProps) => {
                                        return tagValue.map((option, index) => {
                                            const { key, ...restProps } = getTagProps({ index });
                                            return <Chip {...restProps} key={option.id + "-" + key} label={option.name} />;
                                        });
                                    }}
                                    renderOption={(props, option, { selected }) => {
                                        const { key, ...restProps } = props;
                                        return (
                                            <li {...restProps} key={option.id + "-" + key}>
                                                <Checkbox
                                                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                                                    checkedIcon={<CheckBox fontSize="small" />}
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                />
                                                {option.name}
                                            </li>
                                        );
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={5}>
                            <Grid item xs={12} md={6}>
                                <DippingTrend reportData={reportData} selectedType={selectedType}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LatestDippings reportData={reportData} selectedType={selectedType}/>
                            </Grid>
                        </Grid>
                    </>
                    :
                    <Grid container spacing={1} columnSpacing={3}>
                        <Grid item xs={12} mb={1}>
                            <Grid container spacing={1} borderBottom={1} borderColor={'divider'}>
                                <Grid item xs={4} md={1.5} lg={2.5}>
                                    <Typography variant='h4'>Dippings</Typography>
                                </Grid>
                                <Grid item xs={8} md={4} lg={3}>
                                    <Div>
                                        <FormControl fullWidth size='small' label="Display">
                                            <InputLabel id="selected-display-trend-group-by-input-label">Display</InputLabel>
                                            <Select
                                                labelId="selected-display-group-by-label"
                                                id="selected-display-group-by"
                                                value={selectedType}
                                                label={'Display'}
                                                onChange={(e) => {
                                                    setSelectedType(e.target.value);
                                                }}
                                            >
                                                <MenuItem value='closing'>Closing</MenuItem>
                                                <MenuItem value='deviation'>Deviation</MenuItem>
                                                <MenuItem value='calculated stock'>Stock</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Div>
                                </Grid>
                                <Grid item xs={12} md={6.5} paddingBottom={1}>
                                    <Autocomplete
                                        multiple
                                        options={fuelStationCostCenters}
                                        value={selectedStations}
                                        getOptionLabel={(option) => option.name}
                                        size='small'
                                        onChange={(event, newValue) => {
                                            setSelectedStations(newValue || []);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Fuel Stations"
                                                placeholder="Fuel Stations"
                                            />
                                        )}
                                        renderTags={(tagValue, getTagProps) => {
                                            return tagValue.map((option, index) => {
                                                const { key, ...restProps } = getTagProps({ index });
                                                return <Chip {...restProps} key={option.id + "-" + key} label={option.name} />;
                                            });
                                        }}
                                        renderOption={(props, option, { selected }) => {
                                            const { key, ...restProps } = props;
                                            return (
                                                <li {...restProps} key={option.id + "-" + key}>
                                                    <Checkbox
                                                        icon={<CheckBoxOutlineBlank fontSize="small" />}
                                                        checkedIcon={<CheckBox fontSize="small" />}
                                                        style={{ marginRight: 8 }}
                                                        checked={selected}
                                                    />
                                                    {option.name}
                                                </li>
                                            );
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DippingTrend reportData={reportData} selectedType={selectedType}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <LatestDippings reportData={reportData} selectedType={selectedType}/>
                        </Grid>
                    </Grid>
                )
            }
        >
        </JumboCardQuick>
    );
}

export default DippingsCard;
