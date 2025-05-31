import React, { useState, useEffect, useCallback } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { PlusCircle, Edit3, ArrowLeft, Trash2, Eye, Loader2, LogOut, Settings, Tag, BookOpen } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";

    const AdminNavigation = () => (
      <div className="mb-6 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link to="/admin/blog">
            <Edit3 className="mr-2 h-4 w-4" /> Blog Verwalten
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/admin/preise">
            <Tag className="mr-2 h-4 w-4" /> Preise Verwalten
          </Link>
        </Button>
        {/* Placeholder for Admin Logs Link, will be implemented if AdminLogsPage is created */}
        {/* <Button asChild variant="outline">
          <Link to="/admin/logs"> 
            <BookOpen className="mr-2 h-4 w-4" /> Logs Ansehen
          </Link>
        </Button> */}
         <Button asChild variant="outline" className="sm:ml-auto">
            <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Zur Webseite
            </Link>
        </Button>
      </div>
    );


    const AdminBlogDashboardPage = () => {
      const navigate = useNavigate();
      const { toast } = useToast();
      const [posts, setPosts] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [showForm, setShowForm] = useState(false);
      const [currentPost, setCurrentPost] = useState({ title: '', content: '', image_url: '', status: 'draft', meta_description: '', meta_keywords: '' });
      const [editingPostId, setEditingPostId] = useState(null);
      const [currentUser, setCurrentUser] = useState(null);

      const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, created_at, status, slug, content, image_url, meta_description, meta_keywords')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching posts:', error);
          toast({ title: "Fehler", description: "Blogbeiträge konnten nicht geladen werden.", variant: "destructive" });
        } else {
          setPosts(data);
        }
        setIsLoading(false);
      }, [toast]);

      useEffect(() => {
        const checkUserSession = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            navigate('/admin/login');
            toast({ title: "Nicht angemeldet", description: "Bitte zuerst anmelden.", variant: "destructive"});
          } else {
            setCurrentUser(session.user);
            fetchPosts();
          }
        };
        checkUserSession();
      }, [navigate, fetchPosts, toast]);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentPost(prev => ({ ...prev, [name]: value }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
          toast({ title: "Fehler", description: "Kein Benutzer angemeldet. Bitte erneut anmelden.", variant: "destructive" });
          navigate('/admin/login');
          return;
        }
        setIsSubmitting(true);

        const postData = {
          title: currentPost.title,
          content: currentPost.content,
          image_url: currentPost.image_url || null,
          status: currentPost.status,
          meta_description: currentPost.meta_description || null,
          meta_keywords: currentPost.meta_keywords || null,
          author_id: currentUser.id, 
        };

        let result;
        if (editingPostId) {
          const { data, error } = await supabase
            .from('blog_posts')
            .update(postData)
            .eq('id', editingPostId)
            .select()
            .single();
          result = { data, error };
        } else {
          const { data, error } = await supabase
            .from('blog_posts')
            .insert([postData])
            .select()
            .single();
          result = { data, error };
        }
        
        setIsSubmitting(false);

        if (result.error) {
          console.error('Error saving post:', result.error);
          toast({ title: "Fehler", description: `Beitrag konnte nicht gespeichert werden: ${result.error.message}`, variant: "destructive" });
        } else {
          toast({ title: "Erfolg!", description: `Beitrag ${editingPostId ? 'aktualisiert' : 'erstellt'}.`, variant: "success" });
          setShowForm(false);
          setEditingPostId(null);
          setCurrentPost({ title: '', content: '', image_url: '', status: 'draft', meta_description: '', meta_keywords: '' });
          fetchPosts(); 
        }
      };

      const handleEdit = (post) => {
        setEditingPostId(post.id);
        setCurrentPost({ 
          title: post.title, 
          content: post.content || '', 
          image_url: post.image_url || '',
          status: post.status || 'draft',
          meta_description: post.meta_description || '',
          meta_keywords: post.meta_keywords || '',
        });
        setShowForm(true);
      };
      
      const handleDelete = async (postId) => {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', postId);

        if (error) {
          console.error('Error deleting post:', error);
          toast({ title: "Fehler", description: "Beitrag konnte nicht gelöscht werden.", variant: "destructive" });
        } else {
          toast({ title: "Erfolg!", description: "Beitrag gelöscht.", variant: "success" });
          fetchPosts(); 
        }
      };

      const openNewPostForm = () => {
        setEditingPostId(null);
        setCurrentPost({ title: '', content: '', image_url: '', status: 'draft', meta_description: '', meta_keywords: '' });
        setShowForm(true);
      };
      
      const handleLogout = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signOut();
        setIsLoading(false);
        if (error) {
          toast({ title: "Fehler beim Abmelden", description: error.message, variant: "destructive"});
        } else {
          setCurrentUser(null);
          navigate('/admin/login');
          toast({ title: "Abgemeldet", description: "Sie wurden erfolgreich abgemeldet.", variant: "info"});
        }
      };

      if (isLoading && !currentUser && posts.length === 0) { 
        return (
          <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
      }


      return (
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
              <Button variant="destructive" onClick={handleLogout} disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <LogOut className="mr-2 h-4 w-4" /> Abmelden
              </Button>
            </div>
            
            <AdminNavigation />

            <div className="mb-6">
              <Button onClick={openNewPostForm} className="bg-emerald-500 hover:bg-emerald-600">
                <PlusCircle className="mr-2 h-5 w-5" /> Neuen Blogbeitrag erstellen
              </Button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8 overflow-hidden"
                >
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl">{editingPostId ? 'Beitrag bearbeiten' : 'Neuen Beitrag erstellen'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="title">Titel</Label>
                          <Input id="title" name="title" value={currentPost.title} onChange={handleInputChange} required />
                        </div>
                        <div>
                          <Label htmlFor="content">Inhalt</Label>
                          <Textarea id="content" name="content" value={currentPost.content} onChange={handleInputChange} rows={10} required />
                        </div>
                        <div>
                          <Label htmlFor="image_url">Bild-URL (optional)</Label>
                          <Input id="image_url" name="image_url" value={currentPost.image_url} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <select 
                            id="status" 
                            name="status" 
                            value={currentPost.status} 
                            onChange={handleInputChange}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="draft">Entwurf</option>
                            <option value="published">Veröffentlicht</option>
                            <option value="archived">Archiviert</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="meta_description">Meta Beschreibung (SEO, optional)</Label>
                          <Textarea id="meta_description" name="meta_description" value={currentPost.meta_description} onChange={handleInputChange} rows={2} />
                        </div>
                        <div>
                          <Label htmlFor="meta_keywords">Meta Keywords (SEO, optional, kommagetrennt)</Label>
                          <Input id="meta_keywords" name="meta_keywords" value={currentPost.meta_keywords} onChange={handleInputChange} />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingPostId(null); setCurrentPost({ title: '', content: '', image_url: '', status: 'draft', meta_description: '', meta_keywords: '' }); }}>
                            Abbrechen
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingPostId ? 'Änderungen speichern' : 'Beitrag erstellen'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Vorhandene Blogbeiträge</CardTitle>
                <CardDescription>Liste aller erstellten Blogbeiträge.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && posts.length === 0 ? ( 
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : !isLoading && posts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Noch keine Beiträge vorhanden. Erstelle deinen ersten Beitrag!</p>
                ) : (
                  <ul className="space-y-3">
                    {posts.map(post => (
                      <li key={post.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{post.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            Erstellt: {new Date(post.created_at).toLocaleDateString()} - Status: <span className={`font-medium ${post.status === 'published' ? 'text-green-500' : post.status === 'draft' ? 'text-amber-500' : 'text-slate-500'}`}>{post.status}</span>
                          </p>
                        </div>
                        <div className="flex space-x-2 mt-2 sm:mt-0">
                           <Button variant="ghost" size="sm" asChild>
                            <Link to={`/blog/${post.slug || post.id}`} target="_blank" rel="noopener noreferrer" aria-label="Beitrag ansehen">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(post)} aria-label="Beitrag bearbeiten">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" aria-label="Beitrag löschen">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Diese Aktion kann nicht rückgängig gemacht werden. Der Blogbeitrag "{post.title}" wird dauerhaft gelöscht.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(post.id)} className="bg-destructive hover:bg-destructive/90">
                                  Löschen
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">Insgesamt {posts.length} Beiträge.</p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default AdminBlogDashboardPage;