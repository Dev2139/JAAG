import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PasscodeModalProps {
  onVerify: (passcode: string) => boolean;
}

export const PasscodeModal = ({ onVerify }: PasscodeModalProps) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const isValid = onVerify(passcode);
      if (!isValid) {
        setError('Invalid passcode. Please try again.');
        setPasscode('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 p-8 shadow-xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Welcome</h1>
            <p className="text-gray-600">Enter the passcode to access the platform</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passcode" className="text-sm font-medium">
                Passcode
              </Label>
              <Input
                id="passcode"
                type="password"
                placeholder="Enter passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="text-center text-lg tracking-widest"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              disabled={!passcode || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500">
            Secure access to alumni network
          </p>
        </div>
      </Card>
    </div>
  );
};
