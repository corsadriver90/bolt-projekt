import React, { useState, useEffect, useCallback } from 'react';
    import { useParams, Link } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { ArrowLeft, CalendarDays, UserCircle, Loader2, AlertTriangle } from 'lucide-react';
    import { motion } from 'framer-motion';

    const BlogPostPage = () => {
      const { postId } = useParams(); 
      const [post, setPost] = useState(null);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState(null);
      const { toast } = useToast();
      // const [adminAuthor, setAdminAuthor] = useState({ email: 'info@die-buchretter.de', full_name: 'Die Buchretter Admin' });


      const fetchPost = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        let query = supabase
          .from('blog_posts')
          .select(`
            *, 
            author_id
          `)
          .eq('status', 'published');

        if (postId.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
          query = query.eq('id', postId).single();
        } else {
          query = query.eq('slug', postId).single();
        }
        
        const { data, error: fetchError } = await query;

        if (fetchError && !data && !postId.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
          const { data: idData, error: idError } = await supabase
            .from('blog_posts')
            .select(`*, author_id`)
            .eq('id', postId) 
            .eq('status', 'published')
            .single();
          
          if (idData) {
            setPost(idData);
          } else {
            console.error('Error fetching post by slug then ID:', fetchError, idError);
            setError('Beitrag nicht gefunden oder nicht veröffentlicht.');
            toast({ title: "Fehler", description: "Beitrag konnte nicht geladen werden.", variant: "destructive" });
          }
        } else if (fetchError && !data) {
            console.error('Error fetching post:', fetchError.message);
            setError('Beitrag nicht gefunden oder nicht veröffentlicht.');
            toast({ title: "Fehler", description: `Beitrag konnte nicht geladen werden: ${fetchError.message}`, variant: "destructive" });
        } else if (!data) {
            setError('Beitrag nicht gefunden oder nicht veröffentlicht.');
            toast({ title: "Fehler", description: "Beitrag nicht gefunden.", variant: "destructive" });
        } else {
          setPost(data);
          document.title = `${data.title} | Die Buchretter Blog`;
          const metaDescriptionTag = document.querySelector('meta[name="description"]');
          if (metaDescriptionTag) {
            metaDescriptionTag.setAttribute('content', data.meta_description || (data.content ? data.content.substring(0, 160) : ''));
          }
        }
        setIsLoading(false);
      }, [postId, toast]);

      useEffect(() => {
        fetchPost();
        // Optional: Fetch admin user details once
        // const fetchAdminDetails = async () => {
        //   const { data, error } = await supabase
        //     .from('authors_view') // or directly from auth.users if RLS allows for admin
        //     .select('email, full_name')
        //     .eq('email', 'info@die-buchretter.de') // or by known admin user ID
        //     .single();
        //   if (data) setAdminAuthor(data);
        // };
        // fetchAdminDetails();
      }, [fetchPost]);

      const getAuthorName = (currentPost) => {
         if (currentPost && currentPost.author_id) {
          return 'Die Buchretter Team'; // Or adminAuthor.full_name || adminAuthor.email.split('@')[0]
        }
        return 'Das Buchretter Team'; 
      };
      
      const createMarkup = (htmlString) => {
        if (!htmlString) return { __html: '' };
        return { __html: htmlString };
      };


      if (isLoading) {
        return (
          <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
      }

      if (error || !post) {
        return (
          <div className="container mx-auto px-4 py-12 text-center min-h-[calc(100vh-200px)] flex flex-col justify-center items-center">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <h1 className="text-3xl font-bold mb-2">Beitrag nicht gefunden</h1>
            <p className="text-muted-foreground mb-6">{error || "Dieser Blogbeitrag existiert nicht oder ist nicht mehr verfügbar."}</p>
            <Button asChild>
              <Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Zurück zum Blog</Link>
            </Button>
          </div>
        );
      }
      
      if (!post) {
        return (
          <div className="container mx-auto px-4 py-12 text-center">
            <p>Beitrag wird geladen oder konnte nicht gefunden werden.</p>
          </div>
        );
      }

      return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <Button asChild variant="outline">
                <Link to="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zum Blog
                </Link>
              </Button>
            </div>

            <Card className="shadow-xl overflow-hidden border dark:border-slate-700">
              {post.image_url && (
                <div className="w-full h-64 md:h-96 overflow-hidden bg-slate-100 dark:bg-slate-800">
                   <img  
                      alt={post.title}
                      className="w-full h-full object-cover"
                      src={post.image_url || "https://images.unsplash.com/photo-1697256200022-f61abccad430"} />
                </div>
              )}
              <CardHeader className="pt-8">
                <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground pt-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4" /> Veröffentlicht am {new Date(post.created_at).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span className="flex items-center"><UserCircle className="mr-1.5 h-4 w-4" /> Von {getAuthorName(post)}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-lg dark:prose-invert max-w-none py-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                <div dangerouslySetInnerHTML={createMarkup(post.content)} />
              </CardContent>
              <CardFooter className="border-t dark:border-slate-700 pt-6">
                 <p className="text-xs text-muted-foreground">
                  Schlagworte: {post.meta_keywords || "Allgemein"}
                </p>
              </CardFooter>
            </Card>
            
            <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold mb-4">Teile diesen Beitrag!</h3>
                <div className="flex justify-center space-x-3">
                    <Button variant="outline" size="icon" asChild>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" aria-label="Auf Facebook teilen">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                        </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                        <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" aria-label="Auf Twitter teilen">
                           <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                        </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                         <a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent('Schau dir diesen interessanten Blogbeitrag an: ' + window.location.href)}`} aria-label="Per E-Mail teilen">
                            <MailIcon className="h-5 w-5" />
                        </a>
                    </Button>
                </div>
            </div>

          </motion.div>
        </div>
      );
    };
    
    const MailIcon = (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );

    export default BlogPostPage;