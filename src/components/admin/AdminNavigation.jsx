import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Edit3, Tag, ArrowLeft } from 'lucide-react';

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
        <Button asChild variant="outline" className="sm:ml-auto">
            <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Zur Webseite
            </Link>
        </Button>
      </div>
    );

    export default AdminNavigation;