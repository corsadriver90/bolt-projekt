import React, { useState, useEffect } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Button } from '@/components/ui/button';
    import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogDescription,
      DialogFooter,
      DialogClose,
    } from '@/components/ui/dialog';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { useToast } from '@/components/ui/use-toast';
    import { Loader2, UploadCloud } from 'lucide-react';

    const ApplicationModal = ({ isOpen, onOpenChange, jobTitle, jobTypePreset = null }) => {
      const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        jobType: '',
      });
      const [resumeFile, setResumeFile] = useState(null);
      const [coverLetterFile, setCoverLetterFile] = useState(null);
      const [otherFile, setOtherFile] = useState(null);
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

      useEffect(() => {
        if (jobTypePreset) {
          setFormData(prev => ({ ...prev, jobType: jobTypePreset }));
        } else {
          setFormData(prev => ({ ...prev, jobType: ''})); // Reset if no preset
        }
      }, [jobTypePreset, isOpen]);


      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };

      const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
      };

      const handleFileChange = (e, setFile) => {
        if (e.target.files && e.target.files[0]) {
          setFile(e.target.files[0]);
        } else {
          setFile(null); // Clear if no file selected
        }
      };

      const uploadFile = async (file, bucketFolder) => {
        if (!file) return null;
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const filePath = `${bucketFolder}/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('application_documents')
          .upload(filePath, file);

        if (error) {
          console.error('Error uploading file:', error);
          toast({
            variant: "destructive",
            title: "Fehler beim Dateiupload",
            description: `Datei ${file.name} konnte nicht hochgeladen werden: ${error.message}`,
          });
          return null;
        }
        const { data: publicUrlData } = supabase.storage.from('application_documents').getPublicUrl(filePath);
        return publicUrlData.publicUrl;
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.jobType) {
          toast({
            variant: "destructive",
            title: "Fehlende Angaben",
            description: "Bitte füllen Sie alle Pflichtfelder aus (Vorname, Nachname, E-Mail, Art der Anstellung).",
          });
          setIsLoading(false);
          return;
        }
        
        if (!resumeFile) {
           toast({
            variant: "destructive",
            title: "Fehlender Lebenslauf",
            description: "Bitte laden Sie Ihren Lebenslauf hoch.",
          });
          setIsLoading(false);
          return;
        }

        const resumeUrl = await uploadFile(resumeFile, 'resumes');
        if (!resumeUrl && resumeFile) { // Check if mandatory resume upload failed
             setIsLoading(false);
             return; 
        }
        const coverLetterUrl = await uploadFile(coverLetterFile, 'cover_letters');
        const otherDocumentsUrl = await uploadFile(otherFile, 'other_documents');

        const applicationData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          applying_for_position: jobTitle,
          job_type: formData.jobType,
          resume_url: resumeUrl,
          cover_letter_url: coverLetterUrl,
          other_documents_url: otherDocumentsUrl,
          status: 'Eingegangen',
        };

        const { error: dbError } = await supabase
          .from('job_applications')
          .insert([applicationData]);

        if (dbError) {
          console.error('Error inserting application:', dbError);
          toast({
            variant: "destructive",
            title: "Fehler bei der Bewerbung",
            description: `Ihre Bewerbung konnte nicht gespeichert werden: ${dbError.message}`,
          });
        } else {
          toast({
            variant: "success",
            title: "Bewerbung erfolgreich gesendet!",
            description: "Vielen Dank für Ihr Interesse. Wir werden uns bald bei Ihnen melden.",
          });
          // Reset form fields
          setFormData({ firstName: '', lastName: '', email: '', phone: '', jobType: '' });
          setResumeFile(null);
          setCoverLetterFile(null);
          setOtherFile(null);
          // Clear file input fields visually (important for reappearing dialog)
          const fileInputIds = ['resumeFile', 'coverLetterFile', 'otherFile'];
          fileInputIds.forEach(id => {
            const fileInput = document.getElementById(id);
            if (fileInput) fileInput.value = '';
          });
          onOpenChange(false); 
        }
        setIsLoading(false);
      };
      
      const jobTypes = ["Vollzeit", "Teilzeit", "Minijob", "Ferienjob", "Praktikum", "Initiativbewerbung"];

      // Reset form when dialog opens or jobTypePreset changes
      useEffect(() => {
        if (isOpen) {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            jobType: jobTypePreset || '',
          });
          setResumeFile(null);
          setCoverLetterFile(null);
          setOtherFile(null);
          const fileInputIds = ['resumeFile', 'coverLetterFile', 'otherFile'];
          fileInputIds.forEach(id => {
            const fileInput = document.getElementById(id);
            if (fileInput) fileInput.value = '';
          });
        }
      }, [isOpen, jobTypePreset]);

      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Bewerbung für: {jobTitle}</DialogTitle>
              <DialogDescription>
                Füllen Sie bitte das Formular aus und laden Sie Ihre Unterlagen hoch. Mit * markierte Felder sind Pflichtfelder.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="firstName">Vorname *</Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName">Nachname *</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">E-Mail *</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Telefon (optional)</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="jobType">Art der Anstellung *</Label>
                 <Select name="jobType" onValueChange={(value) => handleSelectChange('jobType', value)} value={formData.jobType} required>
                    <SelectTrigger id="jobType" className={!formData.jobType && jobTypePreset === null ? "text-muted-foreground" : ""}>
                        <SelectValue placeholder="Art der Anstellung auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                        {jobTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="font-medium">Bewerbungsunterlagen</Label>
                <div className="space-y-3">
                    <div>
                        <Label htmlFor="resumeFile" className="text-sm font-normal">Lebenslauf (PDF, DOC, DOCX) *</Label>
                        <div className="flex items-center space-x-2 mt-1">
                            <Input id="resumeFile" type="file" accept=".pdf,.doc,.docx,.odt" onChange={(e) => handleFileChange(e, setResumeFile)} className="flex-grow" />
                            {resumeFile && <span className="text-xs text-muted-foreground truncate max-w-[100px]">{resumeFile.name}</span>}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="coverLetterFile" className="text-sm font-normal">Anschreiben (PDF, DOC, DOCX)</Label>
                        <div className="flex items-center space-x-2 mt-1">
                            <Input id="coverLetterFile" type="file" accept=".pdf,.doc,.docx,.odt" onChange={(e) => handleFileChange(e, setCoverLetterFile)} className="flex-grow" />
                            {coverLetterFile && <span className="text-xs text-muted-foreground truncate max-w-[100px]">{coverLetterFile.name}</span>}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="otherFile" className="text-sm font-normal">Weitere Dokumente (optional)</Label>
                         <div className="flex items-center space-x-2 mt-1">
                            <Input id="otherFile" type="file" accept=".pdf,.doc,.docx,.odt,.jpg,.png" onChange={(e) => handleFileChange(e, setOtherFile)} className="flex-grow" />
                            {otherFile && <span className="text-xs text-muted-foreground truncate max-w-[100px]">{otherFile.name}</span>}
                        </div>
                    </div>
                </div>
              </div>

              <DialogFooter className="pt-6">
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isLoading} onClick={() => onOpenChange(false)}>
                    Abbrechen
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                  Bewerbung absenden
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };

    export default ApplicationModal;