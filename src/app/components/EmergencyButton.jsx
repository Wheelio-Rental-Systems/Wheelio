import { ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";



export function EmergencyButton({ onClick }) {
    return (
        <Button
            onClick={onClick}
            variant="destructive"
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:scale-110 transition-transform animate-in zoom-in duration-500"
        >
            <ShieldAlert className="h-6 w-6" />
        </Button>
    );
}

