import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from "@mui/material";

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
}

const InstituteForm: React.FC<InstituteFormProps> = ({ open, onClose, institute, onChange, onSubmit }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", pb: 1 }}>
        Add Institute
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <TextField label="Institute Name" name="name" fullWidth size="small" value={institute.name} onChange={onChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Email" name="email" fullWidth size="small" value={institute.email} onChange={onChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Contact" name="contact" fullWidth size="small" value={institute.contact} onChange={onChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Address" name="address" fullWidth size="small" value={institute.address} onChange={onChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Website" name="website" fullWidth size="small" value={institute.website} onChange={onChange} />
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
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstituteForm;