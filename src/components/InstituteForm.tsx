import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";

interface InstituteFormProps {
  open: boolean;
  onClose: () => void;
  institute: {
    name: string;
    email: string;
    address: string;
    contact: string;
    website: string;
    established: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isEditing: boolean;
}

const InstituteForm: React.FC<InstituteFormProps> = ({
  open,
  onClose,
  institute,
  onChange,
  onSubmit,
  isEditing,
}) => {

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", pb: 1 }}>
        {isEditing ? "Edit Institute" : "Add Institute"}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={1.5}  className="pt-4 space-y-2">
          <Grid item xs={12}>
            <TextField
              label="Institute Name"
              name="name"
              fullWidth
              size="small"
              value={institute.name}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              size="small"
              value={institute.email}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Contact"
              name="contact"
              fullWidth
              size="small"
              value={institute.contact}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              fullWidth
              size="small"
              value={institute.address}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Website"
              name="website"
              fullWidth
              size="small"
              value={institute.website}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Established"
              name="established"
              type="date"
              fullWidth
              size="small"
              value={institute.established}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained">
          {isEditing ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstituteForm;