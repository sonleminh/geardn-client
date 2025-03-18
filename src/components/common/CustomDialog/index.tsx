import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

export default function CustomDialog({
  title,
  content,
  okContent,
  cancelContent,
  open,
  handleConfirm,
  handleClose,
}: {
  title: string;
  content?: string;
  okContent: string;
  cancelContent: string;
  open: boolean;
  handleConfirm: () => void;
  handleClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color='primary' variant='contained'>
          {okContent}
        </Button>
        <Button onClick={handleClose} color='inherit'>
          {cancelContent}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
