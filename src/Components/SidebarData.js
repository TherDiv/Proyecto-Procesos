import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GroupIcon from '@mui/icons-material/Group';

export const SidebarData = [
    {
        title: "Inicio",
        icon: <HomeIcon />,
        link: "/"
    },
    {
        title: "Asistencias",
        icon: <EventAvailableIcon />,
        link: "/asistencias"
    },
    {
        title: "Usuarios",
        icon: <GroupIcon />,
        link: "/usuarios"
    },
    {
        title: "Financiero",
        icon: <AttachMoneyIcon />,
        link: "/financiero"
    },
    {
        title: "Horarios",
        icon: <CalendarMonthIcon />,
        link: "/horarios"
    },
    {
        title: "Trabajadores",
        icon: <BusinessCenterIcon />,
        link: "/trabajadores"
    },
    {
        title: "Mantenimiento",
        icon: <EngineeringIcon />,
        link: "/mantenimiento"
    }
]