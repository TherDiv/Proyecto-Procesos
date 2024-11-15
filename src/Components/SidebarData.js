import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GroupIcon from '@mui/icons-material/Group';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

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
        title: "Actividades",
        icon: <CalendarMonthIcon />,
        link: "/horarios"
    },
    {
        title: "Trabajadores",
        icon: <BusinessCenterIcon />,
        link: "/trabajadores"
    }
];
