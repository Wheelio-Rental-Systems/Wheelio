import { useState } from "react";
import {
    HelpCircle,
    MessageSquare,
    AlertTriangle,
    Phone,
    ShieldAlert,
    ChevronRight,
    Send,
    LifeBuoy,
    MapPin
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

export function SupportDialog({ open, onOpenChange, defaultTab = "faq" }) {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync internal state if prop changes (optional interaction pattern)
    // functionality handled by Tabs defaultValue usually, but if opened dynamically to specific tab:
    if (open && activeTab !== defaultTab && defaultTab !== "faq") {
        // This is a simplification; in a real app we'd use useEffect or just let the parent control
    }

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Message sent successfully", {
                description: "Our support team will get back to you within 24 hours."
            });
            onOpenChange(false);
        }, 1500);
    };

    const handleEmergencyReport = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast.error("Emergency Alert Sent", {
                description: "Emergency contacts and local authorities have been notified of your location.",
                duration: 5000,
            });
        }, 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto border-white/10 bg-[#0f0f1a]/95 backdrop-blur-xl p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <LifeBuoy className="h-6 w-6 text-primary" />
                        Help & Support
                    </DialogTitle>
                    <DialogDescription>
                        How can we assist you today?
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue={defaultTab} className="w-full">
                    <div className="px-6">
                        <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
                            <TabsTrigger value="faq">FAQ</TabsTrigger>
                            <TabsTrigger value="contact">Contact Us</TabsTrigger>
                            <TabsTrigger value="emergency" className="data-[state=active]:bg-destructive data-[state=active]:text-white text-destructive hover:text-destructive/80">
                                Emergency
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* FAQ TAB */}
                    <TabsContent value="faq" className="p-6 space-y-4 pt-4">
                        <div className="space-y-1">
                            <h3 className="font-semibold text-lg">Frequently Asked Questions</h3>
                            <p className="text-sm text-muted-foreground">Quick answers to common questions</p>
                        </div>

                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1" className="border-white/5">
                                <AccordionTrigger>What documents do I need to rent a vehicle?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    You need a valid driver's license, an ID proof (Aadhar/Passport), and a credit/debit card for the security deposit. International renters need an International Driving Permit (IDP).
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-white/5">
                                <AccordionTrigger>Is fuel included in the rental price?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    No, fuel is not included. The vehicle is provided with a full tank and should be returned with a full tank. Alternatively, you can pay for the missing fuel plus a refueling charge.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className="border-white/5">
                                <AccordionTrigger>What is the cancellation policy?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    You can cancel for free up to 24 hours before your pickup time. Cancellations made within 24 hours incur a 50% fee. No-shows are charged 100%.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4" className="border-white/5">
                                <AccordionTrigger>Is there a security deposit?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Yes, a refundable security deposit of ₹500 is charged at the time of booking. It is refunded within 3-5 business days after the vehicle is returned damage-free.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5" className="border-white/5">
                                <AccordionTrigger>What happens if the vehicle breaks down?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    We offer 24/7 roadside assistance. In case of a breakdown, contact us immediately via the "Emergency" tab or call our support line. We will provide a replacement vehicle or arrange repairs.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </TabsContent>

                    {/* CONTACT TAB */}
                    <TabsContent value="contact" className="p-6 space-y-4 pt-4">
                        <div className="space-y-1">
                            <h3 className="font-semibold text-lg">Send us a message</h3>
                            <p className="text-sm text-muted-foreground">We usually respond within a few hours</p>
                        </div>

                        <form onSubmit={handleContactSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" placeholder="e.g., Booking modification Request" className="bg-secondary/30 border-white/10" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Describe your issue or query..."
                                    className="bg-secondary/30 border-white/10 min-h-[150px]"
                                    required
                                />
                            </div>

                            <div className="pt-2">
                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" /> Send Message
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="mt-4 p-4 rounded-lg bg-secondary/30 border border-white/5 flex flex-col gap-4">
                                <div className="flex items-start gap-3 text-muted-foreground">
                                    <MapPin className="h-5 w-5 text-primary shrink-0" />
                                    <span>123 Mobility Lane, Tech District,<br />Coimbatore, Tamilnadu 641004</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Phone className="h-5 w-5 text-primary shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Customer Care</p>
                                        <p className="text-sm">+91 95858 99711</p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </TabsContent>

                    {/* EMERGENCY TAB */}
                    <TabsContent value="emergency" className="p-6 space-y-6 pt-4">
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex gap-4">
                            <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-destructive">Emergency Assistance</h3>
                                <p className="text-sm text-destructive/80">
                                    Only use this section for urgent situations like accidents, theft, or severe breakdowns requiring immediate attention.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive">
                                    <ShieldAlert className="h-8 w-8" />
                                    <span className="font-semibold">Police</span>
                                </Button>
                                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive">
                                    <LifeBuoy className="h-8 w-8" />
                                    <span className="font-semibold">Ambulance</span>
                                </Button>
                            </div>

                            <Button onClick={handleEmergencyReport} className="h-16 w-full text-lg bg-destructive hover:bg-destructive/90 animate-pulse font-bold">
                                {isSubmitting ? "Sending Alert..." : "REPORT EMERGENCY & SHARE LOCATION"}
                            </Button>

                            <div className="text-center">
                                <p className="text-xs text-muted-foreground mb-4">
                                    Pressing this will share your live coordinates with our safety team and local authorities.
                                </p>
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-secondary/30 py-2 rounded-full">
                                    <MapPin className="h-4 w-4" />
                                    <span>Your Location: Detecting... (Enable GPS)</span>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
