"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  demoId: string;
  children: ReactNode;
};

type State = {
  error: Error | null;
};

export class DemoErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[demo:${this.props.demoId}]`, error, info.componentStack);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.demoId !== this.props.demoId && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-md space-y-2 px-6 text-center">
          <p className="font-display text-lg font-bold text-[#f2f5ee]">
            Couldn’t render {this.props.demoId}
          </p>
          <p className="font-mono text-xs text-fog-muted break-words">
            {this.state.error.message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
