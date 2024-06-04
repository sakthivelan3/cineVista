import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { auth, firestore } from "../firebase";

const CreateListDialog = ({ open, onClose }) => {
    const [listName, setListName] = useState("");

    const handleCreateList = async () => {
        if (listName) {
            const listRef = collection(firestore, "users", auth.currentUser.uid, "likeLists");
            await addDoc(listRef, { name: listName, movies: [] });
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create New List</DialogTitle>
            <DialogContent>
                <TextField
                    label="List Name"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleCreateList} color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateListDialog;
