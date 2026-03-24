import { Users, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-hero">
                <Users className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-foreground">JNV Alumni Connect</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Connecting Navodayans across generations. Built with love for the JNV community.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Alumni Directory</Link></li>
              <li><Link to="/opportunities" className="text-muted-foreground hover:text-primary transition-colors">Opportunity Board</Link></li>
              <li><Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">Join Network</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-3">Houses</h4>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-house-aravali text-foreground">Aravali</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-house-nilgiri text-primary-foreground">Nilgiri</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-house-shivalik text-primary-foreground">Shivalik</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-house-udaygiri text-primary-foreground">Udaygiri</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="h-3 w-3 text-destructive" /> by Navodayans, for Navodayans
          </p>
          <p className="mt-1">© {new Date().getFullYear()} JNV Alumni Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
