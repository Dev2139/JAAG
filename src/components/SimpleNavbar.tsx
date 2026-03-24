import { Link } from "react-router-dom";
import { Flame } from "lucide-react";

const SimpleNavbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <Flame className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            JNV Alumni Connect
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default SimpleNavbar;
