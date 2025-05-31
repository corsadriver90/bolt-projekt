import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { ShieldCheck, Loader2 } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/supabaseClient';

    const AdminLoginPage = () => {
      const { toast } = useToast();
      const navigate = useNavigate();
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [isLoading, setIsLoading] = useState(false);

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        setIsLoading(false);

        if (error) {
          toast({
            title: "Anmeldung fehlgeschlagen",
            description: error.message || "Bitte überprüfen Sie Ihre Anmeldedaten.",
            variant: "destructive",
            duration: 5000,
          });
        } else if (data.user) {
          toast({
            title: "Anmeldung erfolgreich",
            description: "Weiterleitung zum Admin Dashboard...",
            variant: "success",
            duration: 3000,
          });
          navigate('/admin/blog');
        } else {
           toast({
            title: "Anmeldung fehlgeschlagen",
            description: "Ein unerwarteter Fehler ist aufgetreten.",
            variant: "destructive",
            duration: 5000,
          });
        }
      };

      return (
        <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-10rem)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full max-w-md shadow-2xl border-t-4 border-primary">
              <CardHeader className="text-center">
                <ShieldCheck className="mx-auto h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-3xl font-bold">Admin Login</CardTitle>
                <CardDescription>Bitte melde dich an, um auf den Admin-Bereich zuzugreifen.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="E-Mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Passwort</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Passwort"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      autoComplete="current-password"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Anmelden'}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="text-center text-xs text-muted-foreground">
                <p>Dieser Bereich ist nur für autorisiertes Personal.</p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default AdminLoginPage;