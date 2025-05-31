import React, { useState, useEffect, useCallback } from 'react';
    import { Link } from 'react-router-dom';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { ArrowRight, CalendarDays, UserCircle, Loader2, MessageSquare as MessageSquareWarning } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';

    const BlogPage = () => {
      const [posts, setPosts] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const { toast } = useToast();
      // Optional: Store admin user details if fetched once
      // const [adminAuthor, setAdminAuthor] = useState({ email: 'info@die-buchretter.de', full_name: 'Die Buchretter Admin' });


      const fetchPublishedPosts = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            id, 
            title, 
            created_at, 
            slug, 
            image_url, 
            meta_description,
            content,
            status,
            author_id 
          `)
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching published posts:', error);
          toast({ title: "Fehler", description: `Blogbeiträge konnten nicht geladen werden: ${error.message}`, variant: "destructive" });
          setPosts([]);
        } else {
          setPosts(data);
        }
        setIsLoading(false);
      }, [toast]);

      useEffect(() => {
        fetchPublishedPosts();
        // Optional: Fetch admin user details once if needed for more dynamic display
        // const fetchAdminDetails = async () => {
        //   const { data, error } = await supabase
        //     .from('authors_view')
        //     .select('email, full_name')
        //     .eq('email', 'info@die-buchretter.de') // or by known admin user ID
        //     .single();
        //   if (data) setAdminAuthor(data);
        // };
        // fetchAdminDetails();
      }, [fetchPublishedPosts]);

      const getAuthorName = (post) => {
        // If author_id exists, assume it's the admin
        if (post && post.author_id) {
          // You can use the stored adminAuthor details or hardcode
          return 'Die Buchretter Team'; // Or adminAuthor.full_name || adminAuthor.email.split('@')[0]
        }
        return 'Das Buchretter Team'; 
      };
      
      const getExcerpt = (content, maxLength = 150) => {
        if (!content) return 'Kein Inhalt verfügbar.';
        const cleanContent = content.replace(/<[^>]+>/g, ''); 
        if (cleanContent.length <= maxLength) return cleanContent;
        return cleanContent.substring(0, cleanContent.lastIndexOf(' ', maxLength)) + '...';
      };


      return (
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">Unser Blog</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Neuigkeiten, Tipps und Wissenswertes rund um Die Buchretter und den Ankauf deiner Schätze.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-muted-foreground text-lg col-span-full py-10 flex flex-col items-center"
            >
              <MessageSquareWarning className="w-16 h-16 mb-4 text-primary/50" />
              <p className="text-2xl font-semibold mb-2">Noch keine Beiträge hier!</p>
              <p>Momentan gibt es hier noch keine veröffentlichten Beiträge. Schau bald wieder vorbei!</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl border dark:border-slate-700">
                    <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img 
                        alt={post.title || 'Blog Beitrag Bild'}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        src={post.image_url || "https://images.unsplash.com/photo-1504983875-d3b163aba9e6"} />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl lg:text-2xl hover:text-primary transition-colors min-h-[3.5em]">
                        <Link to={`/blog/${post.slug || post.id}`}>{post.title}</Link>
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground pt-2">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center"><CalendarDays className="mr-1.5 h-3.5 w-3.5" /> {new Date(post.created_at).toLocaleDateString('de-DE')}</span>
                          <span className="flex items-center"><UserCircle className="mr-1.5 h-3.5 w-3.5" /> {getAuthorName(post)}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {getExcerpt(post.meta_description || post.content, 120)}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="link" className="text-primary p-0 hover:underline text-sm">
                        <Link to={`/blog/${post.slug || post.id}`}>
                          Weiterlesen <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      );
    };

    export default BlogPage;