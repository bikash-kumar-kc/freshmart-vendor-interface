// src/components/ErrorBoundary.tsx
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-7xl m-auto flex flex-col items-center justify-center min-h-screen bg-background gap-4">
          <p className="text-lg font-semibold text-gray-900">
            Something went wrong.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-sm"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
