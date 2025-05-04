import { LoginForm } from "@/pages/login/components/login-form";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { useNavigate } from "react-router";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const navigate = useNavigate();
  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-md" showClose={false}>
        <LoginForm
          className="p-0"
          onSuccessfulLogin={() => {
            onClose();
            void navigate(0);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
