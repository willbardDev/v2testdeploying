'use client';

import { JumboScrollbar } from '@jumbo/components/JumboScrollbar';
import { Div } from '@jumbo/shared';
import React, { Suspense } from 'react';
import { SidebarHeader } from './SidebarHeader';
import { SidebarSkeleton } from './SidebarSkeleton';
import { MODULES } from '@/utilities/constants/modules';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import { PROS_CONTROL_PERMISSIONS } from '@/utilities/constants/prosControlPermissions';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import JumboVerticalNavbar from '@jumbo/components/JumboVerticalNavbar/JumboVerticalNavbar';

const Sidebar = ({ menus }) => {
    const [menuItems, setMenuItems] = React.useState(menus);
    const {authOrganization,checkPermission,checkOrganizationPermission,organizationHasSubscribed, authUser } = useJumboAuth();

    React.useEffect(() => {
        let updatedMenus = [...menus.filter(menu => menu.label === 'sidebar.menu.home')];
        if (authOrganization?.organization?.name) {

            if(organizationHasSubscribed(MODULES.PROCESS_APPROVAL)){
                //Process Approval sections
                updatedMenus = [...updatedMenus,...menus.filter(menu => menu.label === 'Process Approval')];

                const processApprovalMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Process Approval');

                if(!checkOrganizationPermission([PERMISSIONS.REQUISITIONS_CREATE,PERMISSIONS.REQUISITIONS_EDIT,PERMISSIONS.REQUISITIONS_DELETE,PERMISSIONS.REQUISITIONS_EDIT])){
                    if (processApprovalMenuIndex >= 0) {
                        updatedMenus[processApprovalMenuIndex].children = updatedMenus[processApprovalMenuIndex].children.filter(
                            child => child.label !== 'Requisitions'
                        );
                    }
                }

                const hasApprovalMasters = checkOrganizationPermission([
                    PERMISSIONS.APPROVAL_CHAINS_CREATE,
                    PERMISSIONS.APPROVAL_CHAINS_READ,
                    PERMISSIONS.APPROVAL_CHAINS_EDIT,
                    PERMISSIONS.APPROVAL_CHAINS_DEACTIVATE,
                ]);

                // Process Approval > Masters
                if (!hasApprovalMasters) {
                    if (processApprovalMenuIndex >= 0) {
                        updatedMenus[processApprovalMenuIndex].children = updatedMenus[processApprovalMenuIndex].children.filter(
                            child => child.label !== 'Masters'
                        );
                    }
                }


                //Project Management  > Masters > Product Categories
                if (!hasApprovalMasters) {
                    if (processApprovalMenuIndex >= 0) {
                        const mastersIndex = updatedMenus[processApprovalMenuIndex].children.findIndex(child => child.label === 'Masters');
                        if (mastersIndex >= 0) {
                            updatedMenus[processApprovalMenuIndex].children[mastersIndex].children = updatedMenus[processApprovalMenuIndex].children[mastersIndex].children.filter(
                                item => item.label !== "Approval Chains"
                            );
                        }
                    }
                }
            }
  
            if(organizationHasSubscribed(MODULES.POINT_OF_SALE)){
                //PoS
                if(checkOrganizationPermission(
                    [
                        PERMISSIONS.SALES_READ,
                        PERMISSIONS.PROFORMA_INVOICES_READ,
                        PERMISSIONS.OUTLETS_READ,
                        PERMISSIONS.PRICE_LISTS_READ,
                        PERMISSIONS.SALES_REPORTS
                    ])){
                    updatedMenus = [...updatedMenus,...menus.filter(menu => menu.label === 'PoS')];
                }


                //PoS > Counter/Sales
                if (!checkOrganizationPermission([PERMISSIONS.SALES_CREATE, PERMISSIONS.SALES_EDIT, PERMISSIONS.SALES_COMPLETE, PERMISSIONS.SALES_READ])) {
                    const posMenuIndex = updatedMenus.findIndex(menu => menu.label === 'PoS');
                    if (posMenuIndex >= 0) {
                        const salesIndex = updatedMenus[posMenuIndex].children.findIndex(child => child.label === 'Sales');
                        if (salesIndex >= 0) {
                            updatedMenus[posMenuIndex].children[salesIndex].children = updatedMenus[posMenuIndex].children[salesIndex].children.filter(
                                item => item.label !== "Counter"
                            );
                        }
                    }
                }

                // PoS > Proformas
                if (!checkOrganizationPermission([PERMISSIONS.SALES_CREATE,PERMISSIONS.SALES_EDIT,PERMISSIONS.SALES_COMPLETE,PERMISSIONS.SALES_READ])) {
                    const posMenuIndex = updatedMenus.findIndex(menu => menu.label === 'PoS');
                    if (posMenuIndex >= 0) {
                        updatedMenus[posMenuIndex].children = updatedMenus[posMenuIndex].children.filter(
                            child => child.label !== 'Sales'
                        );
                        const salesIndex = updatedMenus[posMenuIndex].children.findIndex(child => child.label === 'Sales');
                        if (salesIndex >= 0) {
                            updatedMenus[posMenuIndex].children[salesIndex].children = updatedMenus[posMenuIndex].children[salesIndex].children.filter(
                                item => item.label !== "Proformas"
                            );
                        }
                    }
                }

                // PoS > Reports
                if (!checkOrganizationPermission(PERMISSIONS.SALES_REPORTS)) {
                    const posMenuIndex = updatedMenus.findIndex(menu => menu.label === 'PoS');
                    if (posMenuIndex >= 0) {
                        updatedMenus[posMenuIndex].children = updatedMenus[posMenuIndex].children.filter(
                            child => child.label !== 'Reports'
                        );
                    }
                }

                // PoS > Masters
                if (!checkOrganizationPermission([PERMISSIONS.OUTLETS_READ,PERMISSIONS.POS_SETTINGS, PERMISSIONS.PRICE_LISTS_READ, PERMISSIONS.PRICE_LISTS_CREATE])) {
                    const posMenuIndex = updatedMenus.findIndex(menu => menu.label === 'PoS');
                    if (posMenuIndex >= 0) {
                        updatedMenus[posMenuIndex].children = updatedMenus[posMenuIndex].children.filter(
                            child => child.label !== 'Masters'
                        );
                    }
                }

                // PoS > Masters > Outlets
                if (!checkOrganizationPermission(PERMISSIONS.OUTLETS_READ)) {
                    const posMenuIndex = updatedMenus.findIndex(menu => menu.label === 'PoS');
                    if (posMenuIndex >= 0) {
                    const mastersIndex = updatedMenus[posMenuIndex].children.findIndex(child => child.label === 'Masters');
                    if (mastersIndex >= 0) {
                        updatedMenus[posMenuIndex].children[mastersIndex].children = updatedMenus[posMenuIndex].children[mastersIndex].children.filter(
                            item => item.label !== "Outlets"
                        );
                    }
                    }
                }

                //PoS > Masters > PriceLists
                if (!checkOrganizationPermission([PERMISSIONS.PRICE_LISTS_READ,PERMISSIONS.PRICE_LISTS_CREATE])) {
                    const posMenuIndex = updatedMenus.findIndex(menu => menu.label === 'PoS');
                    if (posMenuIndex >= 0) {
                    const mastersIndex = updatedMenus[posMenuIndex].children.findIndex(child => child.label === 'Masters');
                    if (mastersIndex >= 0) {
                        updatedMenus[posMenuIndex].children[mastersIndex].children = updatedMenus[posMenuIndex].children[mastersIndex].children.filter(
                            item => item.label !== "Price Lists"
                        );
                    }
                    }
                }

                // PoS > Masters > Settings
                if (!checkOrganizationPermission(PERMISSIONS.POS_SETTINGS)) {
                    const posMenuIndex = updatedMenus.findIndex(menu => menu.label === 'PoS');
                    if (posMenuIndex >= 0) {
                        const mastersIndex = updatedMenus[posMenuIndex].children.findIndex(child => child.label === 'Masters');
                        if (mastersIndex >= 0) {
                            updatedMenus[posMenuIndex].children[mastersIndex].children = updatedMenus[posMenuIndex].children[mastersIndex].children.filter(
                                item => item.label !== "Settings"
                            );
                        }
                    }
                }
            }

            if(organizationHasSubscribed(MODULES.FUEL_STATION)){
                //Fuel Station
                if(checkOrganizationPermission(
                    [
                        PERMISSIONS.FUEL_STATIONS_READ,
                        PERMISSIONS.FUEL_STATIONS_CREATE,
                        PERMISSIONS.FUEL_STATIONS_UPDATE,
                        PERMISSIONS.FUEL_STATIONS_DELETE,
                        PERMISSIONS.FUEL_SALES_SHIFT_READ,
                        PERMISSIONS.FUEL_SALES_SHIFT_CREATE,
                        PERMISSIONS.FUEL_SALES_SHIFT_UPDATE,
                        PERMISSIONS.FUEL_SALES_SHIFT_CLOSE,
                        PERMISSIONS.FUEL_SALES_SHIFT_DELETE,
                    ])){
                    updatedMenus = [...updatedMenus,...menus.filter(menu => menu.label === 'Fuel Station')];
                }

                // Fuel Station > Sales Shift
                if (!checkOrganizationPermission([
                    PERMISSIONS.FUEL_SALES_SHIFT_READ,
                    PERMISSIONS.FUEL_SALES_SHIFT_CREATE,
                    PERMISSIONS.FUEL_SALES_SHIFT_UPDATE,
                    PERMISSIONS.FUEL_SALES_SHIFT_DELETE,
                ])) {
                    const fuelStationMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Fuel Station');
                    if (fuelStationMenuIndex >= 0) {
                        updatedMenus[fuelStationMenuIndex].children = updatedMenus[fuelStationMenuIndex].children.filter(
                            child => child.label !== 'Sales Shifts'
                        );
                    }
                }

                // Fuel Station > Masters
                if (!checkOrganizationPermission([
                    PERMISSIONS.FUEL_STATIONS_READ,
                    PERMISSIONS.FUEL_STATIONS_CREATE,
                    PERMISSIONS.FUEL_STATIONS_UPDATE,
                    PERMISSIONS.FUEL_STATIONS_DELETE,
                ])) {
                    const fuelStationMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Fuel Station');
                    if (fuelStationMenuIndex >= 0) {
                        updatedMenus[fuelStationMenuIndex].children = updatedMenus[fuelStationMenuIndex].children.filter(
                            child => child.label !== 'Masters'
                        );
                    }
                }

                // Fuel Station > Masters > Fuel Stations
                if (!checkOrganizationPermission([
                    PERMISSIONS.FUEL_STATIONS_READ,
                    PERMISSIONS.FUEL_STATIONS_CREATE,
                    PERMISSIONS.FUEL_STATIONS_UPDATE,
                    PERMISSIONS.FUEL_STATIONS_DELETE,
                ])) {
                    const fuelStationMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Fuel Station');
                    if (fuelStationMenuIndex >= 0) {
                        const mastersIndex = updatedMenus[fuelStationMenuIndex].children.findIndex(child => child.label === 'Masters');
                        if(mastersIndex >= 0){
                            updatedMenus[fuelStationMenuIndex].children[mastersIndex].children = updatedMenus[fuelStationMenuIndex].children[mastersIndex].children.filter(
                                child => child.label !== 'Stations'
                            );
                        }
                    }
                }
            }

            if(organizationHasSubscribed(MODULES.MANUFACTURING_AND_PROCESSING)){
                //Manufacturing & Processing
                if(checkOrganizationPermission([
                    PERMISSIONS.BOM_READ,
                    PERMISSIONS.BOM_CREATE,
                    PERMISSIONS.BOM_EDIT,
                    PERMISSIONS.BOM_DELETE,
                    PERMISSIONS.PRODUCTION_BATCHES_CREATE,
                    PERMISSIONS.PRODUCTION_BATCHES_READ,
                    PERMISSIONS.PRODUCTION_BATCHES_EDIT,
                    PERMISSIONS.PRODUCTION_BATCHES_DELETE,
                ])){
                    updatedMenus = [...updatedMenus,...menus.filter(menu => menu.label === 'Manufacturing')];
                }

                // Manufacturing & Processing > Manufacturing Orders
                if (!checkOrganizationPermission([
                    PERMISSIONS.PRODUCTION_BATCHES_CREATE,
                    PERMISSIONS.PRODUCTION_BATCHES_EDIT,
                    PERMISSIONS.PRODUCTION_BATCHES_READ,
                    PERMISSIONS.PRODUCTION_BATCHES_DELETE,
                ])) {
                    const manufacturingMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Manufacturing');
                    if (manufacturingMenuIndex >= 0) {
                        updatedMenus[manufacturingMenuIndex].children = updatedMenus[manufacturingMenuIndex].children.filter(
                            child => child.label !== "Production Batches"
                        );
                    }
                }

                const hasProjectMasters = checkOrganizationPermission([
                    PERMISSIONS.PRODUCT_CATEGORIES_READ,
                    PERMISSIONS.PROJECT_CATEGORIES_CREATE,
                    PERMISSIONS.PROJECT_CATEGORIES_EDIT,
                    PERMISSIONS.PROJECT_CATEGORIES_DELETE,
                ]);

                // Project Management > Masters
                if (!hasProjectMasters) {
                    const projectsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Project Management');
                    if (projectsMenuIndex >= 0) {
                        updatedMenus[projectsMenuIndex].children = updatedMenus[projectsMenuIndex].children.filter(
                            child => child.label !== 'Masters'
                        );
                    }
                }


                //Project Management  > Masters > Product Categories
                if (!hasProjectMasters) {
                    const projectsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Project Management');
                    if (projectsMenuIndex >= 0) {
                        const mastersIndex = updatedMenus[projectsMenuIndex].children.findIndex(child => child.label === 'Masters');
                        if (mastersIndex >= 0) {
                            updatedMenus[projectsMenuIndex].children[mastersIndex].children = updatedMenus[projectsMenuIndex].children[mastersIndex].children.filter(
                                item => item.label !== "Project Categories"
                            );
                        }
                    }
                }
            }

            if(organizationHasSubscribed(MODULES.PROJECT_MANAGEMENT)){
                //Project Management
                if(checkOrganizationPermission([
                    PERMISSIONS.PROJECTS_READ,
                    PERMISSIONS.PROJECTS_CREATE,
                    PERMISSIONS.PROJECTS_EDIT,
                    PERMISSIONS.PROJECTS_DELETE,
                    PERMISSIONS.PROJECT_CATEGORIES_EDIT,
                    PERMISSIONS.PROJECT_CATEGORIES_CREATE,
                    PERMISSIONS.PROJECT_CATEGORIES_EDIT,
                    PERMISSIONS.PROJECT_CATEGORIES_DELETE,
                ])){
                    updatedMenus = [...updatedMenus,...menus.filter(menu => menu.label === 'Project Management')];
                }

                // Project Management > Projects
                if (!checkOrganizationPermission([
                    PERMISSIONS.PROJECTS_READ,
                    PERMISSIONS.PROJECTS_CREATE,
                    PERMISSIONS.PROJECTS_EDIT,
                    PERMISSIONS.PROJECTS_DELETE,
                ])) {
                    const projectsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Project Management');
                    if (projectsMenuIndex >= 0) {
                        updatedMenus[projectsMenuIndex].children = updatedMenus[projectsMenuIndex].children.filter(
                            child => child.label !== 'Projects'
                        );
                    }
                }

                const hasProjectMasters = checkOrganizationPermission([
                    PERMISSIONS.PRODUCT_CATEGORIES_READ,
                    PERMISSIONS.PROJECT_CATEGORIES_CREATE,
                    PERMISSIONS.PROJECT_CATEGORIES_EDIT,
                    PERMISSIONS.PROJECT_CATEGORIES_DELETE,
                ]);

                // Project Management > Masters
                if (!hasProjectMasters) {
                    const projectsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Project Management');
                    if (projectsMenuIndex >= 0) {
                        updatedMenus[projectsMenuIndex].children = updatedMenus[projectsMenuIndex].children.filter(
                            child => child.label !== 'Masters'
                        );
                    }
                }


                //Project Management  > Masters > Product Categories
                if (!hasProjectMasters) {
                    const projectsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Project Management');
                    if (projectsMenuIndex >= 0) {
                        const mastersIndex = updatedMenus[projectsMenuIndex].children.findIndex(child => child.label === 'Masters');
                        if (mastersIndex >= 0) {
                            updatedMenus[projectsMenuIndex].children[mastersIndex].children = updatedMenus[projectsMenuIndex].children[mastersIndex].children.filter(
                                item => item.label !== "Project Categories"
                            );
                        }
                    }
                }
            }


            if(organizationHasSubscribed(MODULES.ACCOUNTS_AND_FINANCE)){

                //Accounts
                if(checkOrganizationPermission(
                    [
                        PERMISSIONS.ACCOUNTS_MASTERS_READ,
                        PERMISSIONS.ACCOUNTS_MASTERS_CREATE,
                        PERMISSIONS.ACCOUNTS_MASTERS_READ,
                        PERMISSIONS.ACCOUNTS_TRANSACTIONS_CREATE,
                        PERMISSIONS.ACCOUNTS_REPORTS,
                    ])){
                    updatedMenus = [...updatedMenus,...menus.filter(menu => menu.label === 'Accounts & Finance')];
                }

                // Accounts > Transactions
                if (!checkOrganizationPermission([
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_CREATE
                ])) {
                    const accountsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Accounts & Finance');
                    if (accountsMenuIndex >= 0) {
                        updatedMenus[accountsMenuIndex].children = updatedMenus[accountsMenuIndex].children.filter(
                            child => child.label !== 'Transactions'
                        );
                    }
                }

                //Accounts > Transactions
                if (!checkOrganizationPermission([
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,
                    PERMISSIONS.ACCOUNTS_TRANSACTIONS_CREATE
                ])) {
                    const accountsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Accounts & Finance');
                    if (accountsMenuIndex >= 0) {
                        updatedMenus[accountsMenuIndex].children = updatedMenus[accountsMenuIndex].children.filter(
                            item => item.label !== "Transactions"
                        );
                    }
                }

                //Accounts > Approved Payments
                if (!organizationHasSubscribed(MODULES.PROCESS_APPROVAL)) {
                    const accountsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Accounts & Finance');
                    
                    if (accountsMenuIndex >= 0) {
                        updatedMenus[accountsMenuIndex].children = updatedMenus[accountsMenuIndex].children.filter(
                            item => item.label !== "Approved Payments"
                        );
                    }
                }

                // Accounts > Masters
                if (!checkOrganizationPermission([PERMISSIONS.ACCOUNTS_MASTERS_READ, PERMISSIONS.ACCOUNTS_MASTERS_CREATE])) {
                    const accountsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Accounts & Finance');
                    if (accountsMenuIndex >= 0) {
                        updatedMenus[accountsMenuIndex].children = updatedMenus[accountsMenuIndex].children.filter(
                            child => child.label !== 'Masters'
                        );
                    }
                }

                // Accounts > Reports
                if (!checkOrganizationPermission(PERMISSIONS.ACCOUNTS_REPORTS)) {
                    const accountsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Accounts & Finance');
                    if (accountsMenuIndex >= 0) {
                        updatedMenus[accountsMenuIndex].children = updatedMenus[accountsMenuIndex].children.filter(
                            child => child.label !== 'Reports'
                        );
                    }
                }
            }

            if(organizationHasSubscribed(MODULES.PROCUREMENT_AND_SUPPLY)){
                //Procurement & Supply
                if(checkOrganizationPermission(
                    [
                        PERMISSIONS.PURCHASES_READ,
                        PERMISSIONS.PURCHASES_CREATE,
                        PERMISSIONS.PURCHASES_RECEIVE,
                        PERMISSIONS.PURCHASES_UNRECEIVE,
                        PERMISSIONS.PRODUCTS_READ,
                        PERMISSIONS.PRODUCTS_CREATE,
                        PERMISSIONS.PRODUCT_CATEGORIES_READ,
                        PERMISSIONS.PRODUCT_CATEGORIES_CREATE,
                        PERMISSIONS.STORES_READ,
                        PERMISSIONS.STORES_CREATE,
                        PERMISSIONS.INVENTORY_CONSUMPTIONS_READ,
                        PERMISSIONS.INVENTORY_CONSUMPTIONS_CREATE
                    ])){
                    updatedMenus = [...updatedMenus,...menus.filter(menu => menu.label === 'Procurement & Supply')];
                }

                // Procurement > Purchases
                if (!checkOrganizationPermission([
                    PERMISSIONS.PURCHASES_READ,
                    PERMISSIONS.PURCHASES_CREATE,
                    PERMISSIONS.PURCHASES_RECEIVE,
                    PERMISSIONS.PURCHASES_UNRECEIVE
                ])) {
                    const procurementsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Procurement & Supply');
                    if (procurementsMenuIndex >= 0) {
                        updatedMenus[procurementsMenuIndex].children = updatedMenus[procurementsMenuIndex].children.filter(
                            child => child.label !== 'Purchases'
                        );
                    }
                }

                //Accounts > Approved Payments
                if (!organizationHasSubscribed(MODULES.PROCESS_APPROVAL)) {
                    const procurementsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Procurement & Supply');
                    if (procurementsMenuIndex >= 0) {
                        updatedMenus[procurementsMenuIndex].children = updatedMenus[procurementsMenuIndex].children.filter(
                            item => item.label !== "Approved Purchases"
                        );
                    }
                }


                //Procurement > Purchases > Purchases List
                if (!checkOrganizationPermission([
                    PERMISSIONS.PURCHASES_READ,
                    PERMISSIONS.PURCHASES_CREATE,
                    PERMISSIONS.PURCHASES_RECEIVE,
                    PERMISSIONS.PURCHASES_UNRECEIVE
                ])) {
                    const procurementsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Procurement & Supply');
                    if (procurementsMenuIndex >= 0) {
                        updatedMenus[procurementsMenuIndex].children = updatedMenus[procurementsMenuIndex].children.filter(
                            item => item.label !== "Purchases"
                        );
                    }
                }

                //Procurement > Reports
                if (!checkOrganizationPermission(PERMISSIONS.PURCHASES_REPORTS)) {
                    const procurementsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Procurement & Supply');
                    if (procurementsMenuIndex >= 0) {
                        updatedMenus[procurementsMenuIndex].children = updatedMenus[procurementsMenuIndex].children.filter(
                            item => item.label !== "Reports"
                        );
                    }
                }

                //Procurement > Inventory Consumptions
                if (!checkOrganizationPermission([PERMISSIONS.INVENTORY_CONSUMPTIONS_READ,PERMISSIONS.INVENTORY_CONSUMPTIONS_CREATE])) {
                    const procurementsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Procurement & Supply');
                    if (procurementsMenuIndex >= 0) {
                        updatedMenus[procurementsMenuIndex].children = updatedMenus[procurementsMenuIndex].children.filter(
                            item => item.label !== "Consumptions"
                        );
                    }
                }


                // Procurement > Masters
                if (!checkOrganizationPermission([
                    PERMISSIONS.PRODUCT_CATEGORIES_READ,
                    PERMISSIONS.STORES_READ,
                    PERMISSIONS.PRODUCTS_READ
                ])) {
                    const procurementsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Procurement & Supply');
                    if (procurementsMenuIndex >= 0) {
                        updatedMenus[procurementsMenuIndex].children = updatedMenus[procurementsMenuIndex].children.filter(
                            child => child.label !== 'Masters'
                        );
                    }
                }


                //Procurement > Masters > Product Categories
                if (!checkOrganizationPermission([PERMISSIONS.PRODUCT_CATEGORIES_READ, PERMISSIONS.PRODUCT_CATEGORIES_CREATE])) {
                    const procurementsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Procurement & Supply');
                    if (procurementsMenuIndex >= 0) {
                        const mastersIndex = updatedMenus[procurementsMenuIndex].children.findIndex(child => child.label === 'Masters');
                        if (mastersIndex >= 0) {
                            updatedMenus[procurementsMenuIndex].children[mastersIndex].children = updatedMenus[procurementsMenuIndex].children[mastersIndex].children.filter(
                                item => item.label !== "Product Categories"
                            );
                        }
                    }
                }

                //Procurement > Masters > Products
                if (!checkOrganizationPermission([PERMISSIONS.PRODUCTS_READ,PERMISSIONS.PRODUCTS_CREATE])) {
                    const procurementsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Procurement & Supply');
                    if (procurementsMenuIndex >= 0) {
                        const mastersIndex = updatedMenus[procurementsMenuIndex].children.findIndex(child => child.label === 'Masters');
                        if (mastersIndex >= 0) {
                            updatedMenus[procurementsMenuIndex].children[mastersIndex].children = updatedMenus[procurementsMenuIndex].children[mastersIndex].children.filter(
                                item => item.label !== "Products"
                            );
                        }
                    }
                }

                //Procurement > Masters > Products
                if (!checkOrganizationPermission([PERMISSIONS.STORES_READ,PERMISSIONS.STORES_CREATE])) {
                    const procurementsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Procurement & Supply');
                    if (procurementsMenuIndex >= 0) {
                        const mastersIndex = updatedMenus[procurementsMenuIndex].children.findIndex(child => child.label === 'Masters');
                        if (mastersIndex >= 0) {
                            updatedMenus[procurementsMenuIndex].children[mastersIndex].children = updatedMenus[procurementsMenuIndex].children[mastersIndex].children.filter(
                                item => item.label !== "Stores"
                            );
                        }
                    }
                }
            }

            //Tools
            if( authOrganization?.organization?.active_subscriptions?.length > 0 && checkOrganizationPermission(
                [
                    PERMISSIONS.FILES_SHELF_BROWSE,
                ])){
                updatedMenus = [...updatedMenus,...menus.filter(menu => menu.label === 'Tools')];
            }

            // Procurement > Purchases
            if (!checkOrganizationPermission(PERMISSIONS.FILES_SHELF_BROWSE)) {
                const toolsMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Tools');
                if (toolsMenuIndex >= 0) {
                    updatedMenus[toolsMenuIndex].children = updatedMenus[toolsMenuIndex].children.filter(
                        child => child.label !== 'Files Shelf'
                    );
                }
            }

            //Masters
            if(authOrganization?.organization?.active_subscriptions?.length > 0 && checkOrganizationPermission(
                [
                    PERMISSIONS.STAKEHOLDERS_READ,
                    PERMISSIONS.MEASUREMENT_UNITS_READ,
                    PERMISSIONS.ACCOUNTS_MASTERS_CREATE,
                ])
            ){
                updatedMenus = [...updatedMenus,...menus.filter(menu => menu.label === 'Masters')];
            }

            // Masters > Stakeholders
            if (!checkOrganizationPermission([PERMISSIONS.STAKEHOLDERS_READ, PERMISSIONS.STAKEHOLDERS_CREATE])) {
                const mastersMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Masters');
                if (mastersMenuIndex >= 0) {
                    updatedMenus[mastersMenuIndex].children = updatedMenus[mastersMenuIndex].children.filter(
                        child => child.label !== 'Stakeholders'
                    );
                }
            }
            
            // Masters > Currencies
            if (!checkOrganizationPermission(PERMISSIONS.ACCOUNTS_MASTERS_CREATE)) {
                const mastersMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Masters');
                if (mastersMenuIndex >= 0) {
                    updatedMenus[mastersMenuIndex].children = updatedMenus[mastersMenuIndex].children.filter(
                        child => child.label !== 'Currencies'
                    );
                }
            }
            
            // Masters > Measurement Units
            if (!checkOrganizationPermission(PERMISSIONS.MEASUREMENT_UNITS_READ)) {
                const mastersMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Masters');
                if (mastersMenuIndex >= 0) {
                    updatedMenus[mastersMenuIndex].children = updatedMenus[mastersMenuIndex].children.filter(
                        child => child.label !== 'Measurement Units'
                    );
                }
            }
        }

        //Pros Control
        if(!!authUser?.permissions && authUser.permissions.length > 0){
            updatedMenus = [...updatedMenus,...menus.filter(menu => menu.label === 'Pros Control')];
        }

        // Pros Control > ProsAfricans
        if (!checkPermission([
            PROS_CONTROL_PERMISSIONS.PROSAFRICANS_READ,
            PROS_CONTROL_PERMISSIONS.PROSAFRICANS_MANAGE
        ])) {
            const prosControlMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Pros Control');
            if (prosControlMenuIndex >= 0) {
                updatedMenus[prosControlMenuIndex].children = updatedMenus[prosControlMenuIndex].children.filter(
                    child => child.label !== 'ProsAfricans'
                );
            }
        }

        //Pros Control > Subscriptions
        if (!checkPermission([
            PROS_CONTROL_PERMISSIONS.SUBSCRIPTIONS_MANAGE,
            PROS_CONTROL_PERMISSIONS.SUBSCRIPTIONS_READ
        ])) {
            const prosControlMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Pros Control');
            if (prosControlMenuIndex >= 0) {
                updatedMenus[prosControlMenuIndex].children = updatedMenus[prosControlMenuIndex].children.filter(
                    child => child.label !== 'Subscriptions'
                );
            }
        }

        //Pros Control > Troubleshooting
        if (!checkPermission([
            PROS_CONTROL_PERMISSIONS.DATABASE_MIGRATE,
            PROS_CONTROL_PERMISSIONS.DATABASE_REFRESH,
            PROS_CONTROL_PERMISSIONS.PERMISSIONS_MANAGE
        ])) {
            const prosControlMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Pros Control');
            if (prosControlMenuIndex >= 0) {
                updatedMenus[prosControlMenuIndex].children = updatedMenus[prosControlMenuIndex].children.filter(
                    child => child.label !== 'Troubleshooting'
                );
            }
        }

        if (!checkPermission([
            PROS_CONTROL_PERMISSIONS.USERS_READ,
            PROS_CONTROL_PERMISSIONS.USERS_MANAGE,
        ])) {
            const prosControlMenuIndex = updatedMenus.findIndex(menu => menu.label === 'Pros Control');
            if (prosControlMenuIndex >= 0) {
                updatedMenus[prosControlMenuIndex].children = updatedMenus[prosControlMenuIndex].children.filter(
                    child => child.label !== 'Users Management'
                );
            }
        }

       //Organizations should always included
        const orgMenu = menus.find(menu => menu.label === "Organizations");
        if (orgMenu) {
            updatedMenus.push(orgMenu);
        }

        setMenuItems([
            ...updatedMenus,
        ]);
    }, [authOrganization, checkOrganizationPermission,authUser?.permissions,checkPermission,organizationHasSubscribed]);

    return (
        <React.Fragment>
            <SidebarHeader/>
            <JumboScrollbar
                autoHide
                autoHideDuration={200}
                autoHideTimeout={500}
            >
                <Suspense
                    fallback={
                        <Div
                            sx={{
                                display: 'flex',
                                minWidth: 0,
                                alignItems: 'center',
                                alignContent: 'center',
                                px: 3
                            }}
                        >
                            <SidebarSkeleton/>
                        </Div>
                    }
                >
                    <JumboVerticalNavbar items={menuItems}/>
                </Suspense>
            </JumboScrollbar>
        </React.Fragment>
    );
};

export { Sidebar };
