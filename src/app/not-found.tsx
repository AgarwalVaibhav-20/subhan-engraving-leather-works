import React from 'react';
import { Search} from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-white animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 text-8xl md:text-9xl lg:text-[12rem] font-bold text-gray-800 opacity-30 blur-sm">
            404
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <Search className="w-16 h-16 text-black animate-bounce" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-black border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            The page you&apos;re looking for seems to have vanished into the digital void. 
            Don&apos;t worry, even the best explorers sometimes take a wrong turn.
          </p>
        </div>
        {/* Footer */}
        <div className="space-y-6">
          <p className="text-gray-500 text-sm">
            Error Code: 404 • Page Not Found • {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-gray-400 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full opacity-80 animate-bounce"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;