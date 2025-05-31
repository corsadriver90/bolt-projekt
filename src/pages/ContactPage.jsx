import React, { useState, useEffect } from 'react';
    import { useLocation } from 'react-router-dom';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { Mail, User, Building, Briefcase as BriefcaseIcon, MessageSquare, Send, Phone, HelpCircle, ShoppingBag, Settings, MessageCircle as MessageCircleQuestion } from 'lucide-react';

    const GeneralContactForm = ({ onSubmit, initialSubject }) => {
      const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: initialSubject || '',
        message: '',
      });

      useEffect(() => {
        setFormData(prev => ({ ...prev, subject: initialSubject || '' }));
      }, [initialSubject]);

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubjectChange = (value) => {
        setFormData({ ...formData, subject: value });
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, 'general');
      };

      const subjectOptions = [
        { value: "Allgemeine Anfrage", label: "Allgemeine Anfrage", icon: <HelpCircle className="mr-2 h-4 w-4" /> },
        { value: "Frage zum Ankaufsprozess", label: "Frage zum Ankaufsprozess", icon: <ShoppingBag className="mr-2 h-4 w-4" /> },
        { value: "Frage zu einer bestehenden Ankaufsnummer", label: "Frage zu einer bestehenden Ankaufsnummer", icon: <MessageCircleQuestion className="mr-2 h-4 w-4" /> },
        { value: "Problem mit der Webseite", label: "Problem mit der Webseite", icon: <Settings className="mr-2 h-4 w-4" /> },
        { value: "Feedback & Verbesserungsvorschläge", label: "Feedback & Verbesserungsvorschläge", icon: <MessageSquare className="mr-2 h-4 w-4" /> },
        { value: "Sonstiges", label: "Sonstiges", icon: <MessageSquare className="mr-2 h-4 w-4" /> },
      ];

      return (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-base">Name*</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ihr Name" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email" className="text-base">E-Mail*</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Ihre E-Mail-Adresse" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="subject-select" className="text-base">Betreff*</Label>
            <Select onValueChange={handleSubjectChange} value={formData.subject} name="subject-select" required>
              <SelectTrigger id="subject-select" className="w-full mt-1">
                <SelectValue placeholder="Bitte Betreff auswählen..." />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      {option.icon}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {formData.subject === "Sonstiges" && (
             <div>
                <Label htmlFor="subjectCustom" className="text-base">Eigener Betreff*</Label>
                <Input id="subjectCustom" name="subject" value={formData.subject === "Sonstiges" ? "" : formData.subject} onChange={handleChange} placeholder="Ihr individueller Betreff" required className="mt-1" />
            </div>
          )}
          <div>
            <Label htmlFor="message" className="text-base">Nachricht*</Label>
            <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Ihre Nachricht an uns" required className="mt-1 min-h-[120px]" />
          </div>
          <Button type="submit" className="w-full text-lg py-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white">
            <Send className="mr-2 h-5 w-5" /> Anfrage senden
          </Button>
        </form>
      );
    };

    const BusinessContactForm = ({ onSubmit }) => {
      const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        concern: '',
        estimatedQuantity: '',
        itemType: '', 
        message: '',
      });

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, 'business');
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="companyName" className="text-base">Firma / Organisation*</Label>
            <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Name Ihrer Firma/Organisation" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="contactPerson" className="text-base">Ansprechpartner*</Label>
            <Input id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Name des Ansprechpartners" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email" className="text-base">E-Mail*</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="E-Mail-Adresse" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="phone" className="text-base">Telefon (optional)</Label>
            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Telefonnummer" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="concern" className="text-base">Art Ihres Anliegens*</Label>
            <Input id="concern" name="concern" value={formData.concern} onChange={handleChange} placeholder="z.B. Restpostenverkauf, Retourenabwicklung" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="itemType" className="text-base">Art der Artikel*</Label>
            <Input id="itemType" name="itemType" value={formData.itemType} onChange={handleChange} placeholder="z.B. Bücher, CDs, DVDs, Spiele, Ladenhüter" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="estimatedQuantity" className="text-base">Geschätzte Menge*</Label>
            <Input id="estimatedQuantity" name="estimatedQuantity" value={formData.estimatedQuantity} onChange={handleChange} placeholder="z.B. 5 Kartons, 1 Palette, ca. 500 Stück" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="message" className="text-base">Weitere Details (optional)</Label>
            <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Zusätzliche Informationen zu Ihrem Anliegen" className="mt-1 min-h-[100px]" />
          </div>
          <Button type="submit" className="w-full text-lg py-6 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white">
            <Send className="mr-2 h-5 w-5" /> Gewerbliche Anfrage senden
          </Button>
        </form>
      );
    };


    const ContactPage = () => {
      const { toast } = useToast();
      const location = useLocation();
      const [showBusinessForm, setShowBusinessForm] = useState(false);
      const [initialSubject, setInitialSubject] = useState('');

      useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('form') === 'gewerbe') {
          setShowBusinessForm(true);
        } else {
          setShowBusinessForm(false);
        }
        setInitialSubject(params.get('subject') || '');
        window.scrollTo(0, 0);
      }, [location.search]);

      const handleSubmit = (formData, formType) => {
        console.log(`Formular (${formType}) abgeschickt:`, formData);
        
        toast({
          title: "Anfrage gesendet!",
          description: "Vielen Dank für Ihre Nachricht. Wir werden uns so schnell wie möglich bei Ihnen melden.",
          variant: "success",
        });
      };

      const cardVariants = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
      };
      
      const formTitle = showBusinessForm ? "Kontakt für Gewerbekunden" : "Kontaktieren Sie uns";
      const formDescription = showBusinessForm 
        ? "Haben Sie größere Mengen, Retouren oder Restposten? Nutzen Sie dieses Formular für eine schnelle Bearbeitung."
        : "Haben Sie Fragen oder Anregungen? Wir freuen uns auf Ihre Nachricht!";
      const formIcon = showBusinessForm ? <BriefcaseIcon className="h-12 w-12 text-primary" /> : <Mail className="h-12 w-12 text-primary" />;

      return (
        <motion.div 
          initial="initial"
          animate="animate"
          variants={cardVariants}
          className="container mx-auto px-4 py-12"
        >
          <Card className="max-w-2xl mx-auto shadow-2xl glassmorphism border-t-4 border-primary">
            <CardHeader className="text-center bg-slate-50 dark:bg-slate-800/50 py-10 rounded-t-lg">
              <div className="flex justify-center mb-4">
                {formIcon}
              </div>
              <CardTitle className="text-4xl font-bold text-primary">{formTitle}</CardTitle>
              <CardDescription className="text-xl text-muted-foreground mt-2">{formDescription}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 md:p-10">
              {showBusinessForm ? (
                <BusinessContactForm onSubmit={handleSubmit} />
              ) : (
                <GeneralContactForm onSubmit={handleSubmit} initialSubject={initialSubject} />
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-800/60 rounded-b-lg">
                <p className="text-muted-foreground text-center mb-3">
                    Sie erreichen uns auch telefonisch oder per E-Mail:
                </p>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-primary">
                    <a href="tel:033396748863" className="flex items-center hover:text-emerald-500 transition-colors">
                        <Phone className="h-5 w-5 mr-2"/> <span>033396 748863</span>
                    </a>
                    <span className="text-muted-foreground hidden sm:inline">|</span>
                    <a href="mailto:info@die-buchretter.de" className="flex items-center hover:text-emerald-500 transition-colors">
                        <Mail className="h-5 w-5 mr-2"/> <span>info@die-buchretter.de</span>
                    </a>
                </div>
                 {!showBusinessForm && (
                    <Button variant="link" onClick={() => setShowBusinessForm(true)} className="mt-6 text-primary hover:text-emerald-600">
                        Zum Formular für Gewerbekunden <BriefcaseIcon className="ml-2 h-4 w-4" />
                    </Button>
                )}
                {showBusinessForm && (
                     <Button variant="link" onClick={() => setShowBusinessForm(false)} className="mt-6 text-primary hover:text-emerald-600">
                        Zum allgemeinen Kontaktformular <User className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default ContactPage;