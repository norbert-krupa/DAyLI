import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Container, Stack, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AxiosCalendarInstance from "./AxiosCalendarInstance";
import MyIconButton from "./forms/MyIconButton";
import CreateGroupModal from "./utils/CreateGroupModal";
import EditGroupModal from "./utils/EditGroupModal";

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = () => {
        AxiosCalendarInstance.get(`taskeventgroups/?owner=${localStorage.getItem("user_id")}`)
            .then((response) => {
                const sortedGroups = response.data.sort((a, b) => 
                    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
                );
                setGroups(sortedGroups);
                setFilteredGroups(sortedGroups);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching groups:", error);
                setGroups([]);
                setFilteredGroups([]);
                setLoading(false);
            });
    };

    const handleDeleteGroup = (groupId) => {
        AxiosCalendarInstance.delete(`taskeventgroups/${groupId}/?owner=${localStorage.getItem("user_id")}`)
            .then(() => {
                setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
                setFilteredGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
            })
            .catch((error) => {
                console.error("Error deleting group:", error);
            });
    };

    const handleEditGroup = (group) => {
        setSelectedGroup(group);
        setOpenEditModal(true);
    };

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        if (!query) {
            setFilteredGroups(groups);
        } else {
            const filtered = groups.filter((group) => {
                if (query.length === 1) {
                    return group.name.toLowerCase().startsWith(query);
                } else {
                    return (
                        group.name.toLowerCase().includes(query) ||
                        (group.description && group.description.toLowerCase().includes(query))
                    );
                }
            });

            setFilteredGroups(filtered);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h4" fontWeight="bold">
                    My Groups
                </Typography>
                <MyIconButton
                    icon={<AddCircleIcon />}
                    onClick={() => setOpenCreateModal(true)}
                    ariaLabel="add-group"
                    sx={{
                        backgroundColor: "#4caf50",
                        color: "white",
                        "&:hover": { backgroundColor: "#388e3c" }
                    }}
                />
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search Groups..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ mb: 3 }}
            />

            <CreateGroupModal 
                open={openCreateModal} 
                handleClose={() => setOpenCreateModal(false)} 
                refreshGroups={fetchGroups} 
            />

            {selectedGroup && (
                <EditGroupModal
                    open={openEditModal}
                    handleClose={() => setOpenEditModal(false)}
                    groupData={selectedGroup}
                    refreshGroups={fetchGroups}
                />
            )}

            {loading ? (
                <CircularProgress />
            ) : filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                    <Box
                        key={group.id}
                        sx={{
                            p: 2,
                            mb: 2,
                            border: "1px solid #ccc",
                            borderRadius: 2,
                            boxShadow: 2,
                            bgcolor: "background.paper",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,  
                                height: 40, 
                                borderRadius: 2, 
                                backgroundColor: group.group_color || "#ccc",
                                border: "1px solid #aaa",
                                flexShrink: 0,
                                mr: 2, 
                            }}
                        />

                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight="bold">
                                {group.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {group.description || "No description"}
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={1}>
                            <MyIconButton
                                icon={<EditIcon />}
                                onClick={() => handleEditGroup(group)}
                                ariaLabel="edit"
                                sx={{
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#1565c0" }
                                }}
                            />
                            <MyIconButton
                                icon={<DeleteForeverIcon />}
                                onClick={() => handleDeleteGroup(group.id)}
                                ariaLabel="delete"
                                sx={{
                                    backgroundColor: "red",
                                    color: "white",
                                    "&:hover": { backgroundColor: "darkred" }
                                }}
                            />
                        </Stack>
                    </Box>
                ))
            ) : (
                <Typography variant="body1" color="text.secondary" align="center">
                    {searchQuery ? "No groups match your search." : "You have no groups yet."}
                </Typography>
            )}
        </Container>
    );
};

export default Groups;
