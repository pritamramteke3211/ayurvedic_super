/**
 * @file src/shared/components/ErrorBoundary.tsx
 * @description React Error Boundary wrapper to catch unhandled component crashes and display ErrorView.
 *
 * Invariants:
 * - Traps rendering exceptions in child component subtrees.
 * - Provides a reset handler to restore the subtree.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../../infrastructure/logging/logger';
import { ErrorView } from './ErrorView';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('ErrorBoundary', `Unhandled rendering error: ${error.message}`, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorView
          title="Screen Error"
          message={this.state.error?.message || 'An unexpected rendering error occurred.'}
          onRetry={this.handleReset}
          retryTitle="Reload Component"
        />
      );
    }

    return this.props.children;
  }
}
