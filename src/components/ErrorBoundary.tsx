import { Component, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props { children: ReactNode; onNavigate?: (path: string) => void; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Signal OS] Error Boundary:', error, errorInfo);
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('error_boundary', { error: error.message, stack: error.stack });
    }
  }

  handleReset = () => { this.setState({ hasError: false, error: null }); window.location.reload(); };
  handleGoHome = () => { this.setState({ hasError: false, error: null }); window.location.href = '/'; };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0D17] flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[#E0E4F0] mb-2">Something Went Wrong</h1>
            <p className="text-[#8B95B8] text-sm mb-6">We have encountered an unexpected error.</p>
            {this.state.error && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-[rgba(255,255,255,0.06)] mb-6 text-left overflow-hidden">
                <p className="text-red-400 text-xs font-mono truncate">{this.state.error.message}</p>
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <button onClick={this.handleReset} className="btn-primary"><RotateCcw className="w-4 h-4" /> Reload</button>
              <button onClick={this.handleGoHome} className="btn-secondary"><Home className="w-4 h-4" /> Home</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
